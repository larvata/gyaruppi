import RoomManager from './common/room-manager';
import {
  showRoomNotification,
  removeRoomNotification,
} from './common/utils';
import { ROOM_STATUS } from './common/constants';

const manager = new RoomManager();

manager.on('status', (room) => {
  console.log(room.status, room);
  if (room.status === ROOM_STATUS.ONLINE) {
    showRoomNotification(room);
  } else {
    removeRoomNotification(room);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.event !== 'list_rooms') {
    return;
  }
  sendResponse(manager.rooms);
});

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.event !== 'request_room_info') {
    return;
  }

  const room = manager.get(request);
  const result = room ? { subscribed: true } : { subscribed: false };
  sendResponse(result);
});

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.event !== 'subscribe_room') {
    return false;
  }

  console.log('subscribe:', request)

  if (request.subscribe) {
    manager.add(request);
  } else {
    manager.remove(request);
  }

  sendResponse();
});

global.manager = manager;
