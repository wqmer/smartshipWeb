import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Modal, Input, Radio, Select, message } from 'antd';

import {actions} from '../../../reducers/saveOrder'
import EditableForm from '../components/addableFrom'
import Message from '../components/message'




class CollectionsPage extends React.Component {
  state = {
    visible: false,
    message:''
  };


  showModal = () => {
    this.setState({ visible: true }); 
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  handleCreate = (e) => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      } 
      e.preventDefault();
      // console.log(values)
      this.props.saveOneorder(values);
      form.resetFields();
      this.setState({ visible: false , message:'添加成功' });
      // message.success('添加成功');
      // redux saga 异步确认
    });
  }


  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  render() {
    // message.success('修改成功')
    return (
      <div style = {{display:'inline'}}    >
        <Button type="primary" icon = {<PlusOutlined />} style={ { marginBottom : '10px' }  } onClick={this.showModal}>创建订单</Button>
        {/* <Button type="dashed" icon = 'file-excel' style={ { marginBottom : '10px' , marginLeft: '10px' } } > 批量导入</Button> */}
        <EditableForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
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
        saveOneorder : bindActionCreators(actions.save_one_order, dispatch)
       }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CollectionsPage)



// export default CollectionsPage 




