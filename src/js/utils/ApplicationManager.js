import uuid from 'node-uuid';
import superagent from 'superagent';
import superagentPromisePlugin from 'superagent-promise-plugin';
import defaultConfig from '../../defaultConfig';
import { localStorage } from '../utils/storage';
import Room from '../models/Room';
import { fetchRoomInfo } from '../adapter';
import { ROOM_STATUS } from '../common';
import { version } from '../../../package.json';

const request = superagentPromisePlugin.patch(superagent);
const API_SERVER = defaultConfig.API_SERVER;

// const MIICHAN_INTERVAL = 3600000;
const MIICHAN_INTERVAL = defaultConfig.MIICHAN_INTERVAL;
const ROOM_INTERVAL = defaultConfig.ROOM_INTERVAL;

class ApplicationManager{
  constructor(){
    this.clientId = null;
    this.stockRooms = null;
    this.stockRoomsVersion = null;

    this.schedules = null;
    this.schedulesVersion = null;

    this.customRooms = null;

    this.settings = Object.assign({}, defaultConfig.initial.settings),

    this.onRoomStatusChanges = null;
    this.onScheduleChanges = null;
    this.onNotificationClicked = null;
  }

  async initialize(){
    let savedData = await localStorage.get(null);
    // console.log('extension init: ', savedData);
    let {
      clientId,
      stockRoomsVersion,
      stockRooms,
      schedulesVersion,
      schedules,
      customRooms,
      settings,
    } = savedData;

    if (!clientId) {
      // first run, init cid and load default config
      clientId = uuid.v1();
      await localStorage.set({
        clientId
      }, ()=> console.log('clientId saved.'));
      // console.log('not find saved clientId, generate new:', clientId);
    }

    // init local variables
    this.clientId = clientId;
    this.stockRoomsVersion = stockRoomsVersion;
    this.stockRooms = stockRooms;
    this.schedulesVersion = schedulesVersion;
    this.schedules = schedules;

    if (settings) {
      Object.assign(this.settings, settings);
    }

    if (!customRooms) {
      this.customRooms = this._rehydrateCustomRooms(this.stockRooms || []);
    }
    else{
      this.customRooms = customRooms.map(r=> {
        const room = new Room(r);
        room.status = ROOM_STATUS.OFFLINE;
        return room;
      });
    }

    //register the notifaction onclick event handler
    chrome.notifications.onClicked.addListener((notificationId) => {
      const room = this._getRoomByNotificationId(notificationId);
      if (room && this.onNotificationClicked) {
        this.onNotificationClicked(room);
      }
    });

    // check and update the idle state
    this.idleState = chrome.idle.IdleState.ACTIVE;
    chrome.idle.onStateChanged.addListener((state) => {
      this.idleState = state;
    });
  }

  // rehydrate customRooms data to Room object from localStorage
  _rehydrateCustomRooms(stockRooms){
    const result = [];
    const customRooms = this.customRooms || [];

    // update stockroom
    stockRooms.forEach(sr => {
      // is already exists in custom room list
      let room = customRooms.find(cr => cr.provider === sr.provider && cr.id === sr.id);

      room = new Room(sr);
      room.isStockRoom = true;
      result.push(room);
    });

    // update custom room
    customRooms.filter(cr => !cr.isStockRoom).forEach(cr => {
      const room = new Room(cr);
      room.isStockRoom = false;
      result.push(room);
    });

    return result;
  }

  _getMiichanUrl(){
    let url = `${API_SERVER}/${this.clientId}`;
    return url;
  }

  _getRoomByNotificationId(notificationId){
    // the notification is formatted as <Provider>#<RoomId>
    const find = this.customRooms.find(r => {
      const currentKey = r.getRoomKey();
      if (currentKey == notificationId) {
        return r;
      }
    });
    return find;
  }

  async _fetchMiichan(){
    if (this.idleState !== chrome.idle.IdleState.ACTIVE) {
      return;
    }

    let url = this._getMiichanUrl();
    try {
      // generate post body
      const usage = this.customRooms.reduce((a, b) => {
        if(b.isStockRoom){
          return a;
        }
        a[b.provider] = a[b.provider] + 1;
        return a;
      }, {bilibili:0,douyu:0,panda:0,zhanqi:0});
      usage.settings = this.settings;

      let res = await request.post(url).send({
        stockRoomsVersion: this.stockRoomsVersion,
        schedulesVersion: this.schedulesVersion,
        version,
        usage
      });
      let { body } = res;

      if (body.status === 'ok') {
        // responsed data vailded
        let {room, schedule} = body;

        if (room.status === 'update') {
          // update room data
          this.stockRoomsVersion = room.stockRoomsVersion;
          this.stockRooms = room.stockRooms;
          this.customRooms = this._rehydrateCustomRooms(room.stockRooms);
          this._fetchAllRoom();

          // save to localStorage
          await localStorage.set({
            stockRoomsVersion: room.stockRoomsVersion,
            stockRooms: room.stockRooms,
            customRooms: this.customRooms
          }, () => console.log('rooms saved'));
        }

        if (schedule.status === 'update') {
          // update schedule
          this.schedules = schedule.data;
          this.schedulesVersion = schedule.timestamp;
          this.onScheduleChanges(this.schedules);

          // save schedules
          await localStorage.set({
            schedulesVersion: schedule.timestamp,
            schedules: schedule.data
          }, () => console.log('schedules saved'));
        }
      }
    }
    catch(e){
      console.log(e);
    }
  }

  async _fetchSingleRoom(room){
    let lastRoomStatus = room.status;
    let _room = await fetchRoomInfo(room);

    // show notification
    if (lastRoomStatus !== _room.status) {
      this.onRoomStatusChanges(_room);
    }

    // save title to stockRoom list
    const stock = this.stockRooms.find(sr=>sr.provider === _room.provider && sr.id === _room.id);
    if (stock) {
      stock.title = _room.title;
      localStorage.set({
        stockRooms: this.stockRooms
      });
    }

    return _room;
  }

  async _fetchAllRoom(){
    if (this.idleState !== chrome.idle.IdleState.ACTIVE) {
      return;
    }

    let promises = this.customRooms.filter(cr => cr.enabled).map(r=>this._fetchSingleRoom(r));

    for( let promise of promises){
      await promise;
    }
  }

  async startMiichanWorker(){
    await this._fetchMiichan();
    setInterval(::this._fetchMiichan, MIICHAN_INTERVAL);
  }

  startRoomWorker(){
    this._fetchAllRoom();
    this.fetchAllTimer = setInterval(::this._fetchAllRoom, ROOM_INTERVAL);
  }

  stopRoomWorker() {
    clearInterval(this.fetchAllTimer);
  }

  getCustomRooms(){
    if (!this.customRooms) {
      return [];
    }
    return this.customRooms.filter(sr=>sr.title);
  }

  removeFromCustomRooms(roomInfo){
    const {id, provider} = roomInfo;
    let room = this.customRooms.find(cr => cr.provider === provider && cr.id === id);
    if (!room) {
      return;
    }

    if (room.isStockRoom) {
      return;
    }

    const nextCustomRooms = this.customRooms.filter(cr => !(cr.provider === provider && cr.id === id));
    if (nextCustomRooms.length !== this.customRooms.length) {
      this.customRooms = nextCustomRooms;
      localStorage.set({customRooms: this.customRooms});
    }
  }

  addToCustomRooms(roomInfo){
    const {id, provider, isStockRoom, title} = roomInfo;
    let room = this.customRooms.find(cr => cr.provider === provider && cr.id === id);
    if (!room) {
      room = new Room({
        id, provider, isStockRoom, title
      });
      this.customRooms.push(room);
      this._fetchAllRoom();
      localStorage.set({customRooms: this.customRooms});
    }
  }

  toggleEnableFromCustomRooms(roomInfo){
    const room = this.customRooms.find(cr => cr.provider === roomInfo.provider && cr.id === roomInfo.id);
    if (!room) {
      return;
    }
    room.enabled = !room.enabled;
    localStorage.set({customRooms: this.customRooms});
  }

  updateSettings(nextSettings){
    Object.assign(this.settings, nextSettings);
    localStorage.set({
      settings: this.settings
    });
  }

  getAllSchedules(){
    if (!this.schedules) {
      return [];
    }
    return this.schedules;
  }

  getAllSettings(){
    return this.settings;
  }

  resetAllSettings(){
    this.customRooms = this.stockRooms.map(sr=>new Room(sr));
    this.settings = defaultConfig.initial.settings;
    this._fetchAllRoom();
    localStorage.set({
      customRooms: this.customRooms,
      settings: this.settings
    });
  }

  setBadge(text){
    chrome.browserAction.setBadgeText({ text });
  }
}

export default new ApplicationManager();
