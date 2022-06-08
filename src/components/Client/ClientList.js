import React from "react"
import _ from "lodash"
import "antd/dist/antd.css"
import { Icon as LegacyIcon } from "@ant-design/compatible"
import { Space, notification, Button, Spin, Table, Form, PageHeader } from "antd"
import { Post } from "../../util/fetch"
import format from "../../util/format"
import { handle_error } from "../../util/error"
import RechargeModal from "./RechargeModal"

class ClientList extends React.Component {

  state = {
    fetching: true,
    showRecharge: false,
    selectedUserId: "",
    selectedUserName: "",
    selectedBalance: 0
  }

  constructor(props) {
    super(props)
  }

  componentDidMount = () => {
    window.scrollTo(0, 0)
    this.getClients()
  }

  componentDidCatch(error) {
    console.log(error)
  }
  
  getClients() {
    this.setState({ fetching: true })

    Post("/forwarder/get_users", this.filter_data)
    .then(payload => {
      console.log(payload.data.docs)

      this.setState({
        fetching: false,
        data: payload.data.docs
      })
    })
    .catch(error => {
      notification.error(format.notfication_remote_server_error(handle_error(error).message))
      if (!handle_error(error).is_authed) this.props.history.push(`/login`)
    })
  }

  render() {
    const tableLoading = {
      spinning: this.state.fetching,
      indicator: <Spin size="large" />
    }

    const showRechargeModal = (userId, userName, balance) => {
      this.setState({ 
        showRecharge: true,
        selectedUserId: userId,
        selectedUserName: userName,
        selectedBalance: balance
      })
    }

    const cancelReCharegeModal = () => {
      this.setState({ showRecharge: false })
    }

    const formOnFinish = (values) => {
      this.setState({ submitting: true })

      if(this.state.selectedUserId !== null) {
        Post("/forwarder/add_ledger", {
          "user": this.state.selectedUserId,
          "type": "balance",
          "amount": parseFloat(values.amount)
        })
        .then(payload => {
          console.log(payload)

          this.setState({ 
            submitting: false,
            showRecharge: false
          })

          this.getClients()
        })
      } 
    }

    const columns = [
      { title: "用户ID", width: 100, dataIndex: "user_id", align: "left", responsive: ['md'], key: "user_id" },
      { title: "用户名", width: 100, dataIndex: "user_name", align: "left", responsive: ['md'], key: "user_name" },
      {
        title: "余额", key: "balance", width: 100, dataIndex: "balance", align: "left", responsive: ['md'],
        render: record => (
          <span>${record}</span>
        )
      },
      {
        title: "类型", key: "status", width: 50, dataIndex: "status", align: "left", responsive: ['md'],
        render: status => {
          switch (status) {
            case "activated":
              return "启用"
            default:
              return "未启用"
          }
        }
      },
      {
        title: "操作", key: "action", width: 100, align: "center", responsive: ['md'],
        fixed: "right",
        render: (text, record) => (
          <Button type="link" onClick={() => showRechargeModal(record._id, record.user_name, record.balance)} >充值</Button>          
        )
      }
    ]

    return (
      <div>
        <PageHeader
          style={{boxShadow: "1px 1px 5px rgba(0,21,41,.1)", background: "#fff", height: 70}}
          title={
            <div>
              <LegacyIcon style={{ marginRight: "8px" }} type="team" />客户列表
            </div>
          }
        />
        <div style={{ paddingTop: "20px" }}>    
          <Space direction="vertical" size="middle"> 
            <div style={{ boxShadow: "rgb(217, 217, 217) 1px 1px 7px 0px", padding: "10px 20px" }}>          
              <Table
                style={{ marginTop: "16px" }}
                rowKey={record => record.ticket_id}
                columns={columns}
                dataSource={this.state.data}
                scroll={{ x: columns.map(item => item.width).reduce((accumulator, currentValue) => accumulator + currentValue), y: 480 }}
                loading={tableLoading}
              />
            </div>
          </Space>
        </div>
        <RechargeModal 
          visible={this.state.showRecharge}
          user_name={this.state.selectedUserName}
          balance={this.state.selectedBalance}
          submitting={this.state.submitting}
          formOnFinish={formOnFinish}
          cancelReCharegeModal={cancelReCharegeModal} />
      </div>
    )
  }
}

export default ClientList