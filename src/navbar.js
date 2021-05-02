function setLinkAction(button, page, callback) {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        fetch(chrome.runtime.getURL("content/" + page)).then(response => response.text()).then(content => {
            document.querySelector('#pageContent').innerHTML = content;
            if (callback) {
                callback();
            }
        });
    });
}

setTimeout(() => {
    setLinkAction(document.querySelector('#generalOptions'), 'general-options.html', loadGeneralOptionsPage);
    setLinkAction(document.querySelector('#salesFilter'), 'sales-filter.html', loadSalesFilterPage);
    setLinkAction(document.querySelector('#documentation'), 'documentation.html');
}, 400)



