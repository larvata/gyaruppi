/* eslint-disable
  no-underscore-dangle
*/

import EventEmitter from 'eventemitter3';

import { ALARMS, STORAGE_KEY, EVENTS } from './constants';
import Room from './room';

export default class RoomManager extends EventEmitter {
  constructor() {
    super();
    this.rooms = [];
    this.initialized = false;

    this.restore()
      .then(() => this.initialize())
      .then(() => {
        this.initialized = true;
      });
  }

  // private
  // restore room info from the local storage
  restore() {
    return chrome.storage.sync.get()
      .then((data) => {
        const keys = Object.keys(data).sort();
        this.rooms = keys.reduce((result, k) => {
          if (!k.startsWith(STORAGE_KEY.ROOM_PERFIX)
            && k !== STORAGE_KEY.ROOMS) {
            return result;
          }

          if (k.startsWith(STORAGE_KEY.ROOM_PERFIX)) {
            const index = Number(k.replace(STORAGE_KEY.ROOM_PERFIX, ''));
            const maxRoomSolt = (data.maxRoomSolt) || 0;
            if (index > maxRoomSolt) {
              return result;
            }
          }

          const rooms = (data[k] || [])
            .map((roomInfo) => {
              // dont touch the status of the roomInfo
              // restore() would be called multiple times
              // due to backend.js work as a servicesworker
              return this.add(roomInfo);
            });
          return [...result, ...rooms];
        }, []);
      });
  }

  // private
  // initialize the alarm
  async initialize() {
    // setup alarm
    ALARMS.forEach(async (alarmSetting) => {
      chrome.alarms.create(alarmSetting.id, {
        periodInMinutes: alarmSetting.period,
      });
    });

    chrome.alarms.onAlarm.addListener((alarm) => {
      const matched = ALARMS.find((a) => a.id === alarm.name);
      if (!matched) {
        return;
      }

      const IDLE_INTERVAL_IN_SECONDS = 60 * 10;
      chrome.idle.queryState(IDLE_INTERVAL_IN_SECONDS, (idleState) => {
        if (matched.idleState === idleState) {
          this.fetchAllRoomInfo();
        }
      });
    });

    // handle notivication click event
    chrome.notifications.onClicked.addListener((notificationId) => {
      const room = this.getByRoomId(notificationId);
      if (!room) {
        return;
      }

      chrome.tabs.create({
        url: room.roomUrl,
      });
    });
  }

  save() {
    const { QUOTA_BYTES_PER_ITEM } = chrome.storage.sync;
    const rooms = [...this.rooms];
    let maxSlotNumber = 0;
    let slotRooms = [];

    const storageData = {
      // clear previous version data
      rooms: [],
    };

    while (rooms.length) {
      const room = rooms.shift().toJSON();

      slotRooms.push(room);
      const json = JSON.stringify(slotRooms);
      const dataLength = encodeURI(json)
        .split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length - 1;

      // reserve 1k byte to prevent the new data from exceeding the qouta
      if (dataLength > QUOTA_BYTES_PER_ITEM - 1024) {
        // the slot is full
        slotRooms.splice(-1);

        maxSlotNumber += 1;
        slotRooms = [room];
      }

      storageData[`${STORAGE_KEY.ROOM_PERFIX}${maxSlotNumber}`] = slotRooms;
    }

    storageData.maxRoomSolt = maxSlotNumber;

    return chrome.storage.sync.set(storageData);
  }

  fetchAllRoomInfo() {
    this.rooms.forEach((room) => this.fetchRoomInfo(room));
  }

  fetchRoomInfo(room) {
    room.fetchRoomInfo().then(() => this.save());
  }

  // returns room info
  add(roomInfo) {
    const exists = this.get(roomInfo);
    const room = new Room(roomInfo);
    room.on(EVENTS.STATUS, () => {
      this.emit(EVENTS.STATUS, room);
    });

    if (exists) {
      console.log(`Room id: ${roomInfo.id} with provider: ${roomInfo.provider} is already exists.`);
      return room;
    }

    this.rooms.push(room);
    this.fetchRoomInfo(room);
    return room;
  }

  remove(roomInfo) {
    const room = this.get(roomInfo);
    this.rooms = this.rooms.filter((r) => r !== room);
    this.save();
    return room;
  }

  get(roomInfo) {
    return this.rooms.find((r) => r.provider === roomInfo.provider && r.id === roomInfo.id);
  }

  getByRoomId(roomId) {
    return this.rooms.find((r) => r.getKey() === roomId);
  }

  getDeferred(roomInfo, callback) {
    if (!callback) {
      return;
    }

    if (this.initialized) {
      callback(this.get(roomInfo));
      return;
    }

    // uninitialized
    this.restore().then(() => callback(roomInfo));
  }

  getRoomsDeferred(callback) {
    if (!callback) {
      return;
    }

    if (this.initialized) {
      callback(this.rooms);
      return;
    }

    this.restore().then(() => callback(this.rooms));
  }

  getNotificationEnabled() {
    return chrome.storage.sync.get([STORAGE_KEY.NOTIFICATION_ENABLED])
      .then((data) => {
        let enabled = data[STORAGE_KEY.NOTIFICATION_ENABLED];
        if (enabled === undefined) {
          enabled = true;
        }
        return enabled;
      });
  }

  toggleNotification() {
    return this.getNotificationEnabled().then((enabled) => {
      chrome.storage.sync.set({
        [STORAGE_KEY.NOTIFICATION_ENABLED]: !enabled,
      });
      return !enabled;
    });
  }
}
