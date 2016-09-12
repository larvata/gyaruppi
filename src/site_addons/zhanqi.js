if (location.host === 'www.zhanqi.tv') {

  console.log("loading zhanqi script...");

  window.addEventListener('message', function(event){
    if (event.source !== window) {
      return;
    }

    var message = event.data;
    console.log('Content Script Received: ', message);
    chrome.runtime.sendMessage(message);
  });

  var s = document.createElement('script');
  // TODO: add "script.js" to web_accessible_resources in manifest.json
  s.src = chrome.extension.getURL('site_addons/zhanqi_inject.js');
  s.onload = function() {
      this.parentNode.removeChild(this);
  };
  (document.head || document.documentElement).appendChild(s);

}

