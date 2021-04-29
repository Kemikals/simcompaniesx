function loadNavBar() {
    $("body").css("display", "none").fadeIn(1500);
    $('#navbar').load(chrome.runtime.getURL('content/navbar.html'));
}

$(() => loadNavBar())

