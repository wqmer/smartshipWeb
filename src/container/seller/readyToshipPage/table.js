import React from 'react';
import ReactDOM from 'react-dom';
import QueueAnim from 'rc-queue-anim';
import 'antd/dist/antd.css';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { DeleteOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Button , Table , Divider} from 'antd';
import { Alert , Popconfirm, message , Checkbox} from 'antd';
import XLSX from 'xlsx'
import Animate from 'rc-animate';
import { TweenOneGroup } from 'rc-tween-one';
import { actions } from '../../../reducers/saveOrder'
import { actions as fetchOrderAction} from '../../../reducers/order'
import { actions as fileAction} from '../../../reducers/handleFile'
import EditableForm from '../components/editableFrom'
import GenerateSheet from './generateSheet'
import EditOrder from './editOrder'
import Moreaction from './moreAction'

import TweenOneGroupBody from '../components/motion/TweenOneGroup'
// import MyQueueAnim from '../components/motion/QueueAnim'
// import AnimateBody from '../components/motion/AntimateBody'



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
    checkAgent:['飞碟'],
    data: {}
  };

  handleCleanCheck = () => {
    this.setState({selectedRowKeys:[] ,  dataFromCheck :[]})
}

  
  handleOnchange = (selectedRowKeys, selectedRows) => {
      this.setState({ selectedRowKeys, dataFromCheck: selectedRows });
  }


  handleCheck = (status) => {
    if(status === '删除') this.props.deleteOrders(this.state.selectedRowKeys)
    this.setState( {selectedRowKeys: [],  dataFromCheck:[]})
  }

  

  handleMakrCheck = () => {
    this.setState( {selectedRowKeys: [],  dataFromCheck:[]})
  }

  showModal = () => {
    this.setState({ visible: true });
  }

 

  // handleCreate = () => {
  //   const form = this.formRef.props.form;
  //   form.validateFields((err, values) => {
  //     if (err) {
  //       return;
  //     }

  //     values._id = this.state.data._id
  //     this.props.saveOneorder(values);
  //     form.resetFields();
  //     this.setState({ visible: false });
  //      message.success('修改成功');// redux saga 异步确认
  //   });
  // }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }


onDelete(_id) {
    this.props.deleteOneorder(_id)
    this.setState( {selectedRowKeys: this.state.selectedRowKeys.filter((item) => item !== _id)} )
}

  // to do to anohter status
handleMarkToship(record , key){
  record.Status = key
  this.props.saveOneorder(record);
  this.setState( {selectedRowKeys: this.state.selectedRowKeys.filter((item) => item !== _id)} )
}


onChange = (checkedValues) => {
  this.setState({checkAgent:checkedValues})
  console.log('checked = ', checkedValues);
}

Oncancel = (e) => {
  console.log(e);
  message.error('已经取消');
}



render() {  


const CheckboxGroup = Checkbox.Group;
const plainOptions = ['飞碟', '快递二', '快递三'];

// console.log(this.props.isLoading)
// this.props.isLoading == true ? console.log('isloading') : console.log(this.props.workbook)

const rowSelection = { 
  selectedRowKeys : this.state.selectedRowKeys ,
  onChange: this.handleOnchange,
  hideDefaultSelections : true ,
  selections: [{
    key: 'all-data',
    text: '选择全部',
    onSelect: () => {
      this.setState({
        selectedRowKeys: [...this.props.order.map ( (item) => item._id)], // 
        dataFromCheck: [...this.props.order.map (item => item)]
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
  { title: '买家信息', key: 'customer', align : 'center' , 
  children: [
  { title: '名字',  dataIndex: 'Name', key: 'Name', align : 'center' }, 
  { title: '联系方式', dataIndex: 'PhoneNumber',  key: 'PhoneNumber', align: 'center'},
  // { title: '证件号', dataIndex: 'Id',  key: 'Id', align : 'center'},
  // { title: '创建时间', dataIndex: 'createdAt',  key: 'createdAt', align : 'center'},

],   

//  render: (text , record )=> (
//   <span>
//        <p> 姓名 ： {record.Name}</p>
//        {/* <p> 证件号 ： {record.Id}</p> */}
//   </span>
//       ),      
} ,   
 

{ title: '产品信息', key: 'Product', align : 'center' , 
children: [

  { title: '名称',  dataIndex: 'Product', key: 'ProductName', align : 'center' }, 
  { title: '数量', dataIndex: 'Quantity',  key: 'PorductQuantity', align : 'center'},
  { title: '规格', dataIndex: 'Standard',  key: 'Standard', align : 'center'},

],   
},


{ title: '物流信息', 
  children: [
    

    // { title: '买家备注',  key: 'messange', align : 'center' , render: (text , record )=> (
    //   <span>
    //        <p>请尽快处理，谢谢！</p>
    //        {/* <p> 证件号 ： {record.Id}</p> */}
    //   </span>
    //       ),      
    // },
    { title: '省', dataIndex: 'Province',  key: 'Province', align : 'center' }, 
    { title: '城市',   dataIndex: 'City', key: 'City', align : 'center' }, 
    { title: '区',  dataIndex: 'District', key: 'District', align : 'center' }, 
    { title: '地址', dataIndex: 'Address',  key: 'Address', align : 'center'},
    // { title: '创建时间', dataIndex: 'createdAt',  key: 'createdAt', align : 'center'},
  
  ],    
} ,  

{ title: '操作', key: 'action',   align : 'center',              
       render: (text , record )=> (
<span>
    <a onClick={() => { this.showModal()
                            this.handleData(record)
                           }}
    icon ='edit' type="default" >编辑</a> 

    <Divider type="vertical" />
    <Moreaction 
       handleMarkToship = {(record ,key) => this.handleMarkToship(record,key)} //子组件向父组件传值
       onDelete = {this.onDelete.bind(this)} //子组件向父组件传值 第二种方式
       cancel = {this.Oncancel.bind(this)}  
       data = {record} />

</span>
    ),
}  
];

  return (
    <div>
        <CheckboxGroup style={ { marginBottom : '20px'  } } options={plainOptions} defaultValue={['飞碟']}  disabled = {this.state.selectedRowKeys.length == 0} onChange={this.onChange} />
        <div>
                     <div style = { { display : 'inline' } }>  
                     {/* <Button disabled = { false && this.state.selectedRowKeys.length == 0} onClick = {() => this.handleGenerateOrder()} type="primary" icon = 'export' style={ { marginBottom : '10px'} } > 生成订单</Button>    */}
                    <GenerateSheet agentType = {this.state.checkAgent} data = {this.state.dataFromCheck}/>
                 
                    </div>              
                       <div style = {{display:'inline'}}   >             
                        {this.state.selectedRowKeys.length == 0 ? <span></span>: <Button  type="default" icon = {<PaperClipOutlined />} style={ { marginBottom : '10px', marginLeft: '10px' } } > 标记勾选</Button>}
                        {this.state.selectedRowKeys.length == 0 ? <span></span>: <Button  onClick = { () => this.handleCheck('删除')}  type="danger" icon = {<DeleteOutlined />} style={ { marginBottom : '10px', marginLeft: '10px'  } } > 删除勾选</Button>}  
                    </div>      
        </div>

    <Alert style={ { marginBottom : '10px' } } 
           message =  { <div>已经选择 <a style ={{marginLeft :'5px' ,marginRight :'5px' }} >{this.state.selectedRowKeys.length}</a>项<a onClick = {this.handleCleanCheck} style ={{marginLeft :'30px'}}>取消选择</a> </div> }      
           type="info" showIcon />
   <Table   
     components={{
       body: { wrapper:  TweenOneGroupBody  },
     }}
     // components={{
     //   body: { wrapper: MyQueueAnim  },
     // }}
     // components={{
     //   body: { wrapper: AnimateBody  },
     // }}
     pagination={{ pageSize: 8, }} 
     rowKey = {record => record._id}  
     rowSelection={rowSelection} 
     columns={columns}  
     dataSource ={this.props.order.filter((item) => item.Status === '待发货')} 
     // bordered
     // expandRowByClick ={true}
     // expandedRowRender = {expandedRowRender}
  />

  </div>
  );
     }
}



function mapStateToProps(state) {
  return {
         order:state.user.order,
         isFetching:state.globalState.isFetching,
         isLoading:state.globalState.isLoading,
         workbook:state.file,
         message:state.globalState.message
  }
}

function mapDispatchToProps(dispatch) {
  return{
        deleteOrders : bindActionCreators(fetchOrderAction.delete_orders, dispatch),
        deleteOneorder : bindActionCreators(actions.delete_one_order, dispatch),
        getAllorder : bindActionCreators(fetchOrderAction.get_all_order,dispatch),
        saveOneorder : bindActionCreators(actions.save_one_order, dispatch),
        getWorkBook : bindActionCreators(fileAction.get_workbook, dispatch),
       }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyTable)

