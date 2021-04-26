function register() {
    const targetNode = document.getElementsByClassName('sc-kIPQKe')[0];
    const chatHeaders = targetNode.getElementsByClassName('well-header');
    const chatWindow1 = chatHeaders[0];
    const chatWindow2 = chatHeaders[1];

    const chatWindows = document.getElementsByClassName('sc-bwCtUz');
    chatWindows[0].id = 'chatWindow1';
    chatWindows[1].id = 'chatWindow2';

    const config = {attributes: true, childList: true, subtree: true, characterData: true};

    const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'characterData') {
                handleChatChange(mutation.target, observer.chatWindow);
            }
        }
    };

    let button;
    let chatWindow1Header;
    let chatWindow2Header;

    function filterSalesChat(chatWindow) {
        let chatText = Array.from(chatWindow.getElementsByClassName('sc-kgAjT'));
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

    function handleChatChange(node, chatWindow) {
        if (chatWindow === 1) {
            chatWindow1Header = node.data;
        }

        if (chatWindow === 2) {
            chatWindow2Header = node.data;
        }
        if (node.data === 'Sale') {
            button = document.createElement('button');
            button.innerText = 'Filter';
            button.id = 'salesFilter';
            button.addEventListener('click', function () {
                filterSalesChat(node.parentNode.parentNode.parentNode)
            });
            node.parentNode.appendChild(button)
        } else {
            if (button && chatWindow1Header !== 'Sale' && chatWindow2Header !== 'Sale') {
                button.remove();
            }
        }

    }

    const observer = new MutationObserver(callback);
    const observer2 = new MutationObserver(callback);

    observer.observe(chatWindow1, config);
    observer.chatWindow = 1;
    if (!!chatWindow2) {
        observer2.observe(chatWindow2, config);
        observer2.chatWindow = 2;
    }
}

setTimeout(() => {
    register();
}, 10000)



