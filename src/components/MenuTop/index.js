import { AuditOutlined, HomeOutlined, DashboardOutlined, DollarOutlined, AppstoreAddOutlined, SettingOutlined, TeamOutlined } from "@ant-design/icons"
import { Menu } from "antd"
import React from "react"

class MenuTop extends React.Component {
  constructor(props) {
      super(props);
  }
  state = {
      current: "client",
  }

  handleClick = e => {
    const KeyMapRouter = {
      "dashboard": `/forwarder/${e.key}/project_summary`,
      "warehouse": `/forwarder/${e.key}/ship`,
      "order": `/forwarder/${e.key}/draft`,
      "client": `/forwarder/${e.key}/list`,
      "ledger": `/forwarder/${e.key}/list`,
      "ticket": `/forwarder/${e.key}/list`,
      "setting": `/forwarder/${e.key}/shipping_carrier`
    }

    this.props.history.push(KeyMapRouter[e.key])
  }

  render() {
    return (
      <Menu
        onClick={this.handleClick}
        style={{ display: "inline-block", fontSize: 16, lineHeight: "63px" }}
        selectedKeys={[this.props.current_selected]}
        mode="horizontal">
        <Menu.Item key="dashboard">
          <DashboardOutlined />
          工作台
        </Menu.Item>
        <Menu.Item key="order" >
          <AuditOutlined />
          订单管理
        </Menu.Item>
        <Menu.Item key="warehouse"  >
          <HomeOutlined />
          仓库管理
        </Menu.Item>
        <Menu.Item key="client" >
          <TeamOutlined />
          客户管理
        </Menu.Item>
        <Menu.Item key="ledger" >
          <DollarOutlined />
          账目中心
        </Menu.Item>
        <Menu.Item key="ticket" >
          <AppstoreAddOutlined />
          工单中心
        </Menu.Item>
        <Menu.Item key="setting" >
          <SettingOutlined />
          设置中心
        </Menu.Item>
      </Menu>
    )
  }
}

export default MenuTop