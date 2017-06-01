// init scribe state
var matches = window.location.pathname.match(/\d+/);
var currentRoomId = matches[0];
var currentRoomProvider = 'douyu';
var currentRoomTitle = document.querySelector('.headline h1').innerText;
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
    if (init) {
      // first load, init the alarm button element

      // todo constants parts for each inject scripts can be extract to common
      var bellImageEnabled = '<img title="点击移出直播间通知列表" style="width:24px;" class="gyaruppi-bell enabled" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0OTUuNDQgNDk1LjQ0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0OTUuNDQgNDk1LjQ0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjY0cHgiIGhlaWdodD0iNjRweCI+CjxnPgoJPHBhdGggc3R5bGU9ImZpbGw6I0VFODcwMDsiIGQ9Ik0yNDcuNzIsNDk1LjQ0YzQyLjc1NiwwLDc4LjYzNy0yOS45NjMsODcuNzU2LTY5Ljk5NUgyNDcuNzJWNDk1LjQ0eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGQTczMzsiIGQ9Ik0xNTkuOTY0LDQyNS40NDVjOS4xMiw0MC4wMzIsNDUsNjkuOTk1LDg3Ljc1Niw2OS45OTV2LTY5Ljk5NUgxNTkuOTY0eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGQ0QwMDsiIGQ9Ik00NTUuMjIsMzg1LjQ0NVYzMjguMTdsLTMwLTMwdi03My41NGMwLTc5LjMtNTIuNzEtMTQ4LjQ2LTEyNy41LTE3MC4zNVY1MGMwLTI3LjU3LTIyLjQzLTUwLTUwLTUwICAgdjM4NS40NDVINDU1LjIyeiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGREE0NDsiIGQ9Ik0yNDcuNzIsMGMtMjcuNTcsMC01MCwyMi40My01MCw1MHY0LjI4Yy03NC43OSwyMS44OS0xMjcuNSw5MS4wNS0xMjcuNSwxNzAuMzV2NzMuNTRsLTMwLDMwdjU3LjI3NSAgIGgyMDcuNVYweiIvPgoJPHJlY3QgeD0iMjAuMjIiIHk9IjM4NS40NDUiIHN0eWxlPSJmaWxsOiNGRkI2NTU7IiB3aWR0aD0iNDU1IiBoZWlnaHQ9IjQwIi8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRkZFNDc3OyIgZD0iTTQ1MS45OTMsMTg3LjY5NmwzOS4zNzctNy4wMzVDNDc5LjQ4LDExNC4xMDcsNDQwLjE5OCw1NC41NjQsMzgzLjU5NywxNy4yOThsLTIxLjk5NiwzMy40MDkgICBDNDA5LjA3Nyw4MS45NjUsNDQyLjAyNSwxMzEuODk2LDQ1MS45OTMsMTg3LjY5NnoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkVCOTk7IiBkPSJNMTMzLjgzOSw1MC43MDdsLTIxLjk5Ni0zMy40MDlDNTUuMjQyLDU0LjU2NCwxNS45NiwxMTQuMTA3LDQuMDcsMTgwLjY2bDM5LjM3Nyw3LjAzNSAgIEM1My40MTUsMTMxLjg5Niw4Ni4zNjMsODEuOTY1LDEzMy44MzksNTAuNzA3eiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=" />';
      var bellImageDisabled = '<img title="点击加入直播间通知列表" style="width:24px;" class="gyaruppi-bell disabled" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0OTUuNDQgNDk1LjQ0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0OTUuNDQgNDk1LjQ0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRUU4NzAwOyIgZD0iTTI0Ny43Miw0OTUuNDRjNDIuNzU2LDAsNzguNjM3LTI5Ljk2Myw4Ny43NTYtNjkuOTk1SDI0Ny43MlY0OTUuNDR6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRkZBNzMzOyIgZD0iTTE1OS45NjQsNDI1LjQ0NWM5LjEyLDQwLjAzMiw0NSw2OS45OTUsODcuNzU2LDY5Ljk5NXYtNjkuOTk1SDE1OS45NjR6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRkZDRDAwOyIgZD0iTTQxMy43MjksMzg1LjQ0NWg0MS40OTFWMzI4LjE3bC0zMC0zMHYtNzMuNTRjMC03OS4zLTUyLjcxLTE0OC40Ni0xMjcuNS0xNzAuMzVWNTAgICBjMC0yNy41Ny0yMi40My01MC01MC01MHYyMTkuNDM1TDQxMy43MjksMzg1LjQ0NXoiLz4KCTxwb2x5Z29uIHN0eWxlPSJmaWxsOiNGRkNEMDA7IiBwb2ludHM9IjI0Ny43MiwzODUuNDQ1IDM1Ny4xNiwzODUuNDQ1IDI0Ny43MiwyNzYuMDA1ICAiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkRBNDQ7IiBkPSJNMjQ3LjcyLDI3Ni4wMDVMOTkuMjExLDEyNy40OTZDODAuODA2LDE1NS42MTQsNzAuMjIsMTg5LjEwMiw3MC4yMiwyMjQuNjN2NzMuNTRsLTMwLDMwdjU3LjI3NSAgIGgyMDcuNVYyNzYuMDA1eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGREE0NDsiIGQ9Ik0yNDcuNzIsMGMtMjcuNTcsMC01MCwyMi40My01MCw1MHY0LjI4Yy0yNy44OSw4LjE2My01Mi43MDcsMjIuOTAzLTcyLjg2OCw0Mi4yODdMMjQ3LjcyLDIxOS40MzVWMCAgIHoiLz4KCTxwb2x5Z29uIHN0eWxlPSJmaWxsOiNGRkI2NTU7IiBwb2ludHM9IjM1Ny4xNiwzODUuNDQ1IDIwLjIyLDM4NS40NDUgMjAuMjIsNDI1LjQ0NSAzOTcuMTYsNDI1LjQ0NSAgIi8+Cgk8cG9seWdvbiBzdHlsZT0iZmlsbDojRkZCNjU1OyIgcG9pbnRzPSI0NTMuNzI5LDQyNS40NDUgNDc1LjIyLDQyNS40NDUgNDc1LjIyLDM4NS40NDUgNDEzLjcyOSwzODUuNDQ1ICAiLz4KCQoJCTxyZWN0IHg9IjIyNy43MiIgeT0iLTc0LjAxNCIgdHJhbnNmb3JtPSJtYXRyaXgoLTAuNzA3MSAwLjcwNzEgLTAuNzA3MSAtMC43MDcxIDU5OC4wNDg5IDI0Ny43MjYpIiBzdHlsZT0iZmlsbDojMDAzRjhBOyIgd2lkdGg9IjQwLjAwMSIgaGVpZ2h0PSI2NDMuNDY3Ii8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==" />';
      var subscribeIcon = document.createElement('div');
      subscribeIcon.className = 'gyaruppi-subscribe';
      subscribeIcon.style.display = 'inline-block';
      subscribeIcon.style.verticalAlign = 'text-bottom';
      subscribeIcon.innerHTML = bellImageEnabled + bellImageDisabled;

      document.querySelector('.headline h1').firstChild.before(subscribeIcon);
      document.querySelector('.gyaruppi-subscribe').style.cursor = 'pointer';
      document.querySelector('.gyaruppi-subscribe').addEventListener('click', function(){
        var currentMessageType = subscribed ? 'unsubscribe' : 'subscribe';
        window.postMessage({
          type: currentMessageType,
          message: {
            provider: 'douyu',
            roomId: currentRoomId,
            title: currentRoomTitle
          }
        }, '*');
      });
    }

    // not init load, update the icon by state
    if (subscribed) {
      document.querySelector('.gyaruppi-bell.enabled').style.display = 'block';
      document.querySelector('.gyaruppi-bell.disabled').style.display = 'none';
    }
    else {
      document.querySelector('.gyaruppi-bell.enabled').style.display = 'none';
      document.querySelector('.gyaruppi-bell.disabled').style.display = 'block';
    }
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
