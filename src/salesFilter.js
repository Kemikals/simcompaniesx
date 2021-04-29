document.addEventListener('DOMContentLoaded', function() {
    let clearButton = document.getElementById('clearButton');
    // onClick's logic below:
    clearButton.addEventListener('click', function() {
        clear();
    });
});

function loadSalesFilterPage() {
    fetch("https://www.simcompanies.com/api/v3/en/encyclopedia/resources/")
        .then(response => response.json()).then(data => showOptions(data));
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
    const checkbox = document.createElement('input');
    if(selected.indexOf(resource.name) > -1){
        checkbox.checked = true;
    }
    checkbox.classList.add('checkbox')
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', function () {
        handleSelection(checkbox, resource)
    });
    selection.appendChild(checkbox);
    img.src = "https://d1fxy698ilbz6u.cloudfront.net/static/" + resource.image;
    div.appendChild(selection);
    document.getElementById('salesFilterContent').appendChild(div);
}

function handleSelection(cb, resource) {
    if (cb.checked) {
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

function clear() {
    chrome.storage.sync.set({selectedResources: []});
    const checkboxes = Array.from(document.getElementsByClassName('checkbox'));
    checkboxes.forEach(checkbox => checkbox.checked = false);
}