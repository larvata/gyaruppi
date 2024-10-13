import EventEmitter from 'eventemitter3';
import { ROOM_STATUS, EVENTS } from './constants';
import { findAdapter } from '../adapter';

/*
roomInfo example:
{
  provider = null,
  // id should be a number
  id = null,
  title = '',
  snapshotUrl = '',
  online = 0,
  follows = 0,
  liveStartAt = null,
  avatarUrl = '',
  username = '',
  roomUrl = '',
  status = ROOM_STATUS.OFFLINE,
}
 */

export default class Room extends EventEmitter {
  constructor(roomInfo) {
    super();

    [
      'provider',
      'id',
      'title',
      'snapshotUrl',
      'online',
      'follows',
      'liveStartAt',
      'avatarUrl',
      'username',
      'roomUrl',
      'status',

      // for douyin
      'rid',
    ].forEach((key) => {
      this[key] = roomInfo[key];
    });

    this.status = this.status || ROOM_STATUS.OFFLINE;
    this.adapter = findAdapter(this);
  }

  getMinuteElapsed() {
    const currentTimestamp = Date.now().toString().substr(0, 10);
    const diff = +currentTimestamp - +this.liveStartAt;
    return (diff / 60) | 0;
  }

  getRoomKey() {
    return `${this.provider}#${this.id}`;
  }

  fetchRoomInfo() {
    if (!this.adapter) {
      // for the provider of the room is no longer avaialable(e.g.: twicasting)
      return Promise.resolve();
    }

    const lastStatus = this.status;
    return this.adapter(this).then((data) => {
      [
        'provider',
        'id',
        'title',
        'snapshotUrl',
        'online',
        'follows',
        'liveStartAt',
        'avatarUrl',
        'username',
        'roomUrl',
        'status',

        // for douyin
        'rid',
      ].forEach((key) => {
        if (data[key] === undefined) {
          return;
        }
        this[key] = data[key];
      });

      if (lastStatus !== this.status) {
        this.emit(EVENTS.STATUS, this);
      }
      return this;
    });
  }

  getKey() {
    return `${this.provider}#${this.id}`;
  }

  toJSON() {
    return [
      'provider',
      'id',
      'title',
      'snapshotUrl',
      'online',
      'follows',
      'liveStartAt',
      'avatarUrl',
      'username',
      'roomUrl',
      'status',

      // for douyin
        'rid',
    ].reduce((ret, key) => {
      // eslint-disable-next-line no-param-reassign
      ret[key] = this[key];
      return ret;
    }, {
      key: this.getKey(),
    });
  }
}
