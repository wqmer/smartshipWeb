import React, { Component } from 'react';
import { Layout, Row, Col } from 'antd';
import { Button, Avatar, Tag } from 'antd';
import TweenOne from 'rc-tween-one/lib';
import BannerAnim, { Element } from 'rc-banner-anim/lib';

import ComponentHeader from './header';
import ComponentFooter from './footer';


const BgElement = Element.BgElement;
const { Header, Content, Footer } = Layout;

class ComponentHome extends Component {
  render() {
    return (
	    <Layout>
		  <ComponentHeader></ComponentHeader>
	      <Content>
		    <BannerAnim prefixCls="banner-user">
	          <Element prefixCls="banner-user-elem" key="0">
                <BgElement key="bg" className="bg" style={{ backgroundImage: `url("http://bisail.com/assets/image/slider1.jpg")`, backgroundSize: 'cover', backgroundPosition: 'center'}}/>
                <TweenOne className="banner-user-title" animation={{ y: 30, opacity: 0, type: 'from' }}>Bisail is ready to trade</TweenOne>
                <TweenOne className="banner-user-date" animation={{ y: 30, opacity: 0, type: 'from', delay: 100 }}>Jun. 11th 2018</TweenOne>
              </Element>
              <Element prefixCls="banner-user-elem" key="1">
                <BgElement key="bg" className="bg" style={{ backgroundImage: `url("http://bisail.com/assets/image/slider2.jpg")`, backgroundSize: 'cover', backgroundPosition: 'center'}}/>
                <TweenOne className="banner-user-title" animation={{ y: 30, opacity: 0, type: 'from' }}>AMC(Amice coin) on our market</TweenOne>
                <TweenOne className="banner-user-date" animation={{ y: 30, opacity: 0, type: 'from', delay: 100 }}>Jun. 11th 2018</TweenOne>
              </Element>
            </BannerAnim>
		    <div>
		      <div className="trade-block">
			    <Row>
			      <Col span={4}><Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /></Col>
			      <Col span={20}><Tag>Tag 1</Tag></Col>
			    </Row>
			    <Row>
			      <Col span={4}>
				    <div>BTC / USDT</div>
				    <div>6708</div>
				    <div>--</div>
				  </Col>
			      <Col span={4}>
				    <div>BTC / USDT</div>
				    <div>6708</div>
				    <div>--</div>
				  </Col>
				  <Col span={4}>
				    <div>BTC / USDT</div>
				    <div>6708</div>
				    <div>--</div>
				  </Col>
			      <Col span={4}>
				    <div>BTC / USDT</div>
				    <div>6708</div>
				    <div>--</div>
				  </Col>
				  <Col span={4}>
				    <div>BTC / USDT</div>
				    <div>6708</div>
				    <div>--</div>
				  </Col>
			      <Col span={4}>
				    <div>BTC / USDT</div>
				    <div>6708</div>
				    <div>--</div>
				  </Col>
			    </Row>
			  </div>
		    </div>
		  </Content>
		  <ComponentFooter></ComponentFooter>
		</Layout>
    );
  }
}

export default ComponentHome;