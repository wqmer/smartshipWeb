import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as single_order_form } from '../../../reducers/shipping_platform/single_order_form'
import 'antd/dist/antd.css';

import { CaretRightOutlined } from '@ant-design/icons';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { Button, Modal, Input, Radio, Select, Row, Col, message } from 'antd';

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const obj_property = ['label_name', 'field_key', 'placeholder', 'message', 'required', 'col_size']

const name_line = [
    ["姓名", 'sender_name', '发件人姓名', '发件人姓名必填', true, 6],
    ["公司", 'sender_company', '发件人公司，选填', '', false, 6],
    ["姓名", 'receiver_name', '收件人姓名', '收件人姓名必填', true, 6],
    ["公司", 'recevier_company', '收件人公司，选填', '', false, 6]
]

const address_line = [
    ["地址一", 'sender_add1', '发件人街道名', '发件人地址一必填', true, 6],
    ["地址二", 'sender_add2', '发件人门牌号，选填', '', false, 6],
    ["地址一", 'receiver_add1', '收件人街道名', '收件人地址一必填', true, 6],
    ["地址二", 'recevier_add2', '收件人门牌号，选填', '', false, 6]
]

const area_line = [
    ["城市", 'sender_city', '发件人城市', '发件人城市必填', true, 6],
    ["州", 'sender_state', '发件人州', '发件人州必填', true, 3],
    ["邮编", 'sender_zip', '发件人邮编', '发件人邮编必填', true, 3],
    ["城市", 'receiver_city', '收件人城市', '收件人城市必填', true, 6],
    ["州", 'recevier_state', '收件人州', '收件人州必填', true, 3],
    ["邮编", 'receiver_zip', '收件人邮编', '收件人邮编必填', true, 3],
]

const form_input_asset = (array_asset) => {
    let form_content_array = []
    for (let i = 0; i < array_asset.length; i++) {
        let obj = {}
        for (let j = 0; j < array_asset[0].length; j++) {
            obj[obj_property[j]] = array_asset[i][j]
        }
        form_content_array.push(obj)
    }
    return form_content_array
}

const Address_form = Form.create()(
    class extends React.Component {
        constructor(props) {
            super(props)
        }

        handleSubmit = e => {
            e.preventDefault();
            const { getFieldsError } = this.props.form;
            // console.log(getFieldsError())
            this.props.set_finished('single_order', 'parcel_form');
            this.props.history.push(`/user/create/single_order/parcel_form`)
            // this.props.form.validateFields((err, values) => {
            //     if (!err) {
            //         this.props.set_finished('single_order', 'parcel_form');
            //         this.props.history.push(`/user/create/single_order/parcel_form`)
            //     }
            // });
        }

        collect_info = (info_label, e) => {
            let obj = {}
            obj[`${info_label}`] = e.target.value
            this.props.get_form_info({ address_info: obj })
        }

        get_fields(form_array) {
            const { getFieldDecorator, getFieldsError } = this.props.form;
            const form = []
            form_array.map(item => {
                form.push(
                    <Col key={item.field_key} span={item.col_size}>
                        <FormItem label={item.label_name}  >
                            {getFieldDecorator(`${item.field_key}`, {
                                initialValue: this.props.address_info == undefined ? undefined : this.props.address_info[`${item.field_key}`],
                                rules: [{ required: item.required, message: item.message }],
                            })(
                                <Input
                                    onBlur={(e) => this.collect_info(`${item.field_key}`, e)}
                                    autoComplete="off"
                                    placeholder={item.placeholder} />
                            )}
                        </FormItem>
                    </Col>
                )
            })
            return form
        }
        componentDidMount = () => {
            this.props.set_current_form(this.props.form);
        }

        render() {
            const {
                visible,
                onCancel,
                onCreate,
                form,
            } = this.props;

            const { getFieldDecorator, getFieldsError } = form;
            const Option = Select.Option;
            return (
                <Form onSubmit={this.handleSubmit} >
                    <Row gutter={24}>
                        <Col span={12} > <p style={{ fontSize: "150%" }}>发件人</p></Col>
                        <Col span={12} ><p style={{ fontSize: "150%" }}>收件人</p> </Col>
                    </Row>
                    <Row gutter={24} >{this.get_fields(form_input_asset(name_line))}</Row>
                    <Row gutter={24} >{this.get_fields(form_input_asset(address_line))}</Row>
                    <Row gutter={24} >{this.get_fields(form_input_asset(area_line))}</Row>
                    <Row gutter={24}>
                        <Col span={6} >
                            <Button
                                htmlType="submit"
                                icon={<CaretRightOutlined />}
                                style={{ marginTop: '20px' }}
                                type="primary"
                            >下一步</Button>
                        </Col>
                    </Row>
                </Form>
            );
        }
    }
);

function mapStateToProps(state) {
    return {
        address_info: state.shipping_platform_single_order.form.address_info
    }
}

function mapDispatchToProps(dispatch) {
    return {
        get_form_info: bindActionCreators(single_order_form.get_form_info, dispatch),
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Address_form)

