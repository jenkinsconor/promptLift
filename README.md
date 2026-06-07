# PromptLift – AI Prompt Improver

> One click rewrites your AI prompt into a better one. Works on ChatGPT, Claude, Gemini, Grok & 16 more.

## What it does

Most people type a few words and hope for the best. PromptLift detects what you're trying to do — fitness, travel, code, email, recipes, and 28 more categories — and rewrites your prompt with the right structure, context, and instructions so AI actually understands what you need.

## Supported platforms

ChatGPT · Claude · Gemini · Perplexity · Grok · Microsoft Copilot · DeepSeek · Mistral · Meta AI · Poe · Character.AI · You.com · HuggingChat · Phind · Groq · Pi · Kimi · Qwen · Cohere · OpenRouter

## How it works

1. Type your question as normal on any supported AI platform
2. Click the purple **✦ PromptLift** button
3. Review the improved prompt in the diff overlay
4. Apply it — or dismiss and keep your original

## Privacy

- Runs 100% in your browser — no server, no account, no tracking
- Your prompts never leave your device
- Optional: paste your own OpenAI API key for cloud-powered rewrites (stored locally only)

## Install

[Chrome Web Store →](https://chrome.google.com/webstore)

## Development

```
prompt-improver-extension/
├── src/
│   ├── content/content.js     # Core logic: intent detection, UI, prompt templates
│   ├── popup/popup.html       # Extension popup
│   └── background/service-worker.js
├── icons/                     # PNG icons + SVG source
├── docs/                      # GitHub Pages landing page
├── store-assets/              # Chrome Web Store graphics
└── manifest.json
```

To load locally: open `chrome://extensions` → Enable Developer Mode → Load unpacked → select this folder.

## Roadmap

- [ ] Pro tier with cloud-powered rewrites
- [ ] More platform support
- [ ] Firefox port
