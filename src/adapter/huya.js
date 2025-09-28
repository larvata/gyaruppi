/* eslint-disable
prefer-destructuring
*/
import { ROOM_STATUS } from '../common/constants';

export default (room) => {
  const roomLiveInfoUrl = `https://m.huya.com/${room.id}`;

  return fetch(roomLiveInfoUrl)
    .then((res) => res.text())
    .then((html) => {
      const result = {};
      result.title = html.match(/"introduction":"(.*?)"/)[1];
      result.snapshotUrl = html.match(/"screenshot":"(.*?)"/)[1];
      result.username = html.match(/"nick":"(.*?)"/)[1];
      result.follows = +html.match(/"attendeeCount":(\d+)/)[1];
      result.liveStartAt = +html.match(/"startTime":(\d+)/)[1];
      result.status = html.includes('"gameStreamInfoList":[]')
        ? ROOM_STATUS.OFFLINE
        : ROOM_STATUS.ONLINE;
      result.roomUrl = `https://www.huya.com/${room.id}`;
      result.avatarUrl = html.match(/"avatar180":"(.*?)"/)[1];
      result.online = +html.match(/"activityCount":(\d+)/)[1];

      return result;
    });
};
