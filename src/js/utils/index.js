import { PROVIDER } from '../common';

export const htmlDecode = (sourceText)=>{
  let ele = document.createElement('textarea');
  ele.innerHTML = sourceText;
  let decoded = ele.value;
  return decoded;
};


export const getReadableTime = (rawMinutes)=>{
  let days = 0;
  let hours = 0;
  let minutes = 0;
  let _rest = rawMinutes;


  days = _rest/(60*24) | 0;
  _rest = _rest%(60*24);

  hours = _rest/60 | 0;
  _rest = _rest%60;
  minutes = _rest;

  return {
    days,
    hours,
    minutes
  };
};


export const getImageBase64=(imageUrl)=>{
  return new Promise((resolve, reject)=>{
    let image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageUrl;
    // TODO add cache support to remote image
    image.onload = ()=>{
      let canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;

      let context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      let base64 = canvas.toDataURL('image/jpg');
      resolve(base64);
    };
  });
};

// parse data object from schedule time string from backend api
// and update the time by current timezone
export const parseScheduleTime = (timeString) => {
  const validateRegex =  /^([0-9]?[0-9]):([0-5][0-9])~([0-9]?[0-9]):([0-5][0-9])$/;
  const matched = timeString.match(validateRegex);
  const result = {
    validated: false,
    data: {
      startHour: null,
      startMinute: null,
      endHour: null,
      endMinute: null,
      timezone: 9
    }
  };

  if (!timeString) {
    // ignore the validate for the empty time
    result.validated = true;
    return result;
  }

  if (matched && matched.length === 5) {
    result.validated = true;
    result.data.startHour = matched[1];
    result.data.startMinute = matched[2];
    result.data.endHour = matched[3];
    result.data.endMinute = matched[4];
  }

  const currentTimezoneOffset = new Date().getTimezoneOffset();
  const hourOffset = (-540 - currentTimezoneOffset) / 60;
  let { startHour, endHour } = result.data;
  startHour = +startHour + hourOffset;
  endHour = +endHour + hourOffset;

  if (startHour < 0) {
    startHour = 24 + startHour;
  }
  if (endHour < 0) {
    endHour = 24 + endHour;
  }

  result.data.startHour = startHour;
  result.data.endHour = endHour;

  return result;
};

export const showRoomNotification = async (room)=>{
  let avatar64 = null;
  if (room.provider === PROVIDER.SHOWROOM) {
    avatar64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1OCIgaGVpZ2h0PSIzOCIgdmlld0JveD0iLTQgLTQgNTggMzgiIGlkPSJsb2dvIiB5PSIyODAyIj48dGl0bGU+c2lkZSBuYXYgTE9HTzwvdGl0bGU+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTguNzEzLjgyNWgtLjc0OGEuMjEuMjEgMCAwIDAtLjIwOC4yMXY0LjgzMkgxMS4wM1YxLjAzNWEuMjEuMjEgMCAwIDAtLjIwNy0uMjFoLS43NWEuMjEuMjEgMCAwIDAtLjIwNy4yMXYxMS44ODJjMCAuMTE2LjA5My4yMS4yMDguMjFoLjc1YS4yMS4yMSAwIDAgMCAuMjA2LS4yMXYtNS45Mmg2LjcyN3Y1LjkyYzAgLjExNi4wOTQuMjEuMjA4LjIxaC43NDhhLjIxLjIxIDAgMCAwIC4yMDgtLjIxVjEuMDM1YS4yMS4yMSAwIDAgMC0uMjA3LS4yMSIgZmlsbD0iI0ZGREExQSIvPjxwYXRoIGQ9Ik0yNy43OTUuNjZjLTMuNDE0IDAtNi4zIDIuODg2LTYuMyA2LjMwMiAwIDMuNDE2IDIuODg2IDYuMyA2LjMgNi4zIDMuNDE0IDAgNi4yOTgtMi44ODQgNi4yOTgtNi4zUzMxLjIxLjY2IDI3Ljc5NS42NnptNS4xNDggNi4zMDJjMCAyLjgxLTIuMzU4IDUuMTg2LTUuMTQ4IDUuMTg2LTIuNzkgMC01LjE0OC0yLjM3NS01LjE0OC01LjE4NiAwLTIuODEyIDIuMzU3LTUuMTg2IDUuMTQ4LTUuMTg2IDIuNzkgMCA1LjE0OCAyLjM3NCA1LjE0OCA1LjE4NnoiIGZpbGw9IiM5RUM4NTAiLz48cGF0aCBkPSJNNC42OSA2LjUzbC0uOTQ1LS4yOThDMi42MzMgNS44NzUgMi4wNyA1LjE4MiAyLjA3IDQuMTY4YzAtMS4xMTYuNjYzLTIuMzE3IDIuMTItMi4zMTcuNTYgMCAxLjA2LjA2NyAxLjk0Mi44OTdsLjA1LjA0OGMuMDcuMDcyLjIwNS4wNy4yNy4wMDJsLjUyLS41MDVhLjE5NS4xOTUgMCAwIDAgLjAwOC0uMjlsLS4wNi0uMDU2QzYuNTIzIDEuNTYgNS42OTcuNzYgNC4xOS43NiAyLjM2NC43Ni45ODcgMi4yMjQuOTg3IDQuMTY3YzAgMS42Mi44NTQgMi42OSAyLjUzNyAzLjE4bC42ODQuMjA0Yy44NTcuMjUyIDEuODQuNzE4IDEuODQgMi4wOTMgMCAuOTQtLjYyNiAyLjQyOC0yLjMwNyAyLjQyOC0xLjA2MyAwLTEuNzctLjg2LTIuMTUtMS4zMmwtLjA4My0uMTAyYy0uMDctLjA5LS4yMzQtLjA4NC0uMjktLjAxNmwtLjQ4LjQ4Ny0uMDQ1LjA2YS4yLjIgMCAwIDAgLjAxLjI0M2wuMDQzLjA1Yy40ODQuNTkzIDEuMzg1IDEuNjkyIDIuOTk1IDEuNjkyIDIuMjAyIDAgMy4zOS0xLjgxMyAzLjM5LTMuNTIgMC0yLjA2OC0xLjIzNC0yLjczNS0yLjQ0LTMuMTE0IiBmaWxsPSIjRUI4QjJEIi8+PHBhdGggZD0iTTQ5LjU0Ljg3MmEuMTk3LjE5NyAwIDAgMC0uMTYzLS4wODVoLS43M2MtLjA4IDAtLjE1LjA0Ny0uMTguMTJsLTQgOS41NDMtMy4xOC05LjUzYS4xOTQuMTk0IDAgMCAwLS4xODUtLjEzM2gtLjc1N2MtLjA2MyAwLS4xMjIuMDMtLjE2LjA4YS4xOS4xOSAwIDAgMC0uMDI2LjE3bDEuNDkgNC41MjgtMi4wNDYgNC44ODVMMzYuNDI2LjkyYS4xOTUuMTk1IDAgMCAwLS4xODYtLjEzM2gtLjc1N2EuMTk3LjE5NyAwIDAgMC0uMTYuMDguMTkuMTkgMCAwIDAtLjAyNy4xN2wzLjk3NCAxMi4wNTVjLjAyNi4wNzYuMDk3LjEzLjE4LjEzMmguMDA3Yy4wOCAwIC4xNS0uMDQ2LjE4LS4xMmwyLjUyLTYuMDAzIDEuOTc2IDUuOTkyYy4wMjYuMDc2LjA5Ny4xMy4xOC4xMzJoLjAwN2MuMDc4IDAgLjE1LS4wNDYuMTgtLjEybDUuMDU3LTEyLjA1MmEuMTkuMTkgMCAwIDAtLjAxOC0uMTgiIGZpbGw9IiMxNUE3NDgiLz48cGF0aCBkPSJNNDcuMDY2IDE3LjA1N2MtLjAxOC0uMDgzLS4wODYtLjE0NC0uMTktLjE1M2EuMTgyLjE4MiAwIDAgMC0uMTc1LjEybC00LjExOCA5Ljg0Ny00LjEwMy05Ljg0N2EuMjA0LjIwNCAwIDAgMC0uMTk0LS4xMi4xOTQuMTk0IDAgMCAwLS4xNzIuMTU0TDM1LjYxIDI5LjEyMmEuMTkuMTkgMCAwIDAgLjE4OC4yMzJoLjcxYy4wOSAwIC4xNy0uMDY0LjE5LS4xNTNsMS44NzYtOS4wOTggMy44MyA5LjE3NmEuMTkyLjE5MiAwIDAgMCAuMzU1LjAwMmwzLjg0Ni05LjE4IDEuODc3IDkuMWEuMTkyLjE5MiAwIDAgMCAuMTg4LjE1NGguNzFhLjE5Mi4xOTIgMCAwIDAgLjE4OC0uMjMybC0yLjUwMi0xMi4wNjUiIGZpbGw9IiNFMTU0ODciLz48cGF0aCBkPSJNMTQuNDE2IDE2LjgyOGMtMy40MTQgMC02LjI5OCAyLjg4Ny02LjI5OCA2LjMwMiAwIDMuNDE2IDIuODg0IDYuMzAyIDYuMjk4IDYuMzAyczYuMjk4LTIuODg2IDYuMjk4LTYuMzAyYzAtMy40MTUtMi44ODQtNi4zMDItNi4yOTgtNi4zMDJ6bTUuMTQ4IDYuMzAyYzAgMi44MS0yLjM1OCA1LjE4Ny01LjE0OCA1LjE4Ny0yLjc5IDAtNS4xNDgtMi4zNzYtNS4xNDgtNS4xODcgMC0yLjgxIDIuMzU3LTUuMTg2IDUuMTQ4LTUuMTg2IDIuNzkgMCA1LjE0OCAyLjM3NSA1LjE0OCA1LjE4NnoiIGZpbGw9IiMzQjZDQTciLz48cGF0aCBkPSJNMjguNDQ1IDE2LjgyOGMtMy40MTUgMC02LjMgMi44ODctNi4zIDYuMzAyIDAgMy40MTYgMi44ODUgNi4zMDIgNi4zIDYuMzAyIDMuNDEzIDAgNi4yOTctMi44ODYgNi4yOTctNi4zMDIgMC0zLjQxNS0yLjg4NC02LjMwMi02LjI5Ny02LjMwMnptMCAxLjExNmMyLjc5IDAgNS4xNDcgMi4zNzUgNS4xNDcgNS4xODYgMCAyLjgxLTIuMzU4IDUuMTg3LTUuMTQ3IDUuMTg3LTIuNzkyIDAtNS4xNS0yLjM3Ni01LjE1LTUuMTg3IDAtMi44MSAyLjM1OC01LjE4NiA1LjE1LTUuMTg2eiIgZmlsbD0iIzkyNUU5OCIvPjxwYXRoIGQ9Ik03LjI3NyAyOC45NjVsLTMuNjIyLTUuMjljMS45NjUtLjExNyAzLjE3OC0xLjM2OCAzLjE3OC0zLjI5NyAwLTEuMTg3LS40NC0yLjEyNS0xLjI2Ny0yLjcxNC0uODctLjYzNy0xLjg5My0uNjM3LTIuNzk3LS42MzdIMS4zMDdhLjIwOC4yMDggMCAwIDAtLjIwNi4yMXYxMS44NDZjMCAuMTE2LjA5My4yMS4yMDYuMjFoLjc0NmEuMjA4LjIwOCAwIDAgMCAuMjA3LS4yMXYtNS40aC4wNmwzLjc2MiA1LjUyYy4wMzguMDU2LjEwMi4wOS4xNy4wOWguODU2YS4yMDcuMjA3IDAgMCAwIC4xNy0uMzI4em0tMS42MDQtOC42MmMwIC43LS4yNzQgMS4zMjQtLjc1MyAxLjcxNC0uNTI2LjQ2LTEuMTguNDk4LTEuOTE4LjQ5OGgtLjc0VjE4LjE1aC42NGMuNTcgMCAxLjE2OC4wMiAxLjY1LjI1LjgyNi4zNyAxLjEyIDEuMjUgMS4xMiAxLjk0NnoiIGZpbGw9IiM0REMwRTMiLz48L2c+PC9zdmc+';
  }
  else {
    avatar64 = await getImageBase64(room.avatarUrl);
  }

  let timeElapsed = getReadableTime(room.getMinuteElapsed());
  let elapsedString = '已播: ';

  if (timeElapsed.days) {
    elapsedString += `${timeElapsed.days}天`;
  }
  if (timeElapsed.hours) {
    elapsedString += `${timeElapsed.hours}小时`;
  }
  elapsedString+= `${timeElapsed.minutes}分钟`;

  if (room.getMinuteElapsed()< 3) {
    elapsedString = '刚刚开播';
  }

  elapsedString += `\n当前观众: ${room.online}`;

  let options = {
    type: 'basic',
    iconUrl: avatar64,
    title: room.title,
    message: elapsedString
  };

  if ('image' in Notification.prototype) {
    // Image is supported (before chrome 59)
    const snapshot64 = await getImageBase64(room.snapshotUrl);
    options.imageUrl = snapshot64;
    options.type = 'image';
  }

  chrome.notifications.create(room.getRoomKey(), options,(notificationId)=>{
    // console.log('Notification: ', room.title);
  });
};


export const showScheduleNotifaction = async (schedules) => {
  const items = schedules.map(s => {
    const scheduleTime = parseScheduleTime(s.time);
    let { startHour, startMinute } = scheduleTime.data;

    return {
      title: `${startHour}:${startMinute}`,
      message: s.description
    };
  });

  const options = {
    type: 'list',
    iconUrl: 'images/gako.png',
    title: '番组表更新',
    message: 'null',
    items: items
  };
  chrome.notifications.create('scheduleNotifactionKey', options, notificationId =>{
    // log
  });
};
