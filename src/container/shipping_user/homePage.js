import React, { Component, PropTypes } from 'react'
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Icon as LegacyIcon } from '@ant-design/compatible';
import DemoSearchBar from '../../components/HeaderSearch'
import {
  Space,
  Drawer,
  Row,
  Statistic,
  BackTop,
  notification,
  Tabs,
  PageHeader,
  Input,
  Dropdown,
  Button,
  Avatar,
  Layout,
  Menu,
  Breadcrumb,
  Badge,
  Divider,
} from 'antd';
import Animate from 'rc-animate'
import Pusher from 'pusher-js';


// import HeaderSearch from 'ant-design-pro/lib/HeaderSearch';


import { Popconfirm, message } from 'antd';
import { ControlTwoTone, ControlOutlined, SearchOutlined } from '@ant-design/icons';

import Demo_avatar from '../../components/Avatar'
import Demo_notification from '../../components/Notification'
import Menu_top from '../../components/Menu_Top'
import InputWithoutBorder from '../../components/InputNoBorder'


// import draft_page from './draft_page'
import Order_page from './order_page'
import Client_page from './client_page'
import Dashboard_page from './dashborad_page'

import CreateOrder_page from './createOrder_page '
import rate_estimate_page from './rate_estimate_page'
import pagesSwitchRouter from '../../asset/home_page'
// import single_order_page from './single_order_page'
// import completed_order_page from './completed_order_page'
import tracking_page from './tracking_page'


import checkForm from './components/checkForm'
import test from './components/motion/QueueAnim'
import NotFound from '../../components/notFound'

import { actions } from '../../reducers/order'
import { actions as actions_user_order } from '../../reducers/shipping_platform/user/order'
import { actions as user_account_actions } from '../../reducers/shipping_platform/user'




const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;

const PUSHER_APP_KEY = 'a02e0dd4b8d8317e5b47';
const PUSHER_APP_CLUSTER = 'us3';

const siderWidth = 256
//  <Breadcrumb separator=">" style={{ margin: '64px 0px 0px',  boxShadow: '0 1px 10px rgba(0,21,41,.12)', padding: '16px 30px 24px', background: '#fff' }}>
//   <Breadcrumb.Item><a href="/user/order/draft">首页</a></Breadcrumb.Item>
//   {getParentName ? <Breadcrumb.Item><span>{getParentName}</span></Breadcrumb.Item> : undefined}
//   {getchildrenName ? <Breadcrumb.Item><span>{getchildrenName}</span></Breadcrumb.Item> : undefined}
// </Breadcrumb> 
const { Search } = Input;
const { TabPane } = Tabs;

class user extends Component {
  container = React.createRef();
  constructor(props) {
    super(props);
    // this.eventSource = new EventSource("events");
    // this.test = this.test.bind(this);
    this.eventSource = new EventSource("http://localhost:8081/api/forwarder/event");
  }

  state = {
    searching_value: '',
    childrenDrawer: false,
    visible: false,
    height: 64,
    searching_string: undefined,
    collapsed: false,
    header_hidden: false,
    processing: false,
  };


  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  changeHeight = () => {
    this.setState({
      height: 350,
    });
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  getKeyOfSubMenus = () => {
    var str = this.props.history.location.pathname.substring('/forwarder/'.length) || '/' //  /seller/order/new   --->  order/new 
    var result = {
      parent: undefined,
      childern: []
    }
    let initial = 0
    for (var i = 0; i < str.length; i++) {
      if (str[i] == '/') {
        !result.parent ? result.parent = str.substring(initial, i) : result.childern.push(str.substring(initial, i))
        initial = i + 1;
      }
      if (str.lastIndexOf('/') == i && str.substring(initial, str.length)) {
        result.childern.push(str.substring(initial, str.length))
      }
    }
    return {
      Parent: result.parent,  //order/new   --> order
      Children: result.childern, //order/new   --> new 
      // 设置为0 表示如果有大于1个子类，都不继续向下映射 暂时只允许一个子类出现在面包屑中，防止对应边栏key和面包屑等不能对应问题。
      // LastChildOfUrl: '/' + result.childern[result.childern.length - 1]
      LastChildOfUrl: '/' + result.childern[0]
    }
  }

  offset = (count) => {
    //一位10（小于10），两位15（大于9，小于100），三位（大于999，小于10000）24，超四位（大于9999）27
    if (count < 10) {
      return 10
    } else if (count > 9 && count < 100) {
      return 15
    } else if (count > 99 & count < 1000) {
      return 19
    } else if (count > 999 && count < 10000) {
      return 24
    } else {
      return 27
    }
  }

  onRef = (ref) => {
    this.child = ref
  }

  handle_search = (value) => {
    value.length != 0 ? this.child.handle_search(value) : this.child.handle_clear_search()
    this.setState({ searching_value: value })
  }

  clear_search_bar = () => this.setState({ searching_value: '', })


  handleScroll = e => {
    if (e.srcElement.scrollingElement.scrollTop > 64 && this.state.header_hidden == false) {
      this.setState({ header_hidden: true })
    } else if (e.srcElement.scrollingElement.scrollTop <= 64 && this.state.header_hidden == true) {
      this.setState({ header_hidden: false })
    }
  }

  showSiderMenu = (parent, child) => {
    return (
      <Menu.Item
        key={child.url}
        onClick={() => this.props.history.push(`/forwarder/${parent}${child.url}`)}
        danger={child.url == '/failed' ? true : false}
      // danger ={true}
      >
        {/* {this.state.processing && child.iconType == "loading-3-quarters" ? child.iconType : "loading"} */}

        <span style={{ marginLeft: 16 }} ><LegacyIcon type={this.state.processing && child.iconType == "loading-3-quarters" ? "loading" : child.iconType} />{child.name}</span>
        {/* <Link to={`/user${parent.url}${child.url}`}><Icon type={child.iconType} /><span>{child.name}</span></Link> */}
      </Menu.Item>
    );
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.eventSource.onmessage = e => {
      let current = JSON.parse(e.data).processingOrder != 0
      if (this.state.processing != current) this.setState({ processing: current })
    }

    // this.pusher = new Pusher('a02e0dd4b8d8317e5b47', { cluster: 'us3', useTLS: true, });
    // this.channel = this.pusher.subscribe("orders");
    // this.channel.bind("inserted", (data) => { console.log(data) });
    // console.log(this.channel)
    window.addEventListener('scroll', this.handleScroll.bind(this))
  }


  componentWillUnmount() {
    this.eventSource.close()
    window.removeEventListener('scroll', this.handleScroll);
  }

  test = () => {
    console.log('test toggle')
    // this.setState({ collapsed: true})
  }

  render() {
    const { url } = this.props.match;
    const current_page = this.getKeyOfSubMenus().Children[0]
    const current_parent = this.getKeyOfSubMenus().Parent
    const page_content = pagesSwitchRouter(current_parent).group ? pagesSwitchRouter(current_parent).group.map(item => item.content).reduce((acc, cur) => acc.concat(cur)) : pagesSwitchRouter(current_parent).content
    // const parent = pagesSwitchRouter(current_parent).find(item => item.key == this.getKeyOfSubMenus().Parent)
    const parent = pagesSwitchRouter(current_parent)
    const getParentName = parent.name

    const children = page_content.find(item => item.url == this.getKeyOfSubMenus().LastChildOfUrl)
    const getchildrenName = children ? children.name : '错误页404'

    // console.log("parent is " + parent)
    // console.log('I am rendered')


    const get_order_count = this.props.order_count == undefined ? 0 : this.props.order_count[current_page]
    const show_number = get_order_count == undefined ? 0 : get_order_count

    const get_draft_count = this.props.order_count == undefined ? 0 : this.props.order_count.draft
    const get_ready_count = this.props.order_count == undefined ? 0 : this.props.order_count.ready_to_ship
    const get_completed_count = this.props.order_count == undefined ? 0 : this.props.order_count.completed


    const page_header_title = (childeren_name) => {
      let icon_type
      // 错误路由找不到对应资源
      try {
        icon_type = page_content.find(item => item.name == childeren_name).iconType
      } catch (error) {
        icon_type = undefined
      }

      return (
        <div  >
          <LegacyIcon style={{ marginRight: '8px' }} type={icon_type} /> {childeren_name}
        </div>
      );
    }

    const page_header_footer = (parent) => {
      if (parent == 'order') {
        return (
          <div>
            <Tabs
              style={{ paddingLeft: 36, }}
              defaultActiveKey="1">
              <TabPane tab={"本土派送" + " (" + show_number + ")"} key="1" />
              <TabPane tab="跨境小包" key="2" disabled />
            </Tabs>
          </div>
        )
      }
    }

    const { logout } = this.props;
    return (

      <div>
        <BackTop visibilityHeight={800} />
        {/* <ControlTwoTone onClick = {() => console.log (123)} style={{ fontSize: '46px',  position: 'fixed', top: "23%", bottom: 0, right: -3, zIndex : 8}} /> */}
        {/* <Button
        // size ='large'
        type="primary"
        icon = {<ControlOutlined style={{ fontSize: '20px' }}/>}
        style={{ height: 48 , width: 48 , position: 'fixed', top: "15%", bottom: 0, right: 0, zIndex : 8}}
        /> */}


        <Layout style={{ minHeight: 1000 }}>
          <Animate transitionName="fade">
            {!this.state.header_hidden ?
              <Header
                style={{
                  boxShadow: 'rgb(204, 204, 204) 0px 0px 10px',
                  height: '64px',
                  // borderBottom: '1px solid rgb(235, 237, 240)',
                  position: 'fixed',
                  zIndex: 1,
                  width: '100%',
                  background: '#fff',
                  padding: 0,
                }}>

                {/* <LegacyIcon
                    className="trigger"
                    // style={{ lineHeight: '64px' }}
                    style={{ padding: "0 24px", fontSize: 21, cursor: 'pointer' }}
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                  /> */}
                <div style={{ margin: "16px 16px 16px 16px", width: siderWidth - 32, height: "31px", float: "left" }} />
                <Menu_top {...this.props} current_selected={current_parent} />


                <div
                  style={{
                    textAlign: 'right',
                    // boxShadow: '0 1px 4px rgba(0,21,41,.12)',
                    display: 'inline-block',
                    position: 'fixed',
                    top: '0px',
                    right: '48px',
                    width: '800px',
                    height: '48px'
                  }}>
                  {/* <Demo_search_bar_top /> */}
                  <Space align="baseline" size={1}>
                    {/* <InputWithoutBorder/> */}
                    <Demo_notification />
                    <Demo_avatar logout={() => logout()} />
                  </Space>
                </div>
              </Header> : null}
          </Animate>
          <Layout style={{ background: '#fff', overflow: 'visible' }}>
            <Layout style={{ background: '#fff', marginTop: 64, }}>
              <Sider
                style={{
                  overflow: 'auto',
                  height: '100vh',
                  position: 'fixed',
                  borderColor: '#ddd',
                  // boxShadow: '1px 1px 5px rgba(0,21,41,.1)',
                  left: 0,
                }}
                theme="light"
                trigger={null}
                // collapsible
                // onCollapse={this.onCollapse}
                collapsed={this.state.collapsed}
                width={siderWidth}
              >
                <Menu
                  theme="light"
                  mode="inline"
                  forceSubMenuRender={true}
                  selectedKeys={[this.getKeyOfSubMenus().LastChildOfUrl]}
                  defaultOpenKeys={[this.getKeyOfSubMenus().Parent]}
                  style={{ paddingTop: 36, height: '100%', }}
                >

                  {/* 显示带有父级的menu */}
                  {/* {submenus.map((parent, index) =>
                    <SubMenu
                      key={parent.key}
                      title={<span><LegacyIcon type={parent.iconType} /><span>{parent.name}</span></span>}
                    >
                      {parent.children.map((child, index) => display_submenu(parent, child))}
                    </SubMenu>
                  )} */}
                  {/* 只显示子级菜单 */}
                  {/* {pagesMapRouter[current_parent].group ?
                    pagesMapRouter[current_parent].group.map((group, index) =>
                      <Menu.ItemGroup key={group.key} title={group.groupTitle} style={group.style}>
                        <Menu.Divider style={{ marginLeft: 16, marginRight: 24 }} />
                        {group.content.map((menuItem, index) => this.showSiderMenu(current_parent, menuItem))}
                      </Menu.ItemGroup>
                    ) : pagesMapRouter[current_parent].content.map((menuItem, index) => this.showSiderMenu(current_parent, menuItem))
                  } */}

                  {pagesSwitchRouter(current_parent).group ? pagesSwitchRouter(current_parent).group.map((group, index) =>
                    <Menu.ItemGroup key={group.key} title={group.groupTitle} style={group.style}>
                      <Menu.Divider style={{ marginLeft: 16, marginRight: 24 }} />
                      {group.content.map((menuItem, index) => this.showSiderMenu(current_parent, menuItem))}
                    </Menu.ItemGroup>
                  ) : pagesSwitchRouter(current_parent).content.map((menuItem, index) => this.showSiderMenu(current_parent, menuItem))
                  }
                </Menu>
              </Sider>
              <Layout style={{ marginLeft: siderWidth }}>
                <Content style={{ background: '#fff', overflow: 'scroll', minHeight: 800 }}>
                  <PageHeader
                    style={{
                      boxShadow: '1px 1px 5px rgba(0,21,41,.1)',
                      // boxShadow: 'rgb(217, 217, 217) 1px 1px 7px 0px',
                      // borderBottom: '1px solid rgb(235, 237, 240)',
                      // padding: '16px 48px 24px 16px',
                      background: '#fff',
                      height: 70
                    }}
                    // title= "Title"
                    title={page_header_title(getchildrenName)}
                  // subTitle={


                  //   <Input
                  //     style={{ border: "none", outlineColor: 'white', outlineStyle: "solid", margin: "0px 2px 0px 10px", width: '350px', }}
                  //     onFocus={() => console.log('focus test')}
                  //     placeholder="输入搜索内容"
                  //     onChange={(e) => {
                  //       let value = e.target.value.trim();
                  //       this.handle_search(value)
                  //     }}
                  //     allowClear
                  //     value={this.state.searching_value}
                  //     // onPressEnter={(e) => { this.handle_search(e.target.value) }}
                  //     prefix={<SearchOutlined style={{ opacity: 0.4 }} />}
                  //   />

                  // }
                  >
                  </PageHeader>
                  <Switch>
                    {/* <Route path={`${url}/create/single_order`}
                    render={(props) => (
                      <CreateOrder_page
                        collapsed={this.state.collapsed}
                        header_hidden={this.state.header_hidden}
                      />)}
                  /> */}

                    {/* <Route path={`${url}/warehouse/ship`}
                    render={(props) => (
                      <CreateOrder_page
                        collapsed={this.state.collapsed}
                        header_hidden={this.state.header_hidden}
                      />)}
                  /> */}

                    <Route path={`${url}/client/`}
                      render={(props) => (
                        <div style={{ padding: "48px", paddingTop: 16 }}>
                          <Client_page
                            {...props}
                            header_hidden={this.state.header_hidden}
                            onRef={this.onRef}
                            handle_search={(value) => this.handle_search(value)}
                            clear_search_bar={() => this.clear_search_bar()}
                          />
                        </div>
                      )}
                    />

                    <Route path={`${url}/dashboard/`}
                      render={(props) => (
                        <div style={{ padding: "48px", paddingTop: 16 }}>
                          <Dashboard_page
                            {...props}
                            header_hidden={this.state.header_hidden}
                            onRef={this.onRef}
                            handle_search={(value) => this.handle_search(value)}
                            clear_search_bar={() => this.clear_search_bar()}
                          />
                        </div>
                      )}
                    />


                    <Route path={`${url}/order/`}
                      render={(props) => (
                        <div style={{ padding: "48px", paddingTop: 16 }}>
                          <Order_page
                            {...props}
                            header_hidden={this.state.header_hidden}
                            onRef={this.onRef}
                            handle_search={(value) => this.handle_search(value)}
                            clear_search_bar={() => this.clear_search_bar()}
                          />
                        </div>
                      )}
                    />
                    {/* <Route path={`${url}/tool/rate_estimate`} component={rate_estimate_page} />
                  <Route path={`${url}/tool/tracking`} component={tracking_page} /> */}
                    <Route component={NotFound} />
                  </Switch>
                </Content>
              </Layout>
            </Layout>

            {/* <Footer style={{ textAlign: 'center' }}>
              SmartShip LLC ©2019 Created by Kimmy Wang
            </Footer> */}
          </Layout>
        </Layout>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    status_code: state.globalState.status_code,
    message: state.globalState.message,
    // order: state.shipping_platform_user.order.result,
    isFetching: state.globalState.isFetching,
    // order_count: state.shipping_platform_user.order.count
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logout: bindActionCreators(user_account_actions.get_logout, dispatch),
    // get_all_order: bindActionCreators(actions_user_order.get_all_order, dispatch),
    // get_order_count: bindActionCreators(actions_user_order.get_order_count, dispatch),
    // user_auth : bindActionCreators(user_account_actions.user_auth, dispatch),

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(user)

