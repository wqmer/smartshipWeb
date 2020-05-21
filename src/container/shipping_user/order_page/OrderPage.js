import React, { Component, PropTypes } from 'react'
import { Tabs, Icon, Divider, Input, BackTop, List, Avatar, Pagination, Spin, Button, Badge, DatePicker, Select } from 'antd';
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from '../../../reducers/order'
// import { shipping_user_actions } from '../../../reducers/shipping_platform/user'
import { actions as actions_user_order } from '../../../reducers/shipping_platform/user/order'
import MyTable from './table'
import Filter from './filter'
import { Skeleton } from 'antd';

import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';


const { Search } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;
const InputGroup = Input.Group;

const width_colum = {
    long: 200,
    medium: 150,
    short: 150
}

function callback(key) {
    console.log(key);
}

const pages_layout = [
    {
        'name': 'draft',
        'column': [],
        'filter': [],
        'button': {
            'action': ['submit', 'delete'],
            'batch': ['批量递交', '批量删除']
        }
    },
    {
        'name': 'ready_to_ship',
        'column': [],
        'filter': [],
        'button': {
            'action': ['create', 'cancel'],
            'batch': ['批量出单', '批量撤销']
        }
    },
    {
        'name': 'completed',
        'column': [],
        'filter': [],
        'button': {
            'action': ['print', 'export'],
            'batch': ['批量打印', '批量导出']
        }
    }
]
const children = [];
for (let i = 10; i < 36; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

class order extends Component {
    constructor(props) {
        super(props);
    }

    fetch_data(value) {
        this.child.fetch_data({ ...this.child.state, searching_string: value });
    }

    onRef = (ref) => {
        this.child = ref
    }

    handle_table_colum = (page_name) => {
        const table_colum = {
            base_head: [{ title: '参考订单号', width: 250, dataIndex: 'customer_order_id', key: 'customer_order_id', align: 'center' }],
            base_tail: [
                { title: '渠道', width: width_colum.short, dataIndex: 'carrier', align: 'center', key: 'carrier', },
                { title: '重量lb', dataIndex: 'parcel.weight', width: width_colum.short, align: 'center', key: 'Weight', },
                { title: '产品sku', width: width_colum.short, dataIndex: 'parcel.sku', align: 'center', key: 'parcel_sku', },
                { title: '收货邮编', width: width_colum.short, dataIndex: 'recipient.zipcode', align: 'center', key: 'recipient_zipcode', },
                { title: '收货城市', width: width_colum.short, dataIndex: 'recipient.city', align: 'center', key: 'recipient_city', },
                { title: '收货州', width: width_colum.short, dataIndex: 'recipient.state', align: 'center', key: 'recipient_state', },
                {
                    title: '收货地址',
                    width: width_colum.medium,
                    dataIndex: 'recipient.add1',
                    align: 'center',
                    key: 'recipient_add1',
                    render: (text, row) => { return (text + ' ' + row.recipient.add2) }
                },
                { title: '收件人', width: width_colum.short, dataIndex: 'recipient.recipient_name', align: 'center', key: 'Name' },
                {
                    title: '尺寸', width: width_colum.medium,
                    dataIndex: 'Reference2',
                    align: 'center',
                    key: 'Reference2',
                    render: (text, row) => { return (row.parcel.length + ' x ' + row.parcel.width + ' x ' + row.parcel.height) }
                },
                { title: '系统订单号', width: 250, dataIndex: 'order_id', align: 'center', key: 'order_id' },
                { title: '创建时间', width: width_colum.medium, dataIndex: 'created_at', align: 'center', key: 'created_at', },


            ],
            draft: {
                'extra': [],
                'action': [{
                    title: '操作', key: 'action', width: width_colum.medium, align: 'center',
                    fixed: 'right',
                    render: (text, record) => (
                        <span>
                            <a type="defa" onClick={() => this.child.handle_action(record.order_id, 'submit')}>提交</a>
                            <Divider type="vertical" />
                            <a type="defa" >编辑</a>
                            <Divider type="vertical" />
                            <a type="defa" onClick={() => this.child.handle_action(record.order_id, 'delete')} >删除</a>
                            {/* <IconButton aria-label="submit" onClick={() => this.child.handle_action(record.order_id, 'submit')} >
                                <AssignmentTurnedInOutlinedIcon fontSize='small' />
                            </IconButton>
                            <IconButton aria-label="edit"  >
                                <EditOutlinedIcon fontSize='small' />
                            </IconButton>
                            <IconButton fontSize='small' aria-label="delete" onClick={() => this.child.handle_action(record.order_id, 'delete')} >
                                <DeleteOutlineOutlinedIcon fontSize='small' />
                            </IconButton> */}

                        </span>
                    )
                }]
            },
            ready_to_ship: {
                'extra': [{
                    title: '请求状态', width: width_colum.short, dataIndex: 'server_status', align: 'center', key: 'server_status',
                    render: (record) => {
                        let status = {
                            'error': <span>  < Badge status={record} />服务器报错</span >,
                            'default': <span>  < Badge status={record} />待出运单</span >,
                            'processing': <span>  < Badge status={record} />获取运单中</span >,
                        }
                        return (status[record])
                    }
                },
                { title: '预估运费', width: width_colum.short, dataIndex: 'postage.estimate_amount', align: 'center', key: 'postage_estimate_amount', },
                ],
                'action': [{
                    title: '操作', key: 'action', width: width_colum.medium, align: 'center',
                    fixed: 'right',
                    render: (text, record) => (
                        <span>
                            <a type="defa" >出单</a>
                            <Divider type="vertical" />
                            <a type="defa" >编辑</a>
                            <Divider type="vertical" />
                            <a type="defa" onClick={() => this.child.handle_action(record.order_id, 'cancel')} >撤销</a>
                        </span>
                    )
                }]

            },
            completed: {
                'extra': [
                    { title: '运单号', width: width_colum.long, dataIndex: 'parcel.tracking_nubmer', align: 'center', key: 'parcel_tracking_number', render: (record) => <a>{record}</a> },
                    { title: '物流状态', width: width_colum.short, align: 'center', key: 'server_response', render: () => <span> <Badge status="success" />投递成功</span> },
                    { title: '结算运费', width: width_colum.short, dataIndex: 'postage.estimate_amount', align: 'center', key: 'postage_estimate_amount', },
                ],
                'action': [{
                    title: '操作', key: 'action', width: width_colum.long, align: 'center',
                    fixed: 'right',
                    render: (text, record) => (
                        <span>
                            <a type="defa" >打印</a>
                            <Divider type="vertical" />
                            <a type="defa" >退款</a>
                            <Divider type="vertical" />
                            <a type="defa" >更多操作</a>
                        </span>
                    )
                }]
            },

            // problem: []
        }
        return table_colum.base_head.concat(table_colum[page_name]['extra'], table_colum.base_tail, table_colum[page_name]['action'])
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.collapsed != nextProps.collapsed) return false
        if (this.props.header_hidden != nextProps.header_hidden) return false
        return true
    }

    //加载页面后回到顶部
    componentDidMount() {
        window.scrollTo(0, 0)
        this.props.onRef(this)

    }

    render() {
        const { url } = this.props.match;
        // console.log(url)
        // console.log(this.props.refs)
        return (
            <Switch>
                {pages_layout.map(item =>
                    <Route key={item.name} path={`${url}/${item.name}`}
                        render={(props) => (

                            <MyTable
                                {...props}
                                page_name={item.name}
                                table_content={this.handle_table_colum(item.name)}
                                layout_button={item.button}
                                onRef={this.onRef}
                            />
                        )}
                    />
                )}
            </Switch>
        )
    }
}



function mapStateToProps(state) {

    return {
        //    order:state.user.order,
        isFetching: state.globalState.isFetching
    }
}

function mapDispatchToProps(dispatch) {

    return {
        reset_order_result: bindActionCreators(actions_user_order.reset_order_result, dispatch),
        //   getAllorder : bindActionCreators(actions.get_all_order,dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(order)

