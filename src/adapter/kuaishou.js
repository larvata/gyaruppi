import { ROOM_STATUS } from '../common/constants';

export default (room) => {
  const roomLiveInfoUrl = `https://live.kuaishou.com/live_api/liveroom/livedetail?principalId=${room.id}`;

  return fetch(roomLiveInfoUrl)
    .then((res) => res.json())
    .then((json) => {
      const { data } = json;
      const { list, live } = data;

      // const status = live.living
      //   ? ROOM_STATUS.ONLINE
      //   : ROOM_STATUS.OFFLINE;

      const result = {};
      result.follows = '无法获取';
      result.status = ROOM_STATUS.OFFLINE;
      // result.status = status;
      result.roomUrl = `https://live.kuaishou.com/u/${room.id}`;

      // extract user info
      if (list.length) {
        const video = list[0];
        const { author } = video;
        result.title = author.name;
        result.snapshotUrl = author.poster;
        result.username = author.name;
        result.liveStartAt = new Date().getTime();
      }

      if (live) {
        const { author } = live;
        // result.title = live.caption;
        result.snapshotUrl = live.poster;
        result.username = author.name;
        result.liveStartAt = parseInt(live.statrtTime / 1000, 10);
        result.status = live.playUrls.length
          ? ROOM_STATUS.ONLINE
          : ROOM_STATUS.OFFLINE;
        result.avatarUrl = author.avatar;
        result.online = parseInt(live.watchingCount, 10);
      }

      return result;
    });
};
