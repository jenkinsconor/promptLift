// Minimal MV3 service worker.
// Storage and future extension points live here (e.g. BYOK cloud-model calls).

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    console.log('PromptLift installed. Open any ChatGPT, Claude, or Gemini tab to start.');
  }
});
