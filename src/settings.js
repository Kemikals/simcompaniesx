fetch(chrome.runtime.getURL('content/general-options.html'))
    .then(response => response.text())
    .then(content => {
        document.querySelector('#pageContent').innerHTML = content;
        loadGeneralOptionsPage()
});

