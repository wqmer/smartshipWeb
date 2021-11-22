import { Space, Avatar, Menu, Dropdown, } from "antd"
import { UserOutlined } from "@ant-design/icons"
import React, { useState } from "react"

const menu = (props) => {
  return (
    <Menu>
      <Menu.Item key="0">
        <a onClick={() => {props.logout()}}>登出</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a target="_blank" rel="noopener noreferrer" href="#">账户信息</a>
      </Menu.Item>
    </Menu>
  )
}

const UserAvatar = (props) => {
  const [background, setBackground] = useState("#FFFFFF")

  return (
    <div
        onMouseLeave={() => setBackground("#FFFFFF")}
        onMouseEnter={() => setBackground("#F8F8F8")}
        style={{ cursor: "pointer", paddingLeft: 8, paddingRight: 8, background: background }}
      >
      <Dropdown
        overlay={menu(props)}
        placement="bottomCenter">
        <Space >
          <Avatar size="small" icon={<UserOutlined />} />
          <span>{props.username}</span>
        </Space>
      </Dropdown>
    </div>
  )
}

export default UserAvatar