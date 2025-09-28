// eslint-disable-next-line max-classes-per-file
import {
  PROVIDER,
} from '../common/constants';

import RoomSubscriber from '../common/room-subscriber';

class __CUSTOM__Subscriber extends RoomSubscriber {
  constructor(options) {
    super({
      provider: PROVIDER.__CUSTOM__,
      id: window.room_id || window.apm_room_id,
      ...options,
    });
  }

  setup() {
    const deadline = new Date().getTime() + (1000 * 30);

    // TODO extract logic to long check function
    this.checker = setInterval(() => {
      const count = document.querySelector('.Title-header').childElementCount;
      if (count < 2) {
        const container = document.querySelector('.Title-header');
        container.prepend(this.subscribeIcon);
        container.prepend(this.unsubscribeIcon);
      }

      if (new Date().getTime() > deadline) {
        clearInterval(this.checker);
        console.log('__CUSTOM__RoomSubscriber setup done');
      }
    }, 200);
  }
}

const subscriber = new __CUSTOM__RoomSubscriber();
