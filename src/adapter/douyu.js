import { ROOM_STATUS } from '../common/constants';

export default (roomId) => {
  const roomLiveInfoUrl = `https://www.douyu.com/betard/${roomId}`;

  return fetch(roomLiveInfoUrl)
    .then((res) => res.json())
    .then((json) => {
      const { room } = json;

      let status = ROOM_STATUS.OFFLINE;
      if (room.show_status === 1) {
        status = ROOM_STATUS.ONLINE;
      }

      const result = {};
      result.title = room.room_name;
      result.snapshotUrl = room.room_pic;
      result.username = room.nickname;
      result.follows = '无法获取';
      result.liveStartAt = room.show_time;
      result.status = status;
      result.roomUrl = room.room_url;
      result.avatarUrl = room.avatar.big;
      result.online = 0;

      return result;
    });
};
