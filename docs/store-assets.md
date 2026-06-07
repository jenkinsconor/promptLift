# Chrome Web Store — Publishing Checklist

## Store Listing Copy

**Name (45 chars max)**
PromptLift – AI Prompt Improver

**Short description (132 chars)**
One click turns your rough AI question into a perfect prompt. Works on ChatGPT, Claude, Gemini & 17 more. Free.

**Category:** Productivity
**Language:** English (US)

---

## Full Description

Stop getting mediocre answers from AI.

Most people type a few words and hope for the best. PromptLift rewrites your question behind the scenes — adding the right structure, context, and instructions — so AI actually understands what you need.

**HOW IT WORKS**
1. Type your question as normal (don't overthink it)
2. Click the purple ✦ PromptLift button in the corner
3. See your improved prompt, review it, then apply it
4. Get dramatically better answers — every time

**WORKS ON 20+ AI TOOLS**
ChatGPT · Claude · Gemini · Perplexity · Grok · Microsoft Copilot · DeepSeek · Le Chat · Meta AI · Poe · Character.AI · You.com · HuggingChat · Phind · Groq · Pi · Kimi · Qwen · Cohere · OpenRouter

**UNDERSTANDS WHAT YOU MEAN**
PromptLift automatically detects what you're trying to do — whether it's a work email, a recipe, a coding problem, a fitness plan, or venting about your day — and applies the right template instantly.

31 categories including: Fitness · Recipes · Work Emails · Travel · Code · Image Prompts · Video Scripts · Career · Interview Prep · Finance · Legal · Health · Social Media · Math · Translation · Brainstorming · Emotional Support · and more

**READS CONTEXT AUTOMATICALLY**
Mention "for my boss" → formal tone
Say "for TikTok" → writes for that platform
Add "make it shorter" → compresses it
These signals are picked up automatically — no settings to configure.

**CHROME AI UPGRADE (FREE)**
On supported hardware, PromptLift uses Chrome's built-in Gemini Nano to polish prompts further — completely free, no API calls, nothing sent to any server.

**COMPLETELY PRIVATE**
✓ Runs 100% in your browser — no server
✓ No account or sign-up required
✓ Zero data collection — your prompts are yours
✓ Works fully offline
✓ Open source on GitHub

**OPTIONAL: BRING YOUR OWN KEY**
Want cloud-quality rewrites? Paste your own OpenAI API key in the extension popup. Stored locally on your device only — never sent anywhere else.

Free. No strings. No subscription.

---

## Screenshots (capture these — 1280x800 or 640x400)

### Screenshot 1 — Hero (most important, shows first)
- ChatGPT open with a vague prompt typed ("help me lose weight")
- Purple PromptLift button visible in the corner
- Caption overlay: "Type anything. PromptLift handles the rest."

### Screenshot 2 — The diff overlay
- The purple PromptLift diff UI open showing "Improved" tab
- Intent badge visible ("fitness")
- The structured prompt in the improved panel
- Caption: "See the before & after. You're always in control."

### Screenshot 3 — Platform grid
- Montage or list of all 20 supported AI platform names/logos
- Caption: "Works on every AI tool you already use."

### Screenshot 4 — Intent categories
- The improved prompt for a social media use case (e.g. Instagram caption)
- Shows intent badge "social media"
- Caption: "31 categories. From recipes to code to emotional support."

### Screenshot 5 — Privacy / popup
- Extension popup open showing "✓ Rule-based mode — works on all devices"
- The clean privacy-first UI
- Caption: "No account. No tracking. Your prompts stay yours."

---

## Promotional Images

### Small promo tile (440x280)
- Purple gradient background (#7c3aed → #5b21b6)
- "PromptLift" logo in white, large
- Tagline: "Better AI answers. One click."
- Small Chrome logo + "Free extension"

### Large promo tile (920x680) — optional, used if featured
- Same gradient
- Before/after prompt comparison mockup
- Logo + tagline
- "Works on ChatGPT, Claude, Gemini + 17 more"

---

## Icons needed (create at favicon.io or Figma)

| Size | File |
|---|---|
| 16×16 | icons/icon16.png |
| 48×48 | icons/icon48.png |
| 128×128 | icons/icon128.png |

**Design:** White ✦ symbol on #7c3aed (purple) rounded-square background.
Quickest path: favicon.io → Generate from Text → "✦" → Background #7c3aed → Download

---

## Submission Steps

1. Go to chrome.google.com/webstore/devconsole
2. Pay one-time $5 developer registration fee
3. Click "New Item" → Upload ZIP of the extension folder
4. Fill in listing copy above
5. Upload screenshots (required: at least 1)
6. Upload 128×128 icon
7. Set Privacy Policy URL → use your GitHub Pages URL + /privacy or add a section to the landing page
8. Submit for review (typically 1–3 business days for new extensions)

## ZIP the extension (run this from the project root)
zip -r promptlift-v1.0.0.zip . --exclude="*.git*" --exclude="docs/*" --exclude="*.md" --exclude="content.js" --exclude="popup.html" --exclude="popup.js"
