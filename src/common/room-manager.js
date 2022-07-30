import EventEmitter from 'eventemitter3';

import { ALARM_ID, ROOM_STATUS } from './constants';
import Room from './room';

export default class RoomManager extends EventEmitter {
  constructor() {
    super();
    this.rooms = [];
    this.init();
  }

  // private
  async init() {
    await this.load();

    let alarm = await chrome.alarms.get(ALARM_ID);
    if (!alarm) {
      await chrome.alarms.create(ALARM_ID, {
        periodInMinutes: 5,
      });
      alarm = await chrome.alarms.get(ALARM_ID);
    }

    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name !== ALARM_ID) {
        return;
      }

      this.fetchAllRoomInfo();
    });
  }

  // private
  load() {
    return chrome.storage.sync.get(['rooms'])
      .then((data) => {
        this.rooms = (data.rooms || [])
          .map((roomInfo) => this.add(roomInfo));
        this.emit('ready');
      });
  }

  save() {
    const roomData = this.rooms.map((r) => {
      const room = r.toJSON();
      room.status = ROOM_STATUS.OFFLINE;
      return room;
    });
    return chrome.storage.sync.set({ rooms: roomData });
  }

  fetchAllRoomInfo() {
    this.rooms.forEach((r) => {
      r.fetchRoomInfo();
    });
  }

  // returns room info
  add(roomInfo) {
    const exists = this.get(roomInfo);
    if (exists) {
      throw new Error(`Room id: ${roomInfo.id} with provider: ${roomInfo.provider} is already exists.`);
    }

    const room = new Room(roomInfo);
    room.on('status', (status) => {
      this.emit('status', room);
    });
    room.on('refresh', (room) => {
      this.emit('refresh', room);
    });
    this.rooms.push(room);
    room.fetchRoomInfo();
    this.save();
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
}
