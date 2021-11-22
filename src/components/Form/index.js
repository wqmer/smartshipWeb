import React, { Component } from 'react';
import { Form, Input, Button, Select } from 'antd';
import '@ant-design/compatible/assets/index.css';
const { TextArea } = Input

class MyForm extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
              <Form
                name={this.props.name}
                className={`form-${this.props.name}`}
                initialValues={{ remember: true }}
                >
                
                {this.props.form_items.map((item) => {
                    switch(item.type) {
                      case "input":
                        return (
                            <Form.Item
                              name={item.name}
                              rules={[{ required: item.required, message: item.message }]}
                            >
                              <Input
                                type={item.type}
                                size={item.size}
                                placeholder={item.placeholder}
                              />
                          </Form.Item>)
                      case "select":
                        return (
                            <Form.Item
                              name={item.name}
                              rules={[{ required: item.required, message: item.message }]}
                            >
                              <Select defaultValue={item.defaultValue} size={item.size}>
                              {item.options.map((item) => {
                                return (<Option value={item.value}>{item.name}</Option>)
                              })}
                              </Select>
                          </Form.Item>)
                      case "textarea":
                        return (
                            <Form.Item
                                name={item.name}
                                rules={[{ required: item.required, message: item.message }]}
                            >
                              <TextArea 
                                rows={item.row} 
                                placeholder={item.placeholder} 
                              />
                            </Form.Item>)
                    }
                })}

                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" className={`btn-${this.props.button_name}`}>
                    {this.props.button_name}
                    </Button>
                </Form.Item>
              </Form>
            </div>
        );
    }
}

export default MyForm