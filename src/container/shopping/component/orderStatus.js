import Result from 'ant-design-pro/lib/Result';
import React, {Component, PropTypes} from 'react'
import { Button, Row, Col, Steps } from 'antd';


const { Step } = Steps;

class orderStatus extends React.Component {
      constructor(props){
        super(props);
    }

    render(){ 
        const {orderId} = this.props.location.state
        // console.log(this.props.location.state.orderId)
        // console.log(this.state)
        const extra = (
            <div>
              <div style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.85)', fontWeight: 500, marginBottom: 20 }}>
                订单信息
              </div>
              <Row style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>订单号：</span>
                  <span> {orderId} </span>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>买家：</span>
                    xxx
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>处理时间：</span>
                  2019-xx-xx ~ 2019-xx-xx
                </Col>
              </Row>
              <Steps progressDot current={0}>
                <Step title="订单创建" />
                <Step title="订单确认"  />
                <Step title="订单处理" />
                <Step title="订单完成" />
              </Steps>
            </div>
          );

          const actions = (
            <div>
              <Button type="primary" onClick = {() => this.props.history.goBack()  }>返回</Button>
              <Button disabled>打 印</Button>
            </div>
          );

          return(
                 <Result
                    type="success"
                    title="订单创建成功"
                    description="订单处于xx状态，请耐心等候处理"
                    extra={extra}
                    actions={actions}
                    style={{ width: '100%' }} 
                  />
          )
    }
 }


 export default orderStatus




