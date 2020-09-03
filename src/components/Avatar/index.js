import { Space, Avatar, Menu, Dropdown, } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React, { Component, PropTypes, useState } from 'react'



const menu = (props) => {
    return (
        <Menu>
            <Menu.Item key="0">
                <a onClick={() => {
                    props.logout()
                }}>
                    登出
                </a>
            </Menu.Item>
            <Menu.Item key="1">
                <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                    账户信息
                </a>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="3" disabled>
                账户权限
            </Menu.Item>
        </Menu>
    )
}



const MyAvatar = (props) => {
    const [background, setBackground] = useState('#FFFFFF');
    return (
        <div
            onMouseLeave={() => setBackground('#FFFFFF')}
            onMouseEnter={() => setBackground('#F8F8F8')}
            style={{ cursor: 'pointer', paddingLeft: 8, paddingRight: 8, background: background }}
        >
            <Dropdown
                overlay={menu(props)}
                // trigger={['click']}
                placement="bottomCenter">
                <Space >
                    <Avatar size="small" icon={<UserOutlined />} />
                    <span>用户名</span>
                </Space>
            </Dropdown>
        </div>
    )
}

// style ={{background : '#F8F8F8'}}


export default MyAvatar