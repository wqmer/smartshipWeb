import { PrinterOutlined, RollbackOutlined, SmileTwoTone } from '@ant-design/icons';
import { Result, Button } from 'antd';
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
                    icon={<SmileTwoTone />}
                    title="订单完成！"
                    subTitle= { <span>系统订单号为xxxxxxxx，总运费为10.23 usd 。 由FedDex提供运输服务。点击按钮直接打印pdf 或在<a>已完成</a>中查看 </span> }
                    extra={[
                        <Button
                            icon={<PrinterOutlined />}
                            type="primary"
                            key="console">
                            打印运单
                        </Button>,
                        <Button
                            icon={<RollbackOutlined />}
                            onClick={() => {
                                this.props.history.push(`/user/create/single_order/`)
                            }}
                            key="buy">再出一单
                        </Button>,
                    ]}
                />
            </div>
        );
    }
}
export default Finish_form