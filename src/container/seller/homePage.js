import React, {Component, PropTypes} from 'react'
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { Dropdown, Button ,Avatar ,Layout, Menu, Breadcrumb, Icon ,Badge} from 'antd';
import newOrderPage from './newOrderPage'
import {actions} from '../../reducers/order'
import readyToshipPage from './readyToshipPage'
import checkForm from './components/checkForm'
import test from './components/motion/QueueAnim'
import NotFound from '../../components/notFound'


const { Header, Sider, Content, Footer} = Layout;
const { SubMenu } = Menu;
const submenus = [
    {name: '我的订单', iconType: 'carry-out', key: 'order' , url: '/order' , children :[ {url: '/new', name: '所有订单'}, {url: '/readyToship', name: '待寄送'}, {url: '/completed', name: '已寄送'},{url: '/cancel', name: '已取消'},{url: '/issue', name: '问题单'},    ]},
    {name: '我的店铺', iconType: 'wallet',key: 'finance' , url: '/finance' ,children  :[{url: '/balance', name: '财务明细'} ]},
    {name: '我的设置', iconType: 'setting', key: 'show' ,url: '/show' ,children  :[{url: '/test', name: '测试页'},{url: '/test1', name: '测试页1'},{url: '/test2', name: '测试页2'},{url: '/test3', name: '测试页3'}]},
];

const menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3rd menu item</a>
      </Menu.Item>
    </Menu>
  );


class user extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.props.getAllorder();
    }

    state = {
        collapsed: false,
      };

    toggle = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
      }


    getKeyOfSubMenus = () => {
        var str = this.props.history.location.pathname.substring('/seller/'.length)||'/' //  /seller/order/new   --->  order/new 
        var result = {
            parent : undefined ,
            childern : []
        }
        let initial = 0
        for (var i = 0 ; i < str.length ; i ++){
             if(str[i] == '/') {
                !result.parent ? result.parent = str.substring(initial , i ) : result.childern.push (str.substring(initial , i ))
                initial = i + 1 ; 
             }
             if(str.lastIndexOf('/') == i && str.substring(initial , str.length)){
                result.childern.push(str.substring(initial , str.length))
             }     
        }

        return { 
                 Parent :    result.parent  ,  //order/new   --> order
                 Children :  result.childern , //order/new   --> new 
                 LastChildOfUrl : '/' + result.childern[result.childern.length - 1]
           }
      }

    render(){
        const {url} = this.props.match;

        const parent = submenus.find(item => item.key == this.getKeyOfSubMenus().Parent)
        const getParentName = parent?parent.name : undefined
        const children = getParentName?submenus.find(item => item.name == getParentName ).children.find(item => item.url == this.getKeyOfSubMenus().LastChildOfUrl):undefined
        const getchildrenName = children?children.name : undefined
    
        return(
            <div>
            <Layout hasSider = {true} style={{height: '1400px' } }>
            {/* <Layout style={this.state.collapsed == false? { width: 280} : { width: 10} }> */}
                <Sider style={{ overflow: 'auto', height: '100%' }}
                 theme="light"
                 trigger={null}
                 collapsible
                 collapsed={this.state.collapsed}
                 width = {200}
                 >
                 <div className="logo" />
                    <Menu theme="light" mode="inline" 
                        //    defaultSelectedKeys={[(submenus[0].children)[0].url]}  
                           selectedKeys= {[this.getKeyOfSubMenus().LastChildOfUrl]}  
                           defaultOpenKeys = {[this.getKeyOfSubMenus().Parent]}
                           style={{ padding: '16px 0', width: '100%' }}>
                           {submenus.map((parent, index) =>  
                           <SubMenu key= {parent.key} 
                                    title={<span><Icon type={parent.iconType}/><span>{parent.name}</span></span>}
                                    onClick={({key}) =>  this.props.history.push(`/seller${parent.url}${key}`)}> 
                                    {parent.children.map((child, index) => 
                                    <Menu.Item 
                                     key = {child.url} ><span>{child.name}</span> 
                                     {/* <Badge offset = {[-10, 0]} count={this.props.order.length} /> */}
                                    </Menu.Item>) }
                           </SubMenu>)
                            } 
                    </Menu>
                </Sider> 
            {/* </Layout> */}

            {/* <p style={{marginLeft: '100px', }}>1231312321312312123123213223123123123123123</p> */}
    
                <Layout 
                // style={this.state.collapsed == false? { marginLeft: 10} : { marginLeft: 0} }
                // style={{ marginLeft: }}
                >
                        {/* <Header style={{ background: '#fff', padding: 0 , } }> */}
                        <Header style={{ background: '#fff', padding: 0  , display : 'flex' , justifyContent :'space-between'}}> 
                            <Icon
                                 className="trigger"
                                 style={{ fontSize: 25}}
                                 type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                 onClick={this.toggle}
                               />  
                
                           <div style= { {marginRight: '30px',  justifyContent :'space-between' }  } >  
                                <Icon type="search" style= { {marginRight: '20px'}  } />    
                                <Icon type="bell" style= { {marginRight: '20px'}  } />    
                                <Avatar size ='small' icon="user" style={{ marginRight: '3px'}} />   
                                <Dropdown overlay={menu} placement="bottomRight">       
                                    <span>用户中心</span>           
                                </Dropdown>                  
                           </div>                          
                        </Header> 

                       <Breadcrumb   style={{ margin: '1px 0', padding: 24, background: '#fff', }}>                             
                                     <Breadcrumb.Item><a href="/seller/order/new">首页</a></Breadcrumb.Item>
                                     { getParentName? <Breadcrumb.Item><span>{ getParentName }</span></Breadcrumb.Item>:undefined}
                                     { getchildrenName? <Breadcrumb.Item><span>{ getchildrenName }</span></Breadcrumb.Item>:undefined}
                       </Breadcrumb>
                     
                       <Content style={{ margin: '1px ', padding: 24, background: '#fff', overflow: 'auto' }}>
                                <div>
                                    <Switch>   
                                            <Route path ={`${url}/order/new`} component={newOrderPage}/>
                                            <Route path ={`${url}/order/readyToship`} component={readyToshipPage}/>
                                            <Route path ={`${url}/test1`} component={checkForm}/>
                                            <Route path ={`${url}/test3`} component={checkForm}/>
                                            <Route component={NotFound}/> 
                                    </Switch>
                                </div>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                             2019 Created by Kimmy
                       </Footer>
                </Layout>
            </Layout>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
           order:state.user.order,
           isFetching:state.globalState.isFetching
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return{
          getAllorder : bindActionCreators(actions.get_all_order,dispatch),
         }
  }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(user)

