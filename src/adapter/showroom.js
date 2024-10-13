import { ROOM_STATUS } from '../common/constants';

export default (room) => {
  const roomLiveInfoUrl = `https://www.showroom-live.com/api/room/profile?room_id=${room.id}`;

  return fetch(roomLiveInfoUrl)
    .then((res) => res.json())
    .then((json) => {
      let status = ROOM_STATUS.OFFLINE;
      if (json.is_onlive) {
        status = ROOM_STATUS.ONLINE;
      }

      const result = {};
      result.title = json.room_name;
      result.snapshotUrl = json.image;
      result.online = json.view_num;
      result.avatarUrl = null;
      result.username = json.main_name;
      result.follows = json.follower_num;
      result.liveStartAt = json.current_live_started_at;
      result.status = status;
      result.roomUrl = `https://www.showroom-live.com/${json.room_url_key}`;
      return result;
    });
};
