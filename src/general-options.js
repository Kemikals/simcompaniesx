const options = {}

function loadGeneralOptionsPage() {
    const enableSalesChatFilter = document.querySelector('#enableSalesFilter');
    const enableOldStyleHQ = document.querySelector('#enableOldStyleHQ');
    const enableEncyclopediaExchangeLink = document.querySelector('#enableEncyclopediaLink');
    const enableIdleBuildingHighlight = document.querySelector('#enableIdleBuildingHighlight');

    chrome.storage.local.get('options', (data) => {
        Object.assign(options, data.options)
        enableSalesChatFilter.checked = Boolean(options["enableSalesChatFilter"]);
        enableOldStyleHQ.checked = Boolean(options["enableOldStyleHQ"]);
        enableEncyclopediaExchangeLink.checked = Boolean(options["enableEncyclopediaExchangeLink"]);
        enableIdleBuildingHighlight.checked = Boolean(options["enableIdleBuildingHighlight"]);
    });

    function addButtonAction(button, key) {
        button.addEventListener('change', (event) => {
            options[key] = event.target.checked;
            chrome.storage.local.set({options});
        });
    }

    addButtonAction(enableSalesChatFilter, 'enableSalesChatFilter');
    addButtonAction(enableOldStyleHQ, 'enableOldStyleHQ');
    addButtonAction(enableEncyclopediaExchangeLink, 'enableEncyclopediaExchangeLink');
    addButtonAction(enableIdleBuildingHighlight, 'enableIdleBuildingHighlight');
}
