'use strict';

let textarea = document.getElementById('url');

chrome.browserAction.getBadgeText({}, function(result) { textarea.value = result })

textarea.onclick = function(element) {
  let url = element.target;
  url.focus();
  url.select();
  url.setSelectionRange(0,99999);
  document.execCommand('copy');
};
