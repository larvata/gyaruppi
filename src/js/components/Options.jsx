import React from 'react';
import Drawer from 'material-ui/Drawer';
import {List, ListItem, MakeSelectable} from 'material-ui/List';
import Toggle from 'material-ui/Toggle';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';
import {spacing, typography, zIndex} from 'material-ui/styles';
import {cyan500} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';

const { ApplicationManager } = chrome.extension.getBackgroundPage();
const currentVersion = chrome.app.getDetails().version;
const SelectableList = MakeSelectable(List);

const styles = {
  logo: {
    cursor: 'pointer',
    fontSize: 24,
    color: typography.textFullWhite,
    lineHeight: `${spacing.desktopKeylineIncrement}px`,
    fontWeight: typography.fontWeightLight,
    backgroundColor: cyan500,
    paddingLeft: spacing.desktopGutter,
    marginBottom: 8
  }
};

export default class Options extends React.Component {
  static propTypes = {
    name: React.PropTypes.string
  };

  constructor(props) {
    super(props);

    const { customRooms, settings } = this._getDataFromBackgroundPage();
    const state = {
      selectedItem: 0,
      customRooms,
      settings
    };
    this.state = state;

    // this._resetAllSettingsHandler = this._resetAllSettingsHandler.bind(this);
    this._injectSubscribeClickHandler = this._injectSubscribeClickHandler.bind(this);
    this._enableDesktopNotificationClickHandler = this._enableDesktopNotificationClickHandler.bind(this);
  }

  _getDataFromBackgroundPage(){
    let customRooms = ApplicationManager.getCustomRooms();
    let settings = ApplicationManager.getAllSettings();
    return {
      customRooms,
      settings
    };
  }

  _roomToggleHandler(roomInfo){
    // const { customRooms } = this.state;
    // const room = customRooms.find(cr => cr.provider === roomInfo.provider && cr.id === roomInfo.id);
    // if (!room) {
    //   return;
    // }
    ApplicationManager.toggleEnableFromCustomRooms(roomInfo);
    const customRooms = ApplicationManager.getCustomRooms();
    // room.enabled = !room.enabled;
    // chrome.extension.getBackgroundPage().ApplicationManager.setCustomRooms(customRooms);
    this.setState({ customRooms });
  }

  _pageChangeHandler(pId){
    this.setState({selectedItem: pId});
  }

  _roomDeleteHandler(roomInfo){
    ApplicationManager.removeFromCustomRooms(roomInfo);
    const customRooms = ApplicationManager.getCustomRooms();
    this.setState({ customRooms });
  }

  _resetAllSettingsHandler(){
    ApplicationManager.resetAllSettings();
    const nextState = this._getDataFromBackgroundPage();
    this.setState(nextState);
  }

  _injectSubscribeClickHandler(){
    let { allowInjectSubscribeButtonScript } = this.state.settings;
    allowInjectSubscribeButtonScript = !allowInjectSubscribeButtonScript;
    ApplicationManager.updateSettings({allowInjectSubscribeButtonScript});
    const settings = ApplicationManager.getAllSettings();
    this.setState({ settings });
  }

  _enableDesktopNotificationClickHandler(){
    let { enableDesktopNotification } = this.state.settings;
    enableDesktopNotification = !enableDesktopNotification;
    ApplicationManager.updateSettings({enableDesktopNotification});
    const settings = ApplicationManager.getAllSettings();
    this.setState({ settings });
  }

  _renderSettings(){
    const { customRooms, settings } = this.state;
    const { allowInjectSubscribeButtonScript, enableDesktopNotification } = settings;
    const roomList = customRooms.map(ar => {
      let rightToggle = null;
      let rightButton = null;
      let disabled = false;

      if (ar.locked) {
        disabled = true;
      }

      if (ar.isStockRoom) {
        rightToggle = (<Toggle toggled={ar.enabled} disabled={disabled} onToggle={this._roomToggleHandler.bind(this, {provider: ar.provider, id: ar.id})}/>);
      }

      if (!ar.isStockRoom) {
        rightButton = (<RaisedButton primary={false} label="删除" onClick={this._roomDeleteHandler.bind(this, {provider: ar.provider, id: ar.id})} />);
      }

      return (
        <ListItem
          key={ar.id}
          primaryText={ar.title}
          rightToggle={rightToggle}
          rightIconButton={rightButton}
          disabled={disabled}
        />
      );
    });

          // <List>
          //   <ListItem
          //     primaryText="清空设定"
          //     secondaryText="仅在插件出现故障时使用"
          //     disabled={true}
          //     rightIconButton={<RaisedButton primary={false} label="重置" onClick={this._resetAllSettingsHandler}/>}
          //   />
          // </List>
          // <Divider />

    return (
      <div style={{paddingLeft: '250px'}}>
        <div style={{width: '560px'}}>
          <List>
            <ListItem
              primaryText="通知选项"
              secondaryText=""
              disabled={true}
            />
          </List>
          <List>
            <ListItem
              primaryText="桌面通知"
              secondaryText="直播间开播时弹出桌面通知"
              leftCheckbox={
                <Checkbox
                  checked={enableDesktopNotification}
                  onCheck={this._enableDesktopNotificationClickHandler}
                />
              }
            />
            <ListItem
              primaryText="自定义直播间通知"
              secondaryText="支持战旗, 斗鱼, 熊猫, bilibili, Showroom"
              leftCheckbox={<Checkbox checked={allowInjectSubscribeButtonScript}
              onCheck={this._injectSubscribeClickHandler}/>}
              />
          </List>
          <Divider />

          <List>
            <ListItem
              primaryText="直播间通知"
              secondaryText="点击右侧按钮可以禁用/删除当前直播间"
              disabled={true}
            />
          </List>
          <List>
            {roomList}
          </List>
          <Divider />
        </div>
      </div>
    );
  }

  _renderAbout(){
    const changelog =
`
1.2.7
- 修复: 斗鱼直播间状态
- 修复: 战旗直播间状态

1.2.5
- 修复: bili偶尔无法使用的问题

1.2.4
- 修复: bili无法使用的问题
- 修复: 斗鱼部分房间无法使用的问题
- 修复: 熊猫无法使用的问题

1.2.3
- 修复: showroom脚本失效

1.2.2
- 修复: 房间按钮点击区域问题

1.2.1
- 修复: showroom无法使用flash播放器

1.2.0
- 新增: 支持showroom

1.1.0
- 新增: 新增斗鱼 熊猫 通知支持
- 修复: 修复战旗通知

1.0.10:
- 修复: 无法通过插件进入战旗房间的问题

1.0.9:
- 修复: bilibili api更新

1.0.8
- 修复: 无法添加自定义房间

1.0.7
- 修复: 节目通知弹出窗口, 按本地时间修正修正播出时间
- UI: 在内置番组直播间页面也显示通知按钮
- 新增: 支持showroom修改播放控件尺寸
`;

    return (
      <div style={{paddingLeft: '250px'}}>
        <div style={{padding: '120px 0px 0 40px', fontSize:'20px'}}>
          <Avatar
            src="images/profile.png"
            size={128}
          />
            {`48系番组直播间通知插件 ${currentVersion}`}
          <p>
            意见反馈: <a href="https://weibo.com/alzzl">https://weibo.com/alzzl</a>
          </p>

          <div>Github Repo: <a href="https://github.com/larvata/gyaruppi">https://github.com/larvata/gyaruppi</a> </div>
          <div>下载地址: <a href="https://live.haruppi.top/">https://live.haruppi.top/</a></div>
        </div>
        <div style={{ padding: '20px 30px'}}>
          <textarea style={{width: '100%', height: '350px','fontSize': 'medium'}} value={changelog} />
        </div>
      </div>
    );
  }

  render() {
    const { selectedItem } = this.state;

    let mainContent = null;
    if (selectedItem === 0) {
      // render settings view
      mainContent = this._renderSettings();
    }
    else if (selectedItem === 1){
      // render about view
      mainContent = this._renderAbout();
    }

    return (
      <div>
        <Drawer>
          <div style={styles.logo}>
            gyaruppi
          </div>
          <SelectableList value={selectedItem}>
            <ListItem value={0} onClick={this._pageChangeHandler.bind(this, 0)}>设置</ListItem>
            <ListItem value={1} onClick={this._pageChangeHandler.bind(this, 1)}>关于</ListItem>
          </SelectableList>
        </Drawer>
        {mainContent}
      </div>
    );
  }
}
