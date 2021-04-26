function findSalesChatWindow(possibleMatches) {
    return Array.from(possibleMatches).find(possible => possible.parentNode.innerText === 'SALE').parentNode;
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


function registerListenerOnWindow() {
    const dom = document.getElementById('reactjs-router');
    const config = {
        subtree: true, characterData: true, characterDataOldValue: true
    };

    const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'characterData' && mutation.target.data === 'Sale') {
                console.log(mutation)
                if (button && button2) {
                    button.remove();
                    button2.remove();
                }
                createButtonsOnWindow(mutation.target.parentNode);
            } else if (mutation.type === 'characterData' && mutation.oldValue === 'Sale') {
                if (button && button2) {
                    button.remove();
                    button2.remove();
                }
            }
        }
    };

    const observer = new MutationObserver(callback);

    observer.observe(dom, config);
}

registerListenerOnWindow();

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



