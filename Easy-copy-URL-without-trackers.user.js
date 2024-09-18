// ==UserScript==
// @name Remove URL trackers and Copy
// @namespace https://github.com/insign
// @version 202409172110
// @description Removes annoying url trackers parameters and copies the cleaned URL to the clipboard when using alt+c (or option+c on mac)
// @match *://*/*
// @author Hélio <open@helio.me>
// @license WTFPL
// @downloadURL https://update.greasyfork.org/scripts/509058/Easy%20copy%20URL%20without%20trackers.user.js
// @updateURL https://update.greasyfork.org/scripts/509058/Easy%20copy%20URL%20without%20trackers.meta.js
// ==/UserScript==

(function() {
  'use strict'

  const paramsToStrip = ['utm_', 'ref', 'gclid', 'gclsrc', 'gs_', 'ga_', '_ga', '_gaq', '__utm', 'fbclid', 'mc_', '_cid', 'epik', 'context']

  function shouldPreserveParam(param) {
    return !paramsToStrip.some(prefix => param.startsWith(prefix))
  }

  function cleanUrl(url) {
    return url.replace(/\?([^#]*)/, (match, searchParams) => {
      const updatedParams = searchParams
        .split('&')
        .filter(shouldPreserveParam)
        .join('&')

      return updatedParams ? '?' + updatedParams : ''
    })
  }

  // Copy the cleaned URL to clipboard
  function copyToClipboard(url) {
    const tempInput = document.createElement('input')
    tempInput.value = url
    document.body.appendChild(tempInput)
    tempInput.select()
    document.execCommand('copy')
    document.body.removeChild(tempInput)
  }

  // Display a notification after copying
  function showNotification() {
    const notification = document.createElement('div')
    notification.textContent = 'Copied without trackers'
    notification.style.position = 'fixed'
    notification.style.top = '10px'
    notification.style.right = '10px'
    notification.style.backgroundColor = 'black'
    notification.style.color = 'white'
    notification.style.padding = '10px'
    notification.style.borderRadius = '5px'
    notification.style.zIndex = 1000
    document.body.appendChild(notification)

    setTimeout(() => {
      document.body.removeChild(notification)
    }, 1000)
  }

  // Event listener for the shortcut
  window.addEventListener('keydown', function(event) {
    if ((event.altKey || event.metaKey) && event.code === 'KeyC') {
      event.preventDefault()

      const currentUrl = location.href
      const cleanedUrl = cleanUrl(currentUrl)

      copyToClipboard(cleanedUrl)
      showNotification()
    }
  })
})()
