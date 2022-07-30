// eslint-disable-next-line max-classes-per-file
import {
  PROVIDER,
} from '../common/constants';

import RoomSubscriber from '../common/room-subscriber';

class ShowroomRoomSubscriber extends RoomSubscriber {
  constructor(options) {
    super({
      provider: PROVIDER.SHOWROOM,
      id: window.__NUXT__.state.roomId,
      title: window.__NUXT__.state.roomName,
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

const subscriber = new ShowroomRoomSubscriber();
