import request from 'superagent';
import { htmlDecode } from '../utils';
import {ROOM_STATUS} from '../common';

const fetchRoomInfo = (room)=>{
  const requestPath = `http://live.bilibili.com/live/getInfo?roomid=${room.id}`;
  return new Promise((resolve, reject)=>{
    request.get(requestPath).end((err, res)=>{
      if (err) {
        reject(err);
      }
      else{
        try {
          // live/getInfo responsed without content-type: text/json
          // superagent cannot parse it automatically
          let parsed = JSON.parse(res.text);
          if (parsed && parsed.code === 0) {
            let {data} = parsed;

            let status = ROOM_STATUS.OFFLINE;
            if (data.LIVE_STATUS === 'LIVE') {
              status = ROOM_STATUS.ONLINE;
            }

            room.title = htmlDecode(data.ROOMTITLE);
            room.snapshotUrl = data.COVER;
            room.username = data.ANCHOR_NICK_NAME;
            room.follows = data.FANS_COUNT;
            room.liveStartAt = data.LIVE_TIMELINE;
            room.status = status;
            room.roomUrl = `http://live.bilibili.com/${room.id}`;

            // fetch user avatar url from another api
            const userInfoPath = `http://api.live.bilibili.com/AppRoom/index?platform=ios&room_id=${room.id}`;
            request
              .get(userInfoPath)
              .end((err, res)=>{
                if (err) {
                  reject(err);
                }
                else{
                  const {data} = res.body;
                  if (data && parsed.code === 0) {
                    room.avatarUrl = data.face;
                    room.online = data.online;
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
