import {ROOM_STATUS} from '../common';

// const ProviderUrlPerfix = {
//   zhanqi: 'http://www.zhanqi.tv'
// };

export default class Room{
  constructor({
      provider = null,
      // id should be a number
      id = null,
      domain = '',
      title = '',
      snapshotUrl = '',
      online = 0,
      follows = 0,
      liveStartAt = null,
      avatarUrl = '',
      username = '',
      roomUrl = '',
      alias = '',
      status = ROOM_STATUS.OFFLINE,

      isStockRoom = true,
      locked = false,
      enabled = true
  }){
    this.provider = provider;
    this.id = id;
    this.domain = domain;
    this.title = title;
    this.snapshotUrl = snapshotUrl;
    this.online = online;
    this.follows = follows;
    this.liveStartAt = liveStartAt;
    this.avatarUrl = avatarUrl;
    this.username = username;
    this.roomUrl = roomUrl;
    this.alias = alias;
    this.status = status;

    this.isStockRoom = isStockRoom;
    this.locked = locked;
    this.enabled = enabled;
  }

  getMinuteElapsed(){
    let currentTimestamp = Date.now().toString().substr(0,10);
    let diff = +currentTimestamp - +this.liveStartAt;
    return diff/60 | 0;
  }

  getRoomKey(){
    return `${this.provider}#${this.id}`;
  }
}