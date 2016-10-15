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

export const showRoomNotification=async (room)=>{
  let avatar64 = await getImageBase64(room.avatarUrl);
  let snapshot64 = await getImageBase64(room.snapshotUrl);

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

  let options = {
    type: 'image',
    iconUrl: avatar64,
    title: room.title,
    imageUrl: snapshot64,
    message: elapsedString
  };

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
