import RoomManager from './common/room-manager';
import {
  showRoomNotification,
  removeRoomNotification,
} from './common/utils';
import { ROOM_STATUS, EVENTS } from './common/constants';

const manager = new RoomManager();

manager.on(EVENTS.STATUS, (room) => {
  if (room.status === ROOM_STATUS.ONLINE) {
    showRoomNotification(room);
    chrome.action.setBadgeBackgroundColor({ color: '#f1592b' });
    chrome.action.setBadgeTextColor({ color: 'white' });
    chrome.action.setBadgeText({ text: '!' });
  } else {
    // offline
    removeRoomNotification(room);
    const allOffline = manager.rooms.every((r) => r.status === ROOM_STATUS.OFFLINE);
    if (allOffline) {
      chrome.action.setBadgeText({ text: '' });
    }
  }
});

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.event !== EVENTS.REQUEST_ROOMS_INFO) {
    return false;
  }

  // background script will be destory by chrome
  // at that time the RoomManager cannot get the roomInfo immediately
  manager.getDeferred(request, (room) => {
    const result = room ? { subscribed: true } : { subscribed: false };
    sendResponse(result);
  });

  return true;
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
  return true;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.event !== EVENTS.REQUEST_ROOM_LIST) {
    return false;
  }

  manager.getRoomsDeferred((rooms) => {
    sendResponse(rooms);
  });

  return true;
});

global.manager = manager;
