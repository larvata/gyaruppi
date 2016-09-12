import uuid from 'node-uuid';
import superagent from 'superagent';
import superagentPromisePlugin from 'superagent-promise-plugin';

// import defaultConfig from '../../defaultConfig';
import { localStorage, syncStorage } from '../utils/storage';
import Room from '../models/Room';
// import roomWorker from '../worker/RoomWorker';
import { fetchRoomInfo } from '../adapter';


const request = superagentPromisePlugin.patch(superagent);
const API_SERVER = 'http://local.larvata.me:8080/api/miichan';
// const MIICHAN_INTERVAL = 3600000;
const MIICHAN_INTERVAL = 120000;
const ROOM_INTERVAL = 120000;

class ApplicationManager{
  constructor(){
    this.clientId = null;
    this.stockRooms = null;
    this.stockRoomsVersion = 0;

    // this.roomPool = [];

    this.onRoomStatusChanges = null;
    this.onScheduleChanges = null;
  }

  async initialize(){
    let savedData = await localStorage.get(null);
    let {clientId, stockRoomsVersion} = savedData;

    if (!clientId) {
      // first run, init cid and load default config
      clientId = uuid.v1();
    }
    this.clientId = clientId;

  }

  startRoomUpdate(){

  }

  startScheduleUpdate(){

  }

  _getMiichanUrl(){
    let url = `${API_SERVER}/${this.clientId}/${this.stockRoomsVersion}`;
    return url;
  }

  _updateRoomInfo(newRooms){
    return newRooms.map(nr=>{
      if (!this.stockRooms) {
        // retrun new room directly for first load
        return new Room(nr);
      }

      let find = this.stockRooms.find(sr=>
        sr.provider === nr.provider &&
        sr.id === nr.id
      );
      if (!find) {
        find = new Room(nr);
      }
      return find;
    });
  }

  async _fetchMiichan(){
    let url = this._getMiichanUrl();
    try {
      let res = await request.get(url);
      let { body } = res;

      if (body.status === 'ok') {
        // responsed data vailded
        let {room, schedule} = body;

        if (room.status === 'update') {
          // update room data
          this.stockRoomsVersion = room.stockRoomsVersion;
          this.stockRooms = this._updateRoomInfo(room.stockRooms);

          // todo save to localstorage

        }

        if (schedule.status === 'update') {
          // todo
          this.schedules = schedule.list;
          this.onScheduleChanges(this.schedules);
        }
      }
    }
    catch(e){
      console.log(e);
    }
  }

  async startMiichanWorker(){
    await this._fetchMiichan();
    setInterval(::this._fetchMiichan, MIICHAN_INTERVAL);
  }

  async _fetchSingleRoom(room){
    let lastRoomStatus = room.status;
    let _room = await fetchRoomInfo(room);
    if (lastRoomStatus !== _room.status) {
      this.onRoomStatusChanges(_room);
    }
    return _room;
  }

  async _fetchAllRoom(){
    let promises = this.stockRooms.map(r=>this._fetchSingleRoom(r));

    for( let promise of promises){
      await promise;
    }
    // console.log('batch fetch rooms done.');
  }

  async startRoomWorker(){
    this._fetchAllRoom();
    setInterval(::this._fetchAllRoom, ROOM_INTERVAL);
  }

  getAllRooms(){
    if (!this.stockRooms) {
      return [];
    }
    return this.stockRooms.filter(sr=>sr.title);
  }

  getAllSchedules(){
    if (!this.schedules) {
      return [];
    }
    return this.schedules;
  }

}

export default new ApplicationManager();