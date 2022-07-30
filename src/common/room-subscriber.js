import {
  subscribeIconBase64,
  unsubscribeIconBase64,
} from './constants';

export default class RoomSubscriber {
  constructor(options) {
    if (!this.validate()) {
      throw new Error('RoomSubscriber options is invalid.');
    }

    this.options = options;
    this.options.extensionId = document.querySelector('#gyaruppi-data').dataset.extensionId;
    this.init();

    chrome.runtime.sendMessage(
      this.options.extensionId,
      {
        event: 'request_room_info',
        provider: this.options.provider,
        id: this.options.id,
        title: this.options.title,
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
    this.subscribeIcon.classList.add('gyaruppi-bell');
    this.unsubscribeIcon = this.subscribeIcon.cloneNode();

    this.subscribeIcon.classList.add('unsubscribed');
    this.subscribeIcon.src = unsubscribeIconBase64;
    this.subscribeIcon.addEventListener('click', () => {
      this.subscribe(true);
    });

    this.unsubscribeIcon.classList.add('subscribed');
    this.unsubscribeIcon.src = subscribeIconBase64;
    this.unsubscribeIcon.addEventListener('click', () => {
      this.subscribe(false);
    });
  }

  subscribe(isSubscribe) {
    chrome.runtime.sendMessage(
      this.options.extensionId,
      {
        event: 'subscribe_room',
        provider: this.options.provider,
        id: this.options.id,
        subscribe: isSubscribe,
      },
      (response) => {
        this.updateIcon({ subscribed: isSubscribe });
      },
    );
  }

  updateIcon(roomInfo) {
    // TODO set icon visible status

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
