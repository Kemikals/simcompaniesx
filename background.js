chrome.action.onClicked.addListener(function (tab) {
    chrome.tabs.create({url: "/content/settings.html"});
});

function containsChatRoom(obj) {
    return obj.url && obj.url.includes('chatroom')
}

function isSimCompaniesMap(obj) {
    return obj.url && obj.url.includes('landscape')
}

function isEncyclopediaResource(obj) {
    return obj.url && obj.url.includes('encyclopedia/resource');
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading' && containsChatRoom(changeInfo)) {
        chrome.tabs.sendMessage(tabId, 'onChat');
    } else if(changeInfo.status === 'loading' && isSimCompaniesMap(changeInfo)){
        chrome.tabs.sendMessage(tabId, 'onMap');
    } else if(changeInfo.status === 'loading' && isEncyclopediaResource(changeInfo)){
        chrome.tabs.sendMessage(tabId, {resource: changeInfo.url.match(/\d+/)[0]})
    }
});


function checkUrl(request, sender, sendResponse) {
    if (request === 'reloaded') {
        chrome.tabs.query({active: true}, (result) => {
            if (result.find(result => containsChatRoom(result))) {
                sendResponse('chatroomReloaded');
            } else if(result.find(result => isSimCompaniesMap(result))){
                sendResponse('mapReloaded');
            }
        });
        return true;
    } else {
        sendResponse('ignore');
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => checkUrl(request, sender, sendResponse));

