# Her Assistant 💛

A personal voice assistant, built as a gift — talks in Tamil or English, remembers the
conversation, and (once you set it up) replies in your own cloned voice. Runs entirely
on free services.

## What's inside
- `public/index.html` — the whole app (chat, mic input, voice output)
- `netlify/functions/chat.js` — a serverless function that talks to Gemini so your API
  key never sits in the browser
- `netlify.toml` — tells Netlify where everything is

## Step 1 — Get a free Gemini API key
1. Go to https://aistudio.google.com/apikey
2. Sign in with any Google account
3. Click **Create API key** — copy it somewhere safe
4. This is genuinely free for personal-scale use (a generous daily quota, no card required)

## Step 2 — Put this project on GitHub
1. Create a new GitHub repo (public or private, either works)
2. Upload these files into it, keeping the folder structure exactly as-is
   (`public/index.html`, `netlify/functions/chat.js`, `netlify.toml`)

## Step 3 — Deploy on Netlify
1. Go to https://app.netlify.com → **Add new site → Import an existing project**
2. Connect your GitHub account, pick this repo
3. Build settings: leave everything default (netlify.toml already configures it)
4. Before the first deploy, go to **Site settings → Environment variables** and add:
   - Key: `GEMINI_API_KEY`
   - Value: (the key from Step 1)
5. Deploy. Netlify gives you a free `https://something.netlify.app` link — that's what
   you send her. Mic access needs this real HTTPS link; it won't work from a local file.

## Step 4 — Your cloned voice (in progress)
This is the "sounds like you" part. It's a multi-stage process — see the separate
notebooks for each stage:

1. **Record** — 4 mood-based clips (~1hr total). See `recording_script.md`
2. **Split + transcribe** — turns long recordings into matched `.wav`/`.lab` pairs.
   See `voice_prep.ipynb` (run in Google Colab)
3. **Fine-tune** — trains the model on your voice using Fish Speech (supports Tamil).
   See `finetune_voice.ipynb` (run in Google Colab, free T4 GPU)
4. **Serve it live** — merges your trained weights and gives you a callable link.
   See `serve_voice.ipynb`

Once Step 4's notebook gives you a live endpoint URL (either a temporary
`https://xxxxx.gradio.live` link for testing, or a permanent Hugging Face Space link
later), paste it into the app's Settings drawer (gear icon) under
"Cloned-voice endpoint." Until then, the assistant works fine with the default
browser voice.

## Notes
- Free Gemini tier has a daily request limit — plenty for two people chatting, but if it
  ever says it's out of quota for the day, that's why.
- The free Hugging Face CPU tier is slower than a paid service — expect several seconds
  per reply once the clone is wired in.
- Nothing here costs money unless you choose to upgrade something later.
