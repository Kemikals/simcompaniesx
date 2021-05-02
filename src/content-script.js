function findSalesChatWindow(possibleMatches) {
    return Array.from(possibleMatches).find(possible => possible.innerText === 'SALE');
}

let filterButton;
let clearFilterButton;

function filterSalesChat(chatWindow) {
    let chatText = Array.from(chatWindow.childNodes[1].children[0].children);
    chatText.forEach(chat => {
        let resources = Array.from(chat.getElementsByClassName('chat-resource')).map(chat => chat.childNodes[0].alt);
        chrome.storage.local.get('selectedResources', function (result) {
            const chosen = result.selectedResources;
            if (!chosen || chosen.length === 0) return;
            if (!chosen.some(r => resources.indexOf(r) >= 0)) {
                hiddenMessage.push(chat);
                chat.style.display = 'none';
            }
        });
    });
}

let hiddenMessage = [];

function clearFilter() {
    hiddenMessage.forEach(message => message.style.display = 'block');
    hiddenMessage = [];
}

function createButton(id, text, clickHandler) {
    const button = document.createElement('button');
    button.innerText = text;
    button.addEventListener('click', clickHandler);
    button.style.marginLeft = '10px';
    return button;
}

function createButtonsOnWindow(salesChat) {
    if (!salesChat) return false;
    filterButton = createButton('salesFilter', 'Filter', () => filterSalesChat(salesChat.parentNode));
    clearFilterButton = createButton('clear', 'Clear Filter', clearFilter)

    salesChat.appendChild(filterButton)
    salesChat.appendChild(clearFilterButton)
    salesChat.style.padding = '0px';
    return true;
}

function changeHq() {
    let hqImage = document.querySelector('.test-headquarters img:nth-child(2)');
    if (hqImage) {
        // change hq image
        hqImage.src = 'https://d1fxy698ilbz6u.cloudfront.net/static/images/landscape/hq-lvl10.png';
        // move company logo to correct place
        document.querySelector('.test-headquarters img:nth-child(3)').style.top = '-21px';
        document.querySelector('.test-headquarters img:nth-child(3)').style.left = '60px';
        return document.querySelector('.test-headquarters img:nth-child(2)').src === 'https://d1fxy698ilbz6u.cloudfront.net/static/images/landscape/hq-lvl10.png';
    }
    return false;
}

let toExchangeButton;

function addLinkToExchange(resourceNumber) {
    if(toExchangeButton){
        toExchangeButton.remove()
    }
    const detail = document.querySelector('.test-resource-detail');
    if (!(detail && detail.children[1] && detail.children[1])) return false;
    const resourceWindow = detail.children[1].children[1];
    const marketLink = 'https://www.simcompanies.com/market/resource/' + resourceNumber;
    toExchangeButton = document.createElement('button')
    toExchangeButton.textContent = 'To Exchange'
    resourceWindow.appendChild(toExchangeButton);
    toExchangeButton.addEventListener('click', () => {
        location.href = marketLink
    })
    return true;
}

function removeAllElements(...buttons){
    buttons.forEach((button) => {
        if(button){
            button.remove()
        }
    })
}

function handleMessageFromService(message) {
    if (message === 'onChat') {
        removeAllElements(filterButton, clearFilterButton);
        tryAtInterval(() => createButtonsOnWindow(findSalesChatWindow(document.querySelectorAll('.well-header'))), 100, 20)
    } else if (message === 'onMap') {
        tryAtInterval(changeHq, 100, 20);
    } else if (message && message.resource) {
        tryAtInterval(() => addLinkToExchange(message.resource), 100, 20);
    }
}

function tryAtInterval(callback, interval, limit) {
    let timesRun = 0;
    const repeater = setInterval(() => {
        if (callback() || (limit && ++timesRun > limit)) {
            clearInterval(repeater)
        }
    }, interval)
}

chrome.runtime.onMessage.addListener((message) => handleMessageFromService(message));