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
    const container = document.querySelector('.room-owner-username')
      || document.querySelector('.live-title > div > div');
    container.prepend(this.subscribeIcon);
    container.prepend(this.unsubscribeIcon);
    console.log('BilibiliRoomSubscriber setup done');
  }
}

waitFor(
  () => (
    window.BilibiliLive
      && window.BilibiliLive.ROOMID
      && document.querySelector('.room-owner-username')
  ),
  () => {
    const subscriber = new BilibiliRoomSubscriber();
  },
);
