function findSalesChatWindow(possibleMatches) {
    return Array.from(possibleMatches).find(possible => possible.innerText === 'SALE');
}

let button;
let button2;

function filterSalesChat(chatWindow) {
    let chatText = Array.from(chatWindow.childNodes[1].children[0].children);
    chatText.forEach(chat => {
        let resources = Array.from(chat.getElementsByClassName('chat-resource')).map(chat => chat.childNodes[0].alt);
        chrome.storage.sync.get('selectedResources', function (result) {
            const chosen = result.selectedResources;
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

function createButtonsOnWindow(salesChat) {
    if(!salesChat) return;
    button = document.createElement('button');
    button.innerText = 'Filter';
    button.id = 'salesFilter';
    button.addEventListener('click', function () {
        filterSalesChat(salesChat.parentNode)
    });

    button2 = document.createElement('button');
    button2.innerText = 'Clear Filter';
    button2.id = 'clear';
    button2.addEventListener('click', function () {
        clearFilter();
    });

    button.style.marginLeft = '10px';
    button2.style.marginLeft = '10px';

    salesChat.appendChild(button)
    salesChat.appendChild(button2)

    salesChat.style.padding = '0px';
}

function changeHq() {
    setTimeout(() => {
        if(document.querySelector('.test-headquarters img:nth-child(2)').src !== 'https://d1fxy698ilbz6u.cloudfront.net/static/images/landscape/hq-lvl10.png') {

            // change hq image
            document.querySelector('.test-headquarters img:nth-child(2)').src = 'https://d1fxy698ilbz6u.cloudfront.net/static/images/landscape/hq-lvl10.png';

            // move company logo to correct place
            document.querySelector('.test-headquarters img:nth-child(3)').style.top = '-21px';
            document.querySelector('.test-headquarters img:nth-child(3)').style.left = '60px';
        }
    }, 2000);
}

function addLinkToExchange(resourceNumber){
    setTimeout(() => {
        const resourceWindow =  document.querySelector('.test-resource-detail').children[1].children[1];
        const marketLink = 'https://www.simcompanies.com/market/resource/' + resourceNumber;
        resourceWindow.innerHTML = resourceWindow.innerHTML.replace('(Exchange)', '<a href='+marketLink+'>(Exchange)</a>');
    }, 2000)
}

function addButtons(message) {
    if(message === 'onChat' || message === 'chatroomReloaded') {
        setTimeout(() => {
            if (button && button2) {
                button.remove()
                button2.remove();
                button = null;
                button2 = null;
            }
            setTimeout(() => {
                const possible = document.querySelectorAll('.well-header');
                createButtonsOnWindow(findSalesChatWindow(possible));
            }, 200)
        });
    } else if(message === 'onMap' || message === 'mapReloaded'){
        changeHq();
    } else if(message && message.resource){
        addLinkToExchange(message.resource);
    }
}

function handleChatroomReloaded(response) {
    if(response === 'chatroomReloaded'){
        setTimeout(() => {
            addButtons(response);
        }, 2000)
    } else if(response === 'mapReloaded'){
        setTimeout(() => {
            changeHq();
        }, 2000)
    }
}

chrome.runtime.sendMessage('reloaded', (response) => handleChatroomReloaded(response));

chrome.runtime.onMessage.addListener((message) => addButtons(message));