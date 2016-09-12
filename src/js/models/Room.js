import {ROOM_STATUS} from '../common';

const ProviderUrlPerfix = {
  zhanqi: 'http://www.zhanqi.tv'
};

export default class Room{
  constructor({
      provider = null,
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
      status = ROOM_STATUS.OFFLINE
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
  }

  getMinuteElapsed(){
    let currentTimestamp = Date.now().toString().substr(0,10);
    let diff = +currentTimestamp - +this.liveStartAt;
    return diff/60 | 0;
  }

  // getUrl(){
  //   let perfix = ProviderUrlPerfix[this.provider];
  //   let roomUrl = `${perfix}/${this.domain}`;
  //   return roomUrl;
  // }

  getRoomKey(){
    return `${this.provider}#${this.id}`;
  }
}