// eslint-disable-next-line max-classes-per-file
import {
  PROVIDER,
} from '../common/constants';
import { waitFor } from '../common/utils';

import RoomSubscriber from '../common/room-subscriber';

class BilibiliRoomSubscriber extends RoomSubscriber {
  constructor(options) {
    super({
      provider: PROVIDER.BILIBILI,
      id: window.BilibiliLive.ROOMID,
      ...options,
    });
  }

  setup() {
    const container = document.querySelector('.live-title');
    container.before(this.subscribeIcon);
    container.before(this.unsubscribeIcon);
    console.log('BilibiliRoomSubscriber setup done');
  }
}

waitFor(
  () => window.BilibiliLive && window.BilibiliLive.ROOMID,
  () => {
    const subscriber = new BilibiliRoomSubscriber();
  },
);
