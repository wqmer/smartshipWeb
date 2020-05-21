import React, { Component, PropTypes } from 'react'
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Drawer, Row, Statistic, BackTop, notification, Tabs, PageHeader, Input, Dropdown, Button, Avatar, Layout, Menu, Breadcrumb, Icon, Badge } from 'antd';
import HeaderSearch from 'ant-design-pro/lib/HeaderSearch';
import { Popconfirm, message } from 'antd';

import Demo_notification from './components/notification'
import Demo_search_bar_top from './components/search_bar_top'
import Animate from 'rc-animate'

// import draft_page from './draft_page'
import Order_page from './order_page'
import CreateOrder_page from './createOrder_page '
import rate_estimate_page from './rate_estimate_page'
// import single_order_page from './single_order_page'
// import completed_order_page from './completed_order_page'
import tracking_page from './tracking_page'

import Menu_top from './components/Menu_top'
import checkForm from './components/checkForm'
import test from './components/motion/QueueAnim'
import NotFound from '../../components/notFound'

import { actions } from '../../reducers/order'
import { actions as actions_user_order } from '../../reducers/shipping_platform/user/order'
import { actions as user_account_actions } from '../../reducers/shipping_platform/user'




const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;

//  <Breadcrumb separator=">" style={{ margin: '64px 0px 0px',  boxShadow: '0 1px 10px rgba(0,21,41,.12)', padding: '16px 30px 24px', background: '#fff' }}>
//   <Breadcrumb.Item><a href="/user/order/draft">首页</a></Breadcrumb.Item>
//   {getParentName ? <Breadcrumb.Item><span>{getParentName}</span></Breadcrumb.Item> : undefined}
//   {getchildrenName ? <Breadcrumb.Item><span>{getchildrenName}</span></Breadcrumb.Item> : undefined}
// </Breadcrumb> 
const { Search } = Input;
const { TabPane } = Tabs;
const submenus = [
  // { name: '运费试算', iconType: 'setting', key: 'rating', url: '/show'},
  { name: '创建运单', iconType: 'file-add', key: 'create', url: '/create', children: [{ url: '/single_order', iconType: "edit", name: '寄单件' }, { url: '/batch', iconType: "form", name: '传批量' }] },
  { name: '订单管理', iconType: 'database', key: 'order', url: '/order', children: [{ url: '/draft', iconType: 'snippets', name: '草稿簿' }, { url: '/ready_to_ship', iconType: 'pushpin', name: '待处理' }, { url: '/completed', iconType: 'carry-out', name: '已完成' }, { iconType: 'exclamation-circle', url: '/problem', name: '问题单' }] },
  { name: '便捷工具', iconType: 'tool', key: 'tool', url: '/tool', children: [{ url: '/rate_estimate', iconType: 'calculator', name: '运费试算' }, { url: '/tracking', iconType: 'file-search', name: '轨迹查询' }] },
  { name: '店铺管理', iconType: 'shopping-cart', key: 'store', url: '/store', children: [{ url: '/amazon', iconType: 'amazon', name: '亚马逊' }] },

];

class user extends Component {
  container = React.createRef();
  constructor(props) {
    super(props);
  }

  state = {
    childrenDrawer: false,
    visible: false,
    height: 64,
    searching_string: undefined,
    collapsed: false,
    header_hidden: false
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
    var str = this.props.history.location.pathname.substring('/user/'.length) || '/' //  /seller/order/new   --->  order/new 
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
    // this.setState({searching_string:'value'})
    this.child.fetch_data(value)
  }

  handleScroll = e => {
    if (e.srcElement.scrollingElement.scrollTop > 160 && this.state.header_hidden == false) {
      this.setState({ header_hidden: true })
    } else if (e.srcElement.scrollingElement.scrollTop <= 160 && this.state.header_hidden == true) {
      this.setState({ header_hidden: false })
    }
  }

  componentDidMount() {
    this.props.get_order_count();
    window.addEventListener('scroll', this.handleScroll.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    //  console.log(handleScroll())
    const current_page = this.getKeyOfSubMenus().Children[0]
    const get_order_count = this.props.order_count == undefined ? 0 : this.props.order_count[current_page]
    const show_number = get_order_count == undefined ? 0 : get_order_count

    const get_draft_count = this.props.order_count == undefined ? 0 : this.props.order_count.draft
    const get_ready_count = this.props.order_count == undefined ? 0 : this.props.order_count.ready_to_ship
    const get_completed_count = this.props.order_count == undefined ? 0 : this.props.order_count.completed

    const { url } = this.props.match;
    const parent = submenus.find(item => item.key == this.getKeyOfSubMenus().Parent)
    const getParentName = parent ? parent.name : undefined
    const children = getParentName ? submenus.find(item => item.name == getParentName).children.find(item => item.url == this.getKeyOfSubMenus().LastChildOfUrl) : undefined
    const getchildrenName = children ? children.name : undefined
    const ph_bottom = this.getKeyOfSubMenus().Parent == 'order' ? '0px' : '32px'

    const page_header_title = (childeren_name) => {
      let icon_type = childeren_name == '轨迹查询' ? "file-search" : "arrow-right"
      return (
        <div style={{ paddingTop: 8, paddingLeft: 6 }} >
          <Icon style={{ marginRight: '8px' }} type={icon_type} /> {getchildrenName}
        </div>
      )
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

    const display_submenu = (parent, child) => {
      let offset_option = {
        '草稿簿': get_draft_count,
        '待处理': get_ready_count,
        '已完成': get_completed_count
      }

      return (
        <Menu.Item key={child.url} onClick={() => this.props.history.push(`/user${parent.url}${child.url}`)} >
          <Badge
            style={{ boxShadow: '0 0 0 0px #FF0000' }}
            //一位10（小于10），两位15（大于9，小于100），四位（大于999，小于10000）24，超四位（大于9999）27
            //  style={{ boxShadow: '0 0 0 1px #FF0000' }}
            offset={[this.offset(offset_option[child.name]), 0]}
            overflowCount={9999}
          // count={offset_option[child.name]}
          >
            <span><Icon type={child.iconType} />{child.name}</span>
            {/* <Link to={`/user${parent.url}${child.url}`}><Icon type={child.iconType} /><span>{child.name}</span></Link> */}
          </Badge>
        </Menu.Item>
      )

    }

    const routes = [
      {
        path: 'ind/user/order/draft',
        breadcrumbName: '首页',
      },
      {
        // path: 'first',
        breadcrumbName: getParentName,
      },
      {
        // path: 'second',
        breadcrumbName: getchildrenName,
      },
    ];

    return (
      <div>
        <BackTop visibilityHeight={800} />
        <Layout style={{ minHeight: 1200, overflow: 'visible' }}>
          <Sider
            style={{
              // boxShadow: '1px 1px 4px rgba(0,21,41,.12)',
              boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
              overflow: "auto",
              height: "100vh",
              // position: "fixed",
              zIndex: 9,
              left: 0,
            }}

            theme="dark"
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
            width={256}
          >
            <div style={{ boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)', height: '48px', width: '100%' }} />
            <Menu
              theme="dark"
              mode="inline"
              forceSubMenuRender={true}
              selectedKeys={[this.getKeyOfSubMenus().LastChildOfUrl]}
              defaultOpenKeys={[this.getKeyOfSubMenus().Parent, 'order', 'create']}
              style={{ paddingTop: 24, zIndex: 9, boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)', height: '100%', }}>
              {submenus.map((parent, index) =>
                <SubMenu key={parent.key}
                  title={<span><Icon type={parent.iconType} /><span>{parent.name}</span></span>}
                >
                  {parent.children.map((child, index) => display_submenu(parent, child))}
                </SubMenu>)
              }
            </Menu>
          </Sider>
          <Layout
            // style={{ paddingLeft: this.state.collapsed ? 80 : 256 }}
          >
            <Animate transitionName="fade">
              {!this.state.header_hidden ?
                <Header
                  style={{
                    boxShadow: '1px 1px 4px rgba(0,21,41,.12)',
                    position: 'fixed',
                    zIndex: 3,
                    width: '100%',
                    background: '#fff',
                    padding: 0,

                  }}>

                  <Icon
                    className="trigger"
                    // style={{ lineHeight: '64px' }}
                    style={{ padding: "0 24px", fontSize: 21, cursor: 'pointer' }}
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                  />
                  <Menu_top {...this.props} />
                  <div
                    style={{
                      textAlign: 'right',
                      // boxShadow: '0 1px 4px rgba(0,21,41,.12)',
                      display: 'inline-block',
                      position: 'fixed',
                      top: '0px',
                      right: '24px',
                      width: '500px',
                      height: '64px'
                    }}>
                    <Demo_search_bar_top />
                    <Demo_notification />
                  </div>
                </Header> : null}
            </Animate>
            <PageHeader
              // breadcrumb={{ routes }}
              style={{
                borderBottom: '1px solid rgb(235, 237, 240)',
                // boxShadow: '0 3px 1px rgba(0,21,41,.12)',
                padding: '92px 48px 32px 16px',
                // paddingBottom: ph_bottom,
                background: '#fff'
              }}

              // extra={}
              // ghost={false}
              // onBack={() => null}
              title={page_header_title(getchildrenName)}
            // footer={page_header_footer(this.getKeyOfSubMenus().Parent)}
            >

              {this.getKeyOfSubMenus().Parent === 'order' ?
                <Content >
                  <div style={{ textAlign: 'center' }}>
                    <Search
                      style={{ width: '500px' }}
                      placeholder="输入订单信息/订单号/包裹信息/地址信息"
                      // loading = {true}
                      allowClear
                      onSearch={value => {
                        this.handle_search(value)
                      }}
                      enterButton
                    />
                  </div>
                </Content>
                : undefined
              }

            </PageHeader>

            <Layout style={{ padding: 24, minHeight: 1000, }}>
              <Content style={{ minHeight: 1000, overflow: 'scroll' }}>
                <Switch>
                  {/* <Route path={`${url}/create/single_order`} component={CreateOrder_page} /> */}
                  <Route path={`${url}/create/single_order`}
                    render={(props) => (
                      <CreateOrder_page
                        collapsed={this.state.collapsed}
                        header_hidden={this.state.header_hidden}
                      // onRef={this.onRef}
                      // handle_search={(value) => this.handle_search(value)}
                      />)}
                  />

                  <Route path={`${url}/order/`}
                    render={(props) => (
                      <Order_page
                        {...props}
                        header_hidden={this.state.header_hidden}
                        onRef={this.onRef}
                        handle_search={(value) => this.handle_search(value)}
                      />)}
                  />
                  <Route path={`${url}/tool/rate_estimate`} component={rate_estimate_page} />
                  <Route path={`${url}/tool/tracking`} component={tracking_page} />
                  <Route component={NotFound} />
                </Switch>
              </Content>
            </Layout>

            <Footer style={{ textAlign: 'center' }}>
              SmartShip LLC ©2019 Created by Kimmy Wang
            </Footer>

          </Layout>
        </Layout>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    status_code: state.globalState.status_code,
    message: state.globalState.message,
    // order: state.shipping_platform_user.order.result,
    isFetching: state.globalState.isFetching,
    order_count: state.shipping_platform_user.order.count
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // get_all_order: bindActionCreators(actions_user_order.get_all_order, dispatch),
    get_order_count: bindActionCreators(actions_user_order.get_order_count, dispatch),
    // user_auth : bindActionCreators(user_account_actions.user_auth, dispatch),

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(user)

