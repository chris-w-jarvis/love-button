// alert("loaded script")

var re = /!\$\^%LOVE{ [A-Z0-9]{56} Don't know what this is\?\? Google "love-button" }LOVE\$\$/

// remember this returns an array (id is one because ids are unique)
setTimeout(() => {
    const description = document.getElementsByClassName('content style-scope ytd-video-secondary-info-renderer')
    if (description[0]) {
        console.log(description[0].innerHTML)

        const match = description[0].innerHTML.match(re)

        if (match) {
            // get public key to be able to send to it
            const destKey = match[0].split(' ')[1]

            // send message to extension
            chrome.runtime.sendMessage({publicKey: destKey, type: 'setDestKey'})

            // remove text (creates tons of weird errors)
            //description[0].innerHTML = description[0].innerHTML.replace(re, '')

        } else chrome.runtime.sendMessage({publicKey: 'No destination key on this page', type: 'setDestKey'})
    } else chrome.runtime.sendMessage({publicKey: 'No destination key on this page', type: 'setDestKey'})

    // send channel to background
    const channel = document.getElementsByClassName('yt-simple-endpoint style-scope yt-formatted-string')
    if (channel[0]) {
        chrome.runtime.sendMessage({channel: channel[0].innerHTML, type: 'setChannel'})
    } else chrome.runtime.sendMessage({channel: 'NOT_A_VIDEO', type: 'setChannel'})

}, 1500)