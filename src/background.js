import RoomManager from './common/room-manager';
import {
  showRoomNotification,
} from './common/utils';
import { ROOM_STATUS, EVENTS } from './common/constants';

const manager = new RoomManager();

manager.on(EVENTS.STATUS, (room) => {
  if (room.status === ROOM_STATUS.ONLINE) {
    showRoomNotification(room);
    chrome.action.setBadgeText({ text: '!' });
  }
});

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.event !== EVENTS.REQUEST_ROOMS_INFO) {
    return;
  }

  const room = manager.get(request);
  const result = room ? { subscribed: true } : { subscribed: false };
  sendResponse(result);
});

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.event !== EVENTS.SUBSCRIBE_ROOM) {
    return false;
  }

  if (request.subscribe) {
    manager.add(request);
  } else {
    manager.remove(request);
  }

  sendResponse();
});

global.manager = manager;
