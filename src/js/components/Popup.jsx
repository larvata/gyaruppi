import React from 'react';
import {ROOM_STATUS} from '../common';

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
    // chrome.extension.getBackgroundPage().roomManager.roomInfoChangedHandler = (roomInfo, allRoomsInfo)=>{
    //   console.log('roomInfoChanged in jsx');
    //   this.setState({
    //     allRoomsInfo
    //   });
    // };
    console.log('test');
    const contentHeight = document.body.clientHeight;
    document.documentElement.style['height'] = (contentHeight + 'px');
  }

  componentDidUpdate(){

  }

  _roomItemClickHandler(roomUrl){
    // console.log(roomUrl);
    chrome.tabs.create({url:roomUrl});
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
      const scheduleTime = this._parseScheduleTime(schedule.time);
      const currentTimezoneOffset = new Date().getTimezoneOffset();
      const hourOffset = (-540 - currentTimezoneOffset) / 60;
      let { startHour, endHour, startMinute, endMinute } = scheduleTime.data;
      startHour = +startHour + hourOffset;
      endHour = +endHour + hourOffset;

      if (startHour < 0) {
        startHour = 24 + startHour;
      }
      if (endHour < 0) {
        endHour = 24 + endHour;
      }
      const timeString = `${startHour}:${startMinute}~${endHour}:${endMinute}`;

      const currentRoom = allRoomsInfo.find(r=>r.id === schedule.roomId) || {alias: ''};


      return (
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
      );
    });

    return (
      <div className="schedule">
        {scheduleItems}
      </div>
    );
  }

  renderChannel(){
    console.log('render channel');
    const { allRoomsInfo } = this.state;

    let roomItems = allRoomsInfo.filter(r=>r.enabled).map(room=>{
      let roomKey = `${room.provider}#${room.id}`;
      let itemClassArray = ['item'];
      itemClassArray.push(room.provider);
      room.status === ROOM_STATUS.ONLINE && itemClassArray.push('online');
      let itemClass = itemClassArray.join(' ');

      let displayTitle = `${room.title} (${room.online})`;
      let altText = `关注人数: ${room.follows}`;
      // let roomUrl = room.getUrl();
      return (
        <a
          className={itemClass}
          key={roomKey}
          title={altText}
          onClick={this._roomItemClickHandler.bind(this, room.roomUrl)}
        >{displayTitle}</a>
      );
    });

    return (
      <div className="channel">
        {roomItems}
      </div>
    );

  }

  render() {
    return (
      <div>
        <div className="category blue">
          <a>Schedule</a>
        </div>
        {this.renderSchedule()}

        <div className="category purple">
          <a>Channel</a>
        </div>
        {this.renderChannel()}
      </div>

    );
  }
}
