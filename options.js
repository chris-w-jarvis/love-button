let defaultInput = document.getElementById('default')
let selectedCurrency = document.getElementById('selectedCurrency')
let defaultBtn = document.getElementById('defaultBtn')

defaultBtn.onclick = function (e) {
  if (defaultInput.value.match(/[a-z]/i) || !defaultInput.value.match(/[0-9]/)) {
    alert('Numbers only and not empty')
    return
  }
  if (parseFloat(defaultInput.value).toFixed(6) <= 0) {
    alert("Can't send 0 or negative")
    return
  }
  chrome.storage.sync.set({defaultAmount: defaultInput.value})
  chrome.storage.sync.set({defaultCurrency: selectedCurrency.value})
  alert('Changed')
}