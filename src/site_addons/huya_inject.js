// eslint-disable-next-line max-classes-per-file
import {
  PROVIDER,
} from '../common/constants';

import RoomSubscriber from '../common/room-subscriber';

class HuyaRoomSubscriber extends RoomSubscriber {
  constructor(options) {
    super({
      provider: PROVIDER.HUYA,
      id: window.hyPlayerConfig.stream.data[0].gameLiveInfo.profileRoom,
      ...options,
    });
  }

  setup() {
    const container = document.querySelector('#J_roomTitle');
    container.prepend(this.subscribeIcon);
    container.prepend(this.unsubscribeIcon);
  }
}

const subscriber = new HuyaRoomSubscriber();
