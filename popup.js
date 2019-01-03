let destKeyElement = document.getElementById('destKey')
let sourceKeyIn = document.getElementById('sourceKeyIn')
let sendPaymentForm = document.getElementById('sendPaymentForm')
let xlmPrice = document.getElementById('xlmPrice')
let priceCheckBtn = document.getElementById('priceCheck')

// I think this works because popup.js doesn't run until you open the popup? if not set to button
chrome.storage.sync.get(['destKey'], function (res) {
    if (res.destKey) destKeyElement.innerHTML = res.destKey
    else destKeyElement.innerHTML = 'No destination key on this page'
})

chrome.storage.sync.get(['xlmPrice'], function (res) {
    if (res.xlmPrice) xlmPrice.innerHTML = `1 Stellar(XLM) is worth ${res.xlmPrice} USD`
    else xlmPrice.innerHTML = 'Please click update price for first time'
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });

priceCheckBtn.onclick = function(e) {
    xlmPrice.innerText = 'loading'
    $.get('https://love-button.glitch.me/priceCheck', function(price) {
        xlmPrice.innerText = `1 Stellar(XLM) is worth ${price.price} USD`
        chrome.storage.sync.set({'xlmPrice': price.price})
    })
}

// if i make this a normal button rather than a submit (so that it won't reload), I can probably show the success alert
sendPaymentForm.onsubmit = function(e) {
  if (destKeyElement.innerHTML != 'Destination key not set' && sourceKeyIn.value != '') {
      $.post( 'https://love-button.glitch.me/sendMoney', {source: sourceKeyIn.value, destination: destKeyElement.innerHTML, amount: '1'})
  } else alert('Destination key or source key not set')
}