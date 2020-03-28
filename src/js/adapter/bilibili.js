import request from 'superagent';
import {ROOM_STATUS} from '../common';


const fetchRoomInfo = (room)=>{
  const roomLiveInfoUrl = `https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=${room.id}`;

  return new Promise((resolve, reject)=>{
    request.get(roomLiveInfoUrl).end((err, res) => {
      if (err) {
        reject(err);
        return;
      }

      const { data, code } = res.body;
      if (code !== 0 || !data) {
        reject(new Error('bili api responsed error status.'));
        return;
      }

      try {
        const { room_info, anchor_info } = data;
        let status = ROOM_STATUS.OFFLINE;
        if (room_info.live_status === 1) {
          status = ROOM_STATUS.ONLINE;
        }

        room.title = room_info.title;
        room.snapshotUrl = room_info.cover;
        room.username = anchor_info.base_info.uname;
        room.follows = anchor_info.relation_info.attention;
        room.liveStartAt = room_info.live_start_time;
        room.status = status;
        room.roomUrl = `https://live.bilibili.com/${room_info.room_id}`;
        room.avatarUrl = anchor_info.base_info.face;
        room.online = room_info.online;

        resolve(room);
      } catch (e) {
        console.log('[BILIBILI FETCHER]Failed on parsing room info: ');
        reject(e);
      }
    });
  });
};


export default {
  fetchRoomInfo
};
