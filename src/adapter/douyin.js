import { ROOM_STATUS } from '../common/constants';

export default (room) => {
  const roomLiveInfoUrl = `https://live.douyin.com/webcast/room/web/enter/?aid=6383&app_name=douyin_web&live_id=1&device_platform=web&language=en-US&enter_from=page_refresh&cookie_enabled=true&screen_width=1920&screen_height=1080&browser_language=en-US&browser_platform=MacIntel&browser_name=Chrome&browser_version=129.0.0.0&web_rid=${room.rid}&room_id_str=${room.id}`;

  return fetch(roomLiveInfoUrl)
    .then((res) => res.json())
    .then((json) => {
      const { data } = json;

      const result = {};
      result.status = ROOM_STATUS.OFFLINE;
      if (data.room_status === 0) {
        result.status = ROOM_STATUS.ONLINE;
        result.online = data.data[0].room_view_stats.display_long_anchor;
      }

      result.title = data.user.nickname;
      result.snapshotUrl = '';
      result.username = data.user.nickname;
      result.liveStartAt = parseInt(new Date().getTime() / 1000, 10);
      result.roomUrl = `https://live.douyin.com/${room.rid}`;
      result.avatarUrl = data.user.avatar_thumb.url_list[0];
      result.follows = 0;

      result.rid = room.rid;

      return result;
    });
};
