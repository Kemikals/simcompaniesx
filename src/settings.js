fetch(chrome.runtime.getURL('content/generalOptions.html'))
    .then(response => response.text())
    .then(content => {
        document.querySelector('#pageContent').innerHTML = content;
        loadGeneralOptionsPage()
});

