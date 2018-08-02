import React, {Component, PropTypes} from 'react'
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import balance from './asset'
import test from './components/test'
// import Sidebar from "./components/sidebar"

const { Header, Sider, Content, Footer} = Layout;
const { SubMenu } = Menu;

const submenus = [
    {name: 'account', iconType: 'user', children :[{url: '/', name: 'profile'}, {url: '/security', name: 'security'}]},
    {name: 'asset', iconType: 'wallet', children  :[{url: '/balance', name: 'balance'} ]},
    {name: 'setting', iconType: 'setting', children  :[{url: '/api', name: 'api'}]},
];

class user extends Component{
    constructor(props){
        super(props);
    }

    state = {
        collapsed: false,
      };
    toggle = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
      }

    render(){
        const {url} = this.props.match;
        var keyOfchildren = this.props.history.location.pathname.substring('/user'.length)||'/'
        if( keyOfchildren.slice(-1) == '/' && keyOfchildren.length > 2 ) {
            keyOfchildren = keyOfchildren.slice(0, -1) 
         }
        var keyOfparent = submenus.find( item => item.children.find(item => item.url === keyOfchildren ) ).name

        return(
            <div>
            <Layout style={{ height: '1400px' } }>
                <Sider
                 trigger={null}
                 collapsible
                 collapsed={this.state.collapsed}
                 width = {280}>
                 <div className="logo" />
                    <Menu theme="dark" mode="inline" 
                           //defaultSelectedKeys={[(submenus[0].children)[0].url]}  
                           selectedKeys={[keyOfchildren]}  
                           defaultOpenKeys = {[keyOfparent]}
                           style={{ padding: '16px 0', width: '100%' }}>
                           {submenus.map((item, index) => 
                           <SubMenu key= {item.name} title={<span><Icon type={item.iconType}/><span>{item.name}</span></span>}
                                    onClick={({key}) => {this.props.history.push(`/user${key}`)}}> 
                                    {item.children.map((item, index) => 
                                    <Menu.Item key = {item.url} > <span>{item.name}</span></Menu.Item>)}
                           </SubMenu>)
                            } 
                    </Menu>
                </Sider>  
                <Layout>
                        <Header style={{ background: '#fff', padding: 0 }}>
                               <Icon
                                 className="trigger"
                                 style={{ fontSize: 25}}
                                 type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                 onClick={this.toggle}
                               />
                        </Header>
                        <Content style={{ margin: '24px 16px 0', padding: 24, background: '#fff', overflow: 'initial' }}>
                                <div>
                                    <Switch> 
                                            <Route exact path ={url} />
                                            <Route path ={`${url}/balance`} component={balance}/>
                                            <Route path ={`${url}/api`} component={test}/>
                                    </Switch>
                                </div>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                                 Ant Design ©2018 Created by Ant UED
                       </Footer>
                </Layout>
            </Layout>
            </div>
        )
    }

    // componentDidMount() {
    // }
}

// function mapStateToProps(state) {
// }

// function mapDispatchToProps(dispatch) {
// }

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(user)


export default user 