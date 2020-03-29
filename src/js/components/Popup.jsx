import React from 'react';
import {ROOM_STATUS} from '../common';
import {parseScheduleTime} from '../utils';

const { ApplicationManager } = chrome.extension.getBackgroundPage();

export default class Popup extends React.Component {

  constructor(props) {
    super(props);

    let allRoomsInfo = ApplicationManager.getCustomRooms();
    let allSchedules = ApplicationManager.getAllSchedules();

    this.state = {
      allRoomsInfo,
      allSchedules
    };
  }

  componentDidMount(){
    const contentHeight = document.body.clientHeight;
    document.documentElement.style['height'] = (contentHeight + 'px');
  }

  _roomItemClickHandler(roomUrl){
    chrome.tabs.create({url:roomUrl});
  }

  _openOptionPage() {
    chrome.tabs.create({ 'url': `chrome-extension://${chrome.runtime.id}/options.html` });
  }

  _parseScheduleTime(timeString){
    const validateRegex =  /^([0-9]?[0-9]):([0-5][0-9])~([0-9]?[0-9]):([0-5][0-9])$/;
    const matched = timeString.match(validateRegex);
    const result = {
      validated: false,
      data: {
        startHour: null,
        startMinute: null,
        endHour: null,
        endMinute: null,
        timezone: 9
      }
    };

    if (!timeString) {
      // ignore the validate for the empty time
      result.validated = true;
      return result;
    }

    if (matched && matched.length === 5) {
      result.validated = true;
      result.data.startHour = matched[1];
      result.data.startMinute = matched[2];
      result.data.endHour = matched[3];
      result.data.endMinute = matched[4];
    }

    return result;
  }

  renderSchedule(){
    const {allSchedules, allRoomsInfo} = this.state;
    // console.log(this.state.allRoomsInfo);
    let scheduleItems = allSchedules.map((schedule, index)=>{
      // build date string
      const dateArray = schedule.date.split('-');
      const dateString = dateArray.slice(1).join('/');

      // build time string by local timezone
      const scheduleTime = parseScheduleTime(schedule.time);
      let { startHour, endHour, startMinute, endMinute } = scheduleTime.data;
      const timeString = `${startHour}:${startMinute}~${endHour}:${endMinute}`;
      const currentRoom = allRoomsInfo.find(r=>r.id === schedule.roomId) || {alias: ''};

      return (
        <div>
          <div className="category blue">
            <a>Schedule</a>
          </div>
          <div className="item" key={index}>
            <div>
              <span className="datetime">
                <span className="date">
                  {dateString}
                </span>
                <span className="time">
                  {timeString}
                </span>
              </span>
              <span className="channel">{currentRoom.alias}</span>
            </div>
            <div>
              <span className="program">
                {schedule.description}
              </span>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="schedule">
        {scheduleItems}
      </div>
    );
  }

  renderChannel(){
    const { allRoomsInfo } = this.state;

    const enabledRooms = allRoomsInfo.filter(r=>r.enabled);
    if (enabledRooms.length === 0) {
      return (
        <div>
          <div className="category purple">
            <a>{`gyaruppi ${chrome.app.getDetails().version}`}</a>
          </div>
          <div className="channel">
            <span className="item">请点击直播间页面标题的铃铛图标订阅通知</span>
          </div>
        </div>
      );
    }

    let roomItems = enabledRooms.map(room=>{
      let roomKey = `${room.provider}#${room.id}`;
      let itemClassArray = ['item'];
      itemClassArray.push(room.provider);
      room.status === ROOM_STATUS.ONLINE && itemClassArray.push('online');
      let itemClass = itemClassArray.join(' ');

      let displayTitle = `${room.title} (${room.online || '-'})`;
      let altText = `关注人数: ${room.follows}`;
      // let roomUrl = room.getUrl();
      return (
        <span
          key={roomKey}
          className={itemClass}
          onClick={this._roomItemClickHandler.bind(this, room.roomUrl)}>
          <a title={altText}>{displayTitle}</a>
        </span>
      );
    });

    return (
      <div>
        <div className="category purple">
          <a>直播间关注列表</a>
        </div>
        <div className="channel">
          {roomItems}
        </div>
      </div>
    );

  }

  render() {
    return (
      <div>
        {
          //this.renderSchedule()
        }

        {this.renderChannel()}
        <div className="pure-g footbar">
          <hr />
          <div className="pure-u-2-3 feedback">
            <a href="https://github.com/larvata/gyaruppi/issues" target="_blank">问题反馈</a>
            <span>{chrome.app.getDetails().version}</span>
          </div>
          <div className="pure-u-1-3 setting">
            <button className="pure-button-primary pure-button" onClick={this._openOptionPage}>设置</button>
          </div>
        </div>
      </div>

    );
  }
}
