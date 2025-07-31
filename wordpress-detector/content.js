(async () => {
  let isWordPress = false;
  let version = null;
  let theme = null;
  let usesElementor = false;

  // Check meta generator tag
  const generator = document.querySelector('meta[name="generator"]');
  if (generator && generator.content.toLowerCase().includes("wordpress")) {
    isWordPress = true;
    version = generator.content.match(/WordPress\s([\d.]+)/)?.[1];
  }

  // Check /wp-json if not detected yet
  if (!isWordPress) {
    try {
      const res = await fetch("/wp-json", { mode: "cors" });
      if (res.ok) {
        const json = await res.json();
        if (json && typeof json === "object") {
          isWordPress = true;
        }
      }
    } catch {}
  }

  // Detect theme if WordPress detected
  if (isWordPress) {
    const html = document.documentElement.innerHTML;
    const themeMatch = html.match(/\/wp-content\/themes\/([a-zA-Z0-9-_]+)/);
    if (themeMatch) {
      theme = themeMatch[1];
    }
  }

  // Check if elementor frontend scripts or markers exist
  if (
    document.querySelector(".elementor") || // Most pages will have this class
    document.querySelector("[data-elementor-id]") || // Elementor template marker
    document.querySelector('link[href*="elementor"]') || // CSS from Elementor
    [...document.scripts].some((script) => script.src.includes("elementor"))
  ) {
    usesElementor = true;
  }

  // Send message to background
  chrome.runtime.sendMessage({
    action: "saveSiteInfo",
    data: {
      isWordPress,
      version: version || "Unknown",
      theme: theme || "Unknown",
      title: document.title,
      url: window.location.href,
      usesElementor,
    },
  });
})();
