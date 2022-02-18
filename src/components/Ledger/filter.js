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
  }

  render() {
    const handleCloseTag = (tag) => {  
      let data

      switch(tag) {
        case "created_at":
          data = {"filter":{"created_at": null}}
          
          break
        case "type":
          data = {"type": ""}
          this.props.filter_data.filter.type = null

          break
        case "searching_string":
          data = {"searching_string": ""}
          this.props.filter_data.searching_string != ""

          break
        default: 
      }

      this.props.handle_filter(data)
    }

    return (
      <div style={{ boxShadow: "rgb(217, 217, 217) 1px 1px 7px 0px", padding: "25px 20px" }}>  
        <Row gutter={24}>
          <Col span={2}><strong>筛选</strong></Col>
          <Col span={8}>
            <RangePicker 
              style={{ width: "100%" }}
              placeholder={["开始时间", "结束时间"]}
              onChange={(dates) => {                
                let data

                if(dates !== null) {
                  let gte = dates[0].format("YYYY-MM-DD HH:mm:ss")
                  let lte = dates[1].format("YYYY-MM-DD HH:mm:ss")
                  data = {"filter":{"created_at": {"$gte": gte, "$lte": lte}}}
                } else {
                  data = {"filter":{"created_at": null}}
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
              placeholder="请选择类型"
              onChange={(type) => {
                let data = {"type": type}
                this.props.handle_filter(data)
              }}
            >
              <Option value="label">运单</Option>
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
              visible={this.props.filter_data.filter.created_at != null}
            >
              创建时间
            </Tag>
            <Tag
              key={"type"}
              className="filter-tag"
              closable={true}
              onClose={() => handleCloseTag("type")}
              visible={this.props.filter_data.type != ""}
            >
              类型
            </Tag>
            <Tag
              key={"searching_string"}
              className="filter-tag"
              closable={true}
              onClose={() => handleCloseTag("searching_string")}
              visible={this.props.filter_data.searching_string != ""}
            >
              关键词
            </Tag>
          </Col>
        </Row>
      </div> 
    )
  }
}

export default Filter