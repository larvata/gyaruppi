const supportedSites = {
  'www.zhanqi.tv': 'site_addons/zhanqi_inject.js',
  'live.bilibili.com': 'site_addons/bilibili_inject.js',
  'www.panda.tv': 'site_addons/panda_inject.js',
  'www.douyu.com': 'site_addons/douyu_inject.js',
  'www.showroom-live.com': 'site_addons/showroom_inject.js',
};

(() => {
  const injectScript = supportedSites[location.host];
  if (!injectScript) {
    return;
  }

  const dataTag = document.createElement('div');
  dataTag.id = 'gyaruppi-data';
  dataTag.dataset.extensionId = chrome.runtime.id;
  document.body.appendChild(dataTag);

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(injectScript);
  (document.head || document.documentElement).appendChild(script);
})();
