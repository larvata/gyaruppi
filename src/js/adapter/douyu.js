import request from 'superagent';
import {ROOM_STATUS} from '../common';
// import md5 from 'blueimp-md5';

const buildRequestUrl = (roomId) => {
  // const API_KEY = 'bLFlashflowlad92';
  // const tt = Math.round(new Date().getTime() / 60 / 1000);
  // const signContent = [roomId, API_KEY, tt].join('');
  // const signHash = md5(signContent);
  return `https://apiv2.douyucdn.cn/live/room/info2/${roomId}?client_sys=android`;
};

const fetchRoomInfo = (room)=>{
  const requestPath = buildRequestUrl(room.id);
  return new Promise((resolve, reject)=>{
    request.get(requestPath).end((err, res)=>{
      if (err && res.statusCode !== 403) {
        reject(err);
      }
      else if (res.statusCode === 403) {
        // reject({message: 'Error on request room info.'});
        room.status = ROOM_STATUS.OFFLINE;
        resolve(room);
      }
      else{
        if (res.body.error === 0) {
          let {data} = res.body;
          // const { hostinfo, roominfo } = data.info;

          let status = ROOM_STATUS.OFFLINE;
          if (data.show_status === '1') {
            status = ROOM_STATUS.ONLINE;
          }

          room.title = data.room_name;
          room.snapshotUrl = data.vertical_src;
          room.online = data.online || 0;
          room.avatarUrl = data.owner_avatar;
          room.username = data.nickname;
          room.follows = '无法获取';
          room.liveStartAt = +data.show_time;
          room.status = status;

          room.roomUrl = `https://www.douyu.com/${room.id}`;

          resolve(room);
        }
        else {
          reject({message: 'unexpected errorcode.'});
        }
      }
    });
  });
};

export default {
  fetchRoomInfo
};
