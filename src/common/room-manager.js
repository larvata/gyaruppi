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
    this.deferredTasks = [];

    this.restore()
      .then(() => this.initialize())
      .then(() => {
        this.initialized = true;
        this.deferredTasks.forEach((task) => task());
      });
  }

  // private
  // restore room info from the local storage
  restore() {
    return chrome.storage.sync.get([STORAGE_KEY.ROOMS])
      .then((data) => {
        this.rooms = (data.rooms || [])
          .map((roomInfo) => this.add(roomInfo));
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
  }

  save() {
    const roomData = this.rooms.map((r) => r.toJSON());
    return chrome.storage.sync.set({
      [STORAGE_KEY.ROOMS]: roomData,
    });
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
    if (exists) {
      throw new Error(`Room id: ${roomInfo.id} with provider: ${roomInfo.provider} is already exists.`);
    }

    const room = new Room(roomInfo);
    room.on(EVENTS.STATUS, () => {
      this.emit(EVENTS.STATUS, room);
    });
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

  getDeferred(roomInfo, callback) {
    if (!callback) {
      return;
    }

    if (this.initialized) {
      callback(this.get(roomInfo));
      return;
    }

    // uninitialized
    this.deferredTasks.push(() => {
      callback(this.get(roomInfo));
    });
  }
}
