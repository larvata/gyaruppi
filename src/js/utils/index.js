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
    console.log('Notification: ', room.title);
  });
};
