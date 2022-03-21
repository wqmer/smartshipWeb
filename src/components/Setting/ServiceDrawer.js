import React from "react"
import _ from "lodash"
import "antd/dist/antd.css"
import { List, Drawer } from "antd"
import { Put, Post } from "../../util/fetch"
import LoadingSwitch from "../LoadingSwitch"

class ServiceDrawer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const getStatus = (status) => {
      if(status) {
        return "activated"
      } else {
        return "unactivated"
      }
    }

    const getCheckedStatus = (status) => {
      if(status == "activated") {
        return true
      } else {
        return false
      }
    }

    const toggleServiceStatus = (element, checked, service) => {
      if(service._id == null) {
        Post("/forwarder/add_service", {
          "carrier": this.state.selectedCarrierId,
          "mail_class": service.name,
          "type": this.state.carrierServiceType,
          "description": service.description
        })
        .then(payload => {
          element.setState({ 
            loading: false
          })
        })
      } else {
        Put("/forwarder/update_service", {
          "_id": service._id,
          "status": getStatus(checked)
        })
        .then(payload => {
          element.setState({ 
            loading: false
          })
        })
      }
    }

    return (
      <div>
        <Drawer
          title="服务配置"
          placement="right"
          onClose={this.props.onClose}
          visible={this.props.visible}
        >
          <List
            header={<div style={{ fontSize: "20px", fontWeight: "bold" }}>{this.props.carrierType}</div>}
            dataSource={this.props.services}
            renderItem={service => 
              <List.Item>
                <span>{service.mail_class}</span>
                <LoadingSwitch 
                  size="small"
                  checked={getCheckedStatus(service.status)}
                  toggleStatus={(element, checked) => toggleServiceStatus(element, checked, service)} />
              </List.Item>
            }
          />
        </Drawer>
      </div>
    )
  }
}

export default ServiceDrawer