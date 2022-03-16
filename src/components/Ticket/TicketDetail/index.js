import React from "react"
import { Icon as LegacyIcon } from "@ant-design/compatible"
import { List, Avatar, Form, Input, Button, Space, Spin, message, PageHeader, Empty, Row, Col } from "antd"
import "@ant-design/compatible/assets/index.css"
import { Put, Post } from "../../../util/fetch"

const { TextArea } = Input

class TicketDetail extends React.Component {

  ticketId = ""
  supporter = ""

  state = {
    messages: [],
    status: "",
    userName: "",
    fetching: true,
    btnUpdateLoading: false,
    btnCloseToggleLoading: false
  }

  formRef = React.createRef()

  constructor(props) {
    super(props)

    this.ticketId = this.props.ticketId
    this.supporter = this.props.forwarder_info.forwarder_object_id
  }

  componentDidMount = () => {
    window.scrollTo(0, 0)
    this.getTicketDetail()
  }

  componentDidUpdate(prevProps, prevState) {
    return true
  }

  getTicketDetail(state = this.state) {
    this.setState({ fetching: true })

    Post("/forwarder/get_ticket", {
      "_id": this.ticketId,
    }).then(payload => {
      //console.log(payload)

      this.setState({
        ...state,
        fetching: false,
        status: payload.data.status,
        messages: payload.data.messages,
        userName: payload.data.user.user_name
      })
    }).catch(error => {
      console.log(error)
    })
  }

  updateTicket = (values) => {  
    this.setState({ btnUpdateLoading: true })

    Put("/forwarder/update_ticket", {
      "_id": this.ticketId,
      "supporter": this.supporter,
      "message": values.message
    }).then(payload => {
      this.setState({
        btnUpdateLoading: false
      })

      this.getTicketDetail()

      message.success("工单更新成功")

      this.formRef.current.resetFields()
    }).catch(error => {
      console.log(error)
    })
  }

  openTicket = () => {
    this.setState({ btnCloseToggleLoading: true })

    Put("/forwarder/update_ticket", {
      "_id": this.ticketId,
      "supporter": this.supporter,
      "status": "created"
    }).then(payload => {
      this.setState({
        status: "created",
        btnCloseToggleLoading: false
      })

      message.success("工单已打开")
    }).catch(error => {
      console.log(error)
    })
  }

  closeTicket = () => {
    this.setState({ btnCloseToggleLoading: true })

    Put("/forwarder/update_ticket", {
      "_id": this.ticketId,
      "supporter": this.supporter,
      "status": "closed"
    }).then(payload => {
      this.setState({
        status: "closed",
        btnCloseToggleLoading: false
      })

      message.success("工单已关闭")
    }).catch(error => {
      console.log(error)
    })
  }

  render() {
    const disabled = (this.state.status == "closed")?true:false
    const btnUpdateLoading = this.state.btnUpdateLoading

    const listLoading = {
      spinning: this.state.fetching,
      indicator: <Spin size="large" />
    }

    return (
      <div>
        <PageHeader
          style={{boxShadow: "1px 1px 5px rgba(0,21,41,.1)", background: "#fff", height: 70}}
          title={
            <div>
              <LegacyIcon style={{ marginRight: "8px" }} type="eye" />工单详情
            </div>
          }
          extra={
            (disabled)? 
            <Button type="primary" loading={this.state.btnCloseToggleLoading} onClick={() => this.openTicket()}>
              打开工单
            </Button> : 
            <Button type="primary" danger loading={this.state.btnCloseToggleLoading} onClick={() => this.closeTicket()}>
              关闭工单
            </Button>
          }
        />
        <Row>
          <Col span={20}>
            <div style={{ padding: 36 }}>
              <Space direction="vertical" size="large" style={{ width: "100%" }} >
                <List
                  loading={listLoading}
                  itemLayout="horizontal"
                  locale={{emptyText: 
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <span>工单详情为空</span>
                      }
                    >
                    </Empty>}
                  } 
                  dataSource={this.state.messages}
                  renderItem={item => {
                    if (item.supporter) {
                      return (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar style={{ color: "#f56a00", backgroundColor: "#fde3cf" }} size={40}>A</Avatar>}
                            title="管理员"
                            description={
                              <div>
                                <div>{item.body}</div>
                                <div style={{float: "right"}}>{item.created_at}</div>
                              </div>
                            }
                          />
                        </List.Item>
                      )
                    } else {
                      return (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar size={40}>U</Avatar>}
                            title={this.state.user_name}
                            description={
                              <div>
                                <div>{item.body}</div>
                                <div style={{float: "right"}}>{item.created_at}</div>
                              </div>
                            }
                          />
                        </List.Item>
                      )
                    }
                  }}
                />
                <Form
                  ref={this.formRef}
                  name="form-ticket-update"
                  onFinish={this.updateTicket}
                >
                  <Form.Item
                    name="message"
                    rules={[{ required: true, message: "请添加回复内容" }]}
                  >
                  <TextArea 
                    rows="6"
                    placeholder="添加回复内容"
                    disabled={disabled}
                    value=""
                  />
                  </Form.Item>
                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      size="large" 
                      loading={btnUpdateLoading}
                      disabled={disabled}>
                      回复
                    </Button>
                  </Form.Item>
                </Form>
              </Space>
            </div>
          </Col>
        </Row>  
      </div>
    )
  }
}

export default TicketDetail