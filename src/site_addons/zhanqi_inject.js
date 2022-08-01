// eslint-disable-next-line max-classes-per-file
import {
  PROVIDER,
} from '../common/constants';

import RoomSubscriber from '../common/room-subscriber';

class ZhanqiRoomSubscriber extends RoomSubscriber {
  constructor(options) {
    super({
      provider: PROVIDER.ZHANQI,
      id: +window.oPageConfig.oRoom.id,
      ...options,
    });
  }

  setup() {
    const container = document.querySelector('.room-name');
    this.subscribeIcon.style.float = 'left';
    this.unsubscribeIcon.style.float = 'left';
    container.before(this.subscribeIcon);
    container.before(this.unsubscribeIcon);
    console.log('ZhanqiRoomSubscriber setup done');
  }
}

const subscriber = new ZhanqiRoomSubscriber();
