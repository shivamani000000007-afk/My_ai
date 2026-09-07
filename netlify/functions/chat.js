// Netlify serverless function — keeps your Gemini API key hidden from the browser.
// Set GEMINI_API_KEY in Netlify: Site settings → Environment variables.

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { history, userText, assistantName, personality } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;

    console.log('apiKey present:', !!apiKey, 'length:', apiKey ? apiKey.length : 0);

    if (!apiKey) {
      console.error('GEMINI_API_KEY is missing from environment variables.');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'GEMINI_API_KEY is not set in Netlify environment variables.' })
      };
    }

    const systemInstruction = `You are ${assistantName || 'the assistant'}, a warm personal voice assistant for someone's girlfriend. Personality: ${personality || 'warm, caring, a little playful'}. The user may write in Tamil, English, or a mix of both (Tanglish) — reply naturally in whichever language/mix fits, matching their style. Keep replies short (1-3 sentences), conversational, and natural to speak out loud. No markdown, no lists, no asterisks, no emoji.`;

    const contents = [
      ...(history || []).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      { role: 'user', parts: [{ text: userText }] }
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: { maxOutputTokens: 200, temperature: 0.9 }
        })
      }
    );

    const data = await response.json();

    console.log('Gemini status:', response.status);
    console.log('Gemini response body:', JSON.stringify(data));

    if (!response.ok) {
      console.error('Gemini API returned an error:', JSON.stringify(data));
      return { statusCode: response.status, body: JSON.stringify({ error: data }) };
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('').trim() ||
      "Sorry, I didn't catch that.";

    return {
      statusCode: 200,
      body: JSON.stringify({ text })
    };
  } catch (err) {
    console.error('Function threw an exception:', err.message, err.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
