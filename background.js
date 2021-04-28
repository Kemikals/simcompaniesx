chrome.action.onClicked.addListener(function (tab) {
    chrome.tabs.create({url: "settings.html"});
});

function containsChatRoom(obj) {
    return obj.url && obj.url.includes('chatroom')
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading' && containsChatRoom(changeInfo)) {
        chrome.tabs.sendMessage(tabId, {});
    }
});


function checkUrl(request, sender, sendResponse) {
    if (request === 'reloaded') {
        chrome.tabs.query({active: true}, (result) => {
            if (result.filter(result => containsChatRoom(result))) {
                sendResponse('chatroomReloaded');
            }
        });
        return true;
    } else {
        sendResponse('ignore');
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => checkUrl(request, sender, sendResponse));

