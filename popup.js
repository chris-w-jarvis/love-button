let destKeyElement = document.getElementById('destKey')
let sourceKeyIn = document.getElementById('sourceKeyIn')
let sendPaymentBtn = document.getElementById('sendPaymentBtn')
let xlmPrice = document.getElementById('xlmPrice')
let priceCheckBtn = document.getElementById('priceCheck')
let acctBalanceBtn = document.getElementById('accountBalanceCheck')
let acctBalanceDiv = document.getElementById('accountBalanceDiv')

// I think this works because popup.js doesn't run until you open the popup? if not set to button
chrome.storage.sync.get(['destKey'], function (res) {
    if (res.destKey) destKeyElement.innerHTML = res.destKey
    else destKeyElement.innerHTML = 'No destination key on this page'
})

chrome.storage.sync.get(['xlmPrice'], function (res) {
    if (res.xlmPrice) xlmPrice.innerHTML = `1 Stellar(XLM) is worth ${res.xlmPrice} USD`
    else xlmPrice.innerHTML = 'Please click "Check price" for first time'
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
        if (priceCheckBtn.innerText === 'Check price') priceCheckBtn.innerText = 'Update price'
    })
}

acctBalanceBtn.onclick = function(e) {
    if (priceCheckBtn.innerText === 'Check price') {
        alert('Sorry, please click "Check Price" once before using this feature')
        return
    }
    if (acctBalanceDiv.firstChild) acctBalanceDiv.removeChild(acctBalanceDiv.firstChild)
    if (sourceKeyIn.value != '') {
        $.post({
            url: 'https://love-button.glitch.me/accountBalance',
            data: {source: sourceKeyIn.value},
            success: function (balance) {
                chrome.storage.sync.get(['xlmPrice'], function (res) {
                    // this should exist
                    if (res.xlmPrice) {
                        var usd = parseFloat(balance.balance) * parseFloat(res.xlmPrice)
                        var xlm = parseFloat(balance.balance).toFixed(3)
                        var acctBal = document.createTextNode(`Account balance: ${xlm} XLM which is ~${usd.toFixed(3)} USD`)
                        acctBalanceDiv.appendChild(acctBal)
                    }
                })
            },
            error: function () {
                alert('Request failed, check your private key.');
            }
        })
    } else alert('Set source key to check balance (private key not public key)')
}

// More detailed error messaging, send error message to user from server (not enough money, etc)
sendPaymentBtn.onclick = function (e) {
    if (destKeyElement.innerHTML != 'Destination key not set' && sourceKeyIn.value != '') {
        $.post({url:'https://love-button.glitch.me/sendMoney',
            data:{source: sourceKeyIn.value, destination: destKeyElement.innerHTML, amount: '1'},
            // statusCode: {
            //     400: function() {
            //         alert('Request failed, check your private key.');
            //     }
            // },
            success: function() {
                alert('Success\nSee this transaction on Stellar public ledger: https://stellarchain.io/')
            },
            error: function() {
                alert('Request failed, check your private key.');
        }
        })
    } else alert('Destination key or source key not set')
}