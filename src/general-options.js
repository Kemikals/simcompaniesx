const options = {};

function loadGeneralOptionsPage() {
    const enableSalesChatFilter = document.querySelector('#enableSalesFilter');
    const enableOldStyleHQ = document.querySelector('#enableOldStyleHQ');
    const enableEncyclopediaExchangeLink = document.querySelector('#enableEncyclopediaLink');

    chrome.storage.local.get('options', (data) => {
        Object.assign(options, data.options)
        enableSalesChatFilter.checked = Boolean(options.enableSalesChatFilter);
        enableOldStyleHQ.checked = Boolean(options.enableOldStyleHQ);
        enableEncyclopediaExchangeLink.checked = Boolean(options.enableEncyclopediaExchangeLink);
    });

    enableSalesChatFilter.addEventListener('change', (event) => {
        options.enableSalesChatFilter = event.target.checked;
        chrome.storage.local.set({options});
    });

    enableOldStyleHQ.addEventListener('change', (event) => {
        options.enableOldStyleHQ = event.target.checked;
        chrome.storage.local.set({options});
    });

    enableEncyclopediaExchangeLink.addEventListener('change', (event) => {
        options.enableEncyclopediaExchangeLink = event.target.checked;
        chrome.storage.local.set({options});
    });
}
