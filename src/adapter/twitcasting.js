/*
eslint-disable
  camelcase,
 */

import { ROOM_STATUS } from '../common/constants';

// roomId is twitter id here
export default async (roomId) => {
  const userUrl = `https://frontendapi.twitcasting.tv/users/${roomId}?detail=true`;
  const { user } = await fetch(userUrl).then((res) => res.json());

  const latestMoiveUrl = `https://frontendapi.twitcasting.tv/users/${roomId}/latest-movie?__n=${new Date().getTime()}`;
  const { movie } = await fetch(latestMoiveUrl).then((res) => res.json());

  const tokenUrl = 'https://twitcasting.tv/happytoken.php';
  const { token } = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `movie_id=${movie.id}`,
  }).then((res) => res.json());

  const roomLiveInfoUrl = `https://frontendapi.twitcasting.tv/movies/${movie.id}/status/viewer?token=${token}`;
  const room_info = await fetch(roomLiveInfoUrl).then((res) => res.json());
  const { movie: movieInfo } = room_info;

  const status = movie.is_on_live
    ? ROOM_STATUS.ONLINE
    : ROOM_STATUS.OFFLINE;

  const result = {};
  result.title = user.name;
  result.snapshotUrl = null;
  result.follows = user.backerCount;
  result.liveStartAt = new Date();
  result.status = status;
  result.roomUrl = `https://twitcasting.tv/${user.url}`;
  result.avatarUrl = `https:${user.image}`;
  result.online = movieInfo.viewers.current;
  return result;
};
