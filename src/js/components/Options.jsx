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

    this._resetAllSettingsHandler = this._resetAllSettingsHandler.bind(this);
    this._injectSubscribeClickHandler = this._injectSubscribeClickHandler.bind(this);
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

  _renderSettings(){
    const { customRooms, settings } = this.state;
    const { allowInjectSubscribeButtonScript } = settings;
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

    return (
      <div style={{paddingLeft: '250px'}}>
        <div style={{width: '500px'}}>
          <List>
            <ListItem
              primaryText="清空设定"
              secondaryText="插件出现故障时使用"
              disabled={true}
              rightIconButton={<RaisedButton primary={false} label="重置" onClick={this._resetAllSettingsHandler}/>}
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
          <List>
            <ListItem
              primaryText="体验功能"
              secondaryText="目前仅支持战旗和哔哩哔哩"
              disabled={true}
            />
          </List>
          <List>
            <ListItem
              primaryText="自定义直播间"
              secondaryText="通过直播间页面的订阅按钮🔔将该直播间加入通知列表"
              leftCheckbox={<Checkbox checked={allowInjectSubscribeButtonScript} onCheck={this._injectSubscribeClickHandler}/>} />
          </List>
        </div>
      </div>
    );
  }

  _renderAbout(){
    const changelog =
`
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
        <div style={{width:'300px', margin: '280px 40%', fontSize:'20px'}}>
          <Avatar
            src="images/profile.png"
            size={128}
          />
          <div><span>gyaruppi {currentVersion}</span></div>
          <div><a href="https://live.haruppi.top/">48系番组直播间</a></div>
          <p>
            <span>意见反馈</span> <a href="http://weibo.com/u/5593301047">兒玉遥应援会</a>
          </p>
          <div>
            <textarea style={{width: '350px', height: '264px','fontSize': 'medium'}} value={changelog} />
          </div>
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
