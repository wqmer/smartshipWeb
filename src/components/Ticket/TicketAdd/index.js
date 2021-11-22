import React from "react"
import { Icon as LegacyIcon } from "@ant-design/compatible"
import { Form, Input, Button, Select, message, PageHeader } from "antd"
import "@ant-design/compatible/assets/index.css"
import { Post } from "../../../util/fetch"

const { Option } = Select
const { TextArea } = Input

class TicketAdd extends React.Component {

  supporter = ""

  state = {
    users: [],
    btnLoading: false
  }

  constructor(props) {
    super(props)

    this.supporter = this.props.forwarder_info.forwarder_object_id
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

    const createTicket = (values) => {  
      this.setState({ btnLoading: true })

      Post("/forwarder/add_ticket", {
        "supporter": this.supporter,
        "user": values.user,
        "type": values.type,
        "message": values.message
      }).then(payload => {
        //console.log(payload)
  
        this.setState({
          btnLoading: false
        })

        message.success("工单创建成功")

        this.props.history.push({ pathname: `/forwarder/ticket/list` })

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
              <LegacyIcon style={{ marginRight: "8px" }} type="plus" />添加工单
            </div>
          }
        />
        <div style={{ padding: 36 }}>
          <Form
            name="form-ticket-add"
            className="form-ticket-add"
            style={{ width: 500 }}
            onFinish={createTicket}
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
                placeholder="请选择工单类型"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="billing">账单</Option>
                <Option value="tracking">追踪号</Option>
              </Select>
            </Form.Item>
            <Form.Item
                name="message"
                rules={[{ required: true, message: "请添加消息内容" }]}
              >
              <TextArea 
                rows="6"
                placeholder="消息内容"
              />
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

export default TicketAdd