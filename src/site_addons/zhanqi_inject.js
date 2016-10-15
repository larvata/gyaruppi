// // active room details
$('.anchorMessage.tabs>ul>li:nth-child(3)').click();


// init subscribe state
var currentRoomId = +window.oPageConfig.oRoom.id;
var currentRoomProvider = 'zhanqi';
var currentRoomTitle = window.oPageConfig.oRoom.title;
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
    var disable = message.disable;
    var subscribedIcon = subscribed ? '🔕' : '🔔';
    var subscribedText = subscribed ? '移出直播间通知列表' : '加入直播间通知列表';
    if (init) {
      // first load, init the alarm button element
      $('.new-room-subscription>.left').before('<div class="left gyaruppi" style="width:48px; cursor: pointer;"><a class="alarm-title" title=""><span class="dv text alarm-icon">🔔</span></a></div>');
      $('.title-name').css('width', '400px');

      if (disable) {
        // not allow user to subscribe/unsubscribe current room
        // $('.left.gyaruppi').css('cursor','not-allowed');
        $('.left.gyaruppi').click(function(){
          alert('48系番组直播间 无法被移出通知列表, 请在其他播主的房间使用这个功能');
        });
      }
      else {
        $('.left.gyaruppi').click(function(){
          var currentMessageType = subscribed ? 'unsubscribe' : 'subscribe';
          window.postMessage({
            type: currentMessageType,
            message: {
              provider: 'zhanqi',
              roomId: currentRoomId,
              title: currentRoomTitle
            }
          }, '*');
        });
      }

    }
    $('.alarm-icon').text(subscribedIcon);
    $('.alarm-title').attr('title', subscribedText);
  }
});

// send init message to content script host to get current room info
window.postMessage({
  type: 'scriptInjected',
  message: {
    currentRoomId: currentRoomId,
    currentRoomProvider: currentRoomProvider
  }
}, '*');
