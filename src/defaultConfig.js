export default {
  API_SERVER: 'https://live.haruppi.top/api/miichan',
  // API_SERVER: 'http://local.larvata.me:8134/api/miichan',

  MIICHAN_INTERVAL: 1000 * 60 * 15,
  ROOM_INTERVAL: 1000 * 60 * 5,

  initial: {
    settings: {
      showRoomNotification: true,
      showScheduleNotifaction: true,
      allowInjectSubscribeButtonScript: true,
      allowInjectRemoveAdsScript: false
    }
  }
};
