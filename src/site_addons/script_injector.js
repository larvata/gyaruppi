import { DOM_DATASET_ID } from '../common/constants';
import PROVIDERS from '../common/providers';

(() => {
  const provider = PROVIDERS.find((p) => new URL(p.content_scripts).hostname === location.host);

  if (!provider || !provider.name) {
    // when the provider is disabled in the constants.PROVIDER
    // provide.name will be undefined
    return;
  }

  const dataTag = document.createElement('div');
  dataTag.id = DOM_DATASET_ID;
  dataTag.dataset.extensionId = chrome.runtime.id;
  document.body.appendChild(dataTag);

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(`site_addons/${provider.name}_inject.js`);
  (document.head || document.documentElement).appendChild(script);
})();
