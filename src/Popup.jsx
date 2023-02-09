/* eslint-disable
  jsx-a11y/click-events-have-key-events,
  jsx-a11y/no-static-element-interactions,
  jsx-a11y/anchor-is-valid
*/

import { createRoot } from 'react-dom/client';
import { ROOM_STATUS } from './common/constants';

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
    const classArray = ['item', room.provider];
    if (room.status === ROOM_STATUS.ONLINE) {
      classArray.push('online');
    }

    const displayText = `${room.title} (${room.online || '-'})`;
    const altText = `关注人数: ${room.follows}`;

    return (
      <span
        key={room.key}
        className={classArray.join(' ')}
        onClick={() => chrome.tabs.create({
          url: room.roomUrl,
        })}
      >
        <a title={altText}>{displayText}</a>
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

.header {
  padding: 10px;
  font-weight: bold;
}

.tips {
  padding: 0 10px 10px 10px;
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
        `}
      </style>
    </div>
  );
}

chrome.storage.sync.get(['rooms'])
  .then((data) => {
    chrome.action.setBadgeText({ text: '' });
    const rooms = (data.rooms || []);
    const root = createRoot(document.getElementById('root'));
    root.render(<Popup rooms={rooms} />);
  });
