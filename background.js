// background.js
chrome.commands.onCommand.addListener((command) => {
  if (command === "approve_pr") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, "approve_pr");
    });
  }
});
