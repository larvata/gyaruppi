import request from 'superagent';
import {ROOM_STATUS} from '../common';
// import md5 from 'blueimp-md5';

const buildRequestUrl = (roomId) => {
  return `https://www.douyu.com/betard/${roomId}`;
};

// const buildReferer = (roomId) => {
//   return `https://www.douyu.com/${roomId}`;
// };

const fetchRoomInfo = (room)=>{
  const requestPath = buildRequestUrl(room.id);
  // const referer = buildReferer(room.id);
  return new Promise((resolve, reject)=>{
    request
      .get(requestPath)
      // .set('referer', referer)
      .end((err, res)=>{
        if (err && res.statusCode !== 403) {
          reject(err);
        }
        else if (res.statusCode === 403) {
          // reject({message: 'Error on request room info.'});
          room.status = ROOM_STATUS.OFFLINE;
          resolve(room);
        }
        else{
          // console.log(res);
          let { room: _room } = res.body;
          // const { hostinfo, roominfo } = data.info;

          let status = ROOM_STATUS.OFFLINE;
          if (_room.show_status === 1) {
            status = ROOM_STATUS.ONLINE;
          }

          // TODO the online and the follows are trasported with wss
          room.title = _room.room_name;
          room.snapshotUrl = _room.room_pic.replace(/\/dy1$/, '');
          room.online = 0;
          room.avatarUrl = _room.avatar.big;
          room.username = _room.nickname;
          room.follows = '无法获取';
          room.liveStartAt = +_room.show_time;
          room.status = status;

          room.roomUrl = _room.room_url;

          resolve(room);
        }
      });
  });
};

export default {
  fetchRoomInfo
};
