//alert("loaded script")

// regex: !\$\^&%LOVE{ [A-Z0-9]{56} <= don't know what this is\? <a href="https:\/\/love-button\.glitch\.me\/about">Love Button<\/a> }EVOL\$\$

var re = /!\$\^%LOVE{ [A-Z0-9]{56} &lt;= don't know what this is\? <a href="https:\/\/love-button\.glitch\.me\/about">Love Button<\/a> }EVOL\$\$/

// remember this returns an array (id is one because ids are unique)
const description = document.getElementsByClassName('content style-scope ytd-video-secondary-info-renderer')

const match = description[0].innerHTML.match(re)

if (match) {
    // get public key to be able to send to it
    const destKey = match[0].split(' ')[1]

    // send message to extension
    chrome.runtime.sendMessage({publicKey: destKey, type: 'setDestKey'})

    // remove text
    description[0].innerHTML = description[0].innerHTML.replace(re, '')

    // change text into button
    // maybe not for just the youtube version

}