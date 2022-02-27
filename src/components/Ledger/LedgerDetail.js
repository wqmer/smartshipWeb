import React from "react"
import { Icon as LegacyIcon } from "@ant-design/compatible"
import { Form, Input, Button, Select, message, PageHeader } from "antd"
import "@ant-design/compatible/assets/index.css"
import { Post } from "../../util/fetch"

const { Option } = Select

class LedgerDetail extends React.Component {

  ledgerId = ""

  state = {
    users: [],
    btnLoading: false
  }

  formRef = React.createRef()

  constructor(props) {
    super(props)
    
    this.ledgerId = this.props.ledgerId
  }

  componentDidMount = () => {
    window.scrollTo(0, 0)

    this.getUsers()
    this.getLedgerDetail()
  }

  componentDidUpdate(prevProps, prevState) {
    return true
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

  getLedgerDetail(state = this.state) {
    this.setState({ fetching: true })

    Post("/forwarder/get_ledger", {
      "_id": this.ledgerId,
    }).then(payload => {
      console.log(payload)

      let detailFields = [
        {
          name: ["amount"],
          value: payload.data.amount
        },
        {
          name: ["type"],
          value: payload.data.type
        },
        {
          name: ["user"],
          value: payload.data.user.user_name
        }
      ]

      this.setState({
        ...state,
        fetching: false,
        detailFields: detailFields
      })
    }).catch(error => {
      console.log(error)
    })
  }

  render() {
    return (
      <div>
        <PageHeader
          style={{boxShadow: "1px 1px 5px rgba(0,21,41,.1)", background: "#fff", height: 70}}
          title={
            <div>
              <LegacyIcon style={{ marginRight: "8px" }} type="eye" />账目详情
            </div>
          }
        />
        <div style={{ padding: 36 }}>
          <Form
            name="form-ledger-edit"
            className="form-ledger-edit"
            style={{ width: 500 }}
            fields={this.state.detailFields}
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
              <Input />
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

export default LedgerDetail