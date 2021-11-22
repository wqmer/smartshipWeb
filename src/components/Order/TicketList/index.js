import React from "react"
import _ from "lodash"
import "antd/dist/antd.css"
import { Icon as LegacyIcon } from "@ant-design/compatible"
import { Space, notification, Spin, Table, PageHeader, Divider } from "antd"
import { Post } from "../../../util/fetch"
import format from "../../../util/format"
import { handle_error } from "../../../util/error"
import Filter from "./filter"

class TicketList extends React.Component {
  state = {
    status: this.props.page_name,
    fetching: true
  }

  constructor(props) {
    super(props)
  }

  componentDidMount = () => {
    window.scrollTo(0, 0)
    this.props.onRef(this)
    this.getTickets()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.page_name !== prevProps.page_name) {
      this.getTickets()
    }
  }

  componentDidCatch(error) {
    console.log(error)
  }
  
  getTickets(state = this.state) {
    this.setState({ fetching: true })

    Post("/forwarder/get_tickets")
    .then(payload => {
      console.log(payload)

      this.setState({
        ...state,
        data: payload.data.docs,
        fetching: false
      })
    })
    .catch(error => {
      notification.error(format.notfication_remote_server_error(handle_error(error).message))
      if (!handle_error(error).is_authed) this.props.history.push(`/login`)
    })
  }

  handleFilter(data) {
    console.log(data)
  }

  render() {
    const tableLoading = {
      spinning: this.state.fetching,
      indicator: <Spin size="large" />
    }

    const columns = [
      { title: "创建时间", width: 150, dataIndex: "created_at", align: "left", key: "created_at" },
      { 
        title: "类型", width: 150, dataIndex: "type", align: "left", key: "type",
        render: type => {
          switch (type) {
            case "billing":
              return "账单"
            case "balance issue":
              return "账单"
            case "tracking":
              return "追踪号"
            default:
              return "未知"
          }
        }
      },
      { 
        title: "状态", width: 150, dataIndex: "status", align: "left", key: "status",
        render: status => {
          switch (status) {
            case "created":
              return "进行中"
            case "closed":
                return "已关闭"
            default:
              return "未知"
          }
        }
      },
      { title: "更新时间", width: 150, dataIndex: "update_at", align: "left", key: "update_at" },
      {
        title: "操作", key: "action", width: 100, align: "center",
        fixed: "right",
        render: (text, record) => (
          <span>
            <a type="defa" onClick={() => {
              this.props.history.push({ pathname: `/forwarder/ticket/detail/${record._id}` })
            }
          }>详情</a>
          </span>
        )
      }
    ]

    return (
      <div>
        <PageHeader
          style={{boxShadow: "1px 1px 5px rgba(0,21,41,.1)", background: "#fff", height: 70}}
          title={
            <div>
              <LegacyIcon style={{ marginRight: "8px" }} type="appstore-add" />工单列表
            </div>
          }
        />
        <div style={{ padding: 36 }}>    
          <Space direction="vertical" size="middle"> 
            <Filter  
              handle_filter={(data) => this.handleFilter(data)}
            />
            <div style={{ boxShadow: "rgb(217, 217, 217) 1px 1px 7px 0px", padding: "10px 20px" }}>          
              <Table
                style={{ marginTop: "16px" }}
                rowKey={record => record.ticket_id}
                columns={columns}
                dataSource={this.state.data}
                scroll={{ x: columns.map(item => item.width).reduce((accumulator, currentValue) => accumulator + currentValue) + 200, y: 480 }}
                loading={tableLoading}
              />
            </div>
          </Space>
        </div>
      </div>
    )
  }
}

export default TicketList