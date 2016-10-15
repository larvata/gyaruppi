import 'babel-polyfill';
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

// reset badge
const { ApplicationManager } = chrome.extension.getBackgroundPage();
ApplicationManager.setBadge('');