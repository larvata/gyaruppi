// eslint-disable-next-line max-classes-per-file
import {
  PROVIDER,
} from '../common/constants';
import { waitFor } from '../common/utils';

import RoomSubscriber from '../common/room-subscriber';

function getRoomId() {
  return (
    window.__INITIAL_STATE__
      && window.__INITIAL_STATE__.authorInfoById
      && window.__INITIAL_STATE__.authorInfoById.principalId
  ) || (
    window.__INITIAL_STATE__
      && window.__INITIAL_STATE__.liveroom.playList
      && window.__INITIAL_STATE__.liveroom.playList[window.__INITIAL_STATE__.liveroom.activeIndex].author.id
  );
}

function getContainer() {
  return document.querySelector('.user-info-name')
    || document.querySelector('.info-group');
}

class KuaishouRoomSubscriber extends RoomSubscriber {
  constructor(options) {
    super({
      provider: PROVIDER.KUAISHOU,
      id: getRoomId(),
      ...options,
    });
  }

  setup() {
    const container = getContainer();
    container.before(this.subscribeIcon);
    container.before(this.unsubscribeIcon);
    console.log('KuaishouRoomSubscriber setup done');
  }
}

if (window.location.href.includes('/profile/')) {
  // for user profile page
  waitFor(
    () => getRoomId() && getContainer(),
    () => {
      new KuaishouRoomSubscriber({
        id: getRoomId(),
      });
    },
  );
} else {
  // for live page
  navigation.addEventListener('navigate', (e) => {
    new KuaishouRoomSubscriber({
      id: getRoomId(),
    });
  });
}
