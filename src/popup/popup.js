async function checkAiAvailability() {
  const dot = document.getElementById('aiDot');
  const statusEl = document.getElementById('aiStatus');

  // 1. Try the Rewriter API (Chrome 137+ for extensions)
  try {
    const rewriterObj = globalThis.Rewriter ?? globalThis.ai?.rewriter;
    if (rewriterObj) {
      const avail = await rewriterObj.availability?.();
      if (avail === 'available') {
        dot.className = 'dot green';
        statusEl.textContent = 'Chrome AI ready — enhanced mode active';
        return;
      }
      if (avail === 'downloadable') {
        dot.className = 'dot amber';
        statusEl.textContent = 'Chrome AI available — model downloads on first use (~4 GB, one-time)';
        return;
      }
    }
  } catch { /* fall through */ }

  // 2. Try the LanguageModel / Prompt API (Chrome 138+ for extensions)
  try {
    if ('LanguageModel' in globalThis) {
      const avail = await LanguageModel.availability();
      if (avail === 'available') {
        dot.className = 'dot green';
        statusEl.textContent = 'Chrome AI ready — enhanced mode active';
        return;
      }
      if (avail === 'downloadable' || avail === 'downloading') {
        dot.className = 'dot amber';
        statusEl.textContent = 'Chrome AI available — model downloads on first use';
        return;
      }
    }
  } catch { /* fall through */ }

  // 3. Fallback: rule-based mode (works everywhere)
  dot.className = 'dot gray';
  statusEl.textContent = 'Rule-based mode — smart templates, works on every device';
}

async function loadSavedKey() {
  // 1. Retrieve key from local storage (never synced to the cloud)
  const result = await chrome.storage.local.get('openaiKey');
  if (result.openaiKey) {
    document.getElementById('apiKey').value = result.openaiKey;
  }
}

document.getElementById('saveBtn').addEventListener('click', async () => {
  const key = document.getElementById('apiKey').value.trim();

  // 1. Persist (or clear) the key — chrome.storage.local stays on this device only
  await chrome.storage.local.set({ openaiKey: key || null });

  // 2. Briefly show confirmation
  const msg = document.getElementById('savedMsg');
  msg.textContent = key ? '✓ Key saved.' : '✓ Key cleared.';
  setTimeout(() => { msg.textContent = ''; }, 2200);
});

// Init on open
checkAiAvailability();
loadSavedKey();
