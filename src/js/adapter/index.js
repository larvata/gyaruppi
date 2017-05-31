import zhanqi from './zhanqi';
import bilibili from './bilibili';
import panda from './panda';
import douyu from './douyu';
import { PROVIDER } from '../common';

export function fetchRoomInfo(room){
  let adapter = null;

  if (room.provider === PROVIDER.ZHANQI) {
    // console.log('provider matched ');
    adapter = zhanqi;
  }
  else if(room.provider === PROVIDER.BILIBILI) {
    adapter = bilibili;
  }
  else if(room.provider === PROVIDER.PANDA) {
    adapter = panda;
  }
  else if(room.provider === PROVIDER.DOUYU){
    adapter = douyu;
  }

  if (adapter === null) {
    throw new Error('Can\'t find adapter for ' + room.provider);
  }
  // console.log(adapter);
  return adapter.fetchRoomInfo(room);

}