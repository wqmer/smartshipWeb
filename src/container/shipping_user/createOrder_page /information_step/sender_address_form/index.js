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

const sender_content = {
    asset: [
        { "label": '姓名', "key": "sender_name", "is_required": true, "message": undefined, "placehold": '发件人姓名，暂时不支持中文', "span_value": 12, type: 'input', },
        { "label": '公司名字', "key": "sender_company", "is_required": false, "message": undefined, "placehold": '公司名字，选填', "span_value": 12, type: 'input', },
        { "label": '电话', "key": "sender_phone_number", "is_required": true, "message": undefined, "placehold": '美国电话,必填', "span_value": 12, type: 'input', },
        { "label": '邮件地址', "key": "sender_email", "is_required": false, "message": undefined, "placehold": 'Email地址, 选填', "span_value": 12, type: 'input', },
        { "label": '地址', "key": "sender_add1", "is_required": true, "message": undefined, "placehold": '街道号码，路名，必填项', "span_value": 12, type: 'input', },
        { "label": '门牌号码', "key": "sender_add2", "is_required": false, "message": undefined, "placehold": '门牌号，选填', "span_value": 12, type: 'input', },
        { "label": '邮编', "key": "sender_zip_code", "is_required": true, "message": undefined, "placehold": '必填项', "span_value": 6, type: 'input', },
        { "label": '城市', "key": "sender_city", "is_required": true, "message": undefined, "placehold": '必填项', "span_value": 6, type: 'input', },
        { "label": '州', "key": "sender_tate", "is_required": true, "message": undefined, "placehold": '选择州', "span_value": 6, type: 'select', },
    ],

    sender_extra: [],
    receipant_extra: [],
    action: [
        // { "key": "save_link", "placehold": '保存', "span_value": 2, type: 'save_link', },
        // { "key": "reset_link", "placehold": '重置', "span_value": 2, type: 'reset_link', },
    ]
}

const is_ready_form = (content, props, form) => {
    const {getFieldsError, getFieldsValue } = form;
    // console.log(getFieldsValue())
    const is_rendered = _.isEmpty(getFieldsError()) ? false : true
    const has_error = !_.isEmpty(_.pickBy(getFieldsError(), _.identity))
    const is_filled = _.difference(content.asset.filter(item => item.is_required == true).map(item => item.key), _.keys((_.pickBy(getFieldsValue(), _.identity)))).length === 0
    // console.log("is_rendered 是 " +  is_rendered )
    // console.log("has_error 是 " +  has_error )
    // console.log("is_filled 是 " +  is_filled )
    return is_rendered && !has_error && is_filled
}

class Sender_Address_Form extends React.Component {
    constructor(props) {
        super(props)
    }


    save_data = (form, data, step) => {
        let obj = {}
        obj[`${step}`] = data
        //如果输入完毕 检查无误，递交至redux,设置面板标题为输入完整地址，否则显示未完成

        let sadd_2 = data.sender_add2 ? " , " + data.sender_add2 + ' , ' : " , "
        if (!is_ready_form(sender_content, this.props, form)) {
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
            obj[`${step}`]['panel_title'] = data.sender_name + ' , ' + data.sender_add1 + sadd_2 + data.sender_city + ' ' + data.sender_state + ' ' + data.sender_zip_code
            obj[`${step}`]['font_type'] = 'strong'
        }
        obj[`${step}`]['is_ready'] = is_ready_form(sender_content, this.props, form)
        obj['service_information'] = {}
        obj['service_information']['is_required_fetch'] = true
        this.props.get_form_info(obj)
        // this.props.get_title(step)
    };

    render() {
        // console.log(this.props.address_info)
        return (
            <div>
                <Select defaultValue="选择或者新输入一个地址" style={{ marginBottom: 16, width: 200 }} >
                    <Select.Option value="default">默认地址一</Select.Option>
                    <Select.Option value="address1">默认地址二</Select.Option>
                    <Select.Option value="address2">默认地址三</Select.Option>
                </Select>

                <Address_form
                    content={sender_content}
                    sender_information={this.props.sender_information}
                    onChange={(form, data) => this.save_data(form, data, this.props.profile)}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sender_information: state.shipping_platform_single_order.form.sender_information,
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
)(Sender_Address_Form)
