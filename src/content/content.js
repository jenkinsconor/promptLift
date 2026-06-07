// ─── 1. Intent map ────────────────────────────────────────────────────────────
// Ordered roughly by measured volume (OpenAI/NBER + Anthropic Economic Index)

const INTENT = {
  // Knowledge (highest volume — 10.2% tutoring, 8.5% how-to)
  EXPLAIN:       'explain',
  HOW_TO:        'how-to',
  QUESTION:      'question',
  MATH:          'math',
  // Writing & editing (16% of all messages; 2/3 are modifications of existing text)
  REWRITE:       'rewrite',
  EMAIL:         'email',
  SUMMARIZE:     'summarize',
  WRITING:       'creative writing',
  // Work
  CAREER:        'career',
  INTERVIEW:     'interview prep',
  MARKETING:     'marketing',
  SOCIAL:        'social media',
  // Tech
  CODE:          'code',
  DATA:          'data & formulas',
  TROUBLESHOOT:  'troubleshoot',
  // Life (fastest-growing category YoY per HBR/Filtered)
  COOKING:       'cooking',
  FITNESS:       'fitness',
  TRAVEL:        'travel',
  FINANCE:       'finance',
  HEALTH_ADVICE: 'health',
  LEGAL:         'legal',
  COMPARE:       'compare',
  LIFE_PLAN:     'life planning',
  // Emotional / personal (non-work share grew 53% → 73% YoY on ChatGPT)
  VENT_PROCESS:  'emotional support',
  SELF_REFLECT:  'self-reflection',
  CONFIDENCE:    'confidence',
  // Creative
  IMAGE_PROMPT:  'image prompt',
  VIDEO:         'video & script',
  MUSIC:         'music & lyrics',
  BRAINSTORM:    'brainstorm',
  // Utility
  TRANSLATE:     'translate',
  PLAN:          'planning',
  // Fallback
  GENERAL:       'general',
};

// ─── 2. Context extraction ────────────────────────────────────────────────────
// Reads signals from the raw input to inject into templates dynamically.
// Also detects the 8 high-ROI refinement patterns (OpenAI/NBER + HBR/Filtered).

function extractContext(text) {
  const t = text.toLowerCase();

  // Tone
  let tone = null;
  if (/\b(formal|professional|business|corporate)\b/.test(t))               tone = 'formal and professional';
  else if (/\b(casual|informal|friendly|conversational|relaxed)\b/.test(t)) tone = 'casual and conversational';
  else if (/\b(funny|humorous|witty|playful|fun|entertaining)\b/.test(t))   tone = 'lighthearted and humorous';
  else if (/\b(concise|brief|short|quick|punchy)\b/.test(t))                tone = 'concise';
  else if (/\b(serious|direct|blunt|no-nonsense)\b/.test(t))                tone = 'direct and serious';
  else if (/\b(warm|empathetic|kind|gentle|supportive)\b/.test(t))          tone = 'warm and empathetic';

  // Audience
  let audience = null;
  if (/\b(boss|manager|executive|ceo|director|vp|c-suite)\b/.test(t))          audience = 'a senior professional or executive';
  else if (/\b(5.year.old|child|kid|young|elementary)\b/.test(t))              audience = 'a child or young learner';
  else if (/\b(beginner|newbie|non.technical|layman|no (experience|background))\b/.test(t)) audience = 'a complete beginner with no prior knowledge';
  else if (/\b(developer|engineer|programmer|technical)\b/.test(t))            audience = 'a technical developer audience';
  else if (/\b(client|customer|prospect)\b/.test(t))                           audience = 'a client or customer';
  else if (/\b(team|colleague|coworker|peer)\b/.test(t))                       audience = 'a colleague or team member';
  else if (/\b(investor|vc|board|stakeholder)\b/.test(t))                      audience = 'an investor or board member';
  else if (/\b(recruiter|hiring manager)\b/.test(t))                           audience = 'a recruiter or hiring manager';
  else if (/\b(gen z|teenager|student|college)\b/.test(t))                     audience = 'a student or Gen Z audience';

  // Length
  let length = null;
  const wcMatch = text.match(/\b(\d+)\s*(word|sentence|bullet|paragraph|line)s?\b/i);
  if (wcMatch)                                                                  length = `${wcMatch[1]} ${wcMatch[2]}s`;
  else if (/\b(short|brief|concise|quick|one.liner|tldr)\b/.test(t))           length = 'short and concise';
  else if (/\b(detailed|comprehensive|thorough|in.depth|long|extensive)\b/.test(t)) length = 'detailed and comprehensive';

  // Platform
  let platform = null;
  if (/\binstagram\b/.test(t))           platform = 'Instagram';
  else if (/\btiktok\b/.test(t))         platform = 'TikTok';
  else if (/\blinkedin\b/.test(t))       platform = 'LinkedIn';
  else if (/\b(twitter|x\.com|tweet)\b/.test(t)) platform = 'Twitter/X';
  else if (/\byoutube\b/.test(t))        platform = 'YouTube';
  else if (/\bfacebook\b/.test(t))       platform = 'Facebook';
  else if (/\breddit\b/.test(t))         platform = 'Reddit';
  else if (/\bthreads\b/.test(t))        platform = 'Threads';
  else if (/\bpinterest\b/.test(t))      platform = 'Pinterest';

  // Image style
  let imageStyle = null;
  if (/\b(photorealistic|realistic|photograph)\b/.test(t))                   imageStyle = 'photorealistic';
  else if (/\b(anime|manga)\b/.test(t))                                      imageStyle = 'anime / manga';
  else if (/\b(oil painting|watercolor|sketch|charcoal|pastel)\b/.test(t))   imageStyle = text.match(/oil painting|watercolor|sketch|charcoal|pastel/i)?.[0];
  else if (/\b(3d|cgi|render|blender)\b/.test(t))                            imageStyle = '3D render / CGI';
  else if (/\b(vintage|retro|80s|90s|vhs)\b/.test(t))                        imageStyle = 'vintage / retro aesthetic';
  else if (/\b(pixel art|8.bit)\b/.test(t))                                  imageStyle = 'pixel art';
  else if (/\b(minimalist|flat design)\b/.test(t))                           imageStyle = 'minimalist';
  else if (/\b(fantasy|surreal|dreamlike)\b/.test(t))                        imageStyle = 'fantasy / surrealism';

  // Output format
  let format = null;
  if (/\b(as a table|in a table|table format)\b/.test(t))                    format = 'table';
  else if (/\b(bullet point|bullet list|as bullets)\b/.test(t))              format = 'bullet point list';
  else if (/\b(numbered|step.by.step|as steps)\b/.test(t))                   format = 'numbered steps';
  else if (/\b(as json|in json)\b/i.test(t))                                 format = 'JSON';
  else if (/\b(as markdown|in markdown)\b/i.test(t))                         format = 'Markdown';
  else if (/\b(as a checklist|checklist format)\b/.test(t))                  format = 'checklist';

  // Target language (for translate)
  let targetLanguage = null;
  const langMatch = text.match(/\b(?:to|in|into)\s+(spanish|french|german|portuguese|italian|japanese|chinese|korean|arabic|hindi|russian|dutch|polish|swedish|turkish|greek|hebrew)\b/i);
  if (langMatch) targetLanguage = langMatch[1].charAt(0).toUpperCase() + langMatch[1].slice(1);

  // ── Refinement signals (the 8 high-ROI patterns from OpenAI/NBER + HBR research)
  // These are the dominant iteration patterns in real-world AI usage.
  let refinement = null;
  if (/\bmake (it|this) (more |less )?(formal|professional|polished|serious|proper)|(less casual|less informal)\b/.test(t))    refinement = 'make-formal';
  else if (/\bmake (it|this) (more |less )?(casual|friendly|warm|relaxed|conversational)|(less formal|less stiff)\b/.test(t)) refinement = 'make-casual';
  else if (/\b(make (it|this) (shorter|more concise|punchier)|shorten|compress|tighten|trim (this|it)|cut (this|it) down)\b/.test(t)) refinement = 'compress';
  else if (/\b(make (it|this) longer|expand (this|on)|elaborate|flesh out|add more detail|go deeper)\b/.test(t))               refinement = 'expand';
  else if (/\b(as a table|in table|as bullets|as a list|as json|reformat|change (the )?format|put this in)\b/.test(t))         refinement = 'reformat';
  else if (/\b(for a |for an |for my )(5.year|child|kid|beginner|non.technical|cfo|executive|developer|recruiter|gen z)\b/.test(t)) refinement = 'audience-shift';
  else if (/\b(\d+\s*(version|option|variation|alternative)|give me \d+|show me \d+)\b/.test(t))                               refinement = 'multi-version';
  else if (/\bthink step.?by.?step\b|\bshow (your |the )?reasoning\b|\bchain of thought\b/.test(t))                           refinement = 'chain-of-thought';
  else if (/\bact as (a |an )\b|\byou are (a |an )\b|\bpretend (you are|you're) (a |an )\b/.test(t))                          refinement = 'persona';

  // Short query (≤6 words: the "AI as Google" pattern — factual lookups grew 14% → 24% YoY)
  const wordCount = text.trim().split(/\s+/).length;
  const isShortQuery = wordCount <= 6;

  return { tone, audience, length, platform, imageStyle, format, targetLanguage, refinement, isShortQuery };
}

// ─── 3. Intent detection ──────────────────────────────────────────────────────
// Most specific signals first to prevent false matches.

function detectIntent(text) {
  const t = text.toLowerCase().trim();

  // ── Refinement intents — highest priority (2/3 of writing messages are modifications)
  if (/\bmake (it|this) (more |less )?(formal|professional|polished|casual|friendly|concise|punchy|shorter|longer)\b/.test(t)) return INTENT.REWRITE;
  if (/\b(rewrite|rephrase|improve this|edit this|polish|revise|refine this|fix this|clean (this|it) up)\b/.test(t)) return INTENT.REWRITE;

  // ── Emotional / personal (fastest-growing cluster, HBR/Filtered #1-3 for 2025)
  if (/\b(feeling (lost|anxious|overwhelmed|stressed|sad|depressed|lonely|confused|stuck)|i don't know what to do|i've been struggling|help me process|i need to vent|vent about|i'm going through)\b/.test(t)) return INTENT.VENT_PROCESS;
  if (/\b(find my purpose|what's my purpose|my life goals|life direction|meaning of|what do i want|who am i|values clarification|figure out my|discover myself)\b/.test(t)) return INTENT.SELF_REFLECT;
  if (/\b(give me confidence|boost my confidence|am i making the right|second.guessing|talk me through|pep talk|reassure me|validate my decision|should i (do|take|quit|leave|accept))\b/.test(t)) return INTENT.CONFIDENCE;

  // ── Life organisation (#2 fastest growing)
  if (/\b(organize my life|organize my week|life plan|morning routine|habit (tracker|plan)|productivity system|daily schedule|weekly plan|goal setting|smart goal|new year|resolutions)\b/.test(t)) return INTENT.LIFE_PLAN;

  // ── Image generation
  if (/\b(midjourney|dall-?e|stable diffusion|image prompt|generate.{0,10}image|photo of|portrait of|picture of|render of|illustration of)\b/i.test(text)) return INTENT.IMAGE_PROMPT;
  if (/^(a |an )?(photo|image|picture|portrait|illustration|painting|drawing|render|artwork) of\b/i.test(t)) return INTENT.IMAGE_PROMPT;

  // ── Code (strong signals — check before HOW_TO to avoid "how to code" misfires)
  if (/```|stack trace|\berror:|\bexception\b|\bundefined\b.*\bfunction\b/i.test(text)) return INTENT.CODE;
  if (/\b(function|const |let |var |import |export |class |def |return |async |await )\b/.test(text)) return INTENT.CODE;
  if (/\b(code|script|program|bug|debug|refactor|implement|algorithm|api endpoint|unit test|regex|snippet|pull request|github)\b/.test(t)) return INTENT.CODE;
  if (/\.(js|ts|py|java|css|html|go|rs|rb|php|sh)\b/.test(t)) return INTENT.CODE;

  // ── Data / spreadsheets
  if (/\b(sql|query|vlookup|hlookup|pivot table|excel formula|google sheets|spreadsheet|database schema|join table|select .{1,30} from|pandas|dataframe|csv|power bi|tableau)\b/i.test(text)) return INTENT.DATA;

  // ── Troubleshoot
  if (/\b(not working|won't (start|open|load|connect)|why (is|isn't|won't|doesn't)|error message|keeps (crashing|freezing|failing)|how (to fix|do i fix)|troubleshoot|diagnose|my .{1,20} (broke|stopped|crashed))\b/.test(t)) return INTENT.TROUBLESHOOT;

  // ── Video / YouTube / TikTok
  if (/\b(youtube|tiktok|reel|video script|storyboard|voiceover|b-roll|vlog|short video|hooks for video|video idea)\b/.test(t)) return INTENT.VIDEO;

  // ── Music
  if (/\b(lyrics|write a song|song about|chorus|verse|bridge|hook|chord progression|rap|hip hop|jingle|melody)\b/.test(t)) return INTENT.MUSIC;

  // ── Cooking
  if (/\b(recipe|ingredient|cook|bake|roast|grill|fry|meal|dish|cuisine|tablespoon|teaspoon|preheat|oven|simmer|marinate|what to (cook|make|eat)|dinner idea|meal prep|substitute for)\b/.test(t)) return INTENT.COOKING;

  // ── Fitness
  if (/\b(workout|exercise|gym|training plan|weight loss|build muscle|cardio|reps|sets|squat|deadlift|bench press|hiit|pilates|yoga|macros|calories burned|get (fit|lean|stronger)|home workout)\b/.test(t)) return INTENT.FITNESS;

  // ── Health
  if (/\b(symptom|diagnosis|should i see a doctor|is it normal to|side effect|medication|disease|illness|condition|health advice|medical question|pain in my|my .{1,20} (hurts|aches|is swollen))\b/.test(t)) return INTENT.HEALTH_ADVICE;

  // ── Legal
  if (/\b(contract|nda|terms of service|tos|lease|legal clause|lawsuit|my rights|is it legal|legally required|liability|intellectual property|copyright|trademark|demand letter|legal document)\b/.test(t)) return INTENT.LEGAL;

  // ── Travel
  if (/\b(trip to|travel to|visit|itinerary|things to do in|best places|hotel|flight|airbnb|vacation|holiday|road trip|backpacking|sightseeing|visa|local tips)\b/.test(t)) return INTENT.TRAVEL;

  // ── Career
  if (/\b(resume|cv|cover letter|job application|linkedin profile|salary negotiation|performance review|job offer|promotion|career change|job description|portfolio review)\b/.test(t)) return INTENT.CAREER;

  // ── Interview (separate from career — high growth, #11 on HBR/Filtered 2025)
  if (/\b(interview prep|mock interview|interview question|prepare for (a |an |my )interview|common interview|behavioral question|tell me about yourself|star method)\b/.test(t)) return INTENT.INTERVIEW;

  // ── Finance
  if (/\b(budget|invest|savings|stock|crypto|etf|401k|retirement|financial plan|debt|mortgage|tax|compound interest|portfolio|dividend|net worth|personal finance)\b/.test(t)) return INTENT.FINANCE;

  // ── Email (top writing sub-topic per OpenAI/NBER)
  if (/\b(email|e-mail|subject line|reply to|follow.?up|write.{0,10}message|message to my|send.{0,10}to|draft.{0,10}(email|message))\b/.test(t)) return INTENT.EMAIL;
  if (/^(hi |hello |dear )(team|boss|manager|client|everyone|all)\b/.test(t)) return INTENT.EMAIL;

  // ── Social media
  if (/\b(instagram|tiktok|linkedin post|facebook post|caption|hashtag|tweet|social media post|content calendar|post for|reel caption|thread for twitter)\b/.test(t)) return INTENT.SOCIAL;

  // ── Marketing
  if (/\b(ad copy|advertisement|landing page|cta|call to action|seo|conversion|campaign|tagline|slogan|brand voice|product description|email campaign|newsletter|value proposition)\b/.test(t)) return INTENT.MARKETING;

  // ── Compare / product decisions (#29, growing via "AI as Google" trend)
  if (/\b(compare|vs\b|versus|pros.?and.?cons|difference between|which is better|x or y|best (option|choice|tool|software|product)|should i (buy|get|use|choose))\b/.test(t)) return INTENT.COMPARE;

  // ── Math / calculations (3% of all ChatGPT messages per OpenAI/NBER)
  if (/\b(calculate|solve|equation|formula for|what is \d|how many|percentage of|square root|derivative|integral|probability|statistics|word problem|\d+\s*[×x\*]\s*\d+|\d+\s*÷\s*\d+)\b/.test(t)) return INTENT.MATH;

  // ── Translate
  if (/\b(translate|translation|in spanish|en français|auf deutsch|in portuguese|in italian|in japanese|in chinese|in arabic)\b/i.test(text)) return INTENT.TRANSLATE;

  // ── Explain (tutoring — single largest sub-category at 10.2% of all messages)
  if (/\b(explain|what is|what are|how does|how do|eli5|break (it |this )?down|in simple terms|for a beginner|what does .{1,20} mean|teach me|help me understand)\b/.test(t)) return INTENT.EXPLAIN;

  // ── How-to (practical steps — 8.5% of all messages, bigger than CODE)
  if (/\b(how to|step.?by.?step|steps to|guide (to|for)|instructions (for|to)|walkthrough|tutorial|how (do i|can i|should i) (do|make|build|set up|configure|install|create))\b/.test(t)) return INTENT.HOW_TO;

  // ── Brainstorm
  if (/\b(ideas? for|brainstorm|give me (ideas?|options?|suggestions?|examples?)|list of|come up with|what (can|should) i|suggest)\b/.test(t)) return INTENT.BRAINSTORM;

  // ── Plan
  if (/\b(plan|roadmap|strategy|schedule|timeline|project plan|action plan|launch plan|growth plan)\b/.test(t)) return INTENT.PLAN;

  // ── Summarize
  if (/\b(summarize|summary|tldr|tl;dr|shorten|condense|recap|key (points?|takeaways?))\b/.test(t)) return INTENT.SUMMARIZE;

  // ── Creative writing
  if (/\b(write|draft|compose|essay|article|blog post|short story|poem|fiction|narrative|speech|screenplay|bedtime story)\b/.test(t)) return INTENT.WRITING;

  // ── Question / fact lookup (factual queries grew 14% → 24% of all messages YoY)
  if (/^(how|what|why|when|where|who|which|can|could|should|would|is|are|do|does|did|will|has|have)\b/i.test(t)) return INTENT.QUESTION;

  return INTENT.GENERAL;
}

// ─── 4. Template builders ─────────────────────────────────────────────────────

function opt(label, value, fallback) {
  return `- ${label}: ${value ?? fallback}`;
}

function refinementAddendum(refinement) {
  // Appends refinement-specific constraints to any template
  if (!refinement) return '';
  const map = {
    'make-formal':      '\n- Tone target: formal and professional — remove colloquialisms, tighten sentence structure',
    'make-casual':      '\n- Tone target: casual and conversational — use contractions, natural phrasing, first-person where natural',
    'compress':         '\n- Length: cut 30–50%; remove filler, redundant adjectives, and qualifiers; keep every key point',
    'expand':           '\n- Length: expand — add examples, explain reasoning, increase depth; do not pad with filler',
    'reformat':         '\n- Format: convert to the requested format exactly, preserving all content',
    'audience-shift':   '\n- Adapt all language, complexity, and examples to the specified audience',
    'multi-version':    '\n- Output the requested number of distinct versions — vary tone, angle, and structure between them',
    'chain-of-thought': '\n- Show your reasoning step-by-step before arriving at the answer',
    'persona':          '\n- Adopt the specified persona fully — adjust voice, expertise level, and framing accordingly',
  };
  return map[refinement] ?? '';
}

function buildTemplate(text, intent, ctx) {
  const { tone, audience, length, platform, imageStyle, format, targetLanguage, refinement } = ctx;
  const ra = refinementAddendum(refinement);

  switch (intent) {

    case INTENT.EXPLAIN: return `You are a patient, knowledgeable teacher.

Task: ${text}

${opt('Audience', audience, 'a curious adult with no prior knowledge of this topic')}
${opt('Tone', tone, 'clear, friendly, and approachable')}

Approach:
1. State the core concept in one or two plain-language sentences
2. Use a concrete analogy to make it relatable
3. Walk through how it works step-by-step
4. Give a real-world example or application
5. End with a one-line summary

Constraints:
- Avoid jargon unless you immediately define it
- Do not assume prior knowledge
${opt('Length', length, 'as concise as possible while being genuinely clear')}${ra}`;

    case INTENT.HOW_TO: return `You are a practical expert in the relevant domain.

Task: ${text}

${opt('Audience', audience, 'someone attempting this for the first time')}

Instructions:
1. List any prerequisites or materials needed before the steps
2. Provide numbered steps in exact sequence
3. At each step: state what to do AND what success looks like
4. Flag the most common mistake at the steps where people go wrong
5. Add a "troubleshooting" note at the end for the top 2 failure modes

Constraints:
- Be specific — no vague steps like "configure the settings"
- Do not skip "obvious" steps — include them
${opt('Length', length, 'complete walkthrough, nothing omitted')}${ra}`;

    case INTENT.QUESTION: return `You are a knowledgeable expert in the relevant domain.

Question: ${text}

${opt('Audience', audience, 'a curious adult expecting a direct, accurate answer')}

Approach:
- Lead with the direct answer in the first sentence — no preamble
- Follow with the essential context that makes the answer meaningful
- Use a concrete example if the answer is abstract
- State your confidence level if uncertain; flag if professional advice applies

${opt('Length', length, 'as concise as possible while being complete')}${ra}`;

    case INTENT.MATH: return `You are a precise, methodical problem-solver.

Task: ${text}

Approach:
1. State the formula or method being used before applying it
2. Show every step of working, numbered
3. Include units at every step, not only in the final answer
4. Verify the answer by working backwards or with a sanity check
5. Note any assumptions made (rounding rules, variable definitions)

Constraints:
- Do not skip steps — every transition must be followable
- If multiple methods exist, use the clearest one and mention the alternative
${opt('Length', length, 'step-by-step solution with a clearly boxed final answer')}${ra}`;

    case INTENT.REWRITE: return `You are an expert editor and writing coach.

Task: ${text}

${opt('Target tone', tone, 'preserve the original voice; improve clarity and flow')}
${opt('Target audience', audience, 'same as the original unless specified')}

Approach:
- Eliminate passive voice, filler phrases, and redundancy
- Tighten sentence structure without removing meaning
- Apply any tone, length, or format change specified in the request
- If rewriting for a specific platform or audience, adapt fully

Constraints:
- Do not change the core meaning or remove key information
- Output the rewritten version only — no commentary or explanation
${opt('Length', length, 'match the original unless a change is specified')}${ra}`;

    case INTENT.EMAIL: return `You are an expert business communicator.

Task: ${text}

${opt('Recipient / relationship', audience, 'infer from context')}
${opt('Tone', tone, 'professional and direct')}
${opt('Length', length, 'concise — every sentence earns its place')}

Structure:
- Subject line: specific and actionable (if not provided)
- Opening: direct context-setting — no "I hope this email finds you well"
- Body: one clear ask or piece of information per paragraph
- Closing: state the specific next step or expected action

Constraints:
- No filler phrases or vague pleasantries
- The recipient should know what to do after reading the last line
${ra}`;

    case INTENT.SUMMARIZE: return `You are an expert at distilling information clearly.

Task: ${text}

Constraints:
- Preserve all key facts, decisions, numbers, and conclusions
- Do not add interpretation beyond what is stated
- Omit repetition, examples, and supporting detail — keep only the substance
${opt('Length', length, 'no longer than 20% of the source')}
${opt('Format', format, 'bullet points for multiple items; one paragraph for a single narrative')}${ra}`;

    case INTENT.WRITING: return `You are an expert writer and storyteller.

Task: ${text}

${opt('Tone', tone, 'infer from the piece type; default to clear and engaging')}
${opt('Audience', audience, 'general reader unless specified')}
${opt('Length', length, 'appropriate for the format')}

Constraints:
- Open with a hook — never start with background or meta-commentary
- Show, don't tell where possible
- Avoid clichés, filler, and padding
- Output the final piece only — no commentary
${opt('Format', format, 'appropriate for the piece type')}${ra}`;

    case INTENT.CAREER: return `You are a senior career coach and HR professional.

Task: ${text}

${opt('Target role / level', audience, 'infer from context')}

Guidelines:
- For resumes/CVs: use strong action verbs, quantify achievements with metrics, tailor to the role
- For cover letters: lead with the specific value you bring, not your career history
- For LinkedIn profiles: optimise for recruiter keyword searches + human readability
- For salary negotiation: provide a specific script with anchoring strategy and fallback positions

Constraints:
- Be specific — no generic "be yourself" advice
- Every bullet should pass the "so what?" test
${opt('Format', format, 'structured sections with clear, actionable deliverables')}${ra}`;

    case INTENT.INTERVIEW: return `You are a senior hiring manager and interview coach.

Task: ${text}

${opt('Role / company / level', audience, 'infer from context or use general best practices')}

Provide:
1. The 5–7 most likely questions for this role/level
2. For each: a STAR-method answer framework (Situation, Task, Action, Result)
3. One question the candidate should ask the interviewer
4. One common mistake candidates make in this type of interview

Constraints:
- Be specific to the role — not generic interview advice
- For mock interviews: ask one question at a time, then give precise, actionable feedback
${opt('Tone', tone, 'direct and coach-like')}${ra}`;

    case INTENT.MARKETING: return `You are a conversion-focused marketing copywriter.

Task: ${text}

${opt('Target audience', audience, 'infer from context')}
${opt('Tone / brand voice', tone, 'clear, benefit-led, and persuasive')}

Guidelines:
- Lead with the benefit, not the feature
- Use PAS where appropriate: Problem → Agitate → Solution
- Include a specific, action-oriented CTA
- Write at a clear reading level unless the audience demands otherwise
- Avoid marketing clichés: "game-changing", "cutting-edge", "seamless"

${opt('Format', format, 'headline + body + CTA, clearly separated')}${ra}`;

    case INTENT.SOCIAL: return `You are a social media strategist and platform-native copywriter.

Task: ${text}

${opt('Platform', platform, 'infer from context or adapt for general social media')}
${opt('Tone', tone, 'authentic and engaging for the platform')}

Platform rules:
${platform === 'Instagram'  ? '- Strong hook in line 1 (before "more"), visual storytelling, 3–5 targeted hashtags at the end' : ''}
${platform === 'TikTok'     ? '- Pattern interrupt opening, trend-aware language, casual Gen Z voice, suggest relevant sounds/trends' : ''}
${platform === 'LinkedIn'   ? '- Professional insight or authentic story, line breaks for mobile readability, end with a question to drive comments' : ''}
${platform === 'Twitter/X'  ? '- 280 character hard limit, punchy single idea, strong hook in the first line' : ''}
${platform === 'YouTube'    ? '- SEO-optimised title (60 chars), keyword-rich description, chapter timestamps if relevant' : ''}
${!platform                 ? '- Adapt format, length, and tone to the platform if specified' : ''}

${opt('Length', length, 'platform-appropriate')}

Output: Ready-to-post caption with hashtag suggestions.${ra}`;

    case INTENT.CODE: return `You are an expert software engineer.

Task: ${text}

Constraints:
- Provide working, production-quality code
- Add brief inline comments for non-obvious logic
- Include error handling for realistic edge cases
- When modifying existing code, show only changed sections with surrounding context
- Do not add unnecessary dependencies
${opt('Format', format, 'code block with the correct language tag, complete and runnable')}${ra}`;

    case INTENT.DATA: return `You are a data analyst and spreadsheet expert.

Task: ${text}

Constraints:
- Provide the exact formula or query — no placeholder column names, use realistic examples
- Explain each part of the formula/query in plain English after showing it
- Cover edge cases: empty cells, nulls, duplicates, type mismatches
${opt('Format', format, 'formula or SQL query followed by a plain-English breakdown')}${ra}`;

    case INTENT.TROUBLESHOOT: return `You are a patient, methodical technical support expert.

Problem: ${text}

Approach:
1. State the most likely root cause based on the symptoms
2. Provide a step-by-step diagnostic checklist — easiest/most common checks first
3. For each step: what to do, what a "pass" looks like, what to try if it fails
4. Address the top 2–3 possible causes if the problem is ambiguous

Constraints:
- Ask for missing context (OS, device model, exact error text) if it would significantly change the diagnosis
- Flag if professional repair or a developer is likely needed
${opt('Format', format, 'numbered diagnostic steps with clear pass/fail criteria')}${ra}`;

    case INTENT.COOKING: return `You are an experienced chef and culinary expert.

Task: ${text}

Guidelines:
- Include ingredients with exact measurements, step-by-step method, prep time, cook time, and serving size
- Suggest substitutions for hard-to-find ingredients
- Call out the 2–3 most common mistakes and how to avoid them
- Note dietary flags (gluten, dairy, nuts) where relevant
${opt('Tone', tone, 'clear and practical — like a friend who can actually cook')}
${opt('Format', format, 'structured recipe: Ingredients → Method → Tips')}${ra}`;

    case INTENT.FITNESS: return `You are a certified personal trainer and sports nutritionist.

Task: ${text}

Guidelines:
- State assumed fitness level and equipment if not specified
- For workouts: include exercise name, sets, reps, rest periods, and one technique cue per movement
- For nutrition: include specific macros or portion guidance, not vague advice
- Flag safety considerations or movements to avoid for beginners
${opt('Format', format, 'structured plan with clearly labelled sections')}${ra}`;

    case INTENT.HEALTH_ADVICE: return `You are a knowledgeable health information resource.

Task: ${text}

Guidelines:
- Provide accurate, evidence-based health information in plain language
- Clearly distinguish general information from personalised medical advice
- Describe when symptoms suggest routine vs. urgent care
- Always recommend consulting a qualified healthcare provider for diagnosis or treatment decisions

Constraints:
- Do not diagnose or prescribe — inform and guide
- Do not downplay potentially serious symptoms
${opt('Tone', tone, 'calm, clear, and non-alarmist')}${ra}`;

    case INTENT.LEGAL: return `You are a knowledgeable legal information resource.

Task: ${text}

Guidelines:
- For explaining documents: identify key clauses, explain their plain-language meaning, flag unusual or risky terms
- For drafting: provide a complete template with standard clauses and clearly labelled placeholders
- Note jurisdiction-specific variations where relevant
- Always recommend consulting a licensed attorney for binding legal decisions

Constraints:
- Use plain language; define legal terms when used
- Do not provide specific legal advice for binding situations
${opt('Format', format, 'structured sections with a professional disclaimer at the end')}${ra}`;

    case INTENT.TRAVEL: return `You are an expert travel planner and local culture guide.

Task: ${text}

Guidelines:
- For itineraries: organise by day with morning / afternoon / evening blocks
- Include must-see spots, hidden gems, and practical logistics (transport, booking tips, costs)
- Note best time of year, visa requirements, and local customs where relevant
- State assumed budget level (budget / mid-range / luxury) if not specified
${opt('Tone', tone, 'practical and inspiring')}
${opt('Format', format, 'day-by-day itinerary or structured travel advice')}${ra}`;

    case INTENT.FINANCE: return `You are a knowledgeable personal finance advisor.

Task: ${text}

Guidelines:
- Give practical, specific advice — not vague suggestions like "spend less"
- State assumptions about income, country, or risk tolerance where they affect the answer
- For investments: explain the concept, risk profile, time horizon, and real examples
- Recommend professional financial advice where the situation requires it
${opt('Tone', tone, 'clear, direct, and trustworthy')}
${opt('Format', format, 'actionable steps with specific numbers where possible')}${ra}`;

    case INTENT.COMPARE: return `You are a sharp, objective analyst.

Task: ${text}

${opt('Audience', audience, 'a decision-maker who needs a clear recommendation')}

Structure:
1. Quick verdict — the one-line answer if there is a clear winner
2. Comparison table — key dimensions side-by-side
3. Best for — who each option is best suited to and why
4. Trade-offs — what you give up with each choice
5. Recommendation — a direct conclusion with specific reasoning

Constraints:
- Base assessments on specs, evidence, and use-case fit — not brand reputation alone
- Flag if the "best" answer depends heavily on the user's specific situation
${opt('Format', format, 'structured sections with a clear final recommendation')}${ra}`;

    case INTENT.LIFE_PLAN: return `You are a practical, no-nonsense life coach.

Task: ${text}

Approach:
- Break the goal into concrete, actionable steps — not abstract advice
- Prioritise by impact and effort: quick wins first, bigger changes second
- Build in realistic timelines — not aspirational ones
- Name the 2–3 most likely obstacles and a mitigation for each
- Offer a "minimum viable version" if the full plan feels daunting

Constraints:
- No generic motivational language — specific actions only
- Every action should be something that can be started today or this week
${opt('Format', format, 'prioritised action plan with clear next steps and timelines')}${ra}`;

    case INTENT.VENT_PROCESS: return `You are a compassionate, non-judgmental thinking partner.

Task: Help me process the following:
${text}

Approach:
1. Acknowledge what the person is feeling before offering any perspective
2. Reflect back what you hear to confirm understanding
3. Ask one clarifying question if the situation is unclear before responding further
4. Offer a gentle reframe or perspective — not a directive
5. Suggest one small, practical next step only if the person seems ready for action

Constraints:
- Do not minimise feelings or jump straight to solutions
- Do not give medical, legal, or financial advice — suggest professional help where appropriate
- Maintain a warm, grounded tone — not clinical, not overly cheerful
${opt('Tone', tone, 'warm, patient, and genuinely empathetic')}${ra}`;

    case INTENT.SELF_REFLECT: return `You are a wise, non-judgmental Socratic coach.

Task: Help me think through the following:
${text}

Approach:
1. Reflect the themes and patterns you notice in what's been shared
2. Offer 1–2 reframing perspectives — not prescriptions
3. Connect the surface concern to the deeper values it might point to
4. End with 3 open reflection questions the person can sit with

Constraints:
- Do not impose a direction or conclusion — guide, don't prescribe
- Acknowledge complexity; avoid false clarity or easy answers
- Be genuinely curious and open, not formulaic
${opt('Tone', tone, 'thoughtful, warm, and unhurried')}${ra}`;

    case INTENT.CONFIDENCE: return `You are a supportive coach and clear-headed advisor.

Task: Help me navigate the following:
${text}

Approach:
1. Acknowledge the difficulty or complexity of the situation honestly
2. Identify the strengths, evidence, or resources the person already has
3. Give a balanced, realistic perspective — including real risks if they exist
4. Provide a direct recommendation or validation if one is warranted
5. Close with one specific, actionable next step

Constraints:
- Be honest — do not just validate; flag genuine risks if present
- Keep the tone warm but grounded — not fluffy or generic
${opt('Tone', tone, 'direct, warm, and encouraging')}${ra}`;

    case INTENT.IMAGE_PROMPT: return `You are a professional AI image generation prompt engineer.

Objective: Create a highly detailed image generation prompt for:
${text}

Build the prompt using these elements in sequence:
1. Subject — main focus, specific details, pose or action
2. Setting — environment, background, time of day, atmosphere
3. Style — ${imageStyle ?? 'art style and medium (e.g. photorealistic, oil painting, concept art, anime)'}
4. Lighting — type and quality (e.g. golden hour, dramatic rim light, soft studio)
5. Composition — camera angle and framing (e.g. close-up, wide shot, bird's eye)
6. Quality tags — fidelity markers (e.g. 8K, hyperdetailed, award-winning photography)

Output: A single optimized prompt (100–200 words) ready to paste into Midjourney, DALL·E, or Stable Diffusion. No explanations — just the prompt.${ra}`;

    case INTENT.VIDEO: return `You are a professional video content strategist and scriptwriter.

Objective: ${text}

${opt('Platform', platform, 'YouTube — adapt length and format for other platforms')}
${opt('Tone', tone, 'engaging and clear')}
${opt('Target length', length, 'suggest appropriate duration for the platform')}

Script structure:
- Hook (0–3 sec): bold opening — a question, surprising claim, or compelling visual cue
- Setup (3–30 sec): why the viewer should keep watching
- Core Content: main points or scenes with approximate timestamps
- CTA: one clear call to action

Constraints:
- Write for spoken delivery — natural, conversational language
- Add B-roll or visual suggestions in [brackets]
- Flag sections needing on-screen text, graphics, or cuts
${ra}`;

    case INTENT.MUSIC: return `You are a professional songwriter and music theorist.

Task: ${text}

${opt('Tone / mood', tone, 'infer from the request or describe the intended emotion')}
${opt('Length', length, 'standard song structure unless specified')}

Guidelines:
- For lyrics: use verse / pre-chorus / chorus / bridge structure with a consistent rhyme scheme
- For chord progressions: specify key, mode, and tempo; include Nashville numbers
- For music theory: explain concepts with real song references and practical examples
${ra}`;

    case INTENT.BRAINSTORM: return `You are a creative strategist and lateral thinker.

Task: ${text}

${opt('Tone', tone, 'generative and open-minded')}
${opt('Count', length, '10 diverse ideas')}

Guidelines:
- Prioritise variety — mix obvious, unconventional, and unexpected options
- For each idea: one sentence of context or rationale
- Flag bold or high-risk ideas explicitly so the user can calibrate
- Do not self-filter — unusual ideas often unlock the best ones

${opt('Format', format, 'numbered list with a one-line rationale per item')}${ra}`;

    case INTENT.TRANSLATE: return `You are a professional translator and linguist.

Task: ${text}

Target language: ${targetLanguage ?? 'as specified in the request'}

Constraints:
- Preserve meaning, tone, and register — do not paraphrase unless literal translation is unnatural
- Flag idioms or culturally specific phrases that don't translate directly, and provide the closest natural equivalent
- For technical or legal text: preserve terminology or provide the standard term in the target language

Output: Translated text, followed by a brief note on any significant translation decisions.${ra}`;

    case INTENT.PLAN: return `You are a strategic planner and project manager.

Task: ${text}

${opt('Detail level', length, 'practical and specific — not high-level fluff')}

Structure:
1. Goal: what does success look like, specifically?
2. Phases: logical sequence with dependencies noted
3. Key actions per phase: specific, assignable tasks
4. Risks and mitigations: top 2–3 realistic blockers and how to handle them
5. Definition of done: how you know each phase is complete

${opt('Format', format, 'structured sections with numbered action items')}${ra}`;

    default: return `You are a highly capable AI assistant.

Task: ${text}

${opt('Tone', tone, 'direct and helpful')}
${opt('Audience', audience, 'general')}

Constraints:
- Be direct and actionable
- If the request is ambiguous, state your interpretation before responding
- Do not make assumptions that change the user's intent

${opt('Format', format, 'format best suited to the task — prose, list, table, or code')}
${opt('Length', length, 'as concise as possible while being complete')}${ra}`;
  }
}

// ─── 5. Short query expander ──────────────────────────────────────────────────
// Handles the "AI as Google" pattern — factual lookups grew 14% → 24% YoY.

function expandShortQuery(text) {
  return `${text}

Please provide:
- A direct, clear answer
- The essential context needed to understand it fully
- A concrete, real-world example or application
- Any important caveats, edge cases, or "it depends" factors`;
}

// ─── 6. Orchestrator ──────────────────────────────────────────────────────────

function scaffoldPrompt(text) {
  // 1. Detect intent and extract context signals from the raw input
  const intent = detectIntent(text);
  const ctx    = extractContext(text);

  // 2. For very short queries, add context slots the user didn't write
  const source = ctx.isShortQuery ? expandShortQuery(text) : text;

  // 3. Build the full structured template with dynamic context injection
  const improved = buildTemplate(source, intent, ctx);

  return { improved, intent };
}

// ─── 7. Chrome built-in AI (Rewriter / LanguageModel APIs) ───────────────────

async function tryBuiltinAI(scaffolded) {
  // 1. Try the Rewriter API (Chrome 137+ for extensions, exact use-case fit)
  try {
    const rewriterObj = globalThis.Rewriter ?? globalThis.ai?.rewriter;
    if (rewriterObj) {
      const avail = await rewriterObj.availability?.();
      if (avail && avail !== 'unavailable') {
        const rewriter = await rewriterObj.create({
          sharedContext: 'Polish this structured AI prompt — improve clarity and natural language without changing its structure or intent.',
          tone: 'as-is',
          length: 'as-is',
        });
        const result = await rewriter.rewrite(scaffolded);
        rewriter.destroy?.();
        if (result?.trim()) return result.trim();
      }
    }
  } catch { /* fall through */ }

  // 2. Try the LanguageModel / Prompt API (Chrome 138+ for extensions)
  try {
    if ('LanguageModel' in globalThis) {
      const avail = await LanguageModel.availability();
      if (avail === 'available') {
        const session = await LanguageModel.create({
          systemPrompt: 'You refine structured AI prompts. Keep the structure and intent completely intact — only improve natural language flow and clarity. Return only the polished prompt, nothing else.',
        });
        const result = await session.prompt(scaffolded);
        session.destroy?.();
        if (result?.trim()) return result.trim();
      }
    }
  } catch { /* fall through */ }

  return null;
}

// ─── 8. Site-specific editor selectors ───────────────────────────────────────
// Selectors ordered: most specific → most generic fallback.
// Sites using <textarea> and sites using contenteditable are both handled
// via getEditorText / setEditorText below.

const SITES = [
  // ── Tier 1: already validated ────────────────────────────────────────────
  {
    match: 'chatgpt.com',
    getEditor: () =>
      document.querySelector('#prompt-textarea[contenteditable="true"]') ||
      document.querySelector('[role="textbox"][data-id="root"]') ||
      document.querySelector('[role="textbox"]'),
  },
  {
    match: 'claude.ai',
    getEditor: () =>
      document.querySelector('[contenteditable="true"].ProseMirror') ||
      document.querySelector('div[aria-label][contenteditable="true"]') ||
      document.querySelector('[contenteditable="true"]'),
  },
  {
    match: 'gemini.google.com',
    getEditor: () =>
      document.querySelector('div.ql-editor[contenteditable="true"]') ||
      document.querySelector('rich-textarea [contenteditable="true"]') ||
      document.querySelector('[contenteditable="true"][aria-label]'),
  },
  // ── Tier 2: top AI platforms ──────────────────────────────────────────────
  {
    match: 'perplexity.ai',
    getEditor: () =>
      document.querySelector('textarea[placeholder]') ||
      document.querySelector('textarea'),
  },
  {
    match: 'copilot.microsoft.com',
    getEditor: () =>
      document.querySelector('div[contenteditable="true"][aria-label]') ||
      document.querySelector('textarea[aria-label]') ||
      document.querySelector('[role="textbox"]'),
  },
  {
    match: 'grok.com',
    getEditor: () =>
      document.querySelector('textarea[enterkeyhint]') ||
      document.querySelector('textarea[placeholder]') ||
      document.querySelector('textarea'),
  },
  {
    // Grok embedded on X/Twitter
    match: 'x.com',
    getEditor: () =>
      document.querySelector('[data-testid="grokChatInput"] textarea') ||
      document.querySelector('[data-testid="grokChatInput"] [contenteditable="true"]'),
  },
  {
    match: 'chat.deepseek.com',
    getEditor: () =>
      document.querySelector('textarea[placeholder]') ||
      document.querySelector('#chat-input') ||
      document.querySelector('textarea'),
  },
  {
    match: 'chat.mistral.ai',
    getEditor: () =>
      document.querySelector('textarea[placeholder]') ||
      document.querySelector('[contenteditable="true"]') ||
      document.querySelector('textarea'),
  },
  {
    match: 'meta.ai',
    getEditor: () =>
      document.querySelector('[contenteditable="true"][role="textbox"]') ||
      document.querySelector('[contenteditable="true"][aria-label]') ||
      document.querySelector('textarea'),
  },
  {
    match: 'poe.com',
    getEditor: () =>
      document.querySelector('textarea[enterkeyhint]') ||
      document.querySelector('textarea[class*="GrowingTextArea"]') ||
      document.querySelector('textarea'),
  },
  {
    match: 'character.ai',
    getEditor: () =>
      document.querySelector('div[contenteditable="true"][enterkeyhint]') ||
      document.querySelector('textarea[placeholder]') ||
      document.querySelector('textarea'),
  },
  {
    match: 'you.com',
    getEditor: () =>
      document.querySelector('textarea[id*="search"]') ||
      document.querySelector('textarea[placeholder]') ||
      document.querySelector('textarea'),
  },
  {
    match: 'huggingface.co',
    getEditor: () =>
      document.querySelector('textarea[enterkeyhint]') ||
      document.querySelector('textarea[placeholder]') ||
      document.querySelector('textarea'),
  },
  {
    match: 'phind.com',
    getEditor: () =>
      document.querySelector('textarea[placeholder]') ||
      document.querySelector('[contenteditable="true"]') ||
      document.querySelector('textarea'),
  },
  {
    match: 'groq.com',
    getEditor: () =>
      document.querySelector('textarea[placeholder]') ||
      document.querySelector('textarea'),
  },
  {
    match: 'pi.ai',
    getEditor: () =>
      document.querySelector('[contenteditable="true"]') ||
      document.querySelector('textarea'),
  },
  {
    match: 'kimi.ai',
    getEditor: () =>
      document.querySelector('textarea[placeholder]') ||
      document.querySelector('[contenteditable="true"]') ||
      document.querySelector('textarea'),
  },
  {
    match: 'chat.qwen.com',
    getEditor: () =>
      document.querySelector('textarea[placeholder]') ||
      document.querySelector('textarea'),
  },
  {
    match: 'coral.cohere.com',
    getEditor: () =>
      document.querySelector('textarea[placeholder]') ||
      document.querySelector('[contenteditable="true"]') ||
      document.querySelector('textarea'),
  },
  {
    match: 'openrouter.ai',
    getEditor: () =>
      document.querySelector('textarea[placeholder]') ||
      document.querySelector('[contenteditable="true"]') ||
      document.querySelector('textarea'),
  },
];

function getSiteConfig() {
  return SITES.find((s) => location.hostname.includes(s.match));
}

// ─── 9. Safe text read / write — handles both textarea and contenteditable ────

function getEditorText(editor) {
  // textarea exposes .value; contenteditable exposes .innerText
  return (editor.tagName === 'TEXTAREA' ? editor.value : editor.innerText).trim();
}

function setEditorText(editor, text) {
  if (editor.tagName === 'TEXTAREA') {
    // 1. Use the native value setter so React/Vue synthetic events fire correctly
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
    if (setter) setter.call(editor, text);
    else editor.value = text;
    // 2. Dispatch input + change so the framework picks up the new value
    editor.dispatchEvent(new Event('input',  { bubbles: true }));
    editor.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    // 1. Focus then select-all so execCommand replaces the full content atomically
    editor.focus();
    document.execCommand('selectAll', false);
    document.execCommand('insertText', false, text);
  }
}

// ─── 10. Shadow DOM diff UI ───────────────────────────────────────────────────

function showDiffUI({ original, improved, intent, onApply, onDismiss }) {
  document.getElementById('promptlift-overlay')?.remove();

  const host = document.createElement('div');
  host.id = 'promptlift-overlay';
  host.style.cssText =
    'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.55)';

  const shadow = host.attachShadow({ mode: 'closed' });

  shadow.innerHTML = `
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      .card {
        background: #fff; border-radius: 14px;
        width: min(700px, 92vw); max-height: 82vh;
        display: flex; flex-direction: column; overflow: hidden;
        box-shadow: 0 32px 80px rgba(0,0,0,0.25);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 14px 20px; border-bottom: 1px solid #f0f0f0; flex-shrink: 0;
      }
      .logo { font-weight: 800; font-size: 15px; color: #111; letter-spacing: -0.4px; }
      .logo span { color: #7c3aed; }
      .close {
        background: none; border: none; cursor: pointer;
        font-size: 22px; color: #9ca3af; line-height: 1; padding: 2px 6px; border-radius: 6px;
      }
      .close:hover { background: #f3f4f6; color: #111; }
      .tabs { display: flex; border-bottom: 1px solid #f0f0f0; flex-shrink: 0; }
      .tab {
        flex: 1; padding: 10px 16px; background: none; border: none;
        cursor: pointer; font-size: 13px; color: #6b7280; font-weight: 600;
        border-bottom: 2px solid transparent; transition: all .15s;
      }
      .tab.active { color: #7c3aed; border-bottom-color: #7c3aed; }
      .body { flex: 1; overflow-y: auto; padding: 16px 20px; }
      .badge {
        display: inline-block; font-size: 11px; font-weight: 700;
        padding: 2px 10px; border-radius: 999px; background: #ede9fe;
        color: #7c3aed; margin-bottom: 10px; text-transform: capitalize; letter-spacing: 0.3px;
      }
      .text {
        font-size: 13px; line-height: 1.65; color: #374151; white-space: pre-wrap;
        background: #fafafa; border-radius: 8px; padding: 14px;
        max-height: 340px; overflow-y: auto; border: 1px solid #ebebeb;
      }
      .footer {
        display: flex; gap: 8px; padding: 14px 20px;
        border-top: 1px solid #f0f0f0; justify-content: flex-end; flex-shrink: 0;
      }
      .btn {
        padding: 8px 20px; border-radius: 8px; font-size: 14px;
        font-weight: 600; cursor: pointer; border: none; transition: all .15s;
      }
      .btn-ghost { background: none; color: #6b7280; border: 1px solid #e5e7eb; }
      .btn-ghost:hover { background: #f3f4f6; }
      .btn-primary { background: #7c3aed; color: #fff; }
      .btn-primary:hover { background: #6d28d9; }
    </style>
    <div class="card">
      <div class="header">
        <span class="logo">Prompt<span>Lift</span></span>
        <button class="close" id="closeBtn" title="Dismiss">×</button>
      </div>
      <div class="tabs">
        <button class="tab active" id="tabImproved">✦ Improved</button>
        <button class="tab" id="tabOriginal">Original</button>
      </div>
      <div class="body">
        <div id="improvedView">
          <div class="badge" id="intentBadge"></div>
          <div class="text" id="improvedText"></div>
        </div>
        <div id="originalView" style="display:none">
          <div class="text" id="originalText"></div>
        </div>
      </div>
      <div class="footer">
        <button class="btn btn-ghost" id="dismissBtn">Dismiss</button>
        <button class="btn btn-primary" id="applyBtn">Apply Prompt ↵</button>
      </div>
    </div>
  `;

  shadow.getElementById('improvedText').textContent = improved;
  shadow.getElementById('originalText').textContent = original;
  shadow.getElementById('intentBadge').textContent  = intent;

  shadow.getElementById('tabImproved').addEventListener('click', () => {
    shadow.getElementById('improvedView').style.display = '';
    shadow.getElementById('originalView').style.display = 'none';
    shadow.getElementById('tabImproved').classList.add('active');
    shadow.getElementById('tabOriginal').classList.remove('active');
  });
  shadow.getElementById('tabOriginal').addEventListener('click', () => {
    shadow.getElementById('improvedView').style.display = 'none';
    shadow.getElementById('originalView').style.display = '';
    shadow.getElementById('tabImproved').classList.remove('active');
    shadow.getElementById('tabOriginal').classList.add('active');
  });

  shadow.getElementById('applyBtn').addEventListener('click',  () => { host.remove(); onApply(); });
  shadow.getElementById('dismissBtn').addEventListener('click', () => { host.remove(); onDismiss(); });
  shadow.getElementById('closeBtn').addEventListener('click',   () => { host.remove(); onDismiss(); });
  host.addEventListener('click', (e) => { if (e.target === host) { host.remove(); onDismiss(); } });

  document.body.appendChild(host);
}

// ─── 11. Floating "Improve" button ───────────────────────────────────────────

const BUTTON_ID = 'promptlift-btn';

function injectButton() {
  if (document.getElementById(BUTTON_ID)) return;

  const btn = document.createElement('button');
  btn.id = BUTTON_ID;
  btn.textContent = '✦ PromptLift';
  btn.title = 'Improve this prompt';
  btn.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 2147483646;
    background: #7c3aed; color: #fff; border: none; border-radius: 10px;
    padding: 9px 16px; font-size: 13px; font-weight: 700; cursor: pointer;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    letter-spacing: 0.2px; box-shadow: 0 4px 16px rgba(124,58,237,0.4);
    transition: background .15s, transform .1s, box-shadow .15s; white-space: nowrap;
  `;
  btn.addEventListener('mouseover', () => {
    btn.style.background = '#6d28d9';
    btn.style.boxShadow  = '0 6px 20px rgba(124,58,237,0.5)';
    btn.style.transform  = 'translateY(-1px)';
  });
  btn.addEventListener('mouseout', () => {
    btn.style.background = '#7c3aed';
    btn.style.boxShadow  = '0 4px 16px rgba(124,58,237,0.4)';
    btn.style.transform  = '';
  });
  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await handleImprove();
  });

  document.body.appendChild(btn);
}

// ─── 12. Core improve handler ─────────────────────────────────────────────────

async function handleImprove() {
  const site = getSiteConfig();
  if (!site) return;

  const editor = site.getEditor();
  if (!editor) return;

  const original = getEditorText(editor);
  if (!original) return;

  const btn = document.getElementById(BUTTON_ID);

  // 1. Lock the button while processing
  if (btn) { btn.textContent = '⏳ Improving…'; btn.disabled = true; }

  try {
    // 2. Rule-based scaffolding — always runs, zero cost, instant
    const { improved: scaffolded, intent } = scaffoldPrompt(original);

    // 3. Optionally polish with Chrome's built-in AI
    const aiResult  = await tryBuiltinAI(scaffolded);
    const finalText = aiResult ?? scaffolded;

    // 4. Diff UI — user must explicitly apply; never auto-submit
    showDiffUI({
      original,
      improved: finalText,
      intent,
      onApply:   () => setEditorText(editor, finalText),
      onDismiss: () => {},
    });
  } finally {
    // 5. Restore button regardless of success or error
    if (btn) { btn.textContent = '✦ PromptLift'; btn.disabled = false; }
  }
}

// ─── 13. MutationObserver — inject button once the page is interactive ────────

function tryInit() {
  if (!getSiteConfig()) return;
  injectButton();
}

const observer = new MutationObserver(() => tryInit());
observer.observe(document.body, { childList: true, subtree: true });
tryInit();
