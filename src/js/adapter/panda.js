import request from 'superagent';
import {ROOM_STATUS} from '../common';

const fetchRoomInfo = (room)=>{
  const requestPath = `http://api.m.panda.tv/ajax_get_liveroom_baseinfo?roomid=${room.id}`;
  return new Promise((resolve, reject)=>{
    request.get(requestPath).end((err, res)=>{
      if (err) {
        reject(err);
      }
      else if (res.statusCode !== 200) {
        reject({message: 'Error on request room info.'});
      }
      else{
        if (res.body.errno === 0) {
          let {data} = res.body;
          const { hostinfo, roominfo } = data.info;

          let status = ROOM_STATUS.OFFLINE;
          if (roominfo.status === '2') {
            status = ROOM_STATUS.ONLINE;
          }

          room.title = roominfo.name;
          room.snapshotUrl = roominfo.pictures.img.replace(/\/w\d+\/h\d+/, '');
          room.online = +roominfo.person_num;
          room.avatarUrl = hostinfo.avatar;
          room.username = hostinfo.name;
          room.follows = +roominfo.fans;
          room.liveStartAt = roominfo.start_time;
          room.status = status;

          room.roomUrl = `http://www.panda.tv/${room.id}`;

          console.log(room);

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
