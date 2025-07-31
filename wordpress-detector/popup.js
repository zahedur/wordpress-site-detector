function getActiveTab(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    callback(tabs[0]);
  });
}

getActiveTab((tab) => {
  chrome.runtime.sendMessage(
    { action: "getTabInfo", tabId: tab.id },
    (data) => {
      console.log("Received data:", data);
      if (!data) {
        document.getElementById("isWP").textContent = "No data available";
        return;
      }

      document.getElementById("title").textContent = data.title || "-";
      document.getElementById("url").textContent = data.url || "-";
      document.getElementById("isWP").textContent = data.isWordPress
        ? "Yes"
        : "No";
      document.getElementById("theme").textContent =
        data.theme || "Not detected";
      document.getElementById("elementor").textContent = data.usesElementor
        ? "Yes"
        : "No";
    }
  );
});
