import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { FileExcelOutlined, UploadOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Upload, Button, Modal, Input, Radio, Select, message } from 'antd';
// import {actions} from '../../../reducers/saveOrder'
import {actions as OrdersAction} from '../../../reducers/order'
import EditableForm from '../components/addableFrom'


class CollectionsPage extends React.Component {
  constructor(props){
        super(props);
    }

  state = {
    ModalText: '可以同时上传多个xls，xlsx文件，或者文件夹',
    visible: false,
    confirmLoading: false,
    data : [] 
  }
  
  setDefault = () =>{
    this.setState({     
    ModalText: '请选择 xls, xlxs结尾等表格文件',
    visible: false,
    confirmLoading: false,
    data : [] 
   });
  }

  showModal = () => {
    this.setState({ visible: true });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  handleOk = () => {
    let finalData = []
    this.state.data.forEach ( item => {
      finalData = finalData.concat(item.dataArray)
    })
    this.props.covertandSaveOrder(finalData);
    this.setState({
      ModalText: '导入成功后自动关闭窗口',
      confirmLoading: true,
    });
  }

  handleChange = (info) => { 
    { 
      if (info.file.status === 'done') {
        this.setState({ 
                        data: [...this.state.data , { key : info.file.uid , dataArray: info.file.response.data  ,} ]
                      });
        message.success(`${info.file.name} 上传成功`);
  
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败.`);
      }
    } 
  }
  
  handleRemove = (info) => {

    this.setState({
      data: this.state.data.filter((item) => item.key !== info.uid)
    });
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.message == '导入成功') {setTimeout(() => { this.setState({  visible: false,  confirmLoading: false, });
                                         }, 1000) 
    } else if ( nextProps.message == '导入失败' ) {
      this.setState({  ModalText: nextProps.message, confirmLoading: false, })
    }
  
  }


  render() {
    const { visible, confirmLoading, ModalText, impotButtomIsDisable } = this.state;
    const props = {
      name: 'excel',
      action: '/api/uploadAndConvert',
      headers: {
        authorization: 'authorization-text',
      },
      onChange: this.handleChange,
      onRemove: this.handleRemove,
    };
    

    return (
      <div style = {{display:'inline'}}    >
        <Button type="primary" icon = {<FileExcelOutlined />} onClick={this.showModal} style={ { marginBottom : '10px' , marginLeft: '10px' } } > 批量导入</Button>
        <Modal
          title="本地上传"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          okButtonProps={{ disabled: this.state.data.length == 0 }}
          cancelText ='取消'
          okText = '导入'
          afterClose = {this.setDefault}
          destroyOnClose = {true}
          maskClosable = {false}
        >

          <Upload accept = '.xlsx,.xls'  {...props}>          {/* 此处添加限制 */}
          <Button style = { {display:'inline'} }  > <UploadOutlined /> 请选择文件 </Button>
          <p style = {{ marginLeft:'30px' ,   display:'inline'}} >{ModalText}</p>
          </Upload>
       
        </Modal>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
         message:state.globalState.message
  }
}

function mapDispatchToProps(dispatch) {
  return{
        // saveOneorder : bindActionCreators(actions.save_one_order, dispatch),
        covertandSaveOrder :  bindActionCreators(OrdersAction.save_orders, dispatch)
       }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CollectionsPage)



// export default CollectionsPage 




