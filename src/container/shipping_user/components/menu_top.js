import { Menu, Icon } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';

const { SubMenu } = Menu;

class Menu_Top extends React.Component {
    constructor(props) {
        super(props);
      }
    state = {
        current: 'mail',
    };

    handleClick = e => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    };

    render() {
        return (
            <Menu
                // style={{   display: 'inline-block', }}
                onClick={this.handleClick}
                style={{  display: 'inline-block', paddingLeft:64, fontSize: 16, width: '50%', lineHeight: '63px' }}
                // selectable ={false}
                // selectedKeys={[this.state.current]}
                mode="horizontal">
                <Menu.Item key="dashboard">
                     <Icon type="dashboard" />
                    工作台
                </Menu.Item>
                {/* <Menu.Item key="track" >
                    <Icon type="barcode" />
                    轨迹查询
                </Menu.Item>
                <Menu.Item key="rate"  onClick={() => this.props.history.push(`/user/tool/rate_estimate`)} >     
                    <Icon type="calculator" />
                    运费试算
                </Menu.Item> */}
                <Menu.Item key="wallet" >
                    <Icon type="dollar" />
                    财务管理
                </Menu.Item>
                <Menu.Item key="setting" >
                    <Icon type="setting" />
                    设置中心
                </Menu.Item>
                {/* <SubMenu
                    title={
                        <span className="submenu-title-wrapper">
                            <Icon type="calculator" />
                            运费试算
                        </span>
                    }
                >
                    <Menu.ItemGroup title="Item 1">
                        <Menu.Item key="setting:1">Option 1</Menu.Item>
                        <Menu.Item key="setting:2">Option 2</Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup title="Item 2">
                        <Menu.Item key="setting:3">Option 3</Menu.Item>
                        <Menu.Item key="setting:4">Option 4</Menu.Item>
                    </Menu.ItemGroup>
                </SubMenu> */}
                {/* <Menu.Item key="alipay">

                    <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                        财务管理
                     </a>
                </Menu.Item> */}
            </Menu>
        );
    }
}

export default Menu_Top