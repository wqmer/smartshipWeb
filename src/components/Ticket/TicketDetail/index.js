import React from "react"
import { Icon as LegacyIcon } from "@ant-design/compatible"
import { List, Avatar, Form, Input, Button, Space, Spin, message, PageHeader, Empty, Row, Col, Switch } from "antd"
import "@ant-design/compatible/assets/index.css"
import { Put, Post } from "../../../util/fetch"

const { TextArea } = Input

class TicketDetail extends React.Component {

  ticketId = ""
  supporter = ""

  state = {
    messages: [],
    userName: "",
    fetching: true,
    tickedClosed: false,
    switchLoading: false,
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

  getTicketDetail(state = this.state) {
    this.setState({ fetching: true })

    Post("/forwarder/get_ticket", {
      "_id": this.ticketId,
    }).then(payload => {
      console.log(payload)

      this.setState({
        ...state,
        fetching: false,
        messages: payload.data.messages,
        tickedClosed: payload.data.status,
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

  toggleTicketStatus = (checked) => {
    this.setState({ switchLoading: true })

    Put("/forwarder/update_ticket", {
      "_id": this.ticketId,
      "supporter": this.supporter,
      "status": (checked)?"created":"closed"
    }).then(payload => {
      console.log(payload)

      this.setState({ 
        switchLoading: false,
        tickedClosed: !checked
      })
    }).catch(error => {
      console.log(error)
    })
  }

  render() {
    const tickedClosed = this.state.tickedClosed
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
                            title={this.state.userName}
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
                    disabled={tickedClosed}
                    value=""
                  />
                  </Form.Item>
                  <Row>
                    <Col span={12}>
                      <Form.Item>
                        <Button 
                          type="primary" 
                          htmlType="submit" 
                          size="large" 
                          loading={btnUpdateLoading}
                          disabled={tickedClosed}>
                          回复
                        </Button>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Switch 
                        size="large"
                        checkedChildren="关闭工单" 
                        unCheckedChildren="打开工单" 
                        loading={this.state.switchLoading}
                        onChange={this.toggleTicketStatus}  
                        style={{float: "right", marginTop: 6}}
                      />
                    </Col>
                  </Row>
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