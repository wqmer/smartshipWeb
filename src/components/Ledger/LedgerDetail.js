import React from "react"
import { Icon as LegacyIcon } from "@ant-design/compatible"
import { Form, Input, Descriptions, Select, PageHeader } from "antd"
import "@ant-design/compatible/assets/index.css"
import { Post } from "../../util/fetch"

const { Option } = Select

class LedgerDetail extends React.Component {

  ledgerId = ""

  state = {
    type: "",
    amount: "",
    user_name: "",
    btnLoading: false
  }

  formRef = React.createRef()

  constructor(props) {
    super(props)
    
    this.ledgerId = this.props.ledgerId
  }

  componentDidMount = () => {
    window.scrollTo(0, 0)

    this.getLedgerDetail()
  }

  componentDidUpdate(prevProps, prevState) {
    return true
  }

  getLedgerDetail(state = this.state) {
    this.setState({ fetching: true })

    Post("/forwarder/get_ledger", {
      "_id": this.ledgerId,
    }).then(payload => {
      //console.log(payload)

      this.setState({
        ...state,
        fetching: false,
        type: payload.data.type,
        amount: payload.data.amount,
        user_name: payload.data.user.user_name
      })
    }).catch(error => {
      console.log(error)
    })
  }

  render() {
    let user_name = this.state.user_name

    let type

    switch (this.state.type) {
      case "label":
        type = "运单"
        break
      case "balance":
        type = "充值"
        break
    }

    let amount

    if(this.state.amount > 0) {
      amount = "$" + this.state.amount
    } else {
      amount = "-$" + Math.abs(this.state.amount)
    }

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
          <Descriptions>
            <Descriptions.Item label="用户" span={24}>{ user_name }</Descriptions.Item>
            <Descriptions.Item label="类型" span={24}>{ type }</Descriptions.Item>
            <Descriptions.Item label="金额" span={24}>{ amount }</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    )
  }
}

export default LedgerDetail