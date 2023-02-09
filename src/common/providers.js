const { PROVIDER } = require('./constants');

module.exports = [{
  name: PROVIDER.ZHANQI,
  host_permissions: 'https://apis.zhanqi.tv/',
  content_scripts: 'https://www.zhanqi.tv/*',
}, {
  name: PROVIDER.DOUYU,
  host_permissions: 'https://www.douyu.com/',
  content_scripts: 'https://www.douyu.com/*',
}, {
  name: PROVIDER.BILIBILI,
  host_permissions: 'https://api.live.bilibili.com/',
  content_scripts: 'https://live.bilibili.com/*',
}, {
  name: PROVIDER.SHOWROOM,
  host_permissions: 'https://www.showroom-live.com/',
  content_scripts: 'https://www.showroom-live.com/*',
}, {
  name: PROVIDER.OPENREC,
  host_permissions: 'https://www.openrec.tv/',
  content_scripts: 'https://www.openrec.tv/*',
}, {
  name: PROVIDER.TWITCASTING,
  host_permissions: 'https://*.twitcasting.tv/*',
  content_scripts: 'https://twitcasting.tv/*',
}];
