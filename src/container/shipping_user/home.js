import React, { Component } from "react"
import { Route, Switch } from "react-router-dom"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { Icon as LegacyIcon } from "@ant-design/compatible"
import { Space, BackTop, Layout, Menu } from "antd"
import Animate from "rc-animate"
import UserAvator from "../../components/UserAvatar"
import Demo_notification from "../../components/Notification"
import MenuTop from "../../components/MenuTop"
import Order_page from "./order_page"
import Client_page from "./client_page"
import Dashboard_page from "./dashborad_page"
import FinancePage from "./finance_page"
import Ticket_page from "./ticket_page"
import SettingPage from "./setting_page"
import pagesSwitchRouter from "../../asset/home_page"
import NotFound from "../../components/notFound"
import { actions as user_account_actions } from "../../reducers/shipping_platform/user"

const { Header, Sider, Content } = Layout
const siderWidth = 256

class Home extends Component {
  container = React.createRef()

  constructor(props) {
    super(props)

    this.eventSource = new EventSource("http://localhost:8081/api/forwarder/event")
  }

  state = {
    searching_value: "",
    childrenDrawer: false,
    visible: false,
    height: 64,
    searching_string: undefined,
    collapsed: false,
    header_hidden: false,
    processing: false,
  }

  onCollapse = collapsed => {
    this.setState({ collapsed })
  }

  showDrawer = () => {
    this.setState({
      visible: true
    })
  }

  onClose = () => {
    this.setState({
      visible: false
    })
  }

  changeHeight = () => {
    this.setState({
      height: 350
    })
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  getKeyOfSubMenus = () => {
    var str = this.props.history.location.pathname.substring("/forwarder/".length) || "/" 
    var result = {
      parent: undefined,
      childern: []
    }
    let initial = 0
    for (var i = 0; i < str.length; i++) {
      if (str[i] == "/") {
        !result.parent ? result.parent = str.substring(initial, i) : result.childern.push(str.substring(initial, i))
        initial = i + 1;
      }
      if (str.lastIndexOf("/") == i && str.substring(initial, str.length)) {
        result.childern.push(str.substring(initial, str.length))
      }
    }
    return {
      Parent: result.parent,  //order/new   --> order
      Children: result.childern, //order/new   --> new 
      // 设置为0 表示如果有大于1个子类，都不继续向下映射 暂时只允许一个子类出现在面包屑中，防止对应边栏key和面包屑等不能对应问题。
      // LastChildOfUrl: "/" + result.childern[result.childern.length - 1]
      LastChildOfUrl: "/" + result.childern[0]
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

  clear_search_bar = () => this.setState({ searching_value: "", })


  handleScroll = e => {
    if (e.srcElement.scrollingElement.scrollTop > 64 && this.state.header_hidden == false) {
      this.setState({ header_hidden: true })
    } else if (e.srcElement.scrollingElement.scrollTop <= 64 && this.state.header_hidden == true) {
      this.setState({ header_hidden: false })
    }
  }

  showSiderMenu = (parent, child) => {
    if (child.showInMenu) {
      return (
        <Menu.Item
          key={child.url}
          onClick={() => this.props.history.push(`/forwarder/${parent}${child.url}`)}
          danger={child.url == "/failed" ? true : false}
        >
          <span style={{ marginLeft: 16 }} ><LegacyIcon type={this.state.processing && child.iconType == "loading-3-quarters" ? "loading" : child.iconType} />{child.name}</span>
        </Menu.Item>
      )
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.eventSource.onmessage = e => {
      let current = JSON.parse(e.data).processingOrder != 0
      if (this.state.processing != current) this.setState({ processing: current })
    }

    window.addEventListener("scroll", this.handleScroll.bind(this))
  }

  componentWillUnmount() {
    this.eventSource.close()
    window.removeEventListener("scroll", this.handleScroll);
  }

  test = () => {
    console.log("test toggle")
  }

  render() {
    const { url } = this.props.match;
    const current_parent = this.getKeyOfSubMenus().Parent
    const { logout } = this.props;
    return (

      <div>
        <BackTop visibilityHeight={800} />
        <Layout style={{ minHeight: 1000 }}>
          <Animate transitionName="fade">
            {!this.state.header_hidden ?
              <Header
                style={{
                  boxShadow: "rgb(204, 204, 204) 0px 0px 10px",
                  height: "64px",
                  position: "fixed",
                  zIndex: 1,
                  width: "100%",
                  background: "#fff",
                  padding: 0,
                }}>
                <div style={{ margin: "16px 16px 16px 16px", width: siderWidth - 32, height: "31px", float: "left" }} />
                <MenuTop {...this.props} current_selected={current_parent} />
                <div
                  style={{
                    textAlign: "right",
                    display: "inline-block",
                    position: "fixed",
                    top: "0px",
                    right: "48px",
                    width: "800px",
                    height: "48px"
                  }}>
                  <Space align="baseline" size={1}>
                    <Demo_notification />
                    <UserAvator username={this.props.forwarder_info.forwarder_name} logout={() => logout()} />
                  </Space>
                </div>
              </Header> : null}
          </Animate>
          <Layout style={{ background: "#fff", overflow: "visible" }}>
            <Layout style={{ background: "#fff", marginTop: 64, }}>
              <Sider
                style={{
                  overflow: "auto",
                  height: "100vh",
                  position: "fixed",
                  borderColor: "#ddd",
                  left: 0,
                }}
                theme="light"
                trigger={null}
                collapsed={this.state.collapsed}
                width={siderWidth}
              >
                <Menu
                  theme="light"
                  mode="inline"
                  forceSubMenuRender={true}
                  selectedKeys={[this.getKeyOfSubMenus().LastChildOfUrl]}
                  defaultOpenKeys={[this.getKeyOfSubMenus().Parent]}
                  style={{ paddingTop: 36, height: "100%", }}
                >
                  {pagesSwitchRouter(current_parent).group ? pagesSwitchRouter(current_parent).group.map((group) =>
                    <Menu.ItemGroup key={group.key} title={group.groupTitle} style={group.style}>
                      <Menu.Divider style={{ marginLeft: 16, marginRight: 24 }} />
                      {group.content.map((menuItem) => this.showSiderMenu(current_parent, menuItem))}
                    </Menu.ItemGroup>
                  ) : pagesSwitchRouter(current_parent).content.map((menuItem) => this.showSiderMenu(current_parent, menuItem))}
                </Menu>
              </Sider>
              <Layout style={{ marginLeft: siderWidth }}>
                <Content style={{ background: "#fff", overflow: "scroll", minHeight: 800 }}>
                  <Switch>
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

                    <Route path={`${url}/finance/`}
                      render={(props) => (
                        <FinancePage
                          {...props}
                          onRef={this.onRef}
                        />
                      )}
                    />  

                    <Route path={`${url}/ticket/`}
                      render={(props) => (
                        <Ticket_page
                          {...props}
                          onRef={this.onRef}
                        />
                      )}
                    />

                    <Route path={`${url}/setting/`}
                      render={(props) => (
                        <SettingPage
                          {...props}
                          header_hidden={this.state.header_hidden}
                          onRef={this.onRef}
                        />
                      )}
                    />
                    <Route component={NotFound} />
                  </Switch>
                </Content>
              </Layout>
            </Layout>
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
    isFetching: state.globalState.isFetching,
    forwarder_info: state.shipping_platform_user.account.forwarder_info
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logout: bindActionCreators(user_account_actions.get_logout, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)

