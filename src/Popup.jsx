/* eslint-disable
  jsx-a11y/click-events-have-key-events,
  jsx-a11y/no-static-element-interactions,
  jsx-a11y/anchor-is-valid
*/

import { createRoot } from 'react-dom/client';
import {
  ROOM_STATUS,
  PROVIDER,
  EVENTS,
} from './common/constants';

function onLinkClick(href) {
  if (!href) {
    return;
  }
  chrome.tabs.create({ url: href });
}

function Link(props) {
  const { href } = props;
  return (
    <a onClick={() => onLinkClick(href)} { ...props } />
  );
}

function Footer(props) {
  const onToggle = () => {
    const toggleBtn = document.querySelector('.btn-toggle-notification');
    chrome.runtime.sendMessage({ event: EVENTS.TOGGLE_NOTIFICATION }, (enabled) => {
      if (enabled) {
        toggleBtn.classList.remove('disabled');
      } else {
        toggleBtn.classList.add('disabled');
      }
    });
  };

  return (
    <div className="footer">
      <div className="grid">
        <div className={`round-toggle-button btn-toggle-notification ${props.initialEnabled ? '' : ' disabled'}`} onClick={onToggle}>
          <div className="button" />
        </div>
      </div>
      <div className="grid">
        <div>
        {chrome.runtime.getManifest().version}
        </div>
        <span>
        </span>
        <Link href={chrome.i18n.getMessage('feedback_url')}>
          {chrome.i18n.getMessage('feedback_text')}
        </Link>
      </div>
      <style jsx="true">
        {`
.footer {
  text-align: right;
  padding: 5px 10px 10px 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.grid {
  display: inline-block;
}

      // @font-face {
      //   font-family: 'Inter';
      //   font-style:  normal;
      //   font-weight: 700;
      //   font-display: swap;
      //   src: url("Inter-Bold.woff2") format("woff2");
      // }

.round-toggle-button {
  cursor: pointer;
  width: 48px;
  height: 20px;
  border-radius: 10px;
  background: #337ab7;
  transition: background .3s;
  position: relative;
}
.round-toggle-button:hover {
  background: #265a88;
}
.round-toggle-button::before {
  width: 24px;
  height: 100%;
  margin: 0 5px;
  font-family: Inter;
  font-style: normal;
  font-weight: 700;
  font-size: 10px;
  line-height: 16px;
  letter-spacing: .4px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  content: 'ON';
}
.round-toggle-button .button {
  top: 2px;
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background: #fff!important;
  display: inline-block;
  transition: left .2s,background .2s;
  left: 30px;
}

.round-toggle-button.disabled {
  background: #9fa6bf;
}
.round-toggle-button.disabled:hover {
  background: #6d758d;
}
.round-toggle-button.disabled::before {
  float: right;
  content: 'OFF';
}
.round-toggle-button.disabled .button {
  left: 2px;
}
        `}
      </style>
    </div>
  );
}

function Popup(props) {
  const roomButtons = props.rooms.map((room) => {
    const classArray = ['item', 'tooltip', room.provider];
    if (room.status === ROOM_STATUS.ONLINE) {
      classArray.push('online');
    }

    const displayText = `${room.title} (${room.online || '-'})`;
    let altText = `关注人数: ${room.follows}`;

    const tooltipArray = [`关注人数: ${room.follows}`];
    if (room.username !== room.title) {
      tooltipArray.unshift(<br />);
      tooltipArray.unshift(room.username);

      altText = `${room.username}\n${altText}`;
    }

    return (
      <span
        key={room.key}
        className={classArray.join(' ')}
        onClick={() => chrome.tabs.create({
          url: room.roomUrl,
        })}
      >
{/*        <span className="tooltiptext">
          {tooltipArray}
        </span>*/}
        <a
          title={altText}
          data-content={displayText}
        >
          {displayText}
        </a>
      </span>
    );
  });

  const tips = roomButtons.length
    ? null
    : (<div className="tips">{chrome.i18n.getMessage('empty_tips')}</div>);

  return (
    <div>
      <div className="header">
        {chrome.i18n.getMessage('extension_name')}
      </div>
      <div className="channel">
        {roomButtons}
      </div>
      {tips}
      <Footer initialEnabled={props.initialEnabled} />

      <style jsx="true">
        {`
html {
  width: 250px;
  cursor: default;
}

.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

.tooltip .tooltiptext {
  top: 32px;
  left: 5px;
  pointer-events: none;
  background-color: rgb(240,240,240);
  visibility: hidden;
  width: 240px;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}

.header {
  padding: 10px;
  font-weight: bold;
}

.tips {
  padding: 0 10px 10px 10px;
}

.channel {
  max-height: 520px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.channel .item{
  margin: 0 2px 1px 0px;
  padding: .5em 0;
  color: black;
  display: inline-block;
  text-align: center;
  width: 100%;
  background-color: rgb(230,230,230);
  cursor: pointer;
}

.channel .item:hover{
  background-color: rgb(240,240,240);
}

.channel .item.online.zhanqi{
  color: white;
  background-color: rgb(70,136,241);
}
.channel .item.online.zhanqi:hover{
  background-color: rgb(90,156,251);
}

.channel .item.online.bilibili{
  color: white;
  background-color: rgb(249,130,169);
}
.channel .item.online.bilibili:hover {
  background-color: #ffafc9;
}

.channel .item.online.douyu{
  color: white;
  background-color: #ff630e;
}
.channel .item.online.douyu:hover {
  background-color: #FF7D28;
}

.channel span.item.online.showroom {
  background-color: #263238;
}
.channel span.item.online.showroom:hover {
  background-color: #404C52;
}
.channel .item.online.showroom a {
  color: white;
  font-weight: bold;
  background: linear-gradient(90deg,#EB8B2D,#FFDA1A,#9EC850,#15A748,#4DC0E3,#3B6CA7,#925E98,#E15487);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.channel span.item.online.openrec {
  background-color: #ff8300;
}
.channel span.item.online.openrec:hover {
  background-color: #ffa200;
}

.channel span.item.online.twitcasting {
  color: white;
  background-color: #3381ff;
}
.channel span.item.online.twitcasting:hover {
  background-color: #1b71fa;
}

.channel span.item.online.kuaishou {
  color: white;
  background-color: #fe3566;
}
.channel span.item.online.kuaishou:hover {
  background-color: #fe4975;
}


.channel span.item.online.douyin a::before {
  color: #28FBED;
  content: attr(data-content);
  position: absolute;
  left: 1px;
  width: 100%;
}

.channel span.item.online.douyin {
  color: #FA1D4D;
  background-color: #121212;
  position: relative !important;
}
.channel span.item.online.douyin:hover {
  background-color: #121233;
}

.channel span.item.online.douyin a::after {
  color: white;
  content: attr(data-content);
  position: absolute;
  left: 2px;
  width: 100%;
}

        `}
      </style>
    </div>
  );
}

(async () => {
  const roomInfo = await chrome.runtime.sendMessage({ event: EVENTS.REQUEST_ROOM_LIST });
  const enabled = await chrome.runtime.sendMessage({ event: EVENTS.GET_NOTIFICATION_ENABLED });

  chrome.action.setBadgeText({ text: '' });
  // prevent list the room which is not in the provider list
  const rooms = roomInfo.filter((r) => PROVIDER[r.provider.toUpperCase()]);
  const root = createRoot(document.getElementById('root'));
  root.render(<Popup rooms={rooms} initialEnabled={enabled} />);
})();
