chrome.action.onClicked.addListener(function (tab) {
    chrome.tabs.create({url: "settings.html"});
});

function containsChatRoom(obj) {
    return obj.url && obj.url.includes('chatroom')
}

function isSimCompaniesMap(obj) {
    return obj.url && obj.url.includes('landscape')
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading' && containsChatRoom(changeInfo)) {
        chrome.tabs.sendMessage(tabId, 'onChat');
    } else if(changeInfo.status === 'loading' && isSimCompaniesMap(changeInfo)){
        chrome.tabs.sendMessage(tabId, 'onMap');
    }
    return false;
});


function checkUrl(request, sender, sendResponse) {
    if (request === 'reloaded') {
        chrome.tabs.query({active: true}, (result) => {
            if (result.find(result => containsChatRoom(result))) {
                console.log(result);
                console.log('how is this true');
                sendResponse('chatroomReloaded');
            } else if(result.find(result => isSimCompaniesMap(result))){
                console.log('bs sending mapReloaded');
                sendResponse('mapReloaded');
            }
        });
        return true;
    } else {
        sendResponse('ignore');
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => checkUrl(request, sender, sendResponse));

