import React from 'react';
import ReactDOM from 'react-dom';
import QueueAnim from 'rc-queue-anim';
import 'antd/dist/antd.css';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {
  DeleteOutlined,
  DownOutlined,
  PaperClipOutlined,
  QuestionCircleFilled,
  SyncOutlined,
} from '@ant-design/icons';
import { Menu, Dropdown, Button, Table, Divider } from 'antd';
import { Popconfirm, message} from 'antd';
import Animate from 'rc-animate';
import { TweenOneGroup } from 'rc-tween-one';
import { Alert } from 'antd';

import { actions } from '../../../reducers/saveOrder'
import { actions as fetchOrderAction} from '../../../reducers/order'
import Moreaction from './moreAction'
import EditableForm from '../components/editableFrom'
import EditOrder from './editOrder'
import AddOrder from './addOneOrder'
import AddBatchOrder from './addBtachOrder'
import TweenOneGroupBody from '../components/motion/TweenOneGroup'

// import  Message from '../components/message'
// import MyQueueAnim from '../components/motion/QueueAnim'
// import AnimateBody from '../components/motion/AntimateBody'

const menu = (
  <Menu >
    <Menu.Item key="1">USPS</Menu.Item>
    <Menu.Item key="2">UPS 2nd Day air</Menu.Item>
    <Menu.Item key="3">FEDEX Ground</Menu.Item>
  </Menu>
);


class MyTable extends React.Component {
  constructor(props) { 
  super(props) 
  }

  static getDerivedStateFromProps  = (nextProps) => {
    if(nextProps.message)message.success(nextProps.message)
    return null
  }

  state = {
    visible: false,
    selectedRowKeys: [] ,
    dataFromCheck : [] ,
    data: {},
    message : ''
  };


  handleOnchange = (selectedRowKeys, selectedRows) => {
      this.setState({ selectedRowKeys, dataFromCheck: selectedRows });
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  }


  handleCheck = (Status) => {
    if(Status === '删除') this.props.deleteOrders(this.state.selectedRowKeys)
    if(Status ==='待寄送') {
      var request = {
      }
      request.id = this.state.selectedRowKeys ;
      request.updateContent = {Status}
      this.props.updateOrders(request);
    }
    this.setState( {selectedRowKeys: [],  dataFromCheck:[]})
  }

  handleCleanCheck = () => {
    this.setState({selectedRowKeys:[] ,  dataFromCheck :[]})
}


  Oncancel = (e) =>{
    console.log(e);
    message.error('已经取消');
  }
  

  onDelete(_id) {

    this.props.deleteOneorder(_id)
    this.setState( {selectedRowKeys: this.state.selectedRowKeys.filter((item) => item !== _id)} )
}


handleMarkToship(data, key){
    data.Status = key
    this.props.saveOneorder(data);// update
    this.setState( {selectedRowKeys: this.state.selectedRowKeys.filter((item) => item !== _id)} )
}


render() {  
const rowSelection = { 
  selectedRowKeys : this.state.selectedRowKeys ,
  onChange: this.handleOnchange,
  hideDefaultSelections : true ,
  selections: [{
    key: 'all-data',
    text: '选择全部',
    onSelect: () => {
      this.setState({
        selectedRowKeys: [...this.props.order.map ( (item) => item._id)], // 0...45
      });
    },
  }],  
};         

// const expandedRowRender = (record) => {
//   const columns = [
//     { title: '联系电话', dataIndex: 'PhoneNumber' , align : 'center'}, 
//     { title: '地址', dataIndex: 'Address', align : 'center' }, 
//     { title: '身份证号码',dataIndex: 'Id', align : 'center'} ,     
//   ];
//   return (
//     <Table
//       rowKey = {record => record._id}  
//       columns={columns}
//       dataSource={this.props.order.filter( (item ) => item._id == record._id ) }
//       pagination={false}
//       // components={{
//       //    header:{ wrapper: TweenOneGroupBody }
//       //   // body: { cell:  TweenOneGroupBody   },
//       // }}
//     />
//   );
// };



const columns = [ 
  // { title: '买家信息', key: 'customer', align : 'center' , 
  //   children: [
  //   { title: '名字',  dataIndex: 'Name', key: 'Name', align : 'center' }, 
 
  //   { title: '联系方式', dataIndex: 'PhoneNumber',  key: 'PhoneNumber', align : 'center'},
  //   // { title: '创建时间', dataIndex: 'createdAt',  key: 'createdAt', align : 'center'},
  
  // ],   
  
   
  // } ,   

  //  { title: '联系方式', key: 'contact', align : 'center' ,  render: (text , record )=> (
  //   <span>
  //        <p> 电话 ： {record.PhoneNumber}</p>     
  //   </span>
  //       ),      
  // } ,  
      { title: '订单编号',  width: 100, dataIndex: '_id', key: '_id', align : 'center',  fixed: 'left' }, 
      { title: '寄送人',dataIndex: 'SenderAddress', key: 'SenderAddress', align : 'center' }, 
      { title: '状态',dataIndex: 'Status',  key: 'Status', align : 'center'},
      { title: '寄送方式',   dataIndex: 'ShipMethod',  key: 'ShipMethod', align : 'center' ,
        render: (record) => (
          <span >
            {/* <Button>UPS gournd< Icon type="down" /> </Button> */}
           <Dropdown overlay={menu}>
                    <a>UPS Gournd <DownOutlined /></a>
           </Dropdown>
           </span> 
            ),
      },
      { title: '预估运费', dataIndex: 'Rate',  key: 'Rate', align : 'center' ,
         render: (record) => (
         <span> {record} <SyncOutlined /></span> 
          ), 
      },

      { title: '地址1', dataIndex: 'Address1',  key: 'Address1', align : 'center',
        render: (record) => (
        <span> <QuestionCircleFilled /> <span>  </span>  {record} </span> 
         ),     
      },
      { title: '城市', dataIndex: 'City',  key: 'City', align : 'center'},
      { title: '州', dataIndex: 'State',  key: 'State', align : 'center'},
      { title: '邮编', dataIndex: 'Zipcode', key: 'Zipcode', align : 'center'},
      { title: '收件人',  dataIndex: 'Name', key: 'Name', align : 'center' }, 
      { title: 'sku',  dataIndex: 'Reference1', key: 'Reference1', align : 'center' }, 
      { title: '备注',  dataIndex: 'Reference2', key: 'Reference2', align : 'center' }, 
      { title: '重量', dataIndex: 'Weight',  key: 'Weight', align : 'center'},
 
      { title: '地址2', dataIndex: 'Address2',  key: 'Address2', align : 'center'},
      { title: '买家备注', dataIndex: 'Message', key: 'Messange', align : 'center' ,   },
      { title: '创建时间', dataIndex: 'createdAt',  key: 'createdAt', align : 'center'},  
  

  // { title: '收货地址', key: 'address', align : 'center' ,  render: (text , record )=> (
  //   <span>
  //        <p> 地址 ： {record.Address}</p>
  //        <p> 省份 ： 默认省</p>
  //   </span>
  //       ),      
  // } ,  

  // { title: '订单信息', key: 'order', align : 'center' ,  render: (text , record )=> (
  //   <span>
  //        <p> 创建时间 ： {record.createdAt}</p>
  //        {/* <p> 订单号 ： {record._id}</p> */}
  //   </span>
  //       ),      
  // } ,  

     
// { title: '操作', key: 'action',   align : 'center',              
//        render: (text , record )=> (
// <span>
  
//   <a type="defa" >选项一</a>  
//   <Divider type="vertical" />
//   <Moreaction 
//   //  handleMarkToship = {(record ,key) => this.handleMarkToship(record,key)} //子组件向父组件传值
//    onDelete = {this.onDelete.bind(this)} //子组件向父组件传值 第二种方式
//    cancel = {this.Oncancel.bind(this)}  
//    data = {record} />
// </span>
//     )
// }  
];

  return (
    <div> 
       <div style = {{display : 'inline'} } >                             
                      <AddOrder  />
                      <AddBatchOrder />
       </div>                        
       <div style = {{display:'inline'}}   >          
            {/* <Button disabled = {this.state.selectedRowKeys.length == 0} type="primary" icon = 'export' style={ { marginBottom : '10px'} } > 生成订单</Button> */}
            {this.state.selectedRowKeys.length == 0 ? <span></span> :  <Button onClick = {() => this.handleCheck('待发货')} type="default" icon = {<PaperClipOutlined />} style={ { marginBottom : '10px', marginLeft: '10px' } } > 标记勾选</Button>}    
            {this.state.selectedRowKeys.length == 0?  <span></span> :  <Button onClick = {() => this.handleCheck('删除')} type="danger" icon = {<DeleteOutlined />} style={ { marginBottom : '10px', marginLeft: '10px'  } } > 删除勾选</Button>  }
      </div>
     
        
   <Alert style={ { marginBottom : '10px' } } 
          message=  { <div>已经选择 <a style ={{marginLeft :'5px' ,marginRight :'5px' }} >{this.state.selectedRowKeys.length}</a>项<a onClick = { this.handleCleanCheck } style ={{marginLeft :'30px'}}>取消选择</a> </div> }      
          type="info" showIcon />

   <Table   
     components={{
       body: { wrapper:  TweenOneGroupBody  },
     }}
     pagination={{ pageSize: 50 }} 
     rowKey = {record => record._id}  
     rowSelection={rowSelection} 
     columns={columns}  
     dataSource ={this.props.order} 
     scroll={{ x: 2000 }}
     // bordered
  />
  </div>
  );
     }
}



function mapStateToProps(state) {
  return {
         order:state.user.order,
         message:state.globalState.message
  }
}

function mapDispatchToProps(dispatch) {
  return{
        deleteOrders : bindActionCreators(fetchOrderAction.delete_orders, dispatch),
        deleteOneorder : bindActionCreators(actions.delete_one_order, dispatch),
        getAllorder : bindActionCreators(fetchOrderAction.get_all_order,dispatch),
        saveOneorder : bindActionCreators(actions.save_one_order, dispatch),
        updateOrders : bindActionCreators(fetchOrderAction.update_orders, dispatch),
       }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyTable)

