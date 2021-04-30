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
    if (changeInfo.status === 'complete') {
        chrome.tabs.query({active: true}, (results) => {
            let tab = results.find(result => containsChatRoom(result) || isSimCompaniesMap(result) || isEncyclopediaResource(result))
            if (settings.options.enableSalesChatFilter && tab && containsChatRoom(tab)) {
                chrome.tabs.sendMessage(tab.id, 'onChat');
            } else if (settings.options.enableOldStyleHQ && tab && isSimCompaniesMap(tab)) {
                chrome.tabs.sendMessage(tab.id, 'onMap');
            } else if (settings.options.enableEncyclopediaExchangeLink && tab && isEncyclopediaResource(tab)) {
                chrome.tabs.sendMessage(tab.id, {resource: tab.url.match(/\d+/)[0]})
            }
        })
    }
});

const settings = {};
const refreshOptions = getAllStorageSyncData().then(items => {
    Object.assign(settings, items);
});


chrome.tabs.onActivated.addListener(async () => {
    await refreshOptions;
})

function getAllStorageSyncData() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(null, (items) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(items);
        });
    });
}