// eslint-disable-next-line max-classes-per-file
import {
  PROVIDER,
} from '../common/constants';
import { waitFor } from '../common/utils';

import RoomSubscriber from '../common/room-subscriber';

const getContainer = () => {
  return document.querySelector('[data-e2e="live-room-nickname"]')
    && document.querySelector('[data-e2e="live-room-nickname"]').parentElement;
};

class DouyinRoomSubscriber extends RoomSubscriber {
  constructor(options) {
    super({
      provider: PROVIDER.DOUYIN,
      id: window.__STORE__.roomStore.roomInfo.roomId,
      rid: window.__STORE__.layoutStore.pathname.slice(1),
      ...options,
    });
  }

  setup() {
    const container = getContainer();
    container.after(this.subscribeIcon);
    container.after(this.unsubscribeIcon);
    console.log('DouyinRoomSubscriber setup done');
  }
}

waitFor(
  () => (
    getContainer()
  ),
  () => {
    const subscriber = new DouyinRoomSubscriber();
  },
);

// const subscriber = new DouyinRoomSubscriber();
