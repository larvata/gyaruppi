import request from 'superagent';
import {ROOM_STATUS} from '../common';

const fetchRoomInfo = (room) => {
  const requestPath = `https://www.showroom-live.com/api/room/profile?room_id=${room.id}`;
  return new Promise((resolve, reject) => {
    request.get(requestPath).end((err, res) => {
      if (err) {
        reject(err);
      }
      else if (res.statusCode !== 200) {
        reject({ message: 'Error on request room info.' });
      }
      else {
        const { body } = res;
        let status = ROOM_STATUS.OFFLINE;
        if (body.is_onlive) {
          status = ROOM_STATUS.ONLINE;
        }

        room.title = body.room_name;
        room.snapshotUrl = body.image;
        room.online = body.view_num;
        room.avatarUrl = null;
        room.username = body.main_name;
        room.follows = body.follower_num;
        room.liveStartAt = body.current_live_started_at;
        room.status = status;

        room.roomUrl = `https://www.showroom-live.com/${body.room_url_key}`;
        resolve(room);
      }
    });
  });
};

export default {
  fetchRoomInfo
};
