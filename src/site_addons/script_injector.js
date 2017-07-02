var supportedSites = {
  'www.zhanqi.tv': 'site_addons/zhanqi_inject.js',
  'live.bilibili.com': 'site_addons/bilibili_inject.js',
  'www.panda.tv': 'site_addons/panda_inject.js',
  'www.douyu.com': 'site_addons/douyu_inject.js',
  'www.showroom-live.com': [
    'site_addons/showroom_inject.js',
    'site_addons/hls.js'
  ]
};

if (supportedSites.hasOwnProperty(location.host) && location.pathname !== '/') {
  var updateGlobalCustomRoomsData = function(customRooms){
    window.__gyaruppi.customRooms = customRooms;
  };
  var getGlobalCustomRoomsData = function(){
    return window.__gyaruppi.customRooms || [];
  };

  // var getInjectScriptUrl = function(){
  //   var script = supportedSites[location.host];
  //   return chrome.extension.getURL(script);
  // };

  var getInjectScripts = function(){
    var scripts = [].concat(supportedSites[location.host]);
    var scriptUrls = scripts.map(function(s){
      return chrome.extension.getURL(s);
    });
    return scriptUrls;
  };

  window.addEventListener('message', function(event){
    // handle injected content script message
    if (event.source !== window) {
      return;
    }

    var eventData = event.data;
    var type = eventData.type;
    var message = eventData.message;

    if (type === 'scriptInjected') {
      // update subscribe state to injected script
      var currentRoomProvider = message.currentRoomProvider;
      var currentRoomId = message.currentRoomId;
      var customRooms = getGlobalCustomRoomsData();
      var room = customRooms.find(function(cr){return cr.provider === currentRoomProvider && cr.id === currentRoomId});

      var subscribed = room ? true : false;
      window.postMessage({
        type: 'updateSubscribeState',
        message: {
          subscribed: subscribed,
          init: true,
          disable: (room && room.isStockRoom) || false
        }
      }, '*');
      return;
    }
    else if(type === 'subscribe' || type === 'unsubscribe'){
      chrome.runtime.sendMessage(eventData, function(data){
        // background page callback
        var subscribed = data.subscribed;
        window.postMessage({
          type: 'updateSubscribeState',
          message: {
            subscribed: subscribed
          }
        }, '*');
      });
    }
  });

  chrome.runtime.sendMessage({
    type: 'getInitData',
    message: {}
  }, function(data){
    var customRooms = data.customRooms;
    var settings = data.settings;
    var allowInjectSubscribeButtonScript = settings.allowInjectSubscribeButtonScript;

    if (!allowInjectSubscribeButtonScript) {
      console.log('inject subscribe script is not allowed');
      return;
    }

    // add custom variables to window
    window.__gyaruppi = {};
    updateGlobalCustomRoomsData(customRooms);

    var scripts = getInjectScripts();
    scripts.forEach(function(scriptUrl){
      var s = document.createElement('script');
      s.src = scriptUrl;
      console.log(scriptUrl);
      s.onload = function(){
        // this.parentNode.removeChild(this);
      };
      (document.head || document.documentElement).appendChild(s);
    });

    // var s = document.createElement('script');
    // s.src = getInjectScriptUrl();
    // s.onload = function() {
    //   this.parentNode.removeChild(this);
    // };
    // (document.head || document.documentElement).appendChild(s);

  });
}


