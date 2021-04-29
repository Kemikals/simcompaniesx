function clear() {
    chrome.storage.sync.set({selectedResources: []});
    const checkboxes = Array.from(document.getElementsByClassName('selected'));
    console.log(checkboxes);
    checkboxes.forEach(img => img.classList.remove('selected'))
}

function loadSalesFilterPage() {
    $(() => {
        fetch("https://www.simcompanies.com/api/v3/en/encyclopedia/resources/")
            .then(response => response.json()).then(data => showOptions(data));

        let clearButton = document.getElementById('clearButton');
        clearButton.addEventListener('click', function() {
            clear();
        });
    })

}

function showOptions(data) {
    chrome.storage.sync.get({selectedResources: []}, function (result) {
        let selectedResources = result.selectedResources.filter((v, i, a) => a.indexOf(v) === i);
        data.forEach(resource => createResource(resource, selectedResources));
    });
}

function createResource(resource, selected) {

    const div = document.createElement('div');
    div.classList.add('resources')
    const selection = document.createElement('div');
    selection.classList.add('selection');
    const img = document.createElement('img');
    selection.appendChild(img);

    img.src = "https://d1fxy698ilbz6u.cloudfront.net/static/" + resource.image;
    img.addEventListener('click', () => {
        let selected = false;
        if(img.classList.contains('selected')){
            img.classList.remove('selected');
        } else {
            img.classList.add('selected');
            selected = true;
        }
        handleSelection(selected, resource);
    })
    console.log(selected)
    console.log(resource);
    if(selected.indexOf(resource.name) >= 0){
        img.classList.add('selected')
    }
    div.appendChild(selection);
    document.getElementById('salesFilterContent').appendChild(div);
}

function handleSelection(selected, resource) {
    if (selected) {
        chrome.storage.sync.get({selectedResources: []}, function (result) {
            let selectedResources = result.selectedResources.filter((v, i, a) => a.indexOf(v) === i);
            selectedResources.push(resource.name);
            chrome.storage.sync.set({selectedResources: selectedResources});
            console.log(selectedResources)
        });
    } else {
        chrome.storage.sync.get({selectedResources: []}, function (result) {
            let selectedResources = result.selectedResources.filter((v, i, a) => a.indexOf(v) === i);
            const idx = selectedResources.indexOf(resource.name);
            if(idx > -1){
                selectedResources.splice(idx, 1);
            }
            chrome.storage.sync.set({selectedResources: selectedResources});
        });
    }
}
