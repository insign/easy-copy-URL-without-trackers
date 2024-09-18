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
  'use strict';

  const paramsToStrip = ['utm_', 'ref', 'gclid', 'gclsrc', 'gs_', 'ga_', '_ga', '_gaq', '__utm', 'fbclid', 'mc_', '_cid', 'epik', 'context'];

  function shouldPreserveParam(param) {
    return !paramsToStrip.some(prefix => param.startsWith(prefix));
  }

  function cleanUrl(url) {
    return url.replace(/\?([^#]*)/, (match, searchParams) => {
      const updatedParams = searchParams
        .split('&')
        .filter(shouldPreserveParam)
        .join('&');
      return updatedParams ? '?' + updatedParams : '';
    });
  }

  // Copy the cleaned URL to clipboard
  function copyToClipboard(url) {
    const tempInput = document.createElement('input');
    tempInput.value = url;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }

  // Display a sliding notification after copying
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '0';
    notification.style.right = '10px';
    notification.style.backgroundColor = 'black';
    notification.style.color = 'white';
    notification.style.padding = '10px';
    notification.style.border = '3px solid white';
    notification.style.borderTopWidth = '0';
    notification.style.borderRadius = '0 0 5px 5px';
    notification.style.zIndex = '1000';
    notification.style.transform = 'translateY(-100%)'; // Start hidden above the viewport
    notification.style.transition = 'transform 0.5s ease'; // Smooth sliding effect

    document.body.appendChild(notification);

    // Slide down into view
    setTimeout(() => {
      notification.style.transform = 'translateY(0)';
    }, 100); // Slight delay to allow CSS to apply

    // Slide up and remove after 1.5 seconds
    setTimeout(() => {
      notification.style.transform = 'translateY(-100%)'; // Slide back up
      setTimeout(() => {
        document.body.removeChild(notification); // Remove after sliding up
      }, 500); // Time for the slide-up transition to finish
    }, 1500);
  }

  // Event listener for the shortcut
  window.addEventListener('keydown', function(event) {
    if (event.altKey && event.code === 'KeyC') {
      event.preventDefault();

      const currentUrl = location.href;
      const cleanedUrl = cleanUrl(currentUrl);

      copyToClipboard(cleanedUrl);

      // Check if the original URL and cleaned URL are different
      if (currentUrl !== cleanedUrl) {
        showNotification('Copied without trackers');
      } else {
        showNotification('Copied!');
      }
    }
  });
})();
