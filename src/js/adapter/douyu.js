import request from 'superagent';
import {ROOM_STATUS} from '../common';
import md5 from 'blueimp-md5';

const buildRequestUrl = (roomId) => {
  const API_KEY = 'bLFlashflowlad92';
  const tt = Math.round(new Date().getTime() / 60 / 1000);
  const signContent = [roomId, API_KEY, tt].join('');
  const signHash = md5(signContent);
  return `http://www.douyutv.com/swf_api/room/${roomId}?cdn=&nofan=yes&_t=${tt}&sign=${signHash}`;
};

const fetchRoomInfo = (room)=>{
  const requestPath = buildRequestUrl(room.id);
  return new Promise((resolve, reject)=>{
    request.get(requestPath).end((err, res)=>{
      if (err) {
        reject(err);
      }
      else if (res.statusCode !== 200) {
        reject({message: 'Error on request room info.'});
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
          room.online = data.online;
          room.avatarUrl = data.owner_avatar;
          room.username = data.nickname;
          room.follows = '无法获取';
          room.liveStartAt = +data.show_time;
          room.status = status;

          room.roomUrl = `https://www.douyu.com/${room.id}`;

          resolve(room);
        }
        else {
          reject({message: 'Erron on parse room info.'});
        }
      }
    });
  });
};

export default {
  fetchRoomInfo
};
