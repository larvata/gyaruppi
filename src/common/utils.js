import { PROVIDER } from './constants';

export function promisify(func) {
  return (...options) => new Promise((resolve, reject) => {
    // TODO handle reject()
    func.call(func, ...options, (results) => {
      resolve(results);
    });
  });
}

export function waitFor(scripts, callback) {
  const deadline = new Date().getTime() + 30 * 1000;
  const timer = setInterval(() => {
    if (scripts() || new Date().getTime() > deadline) {
      clearInterval(timer);
      callback();
    }
  }, 1000);
}

function getReadableTime(rawMinutes) {
  let days = 0;
  let hours = 0;
  let minutes = 0;
  let rest = rawMinutes;

  days = rest / (60 * 24) | 0;
  rest %= (60 * 24);

  hours = rest / 60 | 0;
  rest %= 60;
  minutes = rest;

  return {
    days,
    hours,
    minutes,
  };
}

export async function removeRoomNotification(room) {
  const roomKey = room.getKey();
  await promisify(chrome.notifications.clear)(roomKey);
}

// TODO i18n
export async function showRoomNotification(room) {
  await removeRoomNotification(room);

  let avatar64 = null;
  if (room.provider === PROVIDER.SHOWROOM) {
    avatar64 = chrome.runtime.getURL('public/showroom.png');
  } else {
    avatar64 = room.avatarUrl;
  }

  const timeElapsed = getReadableTime(room.getMinuteElapsed());
  let elapsedString = '已播: ';

  if (timeElapsed.days) {
    elapsedString += `${timeElapsed.days}天`;
  }
  if (timeElapsed.hours) {
    elapsedString += `${timeElapsed.hours}小时`;
  }
  elapsedString += `${timeElapsed.minutes}分钟`;

  if (room.getMinuteElapsed() < 3) {
    elapsedString = '刚刚开播';
  }

  elapsedString += `\n当前观众: ${room.online || '-'}`;

  const options = {
    type: 'basic',
    iconUrl: avatar64,
    title: room.title,
    message: elapsedString,
  };

  if ('image' in Notification.prototype) {
    // Image is supported (before chrome 59)
    options.imageUrl = room.snapshotUrl;
    options.type = 'image';
  }

  chrome.notifications.create(room.getKey(), options);
  chrome.notifications.onClicked.addListener((notificationId) => {
    if (notificationId !== room.getKey()) {
      return;
    }
    chrome.tabs.create({
      url: room.roomUrl,
    });
  });
}
