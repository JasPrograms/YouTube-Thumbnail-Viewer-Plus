document.getElementById('toggle-thumbnail').addEventListener('click', () => {
    chrome.storage.local.get(['thumbnailVisible'], (result) => {
        const visible = !result.thumbnailVisible;
        chrome.storage.local.set({ thumbnailVisible: visible }, () => {
            updateToggleButton(visible);
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: visible ? 'showThumbnail' : 'hideThumbnail' });
            });
        });
    });
});

function updateToggleButton(visible) {
    const button = document.getElementById('toggle-thumbnail');
    if (visible) {
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
            </svg>
            Visibility
        `;
    } else {
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye-off" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" />
                <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" />
                <path d="M3 3l18 18" />
            </svg>
            Visibility
        `;
    }
}

chrome.storage.local.get(['thumbnailVisible'], (result) => {
    updateToggleButton(result.thumbnailVisible);
});
