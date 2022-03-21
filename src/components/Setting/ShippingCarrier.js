import React from "react"
import _ from "lodash"
import "antd/dist/antd.css"
import { Icon as LegacyIcon } from "@ant-design/compatible"
import { Spin, Button, Modal, Form, Input, Table, Select, PageHeader } from "antd"
import { EditOutlined, SettingFilled, DeleteOutlined, PlusOutlined, ControlOutlined } from "@ant-design/icons"
import { Post, Put } from "../../util/fetch"
import ServiceDrawer from "./ServiceDrawer"
import LoadingSwitch from "../LoadingSwitch"
import ClientServiceDrawer from "./ClientServiceDrawer"
import ShippingCarrierFieldAsset from "../../asset/shipping_carrier"

const { Option } = Select

class ShippingCarrier extends React.Component {
  state = {
    clients: [],
    carriers: [],
    detailFields: [],
    footerButtons: [],
    clientServices: [],
    carrierServices: [],
    servicesLoading: [],
    clientServicesLoading: [],
    selectedCarrierId: null,
    providerInfo: null,
    carrierCode: "UPS",
    carrierServiceType: "",
    fetching: false,
    deleting: false,
    submitting: false,
    showService: false,
    showDetailModal: false,
    showDeleteModal: false,
    showClientServiceDrawer: false
  }

  formRef = React.createRef()

  constructor(props) {
    super(props)
  }

  componentDidMount = () => {
    this.getClients()
    this.getShippingCarriers()

    console.log(ShippingCarrierFieldAsset.UPS)
  }

  getClients() {      
    Post("/forwarder/get_users")
    .then(payload => {
      console.log(payload)
  
      this.setState({
        clients: payload.data.docs
      })
    })
  }

  getShippingCarriers() {
    this.setState({ fetching: true })
      
    Post("/forwarder/get_carriers")
    .then(payload => {
      const servicesLoading = []
      const clientServicesLoading = []

      payload.data.map(item => {  
        servicesLoading[item._id] = false
        clientServicesLoading[item._id] = false
      })

      this.setState({
        fetching: false,
        carriers: payload.data,
        servicesLoading: servicesLoading,
        clientServicesLoading: clientServicesLoading
      })
    })
  }

  getShippingCarrier = (_id) => {
    Post("/forwarder/get_carrier", {
      "_id": _id
    })
    .then(payload => {
      let type = payload.data.type
      let asset = payload.data.asset
      let account_information = asset.account_information

      let detailFields

      if(type == "UPS") {
        detailFields = [
          {
            name: ["provider"],
            value: type
          },
          {
            name: ["nick_name"],
            value: asset.nick_name
          },
          {
            name: ["Username"],
            value: account_information.Username
          },
          {
            name: ["Password"],
            value: account_information.Password
          },
          {
            name: ["AccountNo"],
            value: account_information.AccountNo
          },{
            name: ["AccessKey"],
            value: account_information.AccessKey
          }
        ]
      } else {
        detailFields = [
          {
            name: ["provider"],
            value: type
          },
          {
            name: ["nick_name"],
            value: asset.nick_name
          },
          {
            name: ["AccountNumber"],
            value: account_information.AccountNumber
          },
          {
            name: ["Password"],
            value: account_information.Password
          },
          {
            name: ["Key"],
            value: account_information.Key
          },
          {
            name: ["MeterNumber"],
            value: account_information.MeterNumber
          },
          {
            name: ["HubId"],
            value: account_information.HubId
          }
        ]
      }

      this.setState({ 
        carrierCode: type,
        detailFields: detailFields 
      })
    })
  }

  render() {
    const tableLoading = {
      spinning: this.state.fetching,
      indicator: <Spin size="large" />
    }

    const renderFooterButtons = (type) => {
      let footerButtons

      if(type === "add") {
        footerButtons = [
          <Button key="back" onClick={cancelDetailModal}>取消</Button>,
          <Button type="primary" form="carrierDetail" loading={this.state.submitting} key="submit" htmlType="submit">添加</Button>
        ]
      } else {
        footerButtons = [
          <Button key="back" onClick={cancelDetailModal}>取消</Button>,
          <Button type="primary" form="carrierDetail" loading={this.state.submitting} key="submit" htmlType="submit">更新</Button>
        ]
      }

      this.setState({ 
        footerButtons: footerButtons
      })
    }

    const showDetailModal = (selectedCarrierId) => {
      this.setState({ 
        showDetailModal: true,
        selectedCarrierId: selectedCarrierId
      })

      if(selectedCarrierId === null) {
        renderFooterButtons("add")
        this.formRef.current.resetFields()
      } else {
        renderFooterButtons("update")
        this.getShippingCarrier(selectedCarrierId)
      }
    }

    const cancelDetailModal = () => {
      this.setState({ showDetailModal: false })
    }

    const cancelDeleteModal = () => {
      this.setState({ showDeleteModal: false })
    }

    const getCheckedStatus = (status) => {
      if(status == "activated") {
        return true
      } else {
        return false
      }
    }

    const toggleCarrierStatus = (element, checked, selectedCarrierId) => {
      Put("/forwarder/update_carrier_status", {
        "_id": selectedCarrierId,
        "status": (checked)?"activated":"unactivated"
      })
      .then(payload => {
        element.setState({ 
          loading: false
        })
      })
    }

    const showService = (selectedCarrierId) => {
      const servicesLoading = this.state.servicesLoading
      servicesLoading[selectedCarrierId] = true

      this.setState({ 
        servicesLoading: servicesLoading,
        selectedCarrierId: selectedCarrierId
      })

      Post("/forwarder/get_service", {
        "carrier": selectedCarrierId
      })
      .then(payload => {
        //console.log(payload)

        servicesLoading[selectedCarrierId] = false

        this.setState({ 
          showService: true,
          servicesLoading: servicesLoading,
          carrierServices: payload.data.service,
          carrierServiceType: payload.data.type
        })
      })
    }

    const showClientService = (selectedCarrierId) => {
      const clientServicesLoading = this.state.clientServicesLoading
      clientServicesLoading[selectedCarrierId] = true

      this.setState({ 
        selectedCarrierId: selectedCarrierId,
        clientServicesLoading: clientServicesLoading
      })

      Post("/forwarder/get_serivce_auth_status", {
        "carrier": selectedCarrierId
      })
      .then(payload => {
        clientServicesLoading[selectedCarrierId] = false

        this.setState({ 
          showClientServiceDrawer: true,
          clientServices: payload.data.docs,
          clientServicesLoading: clientServicesLoading
        })
      })
    }

    const closeClientService = () => {
      this.setState({ 
        showClientServiceDrawer: false
      })
    }

    const deleteWarning = (selectedCarrierId) => {
      this.setState({ 
        showDeleteModal: true,
        selectedCarrierId: selectedCarrierId
      })
    }

    const closeService = () => {
      this.setState({ showService: false })
    }

    const formOnFinish = (values) => {
      this.setState({ submitting: true })

      let account_information

      if(values.provider == "UPS") {
        account_information = {
          "Username": values.Username,
          "Password": values.Password,
          "AccessKey": values.AccessKey,
          "AccountNo": values.AccountNo
        }
      } else {
        account_information = {
          "AccountNumber": values.AccountNumber,
          "Password": values.Password,
          "Key": values.Key,
          "MeterNumber": values.MeterNumber,
          "HubId": values.HubId
        }
      }

      if(this.state.selectedCarrierId !== null) {
        renderFooterButtons("update")

        Put("/forwarder/update_carrier", {
            "_id": this.state.selectedCarrierId,
            "status": "activated",
            "asset": {
              "nick_name": values.nick_name,
              "account_information": account_information
            }
        })
        .then(payload => {
          //console.log(payload)

          this.setState({ 
            submitting: false,
            showDetailModal: false
          })

          this.getShippingCarriers()
        })
      } else {
        renderFooterButtons("add")

        Post("/forwarder/add_carrier", {
          "type": values.provider,
          "asset": {
            "nick_name": values.nick_name,
            "account_information": account_information
          }
        })
        .then(payload => {
          //console.log(payload)

          this.setState({ 
            submitting: false,
            showDetailModal: false
          })

          this.getShippingCarriers()
        })
      }
    }

    const deleteShippingCarrier = (values) => {
      this.setState({ deleting: true })

      Post("/forwarder/delete_carrier", {
          "_id": this.state.selectedCarrierId
      })
      .then(payload => {
        console.log(payload)

        this.setState({ 
          deleting: false,
          showDeleteModal: false
        })

        this.getShippingCarriers()
      })
    }

    const selectCarrier = (value) => {
      this.setState({ carrierCode: value })
    }

    const columns = [
      {
        title: "操作", key: "action", width: 200, align: "left",
        fixed: "right",
        render: (record) => (
          <div>
            <Button type="link" icon={<EditOutlined />} size="large" onClick={() => showDetailModal(record._id)} />
            <Button type="link" icon={<SettingFilled />} size="large" onClick={() => showService(record._id)} loading={this.state.servicesLoading[record._id]} />
            <Button type="link" icon={<ControlOutlined />} size="large" onClick={() => showClientService(record._id)} loading={this.state.clientServicesLoading[record._id]}/>
            <Button type="link" icon={<DeleteOutlined />} size="large" onClick={() => deleteWarning(record._id)} style={{ color: "red" }}  />
          </div>
        )
      },
      { title: "名称", width: 150, dataIndex: ["asset", "nick_name"], key: "name", align: "left" },
      { 
        title: "使用状态", 
        width: 150, 
        dataIndex: ["asset", "status"], 
        key: "status", 
        align: "left",
        render: (text, record) => (
          <LoadingSwitch 
            size="small"
            checked={getCheckedStatus(record.status)}
            toggleStatus={(element, checked) => toggleCarrierStatus(element, checked, record._id)} />
        ) 
      },
      { 
        title: "渠道", 
        width: 150, 
        dataIndex: ["asset", "logo_url"], 
        key: "logo_url",
        align: "left", 
        render: (text, record) => (
          <img src={`${record.asset.logo_url}`} style={{ width: "30px" }} />
        )
      },
      { title: "账号ID", width: 150, dataIndex: ["asset", "code"], align: "left", key: "code" }            
    ]

    const setFormCarrierItem = (type = "UPS") => {
      if(type == "UPS") {
        return (
          <div>
            <Form.Item
              label="Username"
              name="Username"
              rules={[{ required: true, message: "请输入Username!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="Password"
              rules={[{ required: true, message: "请输入Password!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Access Key"
              name="AccessKey"
              rules={[{ required: true, message: "请输入Access Key!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Account NO"
              name="AccountNo"
              rules={[{ required: true, message: "请输入Account NO!" }]}
            >
              <Input />
            </Form.Item>
          </div>
        )
      } else {
        return (
          <div>
            <Form.Item
              label="Account Number"
              name="AccountNumber"
              rules={[{ required: true, message: "请输入Account Number!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="Password"
              rules={[{ required: true, message: "请输入Password!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="key"
              name="Key"
              rules={[{ required: true, message: "请输入key!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Meter Number"
              name="MeterNumber"
              rules={[{ required: true, message: "请输入Meter Number!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="HubId"
              name="HubId"
              rules={[{ required: true, message: "请输入HubId!" }]}
            >
              <Input />
            </Form.Item>
          </div>
        )
      }
    } 

    return (
      <div>
        <PageHeader
          style={{boxShadow: "1px 1px 5px rgba(0,21,41,.1)", background: "#fff", height: 70}}
          title={
            <div>
              <LegacyIcon style={{ marginRight: "8px" }} type="branches" />配送渠道
            </div>
          }
        />
        <div style={{ padding: 36 }}>
          <div style={{ boxShadow: "rgb(217, 217, 217) 1px 1px 7px 0px", padding: "10px 20px" }}>      
            <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => showDetailModal(null)} /> 
            <Table
              style={{ marginTop: "16px" }}
              rowKey={record => record[this.props.row_key]}
              columns={columns}
              dataSource={this.state.carriers}
              loading={tableLoading}
            />
          </div>
          <Modal
            title="渠道信息"
            visible={this.state.showDetailModal}
            onCancel={cancelDetailModal}
            footer={this.state.footerButtons}
          >
            <Form
              ref={this.formRef}
              name="carrierDetail"
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 15 }}
              fields={this.state.detailFields}
              initialValues={{ remember: false }}
              onFinish={formOnFinish}
            >
              <Form.Item
                name="provider"
                label="渠道"
                rules={[{ required: true, message: "请选择渠道!" }]}
              >
                <Select placeholder="" onChange={selectCarrier}>
                  <Option key="ups" value="UPS">UPS</Option>
                  <Option key="fedex" value="FEDEX">Fedex</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="名称"
                name="nick_name"
                value=""
                rules={[{ required: true, message: "请输入名称!" }]}
              >
                <Input />
              </Form.Item>
              {ShippingCarrierFieldAsset[this.state.carrierCode].map(item => { 
                return(<Form.Item
                  label={ item.name }
                  name={ item.name }
                  rules={[{ required: true, message: "请输入信息!" }]}
                >
                  <Input />
                </Form.Item>)
              })}
            </Form>
          </Modal>
          <Modal
            title="警告"
            visible={this.state.showDeleteModal}
            onCancel={cancelDeleteModal}
            footer={[
              <Button key="back" onClick={cancelDeleteModal}>取消</Button>,
              <Button type="primary" key="delete" loading={this.state.deleting} onClick={deleteShippingCarrier}>确定</Button>
            ]}
          >
           <span>您确定要删除此配送渠道？</span>
          </Modal>
          {this.state.showClientServiceDrawer ? 
            <ClientServiceDrawer 
              clients={this.state.clients}
              data={this.state.clientServices}
              visible={this.state.showClientServiceDrawer} 
              onClose={closeClientService} /> : null}
          <ServiceDrawer 
            onClose={closeService} 
            visible={this.state.showService} 
            services={this.state.carrierServices}
            carrierType={this.state.carrierServiceType} />
        </div>
      </div>
    )
  }
}

export default ShippingCarrier