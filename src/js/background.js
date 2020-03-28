import 'babel-polyfill';
import { MESSAGE } from './common';
import { showRoomNotification, showScheduleNotifaction } from './utils';
import ApplicationManager from './utils/ApplicationManager';
import {ROOM_STATUS} from './common';

// export to popups
window.ApplicationManager = ApplicationManager;

chrome.runtime.onMessage.addListener((request, sender, response) => {
  let {type} = request;
  if (type === MESSAGE.SUBSCRIBE) {
    let {provider, roomId, title} = request.message;
    ApplicationManager.addToCustomRooms({provider, id: roomId, isStockRoom: false, title});
    const result = {
      subscribed: true
    };
    response(result);
  }
  else if(type === MESSAGE.UNSUBSCRIBE){
    let {provider, roomId} = request.message;
    ApplicationManager.removeFromCustomRooms({provider, id: roomId});
    const result = {
      subscribed: false
    };
    response(result);
  }
  else if (type === MESSAGE.GET_INIT_DATA)
  {
    const data = {};
    data.settings = ApplicationManager.getAllSettings();
    data.customRooms = ApplicationManager.getCustomRooms();
    response(data);
  }
});

// main entry
(async ()=>{
  ApplicationManager.onRoomStatusChanges = (room) => {
    const { enableDesktopNotification } = ApplicationManager.getAllSettings();
    if (enableDesktopNotification && room.status === ROOM_STATUS.ONLINE) {
      showRoomNotification(room);
    }
    else if(room.status === ROOM_STATUS.OFFLINE){
      const roomKey = room.getRoomKey();
      chrome.notifications.clear(roomKey);
    }
  };

  ApplicationManager.onNotificationClicked = (room) => {
    const { roomUrl } = room;
    if (roomUrl) {
      chrome.tabs.create({ url: roomUrl });
    }
  };

  ApplicationManager.onScheduleChanges = (schedules) => {
    // chrome.browserAction.setBadgeText(text:text);
    ApplicationManager.setBadge('!');
    showScheduleNotifaction(schedules);
  };

  // kick start the app
  await ApplicationManager.initialize();

  // miichan schedule is offline forever
  // await ApplicationManager.startMiichanWorker();

  ApplicationManager.startRoomWorker();
})();
