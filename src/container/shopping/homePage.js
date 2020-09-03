import { GiftOutlined, RiseOutlined, SearchOutlined, ShoppingOutlined, SkinOutlined } from '@ant-design/icons';
import { Divider, Layout, Menu, Breadcrumb, Button } from 'antd';
import   React, {Component, PropTypes} from 'react'
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import showPage from './showPage/showPage'
import orderDetail from './orderFormPage/orderFormPage'
import NotFound from '../../components/notFound'
import { createBrowserHistory } from 'history';
import orderStatus from './component/OrderStatus'
import submitFailure from './component/submitFailure'

const { Header, Content, Footer , Sider} = Layout;
const { SubMenu } = Menu;



class HomePage extends Component{
  constructor(props){
      super(props);
  }

render(){
 const {url} = this.props.match;
 return (
   <Layout  hasSider = {false} style={{ height: '2000px' } }>
      <Header  style={{ borderBottom:'0.5px solid LightGrey', position: 'fixed', zIndex: 1, width: '100%' ,display:'flex', justifyContent :'space-between',background:'white'}}>
        <div style ={ {width:'140px', height:'31px' ,margin :'16px 32px 16px 0', float: "left" , background: 'white'} } />


       <Content  style = { { display:'flex',justifyContent :'space-between'}}> 
             <Menu      
                   mode="horizontal"
                   style={{borderBottom:'0.5px solid LightGrey',height: '100%',lineHeight: '64px' } }
              >
                    <Menu.Item  key="show"><RiseOutlined />热销</Menu.Item>
                    <Menu.Item  key="dress"><SkinOutlined />服饰</Menu.Item>
                    <Menu.Item  key="comestic"><GiftOutlined />化妆品</Menu.Item>
             </Menu> 
             <div>
                 { window.location.href == 'http://localhost:8080/shop/orderDetail' ? <p >欢迎，游客！</p> :  
                 <div>
                     <a style = {{marginRight : '20px'}} onClick = { () => this.props.history.push(`${url}/orderDetail`) } ><ShoppingOutlined style = {{marginRight : '10px'}}></ShoppingOutlined>定制订单</a> 
                     <a style = {{marginRight : '20px'}} onClick = { () => this.props.history.push(`${url}/orderTrack`) } ><SearchOutlined style = {{marginRight : '10px'}}></SearchOutlined>查询订单</a> 
                 </div>
                }
             </div>

       </Content>

       
    {/* <Icon type="bell" style= { {marginRight: '20px'}  } />   */}
      </Header>    


       <Content style={{ marginTop: 64, marginBottom: 64 , padding: 24, background: '#fff', overflow: 'auto' }}>

          <Breadcrumb style={{ marginBottom: 10 ,marginLeft:'26px'}}>
                            <Breadcrumb.Item>首页</Breadcrumb.Item>
                            <Breadcrumb.Item>商品</Breadcrumb.Item>
                            <Breadcrumb.Item>某分类</Breadcrumb.Item>
          </Breadcrumb> 
         
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
          {window.location.href != 'http://localhost:8080/shop/home' ? <div></div>:
          <Sider id ="sider" width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              // defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              selectable ={false}
              style={{ borderRight:'0.5px solid white', height: '100%' }}
            >
              <SubMenu key="sub1" title={<h3>第一级分类A</h3>}>
                <Menu.Item key="1">二级分类A</Menu.Item>
                <Menu.Item key="2">二级分类B</Menu.Item>
                <Menu.Item key="3">二级分类C</Menu.Item>
                <Menu.Item key="4">二级分类D</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" title={<h3>第一级分类B</h3>}>
                <Menu.Item key="1">二级分类A</Menu.Item>
                <Menu.Item key="2">二级分类B</Menu.Item>
                <Menu.Item key="3">二级分类C</Menu.Item>
                <Menu.Item key="4">二级分类D</Menu.Item>
              </SubMenu>
              <SubMenu key="sub3" title={<h3>第一级分类C</h3>}>
                <Menu.Item key="1">二级分类A</Menu.Item>
                <Menu.Item key="2">二级分类B</Menu.Item>
                <Menu.Item key="3">二级分类C</Menu.Item>
                <Menu.Item key="4">二级分类D</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>}
          <Content style={{ padding: '0 32px', minHeight: 280 }}>
          <div> 
          <h2 style = {{ marginLeft : window.location.href == 'http://localhost:8080/shop/orderDetail' ?'200px':'0px'}}>商品页面</h2>

       
              <Switch> 
                       <Route path ={`${url}/home`} component={showPage}/>
                       <Route path ={`${url}/orderDetail`} component={orderDetail}/> 
                       <Route path ={`${url}/orderStatus/:id`} component={orderStatus}/> 
                       <Route path ={`${url}/submitFailure`} component={submitFailure}/> 
                       <Route component={NotFound}/> 
              </Switch> 


          </div>
          </Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
 );
  }
}

export default HomePage


// #components-layout-demo-fixed .logo {
//   width: 120px;
//   height: 31px;
//   background: rgba(255,255,255,.2);
//   margin: 16px 24px 16px 0;
//   float: left;
// }