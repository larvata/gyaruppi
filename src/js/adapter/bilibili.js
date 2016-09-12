import request from 'superagent';
import { htmlDecode } from '../utils';
import {ROOM_STATUS} from '../common';

const fetchRoomInfo = (room)=>{
  const requestPath = `http://live.bilibili.com/live/getInfo?roomid=${room.id}`;
  return new Promise((resolve, reject)=>{
    request.get(requestPath).set('Accept', 'application/json').end((err, res)=>{
      if (err) {
        reject(err);
      }
      else{

        try {
          let parsed = JSON.parse(res.text);
          if (parsed && parsed.code === 0) {
            let {data} = parsed;

            let status = ROOM_STATUS.OFFLINE;
            if (data.LIVE_STATUS === 'LIVE') {
              status = ROOM_STATUS.ONLINE;
            }

            // room.domain =
            console.log('bili title: ', data.ROOMTITLE);
            room.title = htmlDecode(data.ROOMTITLE);
            console.log('bbb: ' , room.title);
            room.snapshotUrl = data.COVER;
            // room.online =
            // room.avatarUrl = 'http://i0.hdslb.com/bfs/face/2f3d4758ff0505639b477e4d72662cc0049d65f7.jpg';
            room.username = data.ANCHOR_NICK_NAME;
            room.follows = data.FANS_COUNT;
            room.liveStartAt = data.LIVE_TIMELINE;
            room.status = status;

            room.roomUrl = `http://live.bilibili.com/${room.id}`;

            // complete user info
            const userInfoPath = `http://api.bilibili.com/userinfo?mid=${data.MASTERID}`;
            request.get(userInfoPath).end((err, res)=>{
              if (err) {
                reject(err);
              }
              else{
                let parsed = JSON.parse(res.text);
                if (parsed && parsed.code === 0) {
                  // let {data} = parsed;
                  room.avatarUrl = parsed.face;
                }
              }
              resolve(room);
            });
          }
        }
        catch(e){
          console.log(res.text);
          reject(e);
        }

      }
    });
  });
};


export default {
  fetchRoomInfo
};
