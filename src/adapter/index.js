import zhanqi from './zhanqi';
import bilibili from './bilibili';
import douyu from './douyu';
import showroom from './showroom';
import { PROVIDER } from '../common/constants';

// eslint-disable-next-line import/prefer-default-export
export function findAdapter(room) {
  if (room.provider === PROVIDER.ZHANQI) {
    return zhanqi;
  }

  if (room.provider === PROVIDER.BILIBILI) {
    return bilibili;
  }

  if (room.provider === PROVIDER.DOUYU) {
    return douyu;
  }

  if (room.provider === PROVIDER.SHOWROOM) {
    return showroom;
  }

  throw new Error(`Can't find adapter for ${room.provider}`);
}
