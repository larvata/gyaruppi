import '../css/normalize.css';
import '../css/pure-min.css';
import '../css/popup.css';

import React from 'react';
import Popup from './components/Popup';
import { render } from 'react-dom';

render(
  <Popup/>,
  window.document.getElementById('app-container')
);

const { ApplicationManager } = chrome.extension.getBackgroundPage();

// calculate the window hight
let allRoomsInfo = ApplicationManager.getCustomRooms();
let allSchedules = ApplicationManager.getAllSchedules();

const scheduleCount = allSchedules.length;
const roomInfoCount = allRoomsInfo.filter(r=>r.title && r.enabled).length;

let height = 22 * 2;
height += scheduleCount * 41;
height += roomInfoCount * 30;
document.documentElement.style['height'] = (height + 'px');

// reset badge
ApplicationManager.setBadge('');