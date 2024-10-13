import { ROOM_STATUS } from '../common/constants';

export default (room) => {
  const roomLiveInfoUrl = `https://apis.zhanqi.tv/static/v2.2/room/${room.id}.json`;

  return fetch(roomLiveInfoUrl)
    .then((res) => res.json())
    .then((json) => {
      const { code, data, message } = json;
      if (code) {
        throw new Error(message);
      }

      let status = ROOM_STATUS.OFFLINE;
      if (data.status === '4') {
        status = ROOM_STATUS.ONLINE;
      }

      const result = {};
      result.title = data.title;
      result.snapshotUrl = data.bpic;
      result.online = +data.online;
      result.avatarUrl = `${data.avatar}-big`;
      result.username = data.nickname;
      result.follows = data.follows;
      result.liveStartAt = data.liveTime;
      result.status = status;
      result.roomUrl = `http://www.zhanqi.tv${data.url}`;

      return result;
    });
};
