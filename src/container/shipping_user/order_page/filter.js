import {
    Typography,
    Empty,
    Spin,
    Table,
    PageHeader,
    Timeline,
    Button, Modal, Form, Input, Radio, Select, Row,
    Col,
    Tag,
    message,
    Divider,
    Tabs,
    Icon,
    DatePicker,
    Collapse
} from 'antd';

import React, { Component, PropTypes } from 'react'
import FilterTag from '../components/check_tag'
import Chip from '@material-ui/core/Chip';

const InputGroup = Input.Group;
const { Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { CheckableTag } = Tag;
const { Option } = Select;
const { Panel } = Collapse;

const children = [];
for (let i = 10; i < 36; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const chip_style = { padding: '6px' }

const fitler_content = (page_name, component) => {
    const filter_name = {
        base: [
            <RangePicker
                style={{ width: "100%" }}
                // size='small'
                // showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD"
                placeholder={['开始时间', '结束时间']}
                onChange={(value, dateString) => component.filter_onChange({ value, dateString }, 'data_picker')}
                value={[component.state.start, component.state.end]}
            />,
            <Select mode="tags" style={{ width: "100%" }} placeholder="发件地址，可多选" onChange={component.handleChange}>
                {children}
            </Select>,
            <Select mode="tags" style={{ width: "100%" }} placeholder="渠道，可多选" onChange={component.handleChange}>
                {children}
            </Select>,

        ],
        draft: [],
        ready_to_ship: [
            <Select
                placeholder="选择出单状态"
                style={{ width: "100%" }}
                allowClear
                onChange={(value) => component.filter_onChange({ value }, 'select_server_status')}
                value={component.state.server_status}
            >
                <Option value="default">待出运单</Option>
                <Option value="processing">正在出单</Option>
                <Option value="error">服务器报错</Option>
            </Select>,

            <InputGroup compact>
                <Input style={{ width: "30%", textAlign: 'center' }} placeholder="最轻" />
                <Input
                    style={{
                        width: "14%",
                        borderLeft: 0,
                        pointerEvents: 'none',
                        backgroundColor: '#fff',
                        textAlign: 'center'
                    }}
                    placeholder="~"
                    disabled
                />
                <Input style={{ width: "30%", textAlign: 'center', borderLeft: 0 }} placeholder="最重" />

                <Select style={{ width: "26%" }} defaultValue="1">
                    <Option value="1">kg</Option>
                    <Option value="2">lb</Option>
                </Select>
            </InputGroup>,

            <InputGroup compact>
                <Input style={{ width: "40%", textAlign: 'center' }} placeholder="最低运费" />
                <Input
                    style={{
                        width: "20%",
                        borderLeft: 0,
                        pointerEvents: 'none',
                        backgroundColor: '#fff',
                        textAlign: 'center'
                    }}
                    placeholder="~"
                    disabled
                />
                <Input style={{ width: "40%", textAlign: 'center', borderLeft: 0 }} placeholder="最高运费" />
            </InputGroup>,
        ],
        completed: [
            <Select placeholder="打印状态" style={{ width: "100%" }} >
                <Option value="jack">已打印</Option>
                <Option value="lucy">未打印</Option>
            </Select>,

            <Select placeholder="选择物流状态" style={{ width: "100%" }} >
                <Option value="jack">投递</Option>
                <Option value="lucy">运输中</Option>
                <Option value="Yiminghe">创建</Option>
                <Option value="123">异常</Option>
            </Select>,


            <InputGroup compact>
                <Input style={{ width: "30%", textAlign: 'center' }} placeholder="最轻" />
                <Input
                    style={{
                        width: "14%",
                        borderLeft: 0,
                        pointerEvents: 'none',
                        backgroundColor: '#fff',
                        textAlign: 'center'
                    }}
                    placeholder="~"
                    disabled
                />
                <Input style={{ width: "30%", textAlign: 'center', borderLeft: 0 }} placeholder="最重" />

                <Select style={{ width: "26%" }} defaultValue="1">
                    <Option value="1">kg</Option>
                    <Option value="2">lb</Option>
                </Select>
            </InputGroup>,


            <InputGroup compact>
                <Input style={{ width: "40%", textAlign: 'center' }} placeholder="最低运费" />
                <Input
                    style={{
                        width: "20%",
                        borderLeft: 0,
                        pointerEvents: 'none',
                        backgroundColor: '#fff',
                        textAlign: 'center'
                    }}
                    placeholder="~"
                    disabled
                />
                <Input style={{ width: "40%", textAlign: 'center', borderLeft: 0 }} placeholder="最高运费" />
            </InputGroup>,
        ]
    }

    return ({
        base: filter_name.base,
        extra: filter_name[page_name]
    })
}

class Filter extends Component {
    constructor(props) {
        super(props);

    }
    state = {
        start: undefined,
        end: undefined,
        server_status: undefined,
        display_more: false,
        icon_type: 'down',
        description: '更多筛选',
        filter_tags: [],
    }

    //添加一个筛选组件步骤：
    // 一 在fitler_content中添加或者修改组件， 实现state 和 value 的绑定
    // 二 在filter的state 中 添加初始状态 ， 
    // 三 在filter_onChange 添加 state 改变和请求字段，此方法需要和组件中自带Onchange方法进行绑定。也会和触发父组件table的方法，进行实际筛选请求，展示对应数据。此步可以实现筛选组件自有的清除和添加功能
    // 四 在table 中 get_filter_tag 设置tag显示名字（对应，请求字段），为了实现展示 filter tag
    // 五 在handle_tag_close中添加关闭对应组件的tag 的方法。实际就是还原state，和清除对应filter并再次触发父组件的筛选请求，并展示数据
    // 最后再 reset_all_filter中设置还原初始状态，为了使重置控件能重置当前的组件

    filter_onChange(data_object, type) {
        let filter_type
        switch (type) {
            case "select_server_status":
                filter_type = {
                    "state": { "server_status": data_object.value },
                    "server_request": { "server_status": data_object.value }
                }
                break;
            case "data_picker":
                filter_type = {
                    "state": { start: data_object.value[0], end: data_object.value[1] },
                    "server_request": {
                        "created_at": {
                            "$gte": data_object.value[0],
                            "$lte": data_object.value[1]
                        }
                    },
                }
        }
        let action_type = !data_object.value || data_object.value.length == 0 ? 'clear' : 'add'
        this.props.handle_filter(filter_type.server_request, action_type)
        this.setState({ ...filter_type.state })
    }

    handle_tag_close(filter_tag) {
        // console.log(filter_tag)
        let filter
        let state
        switch (filter_tag) {
            case "创建时间":
                filter = {
                    "created_at": {
                        "$gte": undefined,
                        "$lte": undefined
                    }
                }
                state = { start: undefined, end: undefined }
                break;
            case "请求状态":
                filter = {
                    "server_status": undefined
                }
                state = { server_status: undefined, }
                break;
        }
        this.setState({ ...state })
        this.props.handle_filter(filter, 'clear')

    }

    show_extra_fitler_content = (page_name) => {
        let row = fitler_content(this.props.page_name, this).extra.length / 3
        let content = []

        for (var i = 0; i < row; i++) {
            let element =
                <Row key={i} hidden={!this.state.display_more} style={{ marginTop: "16px" }} gutter={25}>
                    <Col span={2} > <span style={{ fontSize: '14px', fontWeight: 800 }}></span></Col>
                    {fitler_content(this.props.page_name, this).extra.map((item, index) => { if (index >= i * 3 && index < (i + 1) * 3) return (<Col key={index} span={6} >{item}</Col>) })}
                </Row>
            content.push(element)
        }
        return content
    }

    show_filter_tag() {
        let filter_tags = this.props.filter_tags
        let content = []

        for (var i = 0; i < filter_tags.length; i++) {
            let element =
                <Col key={i} >
                    <Chip
                        label={filter_tags[i]}
                        onDelete={(e) => {
                            this.handle_tag_close(filter_tags[i])
                        }
                        }
                    />
                    {/* <Tag
                        style={{ borderRadius: 150, fontSize: '14px', fontWeight: 400, padding: "2px 14px 2px 16px" }}
                        color="#108ee9"
                        closable
                        onClose={(e) => {
                            this.handle_tag_close(filter_tags[i])
                        }}
                    >
                        {filter_tags[i]}
                    </Tag> */}
                </Col>
            content.push(element)
        }
        return content
    }

    reset_all_filter() {
        this.setState({
            start: undefined,
            end: undefined,
            server_status: undefined,
        })
        this.props.reset_all_filter()
    }

    handle_more = () => this.setState({
        display_more: !this.state.display_more,
        icon_type: this.state.icon_type == 'down' ? 'up' : 'down',
        description: this.state.description == '更多筛选' ? '收起' : '更多筛选'
    })

    componentDidMount() { this.props.onRef(this) }


    render() {
        const is_all = this.props.filter_tags.length == 0 && (this.props.searching_string == undefined || this.props.searching_string == '')
        const is_seraching = this.props.searching_string != undefined && this.props.searching_string != ''

        return (
            <div style={{ background: '#fff', marginBottom: "24px", padding: 36, }} >

                <Row gutter={25}>

                    <Col span={2}>  <span style={{ fontSize: '15px', fontWeight: 600 }}>筛选：</span>  </Col>
                    {/* 显示基本的筛选 */}
                    {fitler_content(this.props.page_name, this).base.map((item, index) => (<Col key={index} span={6} >{item}</Col>))}
                    {/* 显示展开更多筛选控件 */}
                    <Col style={{ textAlign: 'right', paddingTop: 6 }} span={3} >
                        <a
                            hidden={fitler_content(this.props.page_name, this).extra.length == 0}
                            onClick={() => this.handle_more()} >
                            {this.state.description} <Icon type={this.state.icon_type} />
                        </a>
                    </Col>
                </Row>
                {/* 显示高级的筛选 */}
                {this.show_extra_fitler_content(this.props.page_name).map(item => item)}

                <Divider style={{ marginTop: "24px", marginBottom: "24px" }} dashed />

                <Row gutter={25} type="flex">
                    <Col span={2} >  <span style={{ fontSize: '15px', fontWeight: 600 }}>当前：</span>  </Col>
                    <Col hidden={!is_all} span={2}>


                        <Chip
                            style={chip_style}
                            label="全部"
                            // color="primary"
                            variant="outlined"
                            size='small'
                        />
                        {/* <Tag
                            // visible ={is_all}
                            style={{
                                fontSize: '14px',
                                fontWeight: 400,
                            }}
                        >
                            全部
                            </Tag> */}

                    </Col>
                    {/* 显示当前所有filter */}
                    {this.props.filter_tags.map((item, index) =>
                        // 这个key不能使用index。一定用唯一的标识作key，当数组会有改变的时候，数据会有重叠
                        <Col key={item} >

                            <Chip
                                style={chip_style}
                                label={item}
                                // color="primary"
                                variant="outlined"
                                size='small'
                                onDelete={(e) => {
                                    this.handle_tag_close(item)
                                }}
                            />
                            {/* <Tag
                                style={{
                                    borderRadius: 150,
                                    fontSize: '14px',
                                    fontWeight: 400,
                                    padding: "0px 12px 0px 16px"
                                }}
                                closable
                                onClose={(e) => { this.handle_tag_close(item) }}
                            >
                                {item}
                            </Tag> */}
                        </Col>
                    )}
                    {/* 判断是否有搜索条件，有就显示 */}
                    <Col >
                        <Chip
                            style={chip_style}
                            label='自定义搜索'
                            hidden={!is_seraching}
                            // color="primary"
                            variant="outlined"
                            size='small'
                            onDelete={(e) => {
                                this.props.handle_clear_search()
                            }}
                        />
                        {/* <Tag
                            visible={is_seraching}
                            style={{ borderRadius: 150, fontSize: '14px', fontWeight: 400, padding: "0px 14px 0px 16px", }}
                            closable
                            onClose={(e) => { this.props.handle_clear_search() }}>
                            自定义搜索
                        </Tag> */}
                    </Col>

                    <Col hidden={is_all} style={{ paddingTop: 1 }} > <Text underline> <a onClick={() => this.reset_all_filter()}>重置</a></Text>  </Col>
                </Row>
            </div>
        )
    }
}

export default Filter