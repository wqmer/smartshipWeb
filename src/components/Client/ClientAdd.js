import React from "react"
import { Icon as LegacyIcon } from "@ant-design/compatible"
import { Form, Input, Button, Select, message, PageHeader } from "antd"
import "@ant-design/compatible/assets/index.css"
import { Post } from "../../util/fetch"

const { Option } = Select

class ClientAdd extends React.Component {

  state = {
    users: [],
    btnLoading: false
  }

  constructor(props) {
    super(props)
  }

  componentDidMount = () => {
    this.getUsers()
  }

  getUsers() {
    Post("forwarder/get_users", {
    }).then(payload => {
      var users = []

      const users_data = payload.data.docs

      users_data.forEach(function(user_data, index) {
        let user = {label: user_data.user_name, value: user_data._id}
        users.push(user)
      })

      this.setState({ users: users })

    }).catch(error => {
      console.log(error)
    })
  }

  render() {
    const btnLoading = this.state.btnLoading

    const createLedger = (values) => {  
      this.setState({ btnLoading: true })

      Post("/forwarder/add_ledger", {
        "user": values.user,
        "type": values.type,
        "amount": values.amount
      }).then(payload => {
        console.log(payload)
  
        this.setState({
          btnLoading: false
        })

        message.success("账目创建成功")

        this.props.history.push({ pathname: `/forwarder/ledger/list` })

      }).catch(error => {
        console.log(error)
      })
    }

    return (
      <div>
        <PageHeader
          style={{boxShadow: "1px 1px 5px rgba(0,21,41,.1)", background: "#fff", height: 70}}
          title={
            <div>
              <LegacyIcon style={{ marginRight: "8px" }} type="plus" />添加账目
            </div>
          }
        />
        <div style={{ padding: 36 }}>
          <Form
            name="form-ledger-add"
            className="form-ledger-add"
            style={{ width: 500 }}
            onFinish={createLedger}
          >
            <Form.Item
                name="user"
                rules={[{ required: true, message: "请选择一个用户" }]}
              >
              <Select
                showSearch
                placeholder="请选择一个用户"
                options={ this.state.users }
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
              </Select>
            </Form.Item>
            <Form.Item
                name="type"
                rules={[{ required: true, message: "请选择一项类型" }]}
              >
              <Select
                showSearch
                placeholder="请选择账目类型"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="label">运单</Option>
              </Select>
            </Form.Item>
            <Form.Item
                name="amount"
                rules={[{ required: true, message: "请添加金额" }]}
              >
              <Input placeholder="金额" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" className="btn-add" loading={btnLoading}>
                添加
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>)
  }
}

export default ClientAdd