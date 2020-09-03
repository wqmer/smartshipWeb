import React from 'react'
import {Button} from 'antd'

export const Logined = (props) => (
    <div>
        <p>欢迎：{props.forwarder_info.forwarder_name}</p>
            <Button onClick={() => props.history.push('/forwarder/order/draft')} type="primary">点击进入管理页面</Button> 
    </div>
);