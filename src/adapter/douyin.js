import { ROOM_STATUS } from '../common/constants';

export default (room) => {
  const roomLiveInfoUrl = `https://webcast.amemv.com/douyin/webcast/reflow/${room.id}`;

  return fetch(roomLiveInfoUrl)
    .then((res) => res.text())
    .then((html) => {
      const result = {};

      result.status = +html.match(/\\"status\\":(\d+)/)[1] === 4
        ? ROOM_STATUS.OFFLINE
        : ROOM_STATUS.ONLINE;

      result.title = html.match(/\\"title\\":\\"(.*?)\\"/)[1];
      result.snapshotUrl = null;
      result.username = html.match(/\\"nickname\\":\\"(.*?)\\"/)[1];
      result.liveStartAt = parseInt(new Date().getTime() / 1000, 10);
      result.roomUrl = `https://live.douyin.com/${room.rid}`;
      result.avatarUrl = html.match(/https:\/\/[^\s"]*aweme-avatar[^\s"]*/)[0];
      result.follows = 0;

      result.rid = room.rid;

      return result;
    });
};
