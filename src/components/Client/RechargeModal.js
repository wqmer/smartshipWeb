import React from "react"
import _ from "lodash"
import "antd/dist/antd.css"
import { Button, Form, Input, Modal } from "antd"

class RechargeModal extends React.Component {

  state = {
    rechargeFields: [
      {
        name: ["amount"],
        value: ""
      }
    ]
  }

  constructor(props) {
    super(props)
  }

  render() {
    //const [form] = Form.useForm()
    //formRef.resetFields()

    return (
      <div>
        <Modal
          title="充值"
          visible={this.props.visible}
          onCancel={this.props.cancelReCharegeModal}
          footer={[
            <Button key="back" onClick={this.props.cancelReCharegeModal}>取消</Button>,
            <Button type="primary" form="rechargeDetail" loading={this.props.submitting} key="submit" htmlType="submit">确定</Button>
          ]}
        >
          <Form
            name="rechargeDetail"
            //form={form}
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 15 }}
            fields={this.state.rechargeFields}
            initialValues={{ remember: false }}
            onFinish={this.props.formOnFinish}
          >
             <Form.Item
              label="金额"
              name="amount"
              value=""
              rules={[{ required: true, message: "请输入金额!" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default RechargeModal