import React, { Component } from "react"
import _ from "lodash"
import "antd/dist/antd.css"
import { Row, Col, Select, DatePicker } from "antd"

const { Option } = Select
const { RangePicker } = DatePicker

class Filter extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div style={{ boxShadow: "rgb(217, 217, 217) 1px 1px 7px 0px", padding: "25px 20px" }}>  
        <Row gutter={24}>
          <Col span={2}><strong>筛选</strong></Col>
          <Col span={6}>
            <RangePicker 
              style={{ width: "100%" }}
              placeholder={["开始时间", "结束时间"]}
              onChange={(dates) => {
                console.log(dates[0])
              }}
            />
          </Col>
          <Col span={4}>
            <Select
              style={{ width: "100%" }}
              placeholder="请选择工单类型"
              onChange={(type) => {
                let data = {"type": type}
                this.props.handle_filter(data)
              }}
              allowClear
            >
              <Option value="billing">账单</Option>
              <Option value="tracking">追踪号</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              style={{ width: "100%" }}
              placeholder="请选择状态"
              onChange={(status) => {
                let data = {"status": status}
                this.props.handle_filter(data)
              }}
              allowClear
            >
              <Option value="created">进行中</Option>
              <Option value="closed">已关闭</Option>
            </Select>
          </Col>
        </Row>
      </div> 
    )
  }
}

export default Filter