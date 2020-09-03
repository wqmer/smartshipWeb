import {
  HomeOutlined,
  PhoneOutlined,
  ProfileOutlined,
  ProjectOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { Spin, Button, Input, DatePicker, TimePicker, Select, InputNumber } from 'antd';
import React, { Component, PropTypes } from 'react'
import ChinaSelector from '../component/ChinaDivisionSelector'
import { pca, pcaa } from 'area-data'; // v3 or higher
import 'react-area-linkage/dist/index.css'; // v2 or higher
import { AreaSelect, AreaCascader } from 'react-area-linkage';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'


import { actions } from '../../../reducers/saveOrder'

const hasErrors = (fieldsError) => Object.keys(fieldsError).some(field => fieldsError[field]);


const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

class orderDetailForm extends React.Component {
  constructor(props) {
    super(props);
  }

  state = { loading: false }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ loading: true })
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.Province = Object.values(values.area[0])
        values.City = Object.values(values.area[1])
        values.District = Object.values(values.area[2])
        values.history = this.props.history
        // console.log('Received values of form: ', values);

        setTimeout(() => this.props.saveOneorder(values), 2000);
      }
    });
  }

  render() {
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;

    const userNameError = isFieldTouched('Name') && getFieldError('Name');
    const idError = isFieldTouched('Id') && getFieldError('Id');
    const areaError = isFieldTouched('area') && getFieldError('area');
    const addressError = isFieldTouched('Address') && getFieldError('Address');
    const phoneError = isFieldTouched('PhoneNumber') && getFieldError('PhoneNumber');
    const classError = isFieldTouched('Class') && getFieldError('Class');
    const productError = isFieldTouched('Product') && getFieldError('Product');
    const brandError = isFieldTouched('Brand') && getFieldError('Brand');
    const quantityError = isFieldTouched('Quantity') && getFieldError('Quantity');


    return (
      <div>
        <Spin spinning={this.state.loading} tip="产生订单中">
          <Form style={{ margin: '30px 500px 0px 250px ' }} layout='horizontal' onSubmit={this.handleSubmit}>
            <Form.Item
              {...formItemLayout}
              validateStatus={userNameError ? 'error' : ''}
              help={userNameError || ''}
              style={{ width: 'calc(100% - 10px)' }}
              label="姓名"
            >
              {/* <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="真实姓名" /> */}
              {getFieldDecorator('Name', { rules: [{ required: true, message: '请输入你的姓名!' }], })(
                <Input style={{ width: '40%' }} prefix={<ProfileOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="真实姓名" />
              )}
            </Form.Item>


            <Form.Item
              {...formItemLayout}
              validateStatus={idError ? 'error' : ''}
              help={idError || ''}
              style={{ width: 'calc(100% - 10px)' }}
              label="身份证号码"
            >
              {/* <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="真实姓名" /> */}
              {getFieldDecorator('Id', { rules: [{ required: true, message: '请输入你的身份证号码!' }], })(
                <Input style={{ width: '60%' }} prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="证件号码" />
              )}
            </Form.Item>


            <Form.Item
              {...formItemLayout}
              validateStatus={phoneError ? 'error' : ''}
              help={phoneError || ''}
              style={{ width: 'calc(100% - 12px)' }}
              label="手机"
            >
              {getFieldDecorator('PhoneNumber', {
                rules: [{ required: true, message: '请输入你的手机号码!' }],
              })(
                <Input style={{ width: '60%' }} prefix={<PhoneOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="手机号码" />
              )}
            </Form.Item>

            {/* 
                   <Form.Item
                      {...formItemLayout}
                      // validateStatus={passwordError ? 'error' : ''}
                      // help={passwordError || ''}
                      style={{  width: 'calc(100% - 12px)' }}
                      label = "手机号码"
                       >
                    {getFieldDecorator('phoneNumber', {
                      rules: [{ required: true, message: 'Please input your Password!' }], })(
                      <Input prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="手机号码" />
                     )}
                   </Form.Item> */}

            <Form.Item
              {...formItemLayout}
              validateStatus={areaError ? 'error' : ''}
              help={areaError || ''}
              style={{ width: 'calc(100% - 12px)' }}
              label="省/市-区"
            >
              {getFieldDecorator('area', {
                rules: [{ type: 'array', required: true, message: '请选择你所在区域' }],
              })(
                <AreaCascader placeholder='选择所在地区' type='all' size='large' level={1} data={pcaa} />
              )}
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              validateStatus={addressError ? 'error' : ''}
              help={addressError || ''}
              style={{ width: 'calc(100% - 12px)' }}
              label="详细地址"
            >
              {getFieldDecorator('Address', {
                rules: [{ required: true, message: '请输入你的详细收货地址!' }],
              })(
                <Input prefix={<HomeOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="xxx路xxx号" />
              )}

            </Form.Item>

            <Form.Item
              {...formItemLayout}
              // validateStatus={classError ? 'error' : ''}
              // help={classError || ''}
              required={true}
              label="定制产品"
            >

              <Form.Item
                {...formItemLayout}
                validateStatus={classError ? 'error' : ''}
                help={classError || ''}
                style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
              >
                {getFieldDecorator('Class', {
                  rules: [{ required: false, message: '请选择你的产品类别!' }],
                })(
                  <Select placeholder='类别' style={{ width: '80px' }} />
                )}

              </Form.Item>


              <Form.Item
                {...formItemLayout}
                validateStatus={brandError ? 'error' : ''}
                help={brandError || ''}
                style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}

              >
                {getFieldDecorator('Brand', {
                  rules: [{ required: false, message: '请选择产品品牌!' }],
                })(
                  <Select placeholder='品牌' style={{ width: '80px' }} />
                )}

              </Form.Item>


              <Form.Item
                {...formItemLayout}
                validateStatus={quantityError ? 'error' : ''}
                help={quantityError || ''}
                style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
              >
                {getFieldDecorator('Quantity', {
                  rules: [{ required: false, message: '请输入购买的产品数量!' }],
                })(
                  <Select placeholder='数量' style={{ width: '80px' }} />
                )}

              </Form.Item>


              <Form.Item
                {...formItemLayout}
                validateStatus={productError ? 'error' : ''}
                help={productError || ''}
                style={{ display: 'inline-block', width: 'calc(100% - 12px)' }}

              >
                {getFieldDecorator('Product', {
                  rules: [{ required: true, message: '请输入详细的产品名称!' }],
                })(
                  <Input prefix={<ProjectOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="产品名称" />
                )}
              </Form.Item>
            </Form.Item>


            <Form.Item
              {...formItemLayout}
              // validateStatus={passwordError ? 'error' : ''}
              // help={passwordError || ''}
              style={{ width: 'calc(100% - 12px)' }}
              label='卖家留言(可不填）'

            >
              {getFieldDecorator('Message', {
                rules: [{ required: false, message: '给卖家留意' }],
              })(
                <TextArea rows={4} />
              )}
            </Form.Item>
            <Form.Item  {...tailFormItemLayout} style={{ width: 'calc(100% - 12px)' }}>
              <Button type="primary" onClick={() => this.props.history.goBack()} style={{ display: 'inline-block', width: 'calc(30% - 12px)' }} >后退</Button>
              <Button disabled={hasErrors(getFieldsError())} type="primary" htmlType="submit" style={{ display: 'inline-block', marginLeft: '20px', width: 'calc(30% - 12px)' }} >递交</Button>
            </Form.Item>
          </Form>
        </Spin>

      </div>
    );
  }
}

const orderDetail = Form.create({ name: 'horizontal' })(orderDetailForm);


function mapStateToProps(state) {
  return {
    message: state.globalState.message
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveOneorder: bindActionCreators(actions.save_one_order, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(orderDetail)