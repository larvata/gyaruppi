// eslint-disable-next-line max-classes-per-file
import {
  PROVIDER,
} from '../common/constants';
import { waitFor } from '../common/utils';

import RoomSubscriber from '../common/room-subscriber';

class ShowroomRoomSubscriber extends RoomSubscriber {
  constructor(options) {
    super({
      provider: PROVIDER.SHOWROOM,
      id: window.__NUXT__.pinia.main.roomProfile.room_id,
      ...options,
    });
  }

  setup() {
    const container = document.querySelector('.room-name');
    container.before(this.subscribeIcon);
    container.before(this.unsubscribeIcon);
    console.log('ShowroomRoomSubscriber setup done');
  }
}

waitFor(
  () => window.__NUXT__
    && window.__NUXT__.state
    && window.__NUXT__.pinia.main.roomProfile.room_id,
  () => {
    const subscriber = new ShowroomRoomSubscriber();
  },
);
