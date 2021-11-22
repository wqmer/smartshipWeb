import React from "react"
import _ from "lodash"
import "antd/dist/antd.css"
import { Switch, Table, Drawer } from "antd"
import { Put } from "../../util/fetch"

class ClientServiceDrawer extends React.Component {
  state = {
    columns: []
  }

  constructor(props) {
    super(props)
  }

  componentDidMount = () => {
    const columns = []

    const column = {
      key: "user_name",
      title: "用户",
      width: 120,
      fixed: "left",
      dataIndex: "user_name"
    }

    columns.push(column)

    const services = this.props.data[0].services

    services.map(service => {
      const key = service.name

      const column = {
        width: 160,
        key: key,
        title: key, 
        dataIndex: key,
        render: (text, record, index) => {
          const serviceMap = {}

          record.services.map(service => {
            serviceMap[service.name] = service
          })
          
          return (
            <div>
              <Switch 
                defaultChecked={serviceMap[key].status?true:false} 
                onChange={(checked) => this.toggleServiceStatus(checked, serviceMap[key], index)} 
              />
            </div> 
        )}
      }

      columns.push(column)
    })

    this.setState({ 
      columns: columns
    })    
  }

  toggleServiceStatus = (checked, service, index) => {
    const user = this.props.data[index]._id

    const service_id = service._id

    Put("/forwarder/update_service_auth_status", {
      "user": user,
      "service": [service_id],
      "action": (checked)?"enable":"disable"
    })
  }

  render() {
    return (
      <div>
        <Drawer
            title="用户服务权限"
            placement="right"
            closable={true}
            width={1000}
            visible={this.props.visible}
            onClose={this.props.onClose}
            services={this.props.services}
          >
          <Table
            scroll={{ x: true }}
            rowKey={record => record._id}
            columns={this.state.columns}
            dataSource={this.props.data}
            pagination={false}
          />
        </Drawer>
      </div>
    )
  }
}

export default ClientServiceDrawer