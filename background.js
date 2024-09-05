chrome.runtime.onInstalled.addListener(() => {
  console.log('QR Code Generator extension installed');
});

// 添加消息监听器以处理来自内容脚本的请求
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getIconUrl") {
    sendResponse({ iconUrl: chrome.runtime.getURL('icon.png') });
  }
});