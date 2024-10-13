/*
eslint-disable
  camelcase,
 */

import { ROOM_STATUS } from '../common/constants';

export default (room) => {
  const roomLiveInfoUrl = `https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=${room.id}`;

  return fetch(roomLiveInfoUrl)
    .then((res) => res.json())
    .then((json) => {
      const { data, code } = json;
      if (code !== 0 || !data) {
        throw new Error('bili api responsed error status.');
      }

      const { room_info, anchor_info } = data;
      let status = ROOM_STATUS.OFFLINE;
      if (room_info.live_status === 1) {
        status = ROOM_STATUS.ONLINE;
      }

      const result = {};
      result.title = room_info.title;
      result.snapshotUrl = room_info.cover;
      result.username = anchor_info.base_info.uname;
      result.follows = anchor_info.relation_info.attention;
      result.liveStartAt = room_info.live_start_time;
      result.status = status;
      result.roomUrl = `https://live.bilibili.com/${room_info.room_id}`;
      result.avatarUrl = anchor_info.base_info.face;
      result.online = room_info.online;
      return result;
    });
};
