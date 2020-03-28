import request from 'superagent';
import {ROOM_STATUS} from '../common';


const fetchRoomInfo = (room) => {
  const requestPath = `https://www.douyu.com/betard/${room.id}`;

  return new Promise((resolve, reject) => {
    request.get(requestPath).end((err, res) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        let { body } = res;

        if (body === null) {
          // some the resbody is empty dont know why
          body = JSON.parse(res.text);
        }

        const { room: roomInfo } = body;

        let status = ROOM_STATUS.OFFLINE;
        if (roomInfo.show_status === 1) {
          status = ROOM_STATUS.ONLINE;
        }

        room.title = roomInfo.room_name;
        room.snapshotUrl = roomInfo.room_pic;
        room.username = roomInfo.nickname;
        room.follows = '无法获取';
        room.liveStartAt = roomInfo.show_time;
        room.status = status;
        room.roomUrl = roomInfo.room_url;
        room.avatarUrl = roomInfo.avatar.big;
        room.online = 0;

        resolve(room);
      } catch (e) {
        console.log('[DOUYU FETCHER]Failed on parsing room info: ');
        reject(e);
      }
    });
  });
};

export default {
  fetchRoomInfo
};
