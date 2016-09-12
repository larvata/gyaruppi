import '../css/normalize.css';
import '../css/pure-min.css';
import '../css/popup.css';
// import Greeting from "./popup/greeting_component";

import Popup from './components/Popup';
import React from "react";
import { render } from "react-dom";

render(
  <Popup/>,
  window.document.getElementById("app-container")
);
