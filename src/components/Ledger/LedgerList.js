import React from "react"
import _ from "lodash"
import "antd/dist/antd.css"
import { Icon as LegacyIcon } from "@ant-design/compatible"
import { Space, notification, Spin, Table, PageHeader } from "antd"
import { Post } from "../../util/fetch"
import format from "../../util/format"
import { handle_error } from "../../util/error"
import Filter from "./filter"

class LedgerList extends React.Component {

  state = {
    fetching: true
  }

  filter_data = {
    "searching_string":"",
    "type":"",
    "page":1,
    "limit":20,
    "filter":{}
  }

  constructor(props) {
    super(props)
  }

  componentDidMount = () => {
    window.scrollTo(0, 0)
    this.getLedgers()
  }

  componentDidCatch(error) {
    console.log(error)
  }
  
  getLedgers() {
    this.setState({ fetching: true })

    Post("/forwarder/get_ledgers", this.filter_data)
    .then(payload => {
      console.log(payload)

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

  handleFilter(filter_data) {    
    if ("filter" in filter_data) {
      this.filter_data.filter = {...this.filter_data.filter, ...filter_data.filter}

      console.log("handler filter in the list ... ")
      console.log(this.filter_data)

    } else {
      this.filter_data = {...this.filter_data, ...filter_data}
    }

    this.getLedgers()
  }

  render() {
    const tableLoading = {
      spinning: this.state.fetching,
      indicator: <Spin size="large" />
    }

    const columns = [
      { title: "创建时间", width: 130, dataIndex: "created_at", align: "left", key: "created_at" },
      { 
        title: "类型", width: 70, dataIndex: "type", align: "left", key: "type",
        render: type => {
          switch (type) {
            case "label":
              return "运单"
            case "balance":
              return "充值"
            default:
              return "未知"
          }
        }
      },
      { title: "订单号", width: 200, dataIndex: "order_id", align: "left", key: "order_id" },
      {
        title: "金额", key: "amount", width: 100, dataIndex: "amount", align: "left",
        render: record => {
          if (record > 0) {
            return <span>${record}</span>
          } else {
            return <span>-${Math.abs(record)}</span>
          }
        }
      },
      {
        title: "余额", key: "balance", width: 100, dataIndex: "balance", align: "left",
        render: record => (
          <span>${record}</span>
        )
      },
      {
        title: "用户", key: "user", width: 80, align: "left",
        render: (text, record) => (
          <span>{record.user.user_name}</span>
        )
      },
      {
        title: "操作", key: "action", width: 100, align: "center",
        fixed: "right",
        render: (text, record) => (
          <span>
            <a type="defa" onClick={() => {
              this.props.history.push({ pathname: `/forwarder/ledger/detail/${record._id}` })
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
              <LegacyIcon style={{ marginRight: "8px" }} type="dollar" />账目列表
            </div>
          }
        />
        <div style={{ padding: 36 }}>    
          <Space direction="vertical" size="middle"> 
            <Filter
              filter_data={this.filter_data}  
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

export default LedgerList