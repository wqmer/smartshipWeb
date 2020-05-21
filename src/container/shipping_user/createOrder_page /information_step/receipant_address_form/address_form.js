import { Button, Col, Row, Input, Form, Select, Collapse, Steps, Divider, Icon } from 'antd';
import React, { Component } from 'react';
import { Redirect, Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import { actions as single_order_form } from '../../../../../reducers/shipping_platform/single_order_form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from "lodash";



const select_compoment = (props, item) => {
    const { getFieldDecorator, setFieldsValue, getFieldsValue, resetFields } = props.form;
    let form_item_content = undefined
    switch (item.type) {
        case "input":
            form_item_content = (<Input placeholder={item.placehold} allowClear />)
            break;
        case "select":
            form_item_content =
                (<Select placeholder={item.placehold}  >
                    <Select.Option value="default_state1">州一</Select.Option>
                    <Select.Option value="default_state2">州二</Select.Option>
                    <Select.Option value="default_state3">州三</Select.Option>
                </Select>)
            break;
    }

    let content = <Form.Item hasFeedback={true}
        // validateStatus="warning"
        label={item.label}
    >
        {getFieldDecorator(item.key, {
                //先读取保存数据，如果没有设置undefined
            initialValue: props.receipant_information ? props.receipant_information[item.key] : undefined,
            rules: [
                { required: item.is_required },
                { max: 35 }
            ],
        })(form_item_content)}
    </Form.Item>

    return content
}

const display_form_item = (props) => {
    let content = props.content
    let content_form = content.asset
    let content_action = content.action
    let result = []
    let row_content = []
    let curent_row_length = 0

    for (var i = 0; i < content_form.length; i++) {
        row_content.push(content_form[i])
        curent_row_length = curent_row_length + content_form[i].span_value
        if (curent_row_length == 24 || (curent_row_length < 24 && i == content_form.length - 1)) {
            let element = <Row key={i} gutter={24}> {row_content.map((item, index) => { return (<Col key={item.key} span={item.span_value} >{select_compoment(props, item)} </Col>) })} </Row>
            row_content = []
            curent_row_length = 0
            result.push(element)
        }
    }
    // let action_element = <Row key={i} gutter={24}> {content_action.map((item, index) => { return (<Col key={item.key} span={item.span_value} >{select_compoment(props, item)} </Col>) })} </Row>
    // result.push(action_element)
    return result
}

const Address_form = Form.create({
    onFieldsChange(props, changedValues, allValues) {
        props.onChange(props.form, props.form.getFieldsValue());
    },
})(props => {
    return (
        <Form >{display_form_item(props)} </Form>
    )
})


export default Address_form