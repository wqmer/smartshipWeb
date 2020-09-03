import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Col, Row, Input, Select, Collapse, Steps, Divider } from 'antd';
import React, { Component } from 'react';
import { Redirect, Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import { actions as single_order_form } from '../../../../../reducers/shipping_platform/single_order_form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from "lodash";
import Address_form from './address_form'

const receipant_content = {
    asset: [
        { "label": '姓名', "key": "receipant_name", "is_required": true, "message": undefined, "placehold": '发件人姓名，暂时不支持中文', "span_value": 12, type: 'input', },
        { "label": '公司名字', "key": "receipant_company", "is_required": false, "message": undefined, "placehold": '公司名字，选填', "span_value": 12, type: 'input', },
        { "label": '电话', "key": "receipant_phone_number", "is_required": true, "message": undefined, "placehold": '美国电话,必填', "span_value": 12, type: 'input', },
        { "label": '邮件地址', "key": "receipant_email", "is_required": false, "message": undefined, "placehold": 'Email地址,选填', "span_value": 12, type: 'input', },
        { "label": '地址一', "key": "receipant_add1", "is_required": true, "message": undefined, "placehold": '街道号码，路名，必填项', "span_value": 12, type: 'input', },
        { "label": '地址二', "key": "receipant_add2", "is_required": false, "message": undefined, "placehold": '门牌号，选填', "span_value": 12, type: 'input', },
        { "label": '邮编', "key": "receipant_zip_code", "is_required": true, "message": undefined, "placehold": '必填项', "span_value": 6, type: 'input', },
        { "label": '城市', "key": "receipant_city", "is_required": true, "message": undefined, "placehold": '必填项', "span_value": 6, type: 'input', },
        { "label": '州', "key": "receipant_state", "is_required": true, "message": undefined, "placehold": '选择州', "span_value": 6, type: 'select', },
    ],

    sender_extra: [],
    receipant_extra: [],
    action: [
        // { "key": "save_link", "placehold": '保存', "span_value": 2, type: 'save_link', },
        // { "key": "reset_link", "placehold": '重置', "span_value": 2, type: 'reset_link', },
    ]
}

const is_ready_form = (content, props, form) => {
    const { getFieldDecorator, getFieldsError, getFieldsValue } = form;
    const is_rendered = _.isEmpty(getFieldsError()) ? false : true
    const has_error = !_.isEmpty(_.pickBy(getFieldsError(), _.identity))
    const is_filled = _.difference(content.asset.filter(item => item.is_required == true).map(item => item.key), _.keys((_.pickBy(getFieldsValue(), _.identity)))).length === 0
    return is_rendered && !has_error && is_filled
}

class Receipant_Address_Form extends React.Component {
    constructor(props) {
        super(props)
    }
    save_data = (form, data, step) => {
        let obj = {}
        obj[`${step}`] = data
        obj['service_information'] = {}
        //重置服务面板

        console.log("输入收件人信息")
        // billing_information: {
        //     on_display: false,
        //     total: 0,
        // },

        let radd_2 = data.receipant_add2 ? " , " + data.receipant_add2 + ' , ' : " , "
        if (!is_ready_form(receipant_content, this.props, form)) {
            //信息处于未完成状态时 如果面板打开或者已经选择服务，就强制收起和修改
            if (this.props.setting.open_panel.includes('service_information') || this.props.service_information.service_name) {

                let update_obj = { service_information: {}, setting: {} }
                update_obj['service_information'] = {
                    is_select: false,
                    service_name: undefined,
                    panel_title: '请先完成输入信息',
                    font_type: 'secondary',
                }
                update_obj['setting']['open_panel'] = this.props.setting.open_panel.filter(item => item != 'service_information')
                this.props.update_form_info(update_obj)
            }
            obj[`${step}`]['panel_title'] = '编辑中'
            obj[`${step}`]['font_type'] = 'warning'
        } else {
            obj[`${step}`]['panel_title'] = data.receipant_name + ' , ' + data.receipant_add1 + radd_2 + data.receipant_city + ' ' + data.receipant_state + ' ' + data.receipant_zip_code
            obj[`${step}`]['font_type'] = 'strong'
        }
        obj[`${step}`]['is_ready'] = is_ready_form(receipant_content, this.props, form)
        obj['service_information']['is_required_fetch'] = true
        this.props.get_form_info(obj)
    };

    render() {
        return (
            <div>
                <Select defaultValue="选择或者新输入一个地址" style={{ marginBottom: 16, width: 200 }} >
                    <Select.Option value="default">默认地址一</Select.Option>
                    <Select.Option value="address1">默认地址二</Select.Option>
                    <Select.Option value="address2">默认地址三</Select.Option>
                </Select>

                <Address_form
                    content={receipant_content}
                    receipant_information={this.props.receipant_information}
                    onChange={(form, data) => this.save_data(form, data, this.props.profile)}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        receipant_information: state.shipping_platform_single_order.form.receipant_information,
        service_information: state.shipping_platform_single_order.form.service_information,
        setting: state.shipping_platform_single_order.form.setting
    }
}

function mapDispatchToProps(dispatch) {
    return {
        get_form_info: bindActionCreators(single_order_form.get_form_info, dispatch),
        update_form_info: bindActionCreators(single_order_form.update_form_info, dispatch),
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Receipant_Address_Form)
