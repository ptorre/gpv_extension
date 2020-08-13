"use strict";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function delayClearBadgeText(ms) {
  await sleep(ms);
  chrome.browserAction.setBadgeText({ text: "" });
}

chrome.runtime.onInstalled.addListener(function () {
  console.log("Installed");
  chrome.browserAction.setBadgeText({ text: "⚡" });
  delayClearBadgeText(5000)
})

chrome.runtime.onSuspend.addListener(function () {
  console.log("Unloading.");
  chrome.browserAction.setBadgeText({ text: "" });
});

// Open requests for video streams in an external player.
// TODO allow for configuring the player remote address
// TODO allow for configuring the filter spec externally
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    var target = "http://localhost:5000/" + details.url;
    chrome.browserAction.setBadgeText({ text: details.url });
    console.log("redirecting original request: " + details.url + "to target:" + target)
    return { redirectUrl: target };
  },
  {
    urls: [
      "https://cdnapisec.kaltura.com/*/a.m3u8?*",
      "https://cdnapisec.kaltura.com/*/a.m3u8",
      "https://cfvod.kaltura.com/*/index.m3u8?*",
      "https://cfvod.kaltura.com/*/index.m3u8*",
      "https://*.cloudfront.net/*/index.webm?*",
      "https://*.cloudfront.net/*/index.mp4?*"
    ],
    types: ["xmlhttprequest", "media"]
  },
  ["blocking"]
);

// Block Kaltura analytics updates because the  html5 video player sends invalid
// updates even though it's not playing.
// TODO allow for configuring the blocking filter spec externally
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    return { cancel: true };
  },
  { urls: ["https://analytics.kaltura.com/*"] },
  ["blocking"]
);
