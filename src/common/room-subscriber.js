import {
  subscribeIconBase64,
  unsubscribeIconBase64,
  DOM_DATASET_ID,
  EVENTS,
} from './constants';

export default class RoomSubscriber {
  constructor(options) {
    if (!this.validate()) {
      throw new Error('RoomSubscriber options is invalid.');
    }

    this.options = options;
    this.extensionId = document.querySelector(`#${DOM_DATASET_ID}`).dataset.extensionId;
    this.init();

    chrome.runtime.sendMessage(
      this.extensionId,
      {
        event: EVENTS.REQUEST_ROOMS_INFO,
        // provider: this.options.provider,
        // id: this.options.id,
        // title: this.options.title,
        ...this.options,
      },
      (response) => {
        this.setup(response);
        this.updateIcon(response);
      },
    );
  }

  init() {
    this.subscribeIcon = document.createElement('img');
    this.subscribeIcon.style.width = '24px';
    this.subscribeIcon.style.cursor = 'pointer';
    this.subscribeIcon.style.display = 'none';
    this.subscribeIcon.style.paddingRight = '5px';
    this.subscribeIcon.style.userSelect = 'all';
    this.subscribeIcon.style.pointerEvents = 'all';
    this.subscribeIcon.classList.add('gyaruppi-bell');
    this.unsubscribeIcon = this.subscribeIcon.cloneNode();

    this.subscribeIcon.classList.add('unsubscribed');
    this.subscribeIcon.src = unsubscribeIconBase64;
    this.subscribeIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      this.subscribe(true);
    });

    this.unsubscribeIcon.classList.add('subscribed');
    this.unsubscribeIcon.src = subscribeIconBase64;
    this.unsubscribeIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      this.subscribe(false);
    });
  }

  subscribe(isSubscribe) {
    chrome.runtime.sendMessage(
      this.extensionId,
      {
        event: EVENTS.SUBSCRIBE_ROOM,
        // provider: this.options.provider,
        // id: this.options.id,
        subscribe: isSubscribe,
        ...this.options,
      },
      (response) => {
        this.updateIcon({ subscribed: isSubscribe });
      },
    );
  }

  updateIcon(roomInfo) {
    if (roomInfo.subscribed) {
      this.subscribeIcon.style.display = 'none';
      this.unsubscribeIcon.style.display = 'initial';
    } else {
      this.subscribeIcon.style.display = 'initial';
      this.unsubscribeIcon.style.display = 'none';
    }
  }

  setup() {
    throw new Error('method setup() should be implemented.');
  }

  validate() {
    // TODO validate necessary implements
    return true;
  }
}
