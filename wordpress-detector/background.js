// const siteInfo = {}; // Store info per tab

// chrome.runtime.onMessage.addListener((message, sender) => {
//   if (typeof message.wordpress !== "undefined" && sender.tab) {
//     const tabId = sender.tab.id;
//     const iconPath = message.wordpress
//       ? "icons/wp-green-16.png"
//       : "icons/wp-gray-16.png";
//     const title = message.wordpress
//       ? "This is a WordPress site"
//       : "This is NOT a WordPress site";

//     // Save the tab info for popup use
//     siteInfo[tabId] = message.tabInfo;

//     chrome.action.setIcon({
//       tabId,
//       path: {
//         16: iconPath,
//         32: iconPath,
//         48: iconPath,
//       },
//     });

//     chrome.action.setTitle({
//       tabId,
//       title,
//     });
//   }
// });

// // Allow popup to request the saved info
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "getTabInfo" && message.tabId) {
//     sendResponse(siteInfo[message.tabId] || null);
//   }
// });

const siteInfo = {};

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "saveSiteInfo" && sender.tab) {
    siteInfo[sender.tab.id] = message.data;

    const iconPath = message.data.isWordPress
      ? "icons/wp-green-16.png"
      : "icons/wp-gray-16.png";

    chrome.action.setIcon({
      tabId: sender.tab.id,
      path: {
        16: iconPath,
        32: iconPath,
        48: iconPath,
      },
    });

    chrome.action.setTitle({
      tabId: sender.tab.id,
      title: message.data.isWordPress
        ? "This is a WordPress site"
        : "This is NOT a WordPress site",
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getTabInfo" && message.tabId) {
    sendResponse(siteInfo[message.tabId] || null);
  }
});
