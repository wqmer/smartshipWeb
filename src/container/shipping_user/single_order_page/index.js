import { Steps, Divider, Icon } from 'antd';
import React, { Component } from 'react';
import { Redirect, Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import Address_form from './address_form'
import Parcel_form from './parcel_form'
import Carrier_form from './carrier_form'
import Finish_form from './finish_form'


const { Step } = Steps;
// const Single_order_page = () => {
//     return( 
//      <Steps current={0}>
//         <Step status="finish" title="填写信息" icon={<Icon type="user" />} />
//         <Step status="finish" title="选择渠道" icon={<Icon type="solution" />} />
//         <Step status="process" title="打印运单" icon={<Icon type="loading" />} />
//         <Step status="wait" title="完成" icon={<Icon type="smile-o" />} />
//       </Steps>)
// }

const step_object = {
    "single_order": 0,
    "parcel_form": 1,
    "carrier_form": 2,
    "finish_form": 3
}

const step_array = [
    "single_order",
    "parcel_form",
    "carrier_form",
    "finish_form"
]

class Single_order_page extends React.Component {
    state = {
        status: [
            'process',
            'wait',
            'wait',
            'wait',
        ],
        disabled: [
            false,
            true,
            true,
            true
        ],
        current_form: undefined
    };

    set_current_form = (form) => {
        this.setState({ current_form: form });
    }



    handle_redirect = current => {
        const current_url = step_array[current] == 'single_order' ? '' : step_array[current]
        this.props.history.push(`/user/create/single_order/${current_url}`)
    }


    onChange = current => {
        let current_step = step_object[this.getKeyOfSubMenus().LastChildOfUrl]
        if (current_step < current) {
            this.state.current_form.validateFields((err, values) => { if (!err) this.handle_redirect(current) });
        } else this.handle_redirect(current)
    }

    reset = () => {
        let re_status = [
            'process',
            'wait',
            'wait',
            'wait',
        ]
        let re_disabled = [
            false,
            true,
            true,
            true
        ]
        this.setState({ status: re_status, disabled: re_disabled })
    }

    set_all_disabled = () => {
        let all_disabled = [
            true,
            true,
            true,
            true
        ]
        let list_status = this.state.status.map((item, index) => {
            if (index == 3) {
                item = 'process'
            }
            if (index == 2) {
                item = 'finish'
            }
            return item
        })
        this.setState({ status: list_status, disabled: all_disabled })
    }

    set_finished = (current_step, next_step) => {
        let current_index = step_object[current_step]
        let next_index = step_object[next_step]
        let list_status = this.state.status.map((item, index) => {
            if (index == current_index) {
                item = 'finish'
            }
            if (index == next_index && item != 'finish') {
                item = 'process'
            }
            return item
        })

        let list_disabled = this.state.disabled.map((item, index) => {
            if (index == next_index) {
                item = false
            }
            return item
        })
        this.setState({ status: list_status, disabled: list_disabled })
    }


    getKeyOfSubMenus = () => {
        var str = this.props.history.location.pathname.substring('/user/'.length) || '/' //  /seller/order/new   --->  order/new 
        var result = {
            parent: undefined,
            childern: []
        }
        let initial = 0
        for (var i = 0; i < str.length; i++) {
            if (str[i] == '/') {
                !result.parent ? result.parent = str.substring(initial, i) : result.childern.push(str.substring(initial, i))
                initial = i + 1;
            }
            if (str.lastIndexOf('/') == i && str.substring(initial, str.length)) {
                result.childern.push(str.substring(initial, str.length))
            }
        }
        return {
            Parent: result.parent,  //order/new   --> order
            Children: result.childern, //order/new   --> new 
            //   LastChildOfUrl: '/' + result.childern[0]
            // 设置为0 表示如果有大于1个子类，都不继续向下映射 暂时只允许一个子类出现在面包屑中，防止对应边栏key和面包屑等不能对应问题。
            LastChildOfUrl: result.childern[result.childern.length - 1]
        }
    }


    render() {

        // const { current } = this.state;
        const { url } = this.props.match;
        const current = step_object[this.getKeyOfSubMenus().LastChildOfUrl]
        // console.log(this.state.current_form)
        return (
            <div >
                <Steps
                    // type="navigation"        
                    style={{ background: '#fff', padding: 32 , width: '100%' }}
                    // size = "small"
                    current={current}
                    onChange={this.onChange}>
                    <Step key="收发信息" status={this.state.status[0]} title="收发信息" icon={<Icon type="form" />} disabled={this.state.disabled[0]} />
                    <Step key="包裹信息" status={this.state.status[1]} title="包裹信息" icon={<Icon type="gift" />} disabled={this.state.disabled[1]} />
                    <Step key="选择渠道" status={this.state.status[2]} title="选择渠道" icon={<Icon type="car" />} disabled={this.state.disabled[2]} />
                    <Step key="完成出单" status={this.state.status[3]} title="完成出单" icon={<Icon type="check-circle" />} disabled={this.state.disabled[3]} />
                </Steps>

                <div style={{ background: '#fff', padding: 32 , marginTop: '24px' }}>
                    <Switch >
                        <Route exact path={`${url}/`}
                            render={(props) =>
                                <Address_form
                                    {...props}
                                    // triggle_form_validtor={(boolen)=>this.triggle_form_validtor(boolen)}
                                    // form_vailditor = t
                                    set_current_form={(form) => this.set_current_form(form)}
                                    set_finished={(current_step, next_step) => this.set_finished(current_step, next_step)}
                                />}
                        />
                        {this.state.status[0] != 'finish' ? <Redirect to={`${url}`} /> :
                            <Route path={`${url}/parcel_form`}
                                render={(props) =>
                                    <Parcel_form
                                        {...props}
                                        set_current_form={(form) => this.set_current_form(form)}
                                        set_finished={(current_step, next_step) => this.set_finished(current_step, next_step)}
                                    />}
                            />
                        }

                        <Route path={`${url}/carrier_form`}
                            render={(props) =>
                                <Carrier_form
                                    {...props}
                                    set_all_disabled={() => this.set_all_disabled()}
                                    set_finished={(current_step, next_step) => this.set_finished(current_step, next_step)}
                                />}
                        />
                        {/* <Route path={`${url}/carrier_form`} component={carrier_form} /> */}
                        <Route path={`${url}/finish_form`}
                            render={(props) =>
                                <Finish_form
                                    {...props}
                                    reset={() => (this.reset())}
                                // set_all_disabled={() => this.set_all_disabled()}
                                />}
                        />
                        {/* <Route component={NotFound} /> */}
                    </Switch>
                </div>
            </div>
        );
    }
}

export default Single_order_page
