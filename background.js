chrome.action.onClicked.addListener(function () {
    chrome.tabs.create({url: "/content/settings.html"});
});

function containsChatRoom(obj) {
    return obj.url && obj.url.includes('chatroom_Sale')
}

function isSimCompaniesMap(obj) {
    return obj.url && obj.url.includes('landscape')
}

function isEncyclopediaResource(obj) {
    return obj.url && obj.url.includes('encyclopedia/resource');
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.status === 'complete') {
        chrome.tabs.query({active: true}, (results) => {
            chrome.storage.local.get(null, (settings) => {
                let tab = results.find(result => containsChatRoom(result) || isSimCompaniesMap(result) || isEncyclopediaResource(result))
                chrome.tabs.sendMessage(tab.id, {options: settings.options});
                if (settings.options["enableSalesChatFilter"] && tab && containsChatRoom(tab)) {
                    chrome.tabs.sendMessage(tab.id, {location: 'onChat', options: settings.options});
                } else if (settings.options["enableOldStyleHQ"] && tab && isSimCompaniesMap(tab)) {
                    chrome.tabs.sendMessage(tab.id, {location: 'onMap', options: settings.options});
                } else if (settings.options["enableEncyclopediaExchangeLink"] && tab && isEncyclopediaResource(tab)) {
                    chrome.tabs.sendMessage(tab.id, {resource: tab.url.match(/\d+/)[0]})
                }
            });
        })
    }
});

const resourceHotKeyMap = [];

chrome.contextMenus.create({title: "Resource Emotes", visible: true, enabled: true, id: "resources", documentUrlPatterns: ['https://www.simcompanies.com/*'] })

fetch("https://www.simcompanies.com/api/v4/en/0/encyclopedia/resources/").then(response => response.json()).then(result => {
    Array.from(result).forEach(resource => {
        chrome.contextMenus.create(
            {title: resource.name, visible: true, enabled: true, parentId: "resources", id: resource.name});
        resourceHotKeyMap[resource.name] = `:re-${resource['db_letter']}:`;
    });

    chrome.contextMenus.onClicked.addListener((onClickData, tab) => {
        chrome.tabs.sendMessage(tab.id, {message: 'resourceMenuClicked', data: resourceHotKeyMap[onClickData.menuItemId]})
    });
});

