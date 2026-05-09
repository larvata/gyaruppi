// eslint-disable-next-line max-classes-per-file
import {
  PROVIDER,
} from '../common/constants';

import RoomSubscriber from '../common/room-subscriber';

class DouyuRoomSubscriber extends RoomSubscriber {
  constructor(options) {
    super({
      provider: PROVIDER.DOUYU,
      id: (window.$ROOM && window.$ROOM.room_id),
      ...options,
    });
  }

  setup() {
    const deadline = new Date().getTime() + (1000 * 15);

    // TODO extract logic to long check function
    this.checker = setInterval(() => {
      // both suppor orignal and beta UI
      const container = document.querySelector('.Title-header')
        || document.querySelector('[class*="baseInfoContainer"] [class*="roomName"]');

      if (container) {
        container.prepend(this.subscribeIcon);
        container.prepend(this.unsubscribeIcon);
      }

      if (new Date().getTime() > deadline) {
        // douyu re-render its UI, we need to re-apply the subscribe icon
        // use timeout mechenism to ensure the icon is added
        clearInterval(this.checker);
        console.log('DouyuRoomSubscriber setup done');
      }
    }, 200);
  }
}

const subscriber = new DouyuRoomSubscriber();
