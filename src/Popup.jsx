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

function Footer() {
  return (
    <div className="footer">
      <div>
      {chrome.runtime.getManifest().version}
      </div>
      <span>
      </span>
      <Link href={chrome.i18n.getMessage('feedback_url')}>
        {chrome.i18n.getMessage('feedback_text')}
      </Link>

      <style jsx="true">
        {`
.footer {
  text-align: right;
  padding: 5px 10px 10px 10px;
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
      <Footer />

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

chrome.runtime.sendMessage(
  {
    event: EVENTS.REQUEST_ROOM_LIST,
  },
  (response) => {
    chrome.action.setBadgeText({ text: '' });
    // prevent list the room which is not in the provider list
    const rooms = response.filter((r) => PROVIDER[r.provider.toUpperCase()]);
    const root = createRoot(document.getElementById('root'));
    root.render(<Popup rooms={rooms} />);
  },
);
