// chrome.runtime.sendMessage({roomId:'1234567'});
window.postMessage({
  type: 'subscribe',
  message: {
    provider: 'zhanqi',
    roomId: window.oPageConfig.oRoom.id
  }
}, '*');

// // active room details
$('.anchorMessage.tabs>ul>li:nth-child(2)').click();

// // remove ad in chat list
// $('.activity-show').remove();
// $('.room-chat-notice').remove();

// // remove flash ad in chat list
// $('.chat-gg-area').remove();


// // remove ad under video control
// $('.new-room-img-area').remove();
// $('.js-login-guide-1').remove();
// $('.js-active-info-area').remove();

// // add subscription button
$('.new-room-subscription>.left').before('<div class="left" style="width:48px"><a><span class="dv text">🔔</span></a></div>');






