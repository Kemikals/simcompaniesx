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

function register() {
    const possibleMatches = document.querySelectorAll("a[href*='chatroom_Sale~']");
    const salesChat = findSalesChatWindow(possibleMatches);
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
}

function addButtons() {
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
}

function handleChatroomReloaded(response) {
    if(response === 'chatroomReloaded'){
        setTimeout(() => {
            addButtons();
        }, 2000)
    }
}

chrome.runtime.sendMessage('reloaded', (response) => handleChatroomReloaded(response));

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => addButtons());