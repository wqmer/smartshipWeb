import React, { Component } from "react"
import _ from "lodash"
import "antd/dist/antd.css"
import { Row, Col, Select, DatePicker, Input, Tag, Divider } from "antd"

const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker

class Filter extends Component {
  constructor(props) {
    super(props)

    console.log(props.filter_data)
  }

  render() {
    const handleCloseTag = (tag) => {  
      let data

      switch(tag) {
        case "created_at":
          data = {"created_at": null}
          this.props.handle_filter(data)
          break
        case "type":
          data = {"filter":{"type": null}}
          this.props.handle_filter(data)
          break
        case "status":
          data = {"filter":{"status": null}}
          this.props.handle_filter(data)
          break
        default: 
      }
    }

    return (
      <div style={{ boxShadow: "rgb(217, 217, 217) 1px 1px 7px 0px", padding: "25px 20px" }}>  
        <Row gutter={24}>
          <Col span={2}><strong>筛选</strong></Col>
          <Col span={6}>
            <RangePicker 
              style={{ width: "100%" }}
              placeholder={["开始时间", "结束时间"]}
              onChange={(dates) => {                
                let data;

                if(dates !== null) {
                  let gte = dates[0].format("YYYY-MM-DD HH:mm:ss")
                  let lte = dates[1].format("YYYY-MM-DD HH:mm:ss")
                  data = {"created_at": {"$gte": gte, "$lte": lte}}
                } else {
                  data = {"created_at": null}
                }
                
                this.props.handle_filter(data)
              }}
            />
          </Col>
          <Col span={4}>
            <Select
              allowClear
              style={{ width: "100%" }}
              value={this.props.filter_data.filter.type} 
              placeholder="请选择工单类型"
              onChange={(type) => {
                let data = {"filter":{"type": type}}
                this.props.handle_filter(data)
              }}
            >
              <Option value="billing">账单</Option>
              <Option value="tracking">追踪号</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              allowClear
              style={{ width: "100%" }}
              value={this.props.filter_data.filter.status} 
              placeholder="请选择状态"
              onChange={(status) => {
                let data = {"filter":{"status": status}}
                this.props.handle_filter(data)
              }}
            >
              <Option value="created">进行中</Option>
              <Option value="closed">已关闭</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Search placeholder="关键词搜索" 
              allowClear 
              onSearch={(searching_string) => {
                let data = {"searching_string": searching_string}
                this.props.handle_filter(data)
              }} />
          </Col>
        </Row>
        <Divider dashed={true} />
        <Row gutter={24}>
          <Col span={2}><strong>过滤</strong></Col>
          <Col span={22}>
            <Tag
              key={"created_at"}
              className="filter-tag"
              closable={true}
              onClose={() => handleCloseTag("created_at")}
              visible={this.props.filter_data.date_created != null}
            >
              创建时间
            </Tag>
            <Tag
              key={"type"}
              className="filter-tag"
              closable={true}
              onClose={() => handleCloseTag("type")}
              visible={this.props.filter_data.filter.type != null}
            >
              类型
            </Tag>
            <Tag
              key={"status"}
              className="filter-tag"
              closable={true}
              onClose={() => handleCloseTag("status")}
              visible={this.props.filter_data.filter.status != null}
            >
              状态
            </Tag>
          </Col>
        </Row>
      </div> 
    )
  }
}

export default Filter