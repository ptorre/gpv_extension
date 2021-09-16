"use strict";

function handleToggle(event) {
  chrome.runtime.sendMessage("toggle-enabled",
    function({disabled}) {
      console.log(`disabled: ${disabled}`)
      if (disabled) {
        event.target.classList.replace("enabled", "disabled");
        event.target.textContent="Enable";
        textarea.value = "OFF";
      } else {
        event.target.classList.replace("disabled", "enabled");
        event.target.textContent="Disable";
        textarea.value = "";
      }
    }
  );
}

let textarea = document.getElementById("url");
textarea.onclick = function(element) {
  let url = element.target;
  url.focus();
  url.select();
  url.setSelectionRange(0,99999);
  document.execCommand("copy");
};

chrome.storage.local.get("enabled", ({enabled}) => {
  let button = document.createElement("button");
  if (enabled) {
    button.classList.add("enabled");
    button.textContent="Disable";
    textarea.value = "enabled";
  } else {
    button.classList.add("disabled");
    button.textContent="Enable";
    textarea.value = "disabled";
  }
  button.addEventListener("click", handleToggle);

  let toggle = document.getElementById("toggle");
  toggle.appendChild(button);
});

