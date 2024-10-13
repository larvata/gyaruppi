/*
eslint-disable
  camelcase,
 */

import { ROOM_STATUS } from '../common/constants';

export default (room) => {
  const roomLiveInfoUrl = `https://public.openrec.tv/external/api/v5/search-movies?channel_ids=${room.id}`;

  return fetch(roomLiveInfoUrl)
    .then((res) => res.json())
    .then((json) => {
      const result = {};
      const [movie] = json;
      if (!movie) {
        return result;
      }

      if (movie.onair_status === 1) {
        // 1: online
        result.status = ROOM_STATUS.ONLINE;
        result.roomUrl = `https://www.openrec.tv/live/${movie.id}`;
      } else {
        // 2: offline
        result.status = ROOM_STATUS.OFFLINE;
        result.roomUrl = `https://www.openrec.tv/user/${movie.channel.id}`;
      }

      result.title = movie.channel.nickname;
      result.snapshotUrl = movie.thumbnail_url;
      result.username = movie.channel.id;
      result.follows = movie.channel.followers;
      result.liveStartAt = movie.created_at;
      result.avatarUrl = movie.channel.icon_image_url;
      result.online = movie.live_views;
      return result;
    });
};
