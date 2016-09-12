import 'babel-polyfill';
import { MESSAGE } from './common';
import { showRoomNotification } from './utils';
import appMgr from './utils/ApplicationManager';
import {ROOM_STATUS} from './common';


// export to popups
// window.roomManager = roomManager;
window.appMgr = appMgr;

chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
  let {type} = request;
  if (type === MESSAGE.SUBSCRIBE) {
    let {provider, roomId} = request.message;
    console.log(`Showroom HOOK: { Room: ${roomId}, Provider: ${provider} }`);
    // todo code for register new notification
    //
  }
});

// create context menus
// chrome.contextMenus.create({
//   title: 'heheh',
//   contexts: ['browser_action', 'page_action'],
// })

chrome.storage.local.clear();


// main entry
// load data
(async ()=>{
  appMgr.onRoomStatusChanges=(room)=>{
    console.log(`Room ${room.title} status changed to ${room.status}`);
    if (room.status === ROOM_STATUS.ONLINE) {
      showRoomNotification(room);
    }
  };

  appMgr.onScheduleChanges=(schedules)=>{
    console.log('schedule changed: ', schedules);
  };

  await appMgr.initialize();
  await appMgr.startMiichanWorker();
  appMgr.startRoomWorker();

})();

console.log('Background.js');
