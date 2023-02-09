// eslint-disable-next-line max-classes-per-file
import {
  PROVIDER,
} from '../common/constants';
import { waitFor } from '../common/utils';

import RoomSubscriber from '../common/room-subscriber';

class TwitCastingRoomSubscriber extends RoomSubscriber {
  constructor(options) {
    const roomId = document.querySelector('meta[name="twitter:creator"]').getAttribute('content');
    super({
      provider: PROVIDER.TWITCASTING,
      id: roomId,
      ...options,
    });
  }

  setup() {
    const container = document.querySelector('.tw-user-nav-profile');
    container.before(this.subscribeIcon);
    container.before(this.unsubscribeIcon);
    console.log('TwitCastingRoomSubscriber setup done');
  }
}

waitFor(
  () => document.querySelector('.tw-user-nav-profile'),
  () => {
    const subscriber = new TwitCastingRoomSubscriber();
  },
);
