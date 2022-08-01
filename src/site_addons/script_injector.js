import {
  SUPPORTTED_SITES,
  DOM_DATASET_ID,
} from '../common/constants';

(() => {
  const injectScript = SUPPORTTED_SITES[location.host];
  if (!injectScript) {
    return;
  }

  const dataTag = document.createElement('div');
  dataTag.id = DOM_DATASET_ID;
  dataTag.dataset.extensionId = chrome.runtime.id;
  document.body.appendChild(dataTag);

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(injectScript);
  (document.head || document.documentElement).appendChild(script);
})();
