import { Form, Icon, Input, Button, Checkbox } from 'antd';
import React , { Component }  from 'react';

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  handle_login = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(values)
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handle_login} className="login-form">
        <FormItem>
          {getFieldDecorator('user_name', {
            // rules: [{ required: true, message: 'Please input your username!' }],
            rules: [{ required: true, message: '请输入你的用户名!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem
          //  validateStatus ={ this.props.status_code === 1 ? 'error' : "success"}
          //  help={ this.props.error_message}
        >
          {getFieldDecorator('password', {
            // rules: [{ required: true, message: 'Please input your Password!' }],
            rules: [{ required: true, message: '请输入你的密码' }]
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>记住账号</Checkbox>
          )}
          <a className="login-form-forgot" href="">忘记密码</a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
          或者 <a href="">现在就注册!</a>
        </FormItem>
      </Form>
    );
  }
}

 const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

 export default WrappedNormalLoginForm