import { fetchRoomInfo } from '../adapter';


class RoomManager{
  constructor(){
    this.monitors = [];
    this.roomInfoStore = [];

    // feed new room state
    this.roomInfoChangedHandler = ()=>{};
  }

  // _getRoomKey(room){
  //   return `${room.provider}#${room.id}`;
  // }

  _findRegisteredMonitor(room){
    let matched = this.monitors.find(m=>{
      let r = m.room;
      return r.getRoomKey() === room.getRoomKey();
    });
    return matched;
  }

  _fetchRoomInfoSuccess(interval){
    return (roomInfo)=>{
      const roomKey = roomInfo.getRoomKey();
      // const roomKey = this._getRoomKey(roomInfo);

      let lastRoomInfo = this.roomInfoStore[roomKey] || {};
      let roomStatusChanged = (lastRoomInfo.status !== roomInfo.status);

      // new room info got, feed to store
      this.roomInfoStore[roomKey] = roomInfo;

      // console.log('Updated: ', roomInfo);

      // call extend handler
      this.roomInfoChangedHandler(roomInfo, roomStatusChanged);

      // start a new fetch
      setTimeout(()=>this._fetchRoomInfo(roomInfo, interval), interval);
    };
  }

  _fetchRoomInfo(room, interval){
    const fetchSuccess = this._fetchRoomInfoSuccess(interval);
    return fetchRoomInfo(room)
      .then(roomInfo=>fetchSuccess(roomInfo))
      .catch(e=>{
        console.log('----------------');
        console.log(room);
        console.log('Error on fetchRoomInfo: ', e);
      });
  }

  register(room, interval = 120000){
    let m = this._findRegisteredMonitor(room);
    if (m) {
      return;
    }

    this._fetchRoomInfo(room, interval);

    this.monitors.push({
      // timer,
      room,
      interval
    });
  }

  // todo: ability to destory room fetch loop
  // unregister(room){
  //   let m = this._findRegisteredMonitor(room);
  //   if (m) {
  //     clearTimeout(m.timer);
  //   }
  // }

  getAllRooms(){
    return Object.keys(this.roomInfoStore).map((r)=>this.roomInfoStore[r]).sort((a,b)=>(b.follows - a.follows));
  }
}

export default new RoomManager();