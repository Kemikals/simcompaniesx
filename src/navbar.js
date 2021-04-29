$(() => {
    function setLinkAction(button, page, callback) {
        button.on('click', (e) => {
            e.preventDefault();
            $('#pageContent').load(chrome.runtime.getURL("content/" + page));
            if(callback){
                callback();
            }
        });
    }
    setTimeout(() => {
        const salesFilter = loadSalesFilterPage;
        setLinkAction($('#generalOptions'), 'generalOptions.html');
        setLinkAction($('#salesFilter'), 'salesFilter.html', salesFilter);
        setLinkAction($('#documentation'), 'documentation.html');

    }, 400)
});


