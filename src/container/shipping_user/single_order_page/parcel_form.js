import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as single_order_form } from '../../../reducers/shipping_platform/single_order_form'

import {
    Button, Modal, Form, Input, Radio, Select, Row, Switch, Icon,
    InputNumber,
    Col,
    message
} from 'antd';

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
};

const formItemLayout_tail = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
};


const obj_property = ['label_name', 'field_key', 'placeholder', 'message', 'required', 'col_size']

const parcel_line = [
    ["重量", 'weight', '包裹重量', '包裹重量必填', true, 9],
    ["单位", 'weight_unit', '重量单位', '包裹重量必填', true, 3],
    ["长", 'length', '包裹长', '包裹长必填', true, 3],
    ["宽", 'width', '包裹宽', '包裹宽必填', true, 3],
    ["高", 'height', '包裹高', '包裹高必填', true, 3],
    ["单位", 'length_unit', '长度单位', '长度单位', true, 3]
]

const order_info_line = [
    ["自定义订单号", 'customer_order_id', '如果不填系统自动生成', '', false, 12],
    ["备注信息一", 'note1', '备注信息出现在label位置一，选填', '', false, 6],
    ["备注信息二", 'note2', '备注信息出现在label位置二，选填', '', false, 6],

]

const value_add_service_line_1 = [

    ["需要保险", 'insurance', '', '', false, 2],
    ["保险额度", 'insurance_amount', '', '', false, 2],
]

const value_add_service_line_2 = [
    [" 是否签收", 'signature', '', '', false, 2],
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

const Parcel_form = Form.create()(
    // eslint-disable-next-line
    class extends React.Component {

        collect_info = (info_label, e) => {
            let obj = {}
            obj[`${info_label}`] = e.target.value
            this.props.get_form_info({ parcel_info: obj })
        }

        collect_info_switch = (info_label, checked) => {
            let obj = {}
            obj[`${info_label}`] = checked
            this.props.get_form_info({ parcel_info: obj })
        }


        get_fields(form_array) {
            const { getFieldDecorator } = this.props.form;
            const form = []
            form_array.map(item => {
                switch (item.field_key) {
                    case 'weight_unit':
                        form.push(
                            <Col key={item.field_key} span={item.col_size}>
                                <FormItem label={item.label_name}  >
                                    {getFieldDecorator(`${item.field_key}`, {
                                        initialValue: this.props.parcel_info != undefined && this.props.parcel_info[`${item.field_key}`] ? this.props.parcel_info[`${item.field_key}`] : "lb",
                                        rules: [{ required: item.required, message: item.message }],
                                    })(
                                        <Radio.Group 
                                            size = "small"
                                            onChange={(e) => this.collect_info(`${item.field_key}`, e)}
                                            buttonStyle="solid">
                                            <Radio.Button value="kg">Kg</Radio.Button>
                                            <Radio.Button value="lb">Lb</Radio.Button>
                                        </Radio.Group>
                                    )}
                                </FormItem>
                            </Col>)
                        break;
                    case 'length_unit':
                        form.push(
                            <Col key={item.field_key} span={item.col_size}>
                                <FormItem label={item.label_name}  >
                                    {getFieldDecorator(`${item.field_key}`, {
                                        initialValue: this.props.parcel_info != undefined && this.props.parcel_info[`${item.field_key}`] ? this.props.parcel_info[`${item.field_key}`] : "inch",
                                        rules: [{ required: item.required, message: item.message }],
                                    })(
                                        <Radio.Group
                                            size = "small"
                                            onChange={(e) => this.collect_info(`${item.field_key}`, e)}
                                            buttonStyle="solid">
                                            <Radio.Button value="inch">Inch</Radio.Button>
                                            <Radio.Button value="cm">Cm</Radio.Button>
                                        </Radio.Group>
                                    )}
                                </FormItem>
                            </Col>)
                        break;

                    case 'signature':
                        form.push(
                            <Col key={item.field_key} span={item.col_size}>
                                <FormItem label={item.label_name}  >
                                    {getFieldDecorator(`${item.field_key}`, {
                                        valuePropName: 'checked',
                                        initialValue: this.props.parcel_info != undefined && this.props.parcel_info[`${item.field_key}`] ? this.props.parcel_info[`${item.field_key}`] : false,
                                        rules: [{ required: item.required, message: item.message }],
                                    })(
                                        <Switch
                                            onChange={(checked) => this.collect_info_switch(`${item.field_key}`, checked)}
                                            checkedChildren={<Icon type="check" />}
                                            unCheckedChildren={<Icon type="close" />}
                                        />
                                    )}
                                </FormItem>
                            </Col>)
                        break;

                    case 'insurance':
                        form.push(
                            <Col key={item.field_key} span={item.col_size}>
                                <FormItem label={item.label_name}  >
                                    {getFieldDecorator(`${item.field_key}`, {
                                        valuePropName: 'checked',
                                        initialValue: this.props.parcel_info != undefined && this.props.parcel_info[`${item.field_key}`] ? this.props.parcel_info[`${item.field_key}`] : false,
                                        rules: [{ required: item.required, message: item.message }],
                                    })(
                                        <Switch
                                            onChange={(checked) => this.collect_info_switch(`${item.field_key}`, checked)}
                                            checkedChildren={<Icon type="check" />}
                                            unCheckedChildren={<Icon type="close" />}
                                        />
                                    )}
                                </FormItem>
                            </Col>)
                        break;
                    case 'insurance_amount':
                        form.push(
                            <Col key={item.field_key} span={item.col_size}>
                                <FormItem label={item.label_name}  >
                                    {getFieldDecorator(`${item.field_key}`, {
                                        initialValue: 100,
                                        rules: [{ required: item.required, message: item.message }],
                                    })(
                                        <InputNumber min={100} max={5000} disabled />
                                    )}
                                </FormItem>
                            </Col>)
                        break;
                    default:
                        form.push(
                            <Col key={item.field_key} span={item.col_size}>
                                <FormItem label={item.label_name}  >
                                    {getFieldDecorator(`${item.field_key}`, {
                                        initialValue: this.props.parcel_info == undefined ? undefined : this.props.parcel_info[`${item.field_key}`],
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
                }
            })
            return form
        }

        componentDidMount = () => {
            this.props.set_current_form(this.props.form);
        }

        render() {
            const {
                visible, onCancel, onCreate, form,
            } = this.props;

            const { getFieldDecorator } = form;

            const Option = Select.Option;

            function handleChange(value) {
                console.log(`selected ${value}`);
            }

            function cancel(e) {
                console.log(e);
                message.error('Click on No');
            }


            return (

                <Form>
                    <Row gutter={24} >{this.get_fields(form_input_asset(parcel_line))}</Row>
                    <Row gutter={24} >{this.get_fields(form_input_asset(order_info_line))}</Row>
                    <Row gutter={24} >{this.get_fields(form_input_asset(value_add_service_line_1))}</Row>
                    <Row gutter={24} >{this.get_fields(form_input_asset(value_add_service_line_2))}</Row>

                    <Row gutter={24}>
                        <Col span={6} >
                            <Button
                                style={{ marginTop: '20px' }}
                                icon='caret-right'
                                // disabled={hasErrors(getFieldsError())}
                                type="primary"
                                // htmlType="submit"
                                onClick={() => {
                                    this.props.set_finished('parcel_form', 'carrier_form');
                                    this.props.history.push(`/user/create/single_order/carrier_form`)
                                }}
                            >下一步</Button>
                        </Col>
                    </Row>
                </Form>
            );
        }
    }
);



function mapStateToProps(state) {
    console.log(state)
    return {
        parcel_info: state.shipping_platform_single_order.form.parcel_info
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
)(Parcel_form)

