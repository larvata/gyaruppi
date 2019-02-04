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
    avatar64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iLTQgLTQgNjQgNjQiIGlkPSJsb2dvLXNpdGUtc3F1YXJlIiB5PSIyODAyIj48dGl0bGU+c2lkZSBuYXYgTE9HTzwvdGl0bGU+PHJlY3QgZmlsbD0iYmxhY2siIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1LDEzKSI+PHBhdGggZD0iTTE4LjcxMy44MjVoLS43NDhhLjIxLjIxIDAgMCAwLS4yMDguMjF2NC44MzJIMTEuMDNWMS4wMzVhLjIxLjIxIDAgMCAwLS4yMDctLjIxaC0uNzVhLjIxLjIxIDAgMCAwLS4yMDcuMjF2MTEuODgyYzAgLjExNi4wOTMuMjEuMjA4LjIxaC43NWEuMjEuMjEgMCAwIDAgLjIwNi0uMjF2LTUuOTJoNi43Mjd2NS45MmMwIC4xMTYuMDk0LjIxLjIwOC4yMWguNzQ4YS4yMS4yMSAwIDAgMCAuMjA4LS4yMVYxLjAzNWEuMjEuMjEgMCAwIDAtLjIwNy0uMjEiIGZpbGw9IiNGRkRBMUEiLz48cGF0aCBkPSJNMjcuNzk1LjY2Yy0zLjQxNCAwLTYuMyAyLjg4Ni02LjMgNi4zMDIgMCAzLjQxNiAyLjg4NiA2LjMgNi4zIDYuMyAzLjQxNCAwIDYuMjk4LTIuODg0IDYuMjk4LTYuM1MzMS4yMS42NiAyNy43OTUuNjZ6bTUuMTQ4IDYuMzAyYzAgMi44MS0yLjM1OCA1LjE4Ni01LjE0OCA1LjE4Ni0yLjc5IDAtNS4xNDgtMi4zNzUtNS4xNDgtNS4xODYgMC0yLjgxMiAyLjM1Ny01LjE4NiA1LjE0OC01LjE4NiAyLjc5IDAgNS4xNDggMi4zNzQgNS4xNDggNS4xODZ6IiBmaWxsPSIjOUVDODUwIi8+PHBhdGggZD0iTTQuNjkgNi41M2wtLjk0NS0uMjk4QzIuNjMzIDUuODc1IDIuMDcgNS4xODIgMi4wNyA0LjE2OGMwLTEuMTE2LjY2My0yLjMxNyAyLjEyLTIuMzE3LjU2IDAgMS4wNi4wNjcgMS45NDIuODk3bC4wNS4wNDhjLjA3LjA3Mi4yMDUuMDcuMjcuMDAybC41Mi0uNTA1YS4xOTUuMTk1IDAgMCAwIC4wMDgtLjI5bC0uMDYtLjA1NkM2LjUyMyAxLjU2IDUuNjk3Ljc2IDQuMTkuNzYgMi4zNjQuNzYuOTg3IDIuMjI0Ljk4NyA0LjE2N2MwIDEuNjIuODU0IDIuNjkgMi41MzcgMy4xOGwuNjg0LjIwNGMuODU3LjI1MiAxLjg0LjcxOCAxLjg0IDIuMDkzIDAgLjk0LS42MjYgMi40MjgtMi4zMDcgMi40MjgtMS4wNjMgMC0xLjc3LS44Ni0yLjE1LTEuMzJsLS4wODMtLjEwMmMtLjA3LS4wOS0uMjM0LS4wODQtLjI5LS4wMTZsLS40OC40ODctLjA0NS4wNmEuMi4yIDAgMCAwIC4wMS4yNDNsLjA0My4wNWMuNDg0LjU5MyAxLjM4NSAxLjY5MiAyLjk5NSAxLjY5MiAyLjIwMiAwIDMuMzktMS44MTMgMy4zOS0zLjUyIDAtMi4wNjgtMS4yMzQtMi43MzUtMi40NC0zLjExNCIgZmlsbD0iI0VCOEIyRCIvPjxwYXRoIGQ9Ik00OS41NC44NzJhLjE5Ny4xOTcgMCAwIDAtLjE2My0uMDg1aC0uNzNjLS4wOCAwLS4xNS4wNDctLjE4LjEybC00IDkuNTQzLTMuMTgtOS41M2EuMTk0LjE5NCAwIDAgMC0uMTg1LS4xMzNoLS43NTdjLS4wNjMgMC0uMTIyLjAzLS4xNi4wOGEuMTkuMTkgMCAwIDAtLjAyNi4xN2wxLjQ5IDQuNTI4LTIuMDQ2IDQuODg1TDM2LjQyNi45MmEuMTk1LjE5NSAwIDAgMC0uMTg2LS4xMzNoLS43NTdhLjE5Ny4xOTcgMCAwIDAtLjE2LjA4LjE5LjE5IDAgMCAwLS4wMjcuMTdsMy45NzQgMTIuMDU1Yy4wMjYuMDc2LjA5Ny4xMy4xOC4xMzJoLjAwN2MuMDggMCAuMTUtLjA0Ni4xOC0uMTJsMi41Mi02LjAwMyAxLjk3NiA1Ljk5MmMuMDI2LjA3Ni4wOTcuMTMuMTguMTMyaC4wMDdjLjA3OCAwIC4xNS0uMDQ2LjE4LS4xMmw1LjA1Ny0xMi4wNTJhLjE5LjE5IDAgMCAwLS4wMTgtLjE4IiBmaWxsPSIjMTVBNzQ4Ii8+PHBhdGggZD0iTTQ3LjA2NiAxNy4wNTdjLS4wMTgtLjA4My0uMDg2LS4xNDQtLjE5LS4xNTNhLjE4Mi4xODIgMCAwIDAtLjE3NS4xMmwtNC4xMTggOS44NDctNC4xMDMtOS44NDdhLjIwNC4yMDQgMCAwIDAtLjE5NC0uMTIuMTk0LjE5NCAwIDAgMC0uMTcyLjE1NEwzNS42MSAyOS4xMjJhLjE5LjE5IDAgMCAwIC4xODguMjMyaC43MWMuMDkgMCAuMTctLjA2NC4xOS0uMTUzbDEuODc2LTkuMDk4IDMuODMgOS4xNzZhLjE5Mi4xOTIgMCAwIDAgLjM1NS4wMDJsMy44NDYtOS4xOCAxLjg3NyA5LjFhLjE5Mi4xOTIgMCAwIDAgLjE4OC4xNTRoLjcxYS4xOTIuMTkyIDAgMCAwIC4xODgtLjIzMmwtMi41MDItMTIuMDY1IiBmaWxsPSIjRTE1NDg3Ii8+PHBhdGggZD0iTTE0LjQxNiAxNi44MjhjLTMuNDE0IDAtNi4yOTggMi44ODctNi4yOTggNi4zMDIgMCAzLjQxNiAyLjg4NCA2LjMwMiA2LjI5OCA2LjMwMnM2LjI5OC0yLjg4NiA2LjI5OC02LjMwMmMwLTMuNDE1LTIuODg0LTYuMzAyLTYuMjk4LTYuMzAyem01LjE0OCA2LjMwMmMwIDIuODEtMi4zNTggNS4xODctNS4xNDggNS4xODctMi43OSAwLTUuMTQ4LTIuMzc2LTUuMTQ4LTUuMTg3IDAtMi44MSAyLjM1Ny01LjE4NiA1LjE0OC01LjE4NiAyLjc5IDAgNS4xNDggMi4zNzUgNS4xNDggNS4xODZ6IiBmaWxsPSIjM0I2Q0E3Ii8+PHBhdGggZD0iTTI4LjQ0NSAxNi44MjhjLTMuNDE1IDAtNi4zIDIuODg3LTYuMyA2LjMwMiAwIDMuNDE2IDIuODg1IDYuMzAyIDYuMyA2LjMwMiAzLjQxMyAwIDYuMjk3LTIuODg2IDYuMjk3LTYuMzAyIDAtMy40MTUtMi44ODQtNi4zMDItNi4yOTctNi4zMDJ6bTAgMS4xMTZjMi43OSAwIDUuMTQ3IDIuMzc1IDUuMTQ3IDUuMTg2IDAgMi44MS0yLjM1OCA1LjE4Ny01LjE0NyA1LjE4Ny0yLjc5MiAwLTUuMTUtMi4zNzYtNS4xNS01LjE4NyAwLTIuODEgMi4zNTgtNS4xODYgNS4xNS01LjE4NnoiIGZpbGw9IiM5MjVFOTgiLz48cGF0aCBkPSJNNy4yNzcgMjguOTY1bC0zLjYyMi01LjI5YzEuOTY1LS4xMTcgMy4xNzgtMS4zNjggMy4xNzgtMy4yOTcgMC0xLjE4Ny0uNDQtMi4xMjUtMS4yNjctMi43MTQtLjg3LS42MzctMS44OTMtLjYzNy0yLjc5Ny0uNjM3SDEuMzA3YS4yMDguMjA4IDAgMCAwLS4yMDYuMjF2MTEuODQ2YzAgLjExNi4wOTMuMjEuMjA2LjIxaC43NDZhLjIwOC4yMDggMCAwIDAgLjIwNy0uMjF2LTUuNGguMDZsMy43NjIgNS41MmMuMDM4LjA1Ni4xMDIuMDkuMTcuMDloLjg1NmEuMjA3LjIwNyAwIDAgMCAuMTctLjMyOHptLTEuNjA0LTguNjJjMCAuNy0uMjc0IDEuMzI0LS43NTMgMS43MTQtLjUyNi40Ni0xLjE4LjQ5OC0xLjkxOC40OThoLS43NFYxOC4xNWguNjRjLjU3IDAgMS4xNjguMDIgMS42NS4yNS44MjYuMzcgMS4xMiAxLjI1IDEuMTIgMS45NDZ6IiBmaWxsPSIjNERDMEUzIi8+PC9nPjwvc3ZnPg==';
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

  elapsedString += `\n当前观众: ${room.online || '-'}`;

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
