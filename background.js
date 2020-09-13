'use strict';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function delayClearBadgeText(ms) {
    await sleep(ms);
    chrome.browserAction.setBadgeText({text: ''});
}

chrome.runtime.onInstalled.addListener(function() {
    console.log("Installed");
    chrome.browserAction.setBadgeText({text: "⚡"});
    delayClearBadgeText(5000)
})

chrome.runtime.onSuspend.addListener(function() {
    console.log("Unloading.");
    chrome.browserAction.setBadgeText({text: ""});
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    if (details.type == "xmlhttprequest" && details.url.includes("a.m3u8")) {
      chrome.browserAction.setBadgeText({'text': details.url});
      console.log(details)
    }
    return {}
  },
  {urls: ['https://*.kaltura.com/*', 'http://*.kaltura.com/*']},
  ['blocking']);
