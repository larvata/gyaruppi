// init scribe state
var currentRoomId = window.ROOMID;
var currentRoomProvider = 'bilibili';
var currentRoomTitle = $('.room-title').attr('title');
var subscribed = false;

// init event listener
window.addEventListener('message', function(event){
  if (event.source !== window) {
    return;
  }

  var eventData = event.data;
  var type = eventData.type;
  var message = eventData.message;

  if (type === 'updateSubscribeState') {
    subscribed = message.subscribed;
    var init = message.init;
    var subscribedIcon = subscribed ? '🔕' : '🔔';
    var subscribedText = subscribed ? '移出直播间通知列表' : '加入直播间通知列表';
    if (init) {
      // first load, init the alarm button element
      $('.dp-inline-block.v-middle:first').before('<div class="dp-inline-block v-middle alarm-ctrl" style="margin-right: 20px; cursor: pointer">🔕</div>');
      $('.alarm-ctrl').click(function(){
        var currentMessageType = subscribed ? 'unsubscribe' : 'subscribe';
        window.postMessage({
          type: currentMessageType,
          message: {
            provider: 'bilibili',
            roomId: currentRoomId,
            title: currentRoomTitle
          }
        }, '*');
      });
    }
    $('.alarm-ctrl').text(subscribedIcon);
    $('.alarm-ctrl').attr('title', subscribedText);
  }
});

// send init message to content script host to get current room info
window.postMessage({
  type: 'scriptInjected',
  message: {
    currentRoomId: currentRoomId,
    currentRoomProvider: currentRoomProvider,
  }
}, '*');
