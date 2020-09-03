import { EditOutlined, InfoCircleOutlined, PropertySafetyOutlined } from '@ant-design/icons';
import {
    Progress,
    Modal,
    Tag,
    Tooltip,
    Skeleton,
    Button,
    Radio,
    List,
    Avatar,
    Row,
    Col,
} from 'antd';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import My_Progress from '../components/progress'
import { actions as single_order_form } from '../../../reducers/shipping_platform/single_order_form'
import { actions as user_service_action } from '../../../reducers/shipping_platform/user/service'



const carrier_url = {
    UPS: "https://logo-logos.com/wp-content/uploads/2016/10/UPS_logo_logotype.png",
    USPS: "https://logo-logos.com/wp-content/uploads/2016/10/USPS_logo_logotype.png",
    FEDEX_GROUND: 'https://job-upload-imge.s3-us-west-1.amazonaws.com/carrier_logo/FedExLogo_Supplied_250x250.png',
    FEDEX_EXPRESS: "https://logo-logos.com/wp-content/uploads/2016/10/Fedex_Express_logo_logotype.png",
}


const data = [
    {
        title: 'USPS First Class',
        description: '时效3-5个工作日',
        src: carrier_url.USPS,
        key: 'usps_first_class'
    },
    {
        title: 'USPS Prority Mail',
        description: '时效1-3个天工作日',
        src: carrier_url.USPS,
        key: 'usps_priority'
    },
    {
        title: 'UPS Ground',
        description: '时效1-7个工作日',
        src: carrier_url.UPS,
        key: 'ups_ground'
    },
    {
        title: 'FedEx Express 2day',
        description: '时效2个工作日',
        src: carrier_url.FEDEX_EXPRESS,
        key: 'fedex_2_day'
    },

    {
        title: 'FedEx Ground',
        description: '时效1-7个工作日',
        src: carrier_url.FEDEX_GROUND,
        key: 'fedex_ground'
    },
];

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};


class Carrier_form extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        value: this.props.form_info.service_info == undefined ? undefined : this.props.form_info.service_info.key,
        visible: false,
        percent: 0,
        title: ' 正在递交数据'
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
        //  this.props.history.push(`/user/create/single_order/finish_form`)
    };

    hideModal = () => {
        this.setState({
            visible: false,
        });
    };

    got_finished = () => {
        // console.log('reach 100')
        this.setState({ title: ' 出单成功！' })
        // setTimeout(() => this.setState({ visible: false }), 1000)
        setTimeout(() => this.props.history.push(`/user/create/single_order/finish_form`), 1000)
    }

    got_progress = () => {
        // console.log('reach 100')
        this.setState({ title: '获取运单数据中' })
    }

    // update_title = () => {
    //     this.setState({ title: ' 出单成功' })
    // }


    onChange = e => {
        this.setState({ value: e.target.value });
        this.props.get_form_info({ service_info: this.props.service.find(item => item.code === e.target.value) })
        // console.log('radio checked', e.target.value);
    };

    componentWillReceiveProps() {
        // console.log('parent receive props')
    }
    componentDidMount() {
        this.props.get_service()
    }
    componentWillUnmount() {
        // this.props.reset_service()
        // this.props.reset_service_info()
    }

    render() {
        // console.log(this.props.service.length == 0 ? '没获取费用' : this.props.service[0].rate[0].base_zone.one[0])

        return (
            <div>
                <List
                    itemLayout="horizontal"
                    dataSource={this.props.service}
                    renderItem={item => (
                        <List.Item
                        >
                            <Skeleton loading={this.props.isFetching} active avatar paragraph={{ rows: 1 }}>
                                <Radio.Group
                                    onChange={this.onChange}
                                    value={this.state.value}>
                                    <Radio value={item.code}></Radio>
                                </Radio.Group>
                                <List.Item.Meta
                                    style={{ marginLeft: '20px' }}
                                    description={item.description}
                                    title={item.name}
                                    avatar={<Avatar
                                        shape="square"
                                        size={64}
                                        src={item.logo_url}
                                    />}
                                />
                                <div>

                                    <div>
                                        <span style={{ float: 'left', textAlign: 'right', marginRight: '10px' }} >{item == undefined ? 0 : item.rate[0].base_zone.one[0]} usd</span>
                                        <span style={{ float: 'left', textAlign: 'right' }}> <Tag color="red">官方零售价</Tag></span>
                                    </div>

                                    <div>
                                        <span style={{ float: 'left', textAlign: 'right', marginRight: '10px' }} >{item == undefined ? 0 : item.rate[0].base_zone.one[0]} usd</span>
                                        <span style={{ float: 'left', textAlign: 'right' }}> <Tag color="green">当前折扣价</Tag>
                                            <span>
                                                <Tooltip placement="bottomLeft" title="此处显示费用详细解释或者补充说明">
                                                    <InfoCircleOutlined />
                                                </Tooltip>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </Skeleton>
                        </List.Item>

                    )}
                />
                <Skeleton loading={this.props.isFetching} active paragraph={{ rows: 1 }}>
                    <Row gutter={24}>
                        <Col span={3} >
                            <Button
                                style={{ marginTop: '20px' }}
                                icon={<EditOutlined />}
                                // size="large"
                                onClick={() => {
                                    // this.props.set_finished('carrier_form', 'finish_form');
                                    // this.props.history.push(`/user/create/single_order/finish_form`)
                                }}
                            // disabled={hasErrors(getFieldsError())}
                            // type="primary"
                            // htmlType="submit"
                            >保存至草稿</Button>
                        </Col>

                        <Col span={3} >
                            <Button
                                style={{ marginTop: '20px' }}
                                icon={<PropertySafetyOutlined />}
                                disabled ={this.state.value == undefined}
                                onClick={() => {
                                    this.showModal()
                                    // this.handle_process()
                                    // console.log(this.props.carrier)                            
                                    this.props.reset_form_info()
                                    this.props.set_all_disabled()
                                    // this.props.history.push(`/user/create/single_order/finish_form`)
                                }}
                                type="primary"
                            // htmlType="submit"
                            >付款并打印</Button>
                        </Col>
                    </Row>
                </Skeleton>
  
                    <Modal
                        title={<div style={{ textAlign: 'center' }} > {this.state.title}</div>}
                        centered
                        destroyOnClose={true}
                        // visible={true}
                        visible={this.state.visible}
                        onCancel={this.hideModal}
                        footer={null}
                        width={400}
                        closable={false}
                    // keyboard={true}
                    // onOk={this.handleOk}
                    // onCancel={this.handleCancel}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <My_Progress
                                // update_title={this.update_title}
                                got_progress={this.got_progress}
                                got_finished={this.got_finished}
                            />
                        </div>
                        {/* <Progress width={150} type="circle" percent={this.state.percent} /> */}
                    </Modal>
            </div>
        );
    }
}


function mapStateToProps(state) {
    // console.log(state)
    return {
        isFetching: state.globalState.isFetching,
        service: state.shipping_platform_user.service,
        form_info: state.shipping_platform_single_order.form,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        get_form_info: bindActionCreators(single_order_form.get_form_info, dispatch),
        reset_form_info: bindActionCreators(single_order_form.reset_all_info, dispatch),
        reset_service_info: bindActionCreators(single_order_form.reset_service_info, dispatch),
        get_service: bindActionCreators(user_service_action.get_service, dispatch),
        reset_service: bindActionCreators(user_service_action.reset_service, dispatch),
        // to-do submit_order
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Carrier_form)
