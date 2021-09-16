"use strict";

let disabled;

chrome.runtime.onMessage.addListener(
  (message, _sender, sendResponse) => {
    if (chrome.runtime.lastError) {
      console.log(`"lastError: ${chrome.runtime.lastError.message}`);
    } else {
      if (message === "toggle-enabled") {
        chrome.storage.local.get("enabled", ({ enabled }) => {
          if (enabled) {
            chrome.browserAction.setBadgeText({ text: "OFF" });
            chrome.storage.local.set({ enabled: false });
            disabled = true;
          } else {
            chrome.browserAction.setBadgeText({ text: "ON" });
            chrome.storage.local.set({ enabled: true });
            disabled = false;
          }
          sendResponse({ disabled });
        });
      }
    }
    return true;
  }
);

chrome.runtime.onInstalled.addListener(function () {
  console.log("Installed");
  chrome.storage.local.get("enabled", ({enabled}) => {
    // For each color we were provided…
    if (typeof enabled === 'undefined') {
      console.log("Initial install setting is enabled");
      chrome.storage.local.set({ enabled: true });
      chrome.browserAction.setBadgeText({ text: "*ON*" });
      disabled = false;
    } else if (!enabled) {
      chrome.browserAction.setBadgeText({ text: "OFF" });
      disabled = true;
    } else {
      chrome.browserAction.setBadgeText({ text: "ON" });
      disabled = false;
    }
  });
})

// Open requests for video streams in an external player.
// TODO allow for configuring the player remote address
// TODO allow for configuring the filter spec externally
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (disabled) {
      return {};
    }
    var target = "http://localhost:5000/" + details.url;
    chrome.browserAction.setBadgeText({ text: details.url});
    return { redirectUrl: target };
  },
  {
    urls: [
      "*://*/*.m3u8*",
      "*://*/*stream.mpd*",
      "*://*/*.webm*",
      "*://*/*.mp4*"
    ],
    types: ["xmlhttprequest", "media"]
  },
  ["blocking"]
);

// Block Kaltura analytics updates because the html5 video player sends invalid
// updates even though it's not playing.
// TODO allow for configuring the blocking filter spec externally
chrome.webRequest.onBeforeRequest.addListener(
  function (_details) {
    if (disabled) {
      return {};
    }
    return { cancel: true };
  },
  { urls: ["https://analytics.kaltura.com/*"] },
  ["blocking"]
);
