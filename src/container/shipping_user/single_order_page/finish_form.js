import { Result, Button, Icon } from 'antd';
import React, { Component } from 'react';
import { Redirect, Router, Route, Switch, Link, NavLink } from 'react-router-dom';

class Finish_form extends Component {
    constructor(props) {
        super(props);
    }

    componentWillUnmount(){
        // this.props.reset()
    }

    
    render() {
        const { url } = this.props.match;
        return (
            <div>
                <Result
                    icon={<Icon type="smile" theme="twoTone" />}
                    title="订单完成！"
                    subTitle= { <span>系统订单号为xxxxxxxx，总运费为10.23 usd 。 由FedDex提供运输服务。点击按钮直接打印pdf 或在<a>已完成</a>中查看 </span> }
                    extra={[
                        <Button
                            icon="printer"
                            type="primary"
                            key="console">
                            打印运单
                        </Button>,
                        <Button
                            icon="rollback"
                            onClick={() => {
                                this.props.history.push(`/user/create/single_order/`)
                            }}
                            key="buy">再出一单
                        </Button>,
                    ]}
                />
            </div>
        )
    }
}
export default Finish_form