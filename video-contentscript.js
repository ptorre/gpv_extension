'use strict';
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    var nodes = mutation.addedNodes;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeName == "VIDEO") {
        nodes[i].setAttribute('preload', 'none');
        nodes[i].removeAttribute('autoplay');
      }
    }
  })
});
observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

/*
(function() {
  var nodes = document.getElementsByTagName("video");
  var i;
  for (i = 0; i < nodes.length; i++) {
    nodes[i].setAttribute('preload', 'none');
    nodes[i].removeAttribute('autoplay');
  }
})();
*/
