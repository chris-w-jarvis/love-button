// listener for the extension being installed to browser, store a persistant value that other extension components can change
chrome.runtime.onInstalled.addListener(function() {

    // clear storage on install while testing (and maybe forever?)
    chrome.storage.sync.clear()

    // on every page change, remove all?? rules then set a rule that only allows the extension to be turned on (showPageAction) on specified urls
    // it appears an action is composed of arrays of conditions and actions
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [
            new chrome.declarativeContent.PageStateMatcher({
              pageUrl: { hostEquals: 'www.youtube.com', schemes: ['https'] },
        // conditions: [new chrome.declarativeContent.PageStateMatcher({
        //   pageUrl: {hostEquals: 'https://www.youtube.com/*'},
        })
        ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });

    // listen for public key message from content script
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (request.type == 'setDestKey') {
          // store destination key
          // POSSIBLE ERROR: this will be reset if you have multiple videos open
          // FIX: put part of url (video id?) into key
          chrome.storage.sync.set({destKey: request.publicKey})
        }
    });
});