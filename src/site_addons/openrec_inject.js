// eslint-disable-next-line max-classes-per-file
import {
  PROVIDER,
} from '../common/constants';
import { waitFor } from '../common/utils';

import RoomSubscriber from '../common/room-subscriber';

function getUserIdFromUrl() {
  const parts = location.pathname.split('/');
  if (parts[1] === 'user') {
    return parts[2];
  }
  return null;
}

function getUserIdFromScript() {
  let result = null;
  [...document.querySelectorAll('script')].some((el) => {
    const match = el.innerText.match(/userKey":"([^"]*)"/);
    if (!match) {
      return false;
    }
    console.log('match:', match);
    result = match[1];
    return true;
  });
  return result;
}

class OpenRecRoomSubscriber extends RoomSubscriber {
  constructor(options) {
    // get room id
    const roomId = getUserIdFromUrl() || getUserIdFromScript();

    super({
      provider: PROVIDER.OPENREC,
      id: roomId,
      ...options,
    });

    if (roomId) {
      console.log('Failed to get Room Id.');
      this.success = true;
    } else {
      this.success = false;
    }
  }

  setup() {
    if (!this.success) {
      return;
    }

    const container = document.querySelector('[class^="UserName__Wrapper"] [class^="UserName__Name"]')
      .parentElement
      .parentElement;
    container.before(this.subscribeIcon);
    container.before(this.unsubscribeIcon);
    console.log('OpenRecRoomSubscriber setup done');
  }
}

waitFor(
  () => document.querySelector('[class^="UserName__Wrapper"] [class^="UserName__Name"]'),
  () => {
    const subscriber = new OpenRecRoomSubscriber();
  },
);
