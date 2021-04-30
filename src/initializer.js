function loadNavBar() {
    //document.querySelector("body").style.cssText("display", "none").fadeIn(1500);
    fetch(chrome.runtime.getURL('content/navbar.html')).then(response => response.text()).then((content) => {
        document.querySelector('#navbar').innerHTML = content;
    })
}

loadNavBar();

