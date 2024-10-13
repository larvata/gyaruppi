/*
eslint-disable
  camelcase,
 */

import { ROOM_STATUS } from '../common/constants';
import { now } from '../common/utils';

async function getSessionId(room) {
  // not a actual expiration interval but it is long enough for using
  const SESSION_EXPIRED_IN = 1000 * 60 * 60 * 24;

  const { twitcasting_session: data } = await chrome.storage.local.get(['twitcasting_session']);
  if (data && data.sessionId && data.expires && data.expires > now()) {
    return data.sessionId;
  }

  const roomUrl = `https://twitcasting.tv/${room.id}`;
  const html = await fetch(roomUrl).then((res) => res.text());
  const sessionId = html.match(/web-authorize-session-id&quot;:&quot;([a-zA-Z0-9=:]*)&quot;/)[1];
  chrome.storage.local.set({
    twitcasting_session: {
      sessionId,
      expires: now() + SESSION_EXPIRED_IN,
    },
  });
  return sessionId;
}

async function getLatestMovie(room) {
  const timestamp = now();
  const timestampShort = Math.floor(timestamp / 1000);
  const latestMoiveUrl = `https://frontendapi.twitcasting.tv/users/${room.id}/latest-movie?__n=${timestamp}`;
  const u = new URL(latestMoiveUrl);
  const sessionId = await getSessionId(room.id);
  const parameterString = '3gapbnr449n856tj'
    .concat(timestampShort)
    .concat('GET')
    .concat(`${u.pathname}?${u.searchParams}`)
    .concat(sessionId)
    .concat('');
  const hashKey = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(parameterString))
    .then((hash) => Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join(''));

  return fetch(latestMoiveUrl, {
    headers: {
      'x-web-authorizekey': `${timestampShort}.${hashKey}`,
      'x-web-sessionid': sessionId,
    },
  }).then((res) => {
    if (res.status === 400) {
      // authorization failure
      chrome.storage.local.set({
        twitcasting: {
          sessionId: null,
          expires: 0,
        },
      });
      return {};
    }
    return res.json();
  });
}

async function getHappyToken(movieId) {
  const TOKEN_EXPIRED_IN = 1000 * 60 * 45;

  const { twitcasting_happytoken } = await chrome.storage.local.get(['twitcasting_happytoken']);
  const data = twitcasting_happytoken || {};
  if (data && data[movieId] && data[movieId].expires > now()) {
    return data[movieId].token;
  }

  const tokenUrl = 'https://twitcasting.tv/happytoken.php';
  const { token } = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `movie_id=${movieId}`,
  }).then((res) => res.json());
  const nextData = Object.keys(data).reduce((acc, mid) => {
    const current = data[mid];
    if (current.expires > now()) {
      acc[mid] = current;
    }
    return acc;
  }, {
    [movieId]: {
      token,
      expires: now() + TOKEN_EXPIRED_IN,
    },
  });
  chrome.storage.local.set({ twitcasting_happytoken: nextData });
  return token;
}

// roomId is twitter id here
export default async (roomId) => {
  const userUrl = `https://frontendapi.twitcasting.tv/users/${roomId}?detail=true`;
  const { user } = await fetch(userUrl).then((res) => res.json());

  const { movie } = await getLatestMovie(roomId);
  const token = await getHappyToken(movie.id);
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
  result.liveStartAt = Math.floor(now() / 1000);
  result.status = status;
  result.roomUrl = `https://twitcasting.tv/${user.url}`;
  result.avatarUrl = `https:${user.image}`;
  result.online = movieInfo.viewers.current;
  return result;
};
