(function () {

    const marketResourceLink = 'https://www.simcompanies.com/market/resource/';
    const oldHQImageLink = 'https://d1fxy698ilbz6u.cloudfront.net/static/images/landscape/hq-lvl10.png';

    let filterButton;
    let clearFilterButton;
    let toExchangeButton;
    let filteredMessages = [];

    function clearFilter() {
        filteredMessages.forEach(message => message.style.display = 'block');
        filteredMessages = [];
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

    function filterSalesChat(chatWindow) {
        let chatText = Array.from(chatWindow.childNodes[1].children[0].children);
        chatText.forEach(chat => {
            let resources = Array.from(chat.getElementsByClassName('chat-resource')).map(chat => chat.childNodes[0].alt);
            chrome.storage.local.get('selectedResources', function (result) {
                const chosen = result.selectedResources;
                if (!chosen || chosen.length === 0) return;
                if (!chosen.some(r => resources.indexOf(r) >= 0)) {
                    filteredMessages.push(chat);
                    chat.style.display = 'none';
                }
            });
        });
    }

    function changeHq() {
        let hqImage = document.querySelector('.test-headquarters img:nth-child(2)');
        if (!hqImage) return false;
        hqImage.src = oldHQImageLink;
        const logo = document.querySelector('.test-headquarters img:nth-child(3)');
        logo.style.top = '-21px';
        logo.style.left = '60px';
        return document.querySelector('.test-headquarters img:nth-child(2)')?.src === oldHQImageLink;
    }


    function addLinkToExchange(resourceNumber) {
        toExchangeButton?.remove();
        const resourceElement = document.querySelector('.test-resource-detail div:nth-child(2) div:nth-child(2)');
        if (!resourceElement) return false;
        const marketLink = marketResourceLink + resourceNumber;
        toExchangeButton = document.createElement('button')
        toExchangeButton.textContent = 'To Exchange'
        resourceElement.appendChild(toExchangeButton);
        toExchangeButton.addEventListener('click', () => {
            location.href = marketLink
        })
        return true;
    }

    function removeTicker() {
        document.querySelector('.market-ticker')?.remove();
    }

    function hideContest() {
        document.querySelector('.contest')?.remove();
    }

    function handleMessageFromService(message) {
        if (message?.location === 'onChat') {
            removeAllElements(filterButton, clearFilterButton);
            tryAtInterval(() => createButtonsOnWindow(findSalesChatWindow(document.querySelectorAll('.well-header'))), 100, 20)
        } else if (message?.location === 'onMap') {
            if (message.options["enableOldStyleHQ"]) {
                tryAtInterval(changeHq, 100, 20);
            }
            if (message.options["enableIdleBuildingHighlight"]) {
                setTimeout(() => {
                    colorIdleBuildings();
                }, 200)
            }
        } else if (message && message.resource) {
            tryAtInterval(() => addLinkToExchange(message.resource), 200, 20);
        }

        if (message && message.options && message.options["removeTicker"]) {
            setTimeout(() => {
                removeTicker()
            }, 200)
        }

        if (message && message.options && message.options["hideContest"]) {
            setTimeout(() => {
                hideContest()
            }, 200)
        }

        if (message && message.message === 'resourceMenuClicked') {
            console.log('here')
            const copyFrom = document.createElement("textarea");
            copyFrom.textContent = message.data;
            document.body.appendChild(copyFrom);
            copyFrom.select();
            document.execCommand('copy');
            document.body.removeChild(copyFrom);
        }
    }

    function findSalesChatWindow(possibleMatches) {
        return Array.from(possibleMatches).find(possible => possible.innerText === 'SALE');
    }

    chrome.runtime.onMessage.addListener((message) => handleMessageFromService(message));

    function colorIdleBuildings() {
        const buildings = Array.from(document.querySelectorAll("a[href*='/b/']"));
        buildings.forEach(building => {
            console.dir(building)
            if (!building.innerText.includes('Producing') && !building.innerText.includes('New')) {
                const buildingText = building.querySelector('small');
                console.dir(buildingText)
                buildingText.style.backgroundColor = 'yellow';
                buildingText.parentNode.children[0].style.backgroundColor = 'yellow';
            }
        });
    }
})();
