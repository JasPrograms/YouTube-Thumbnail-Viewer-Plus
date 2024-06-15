chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ thumbnailVisible: true });
});

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    if (request.action === 'showThumbnail' || request.action === 'hideThumbnail') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: request.action });
            sendResponse({ received: true });
        });
        return true;
    }
});
