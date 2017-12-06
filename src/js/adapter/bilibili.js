import request from 'superagent';
import { htmlDecode } from '../utils';
import {ROOM_STATUS} from '../common';

const fetchRoomInfo = (room)=>{
  const roomBaseInfoUrl = `https://api.live.bilibili.com/AppRoom/index?device=phone&platform=ios&scale=3&build=10000&room_id=${room.id}`;
  const roomLiveInfoUrl = `https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${room.id}&from=room`;

  return new Promise((resolve, reject)=>{
    request.get(roomBaseInfoUrl).end((err, res)=>{
      if (err) {
        reject(err);
      }
      else{
        try {
          const { data, code } = res.body;
          if (data && code === 0) {
            let status = ROOM_STATUS.OFFLINE;
            if (data.status === 'LIVE') {
              status = ROOM_STATUS.ONLINE;
            }

            room.title = htmlDecode(data.title);
            room.snapshotUrl = data.cover;
            room.username = data.uname;
            room.follows = data.attention;
            room.liveStartAt = data.schedule.start;
            room.status = status;
            room.roomUrl = `https://live.bilibili.com/${data.show_room_id}`;
            room.avatarUrl = data.m_face;

            if (status === ROOM_STATUS.ONLINE) {
              room.online = data.online;
            }
            else {
              room.online = 0;
            }

            // fetch user avatar url from another api
            request
              .get(roomLiveInfoUrl)
              .end((err, res)=>{
                if (err) {
                  reject(err);
                }
                else{
                  const {data, code} = res.body;
                  if (data && code === 0) {
                    room.liveStartAt = new Date(data.live_time).getTime() / 1000;
                  }
                }
                resolve(room);
              });
          }
        }
        catch(e){
          console.log('[BILIBILI FETCHER]Failed on parsing room info: ', res.text);
          reject(e);
        }

      }
    });
  });
};


export default {
  fetchRoomInfo
};
