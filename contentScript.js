function findSalesChatWindow(possibleMatches) {
    return Array.from(possibleMatches).find(possible => possible.parentNode.innerText === 'SALE').parentNode;
}

function filterSalesChat(chatWindow) {
    let chatText = Array.from(chatWindow.childNodes[1].children[0].children);
    console.log(chatText);
    chatText.forEach(chat => {
        let resources = Array.from(chat.getElementsByClassName('chat-resource')).map(chat => chat.childNodes[0].alt);
        chrome.storage.sync.get('selectedResources', function (result) {
            const chosen = result.selectedResources;
            if (!chosen.some(r => resources.indexOf(r) >= 0)) {
                chat.style.display = 'none';
            }
        });
    });
}

function register() {
    const possibleMatches = document.querySelectorAll("a[href*='chatroom_Sale~']");
    const salesChat = findSalesChatWindow(possibleMatches);
    const button = document.createElement('button');
    button.innerText = 'Filter';
    button.id = 'salesFilter';
    button.addEventListener('click', function () {
        filterSalesChat(salesChat.parentNode)
    });
    salesChat.appendChild(button)
}

setTimeout(() => {
    register();
}, 5000)



