document.addEventListener('DOMContentLoaded', function () {
    var printButton = document.getElementById('printButton');
    var testButton = document.getElementById('testButton');

    printButton.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var currentTab = tabs[0];
            chrome.tabs.sendMessage(currentTab.id, { action: 'printHTML' });
        });
    });
});
