function getThumbnailUrl(videoId) {
    return [
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/default.jpg`
    ];
}

function insertThumbnail() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('v');

    if (videoId) {
        const thumbnailUrls = getThumbnailUrl(videoId);
        const secondarySection = document.querySelector('#secondary');

        if (secondarySection) {
            const existingThumbnail = document.querySelector('.custom-thumbnail-container');
            if (existingThumbnail) {
                existingThumbnail.remove();
            }

            const thumbnailContainer = document.createElement('div');
            thumbnailContainer.className = 'custom-thumbnail-container';
            thumbnailContainer.style.position = 'relative';
            thumbnailContainer.style.display = 'flex';
            thumbnailContainer.style.cursor = 'pointer';
            thumbnailContainer.style.borderRadius = '16px';
            thumbnailContainer.style.overflow = 'hidden';
            thumbnailContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            thumbnailContainer.style.width = '100%';
            thumbnailContainer.style.height = 'auto';
            thumbnailContainer.style.maxWidth = '480px';
            thumbnailContainer.style.marginBottom = '16px';
            thumbnailContainer.style.backgroundColor = '#444';
            thumbnailContainer.style.justifyContent = 'center';
            thumbnailContainer.style.alignItems = 'center';

            const overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.background = 'rgba(0, 0, 0, 0)';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.pointerEvents = 'none';
            overlay.style.backdropFilter = 'blur(0)';
            overlay.style.transition = 'backdrop-filter 0.15s ease, background 0.15s ease';
            overlay.style.borderRadius = 'inherit';

            const icon = document.createElement('div');
            icon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-window-maximize" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M3 16m0 1a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1z" />
                    <path d="M4 12v-6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-6" />
                    <path d="M12 8h4v4" />
                    <path d="M16 8l-5 5" />
                </svg>
            `;
            icon.querySelector('svg').style.width = '55px';
            icon.querySelector('svg').style.height = '55px';
            icon.style.opacity = '0';
            icon.style.transition = 'opacity 0.15s ease';

            overlay.appendChild(icon);
            thumbnailContainer.appendChild(overlay);

            let hoverTimeout;

            thumbnailContainer.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                overlay.style.background = 'rgba(0, 0, 0, 0.5)';
                overlay.style.backdropFilter = 'blur(10px)';
                hoverTimeout = setTimeout(() => {
                    icon.style.opacity = '1';
                }, 150);
            });

            thumbnailContainer.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
                icon.style.opacity = '0';
                overlay.style.background = 'rgba(0, 0, 0, 0)';
                overlay.style.backdropFilter = 'blur(0)';
            });

            function loadThumbnail(urls) {
                if (urls.length === 0) {
                    thumbnailContainer.innerHTML = `
                        <div class="no-video-id">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-exclamation-circle" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ff4c4c" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                <path d="M12 9v4" />
                                <path d="M12 16v.01" />
                            </svg>
                            No video ID found
                        </div>
                    `;
                    return;
                }

                const img = new Image();
                img.src = urls[0];
                img.onload = () => {
                    if (img.width <= 120 && img.height <= 90) {
                        loadThumbnail(urls.slice(1));
                    } else {
                        img.style.width = '100%';
                        img.style.height = 'auto';
                        img.style.borderRadius = '16px';
                        img.style.pointerEvents = 'none';
                        img.style.display = 'block';
                        thumbnailContainer.appendChild(img);
                        thumbnailContainer.addEventListener('click', () => {
                            window.open(img.src, '_blank');
                        });
                    }
                };
                img.onerror = () => {
                    loadThumbnail(urls.slice(1));
                };
            }

            loadThumbnail(thumbnailUrls);
            secondarySection.prepend(thumbnailContainer);
        }
    }
}

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'showThumbnail') {
        insertThumbnail();
    } else if (request.action === 'hideThumbnail') {
        const existingThumbnail = document.querySelector('.custom-thumbnail-container');
        if (existingThumbnail) {
            existingThumbnail.remove();
        }
    }
});

document.addEventListener('yt-navigate-finish', () => {
    chrome.storage.local.get(['thumbnailVisible'], (result) => {
        if (result.thumbnailVisible) {
            insertThumbnail();
        }
    });
});
chrome.storage.local.get(['thumbnailVisible'], (result) => {
    if (result.thumbnailVisible) {
        insertThumbnail();
    }
});
