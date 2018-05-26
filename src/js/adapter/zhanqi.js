import request from 'superagent';
import {htmlDecode} from '../utils';
import {ROOM_STATUS} from '../common';

const fetchRoomInfo = (room)=>{
  const requestPath = `https://apis.zhanqi.tv/static/v2.2/room/${room.id}.json`;
  return new Promise((resolve, reject)=>{
    request.get(requestPath).set('Accept', 'application/json').end((err, res)=>{

      if (err) {
        return reject(err);
      }
      else if (res.statusCode !== 200) {
        return reject({message: 'Error on request room info.'});
      }

      const { body } = res;
      if (body && body.code === 0) {
        let {data} = body;

        let status = ROOM_STATUS.OFFLINE;
        if (data.status === '4') {
          status = ROOM_STATUS.ONLINE;
        }

        room.title = htmlDecode(data.title);
        room.snapshotUrl = data.bpic;
        room.online = +data.online;
        room.avatarUrl = data.avatar+ '-big';
        room.username = data.nickname;
        room.follows = data.follows;
        room.liveStartAt = data.liveTime;
        room.status = status;

        room.roomUrl = `http://www.zhanqi.tv${data.url}`;
      }

      resolve(room);
    });
  });
};

export default {
  fetchRoomInfo
};
