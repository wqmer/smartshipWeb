const pagesSwitchRouter = (expr) => {
    switch (expr) {
        case 'dashboard':
            return {
                name: '工作台',
                iconType: 'dashboard',
                key: 'dashboard',
                url: '/dashboard',
                content: [
                    { url: '/project_summary', iconType: 'appstore', name: '业务总览' },
                    { url: '/order_summary', iconType: 'container', name: '订单总览' },
                    { url: '/finance_analyze', iconType: 'account-book', name: '财务分析' },
                ]
            }
            break;
        case 'order':
            return {
                name: '订单管理',
                iconType: 'database',
                key: 'order',
                url: '/order',
                group: [
                    {
                        groupTitle: '订单历史',
                        key: "history",
                        style: undefined,
                        content: [
                            { url: '/draft', iconType: 'snippets', name: '草稿簿' },
                            { url: '/ready_to_ship', iconType: 'pushpin', name: '待处理' },
                            { url: '/completed', iconType: 'carry-out', name: '已完成' },
                            { url: '/problem', iconType: 'exclamation-circle', name: '问题单' },
                        ]
                    },
                    {
                        groupTitle: '当前进行',
                        key: "processing",
                        style: { marginTop: 16 },
                        content: [
                            { url: '/processing', iconType: 'loading-3-quarters', name: '运单生成中' },
                            { url: '/failed', iconType: 'warning', name: '提交失败' }
                        ]
                    },
                ]
            }
            break;
        case 'warehouse':
            return {
                name: "仓库管理",
                iconType: undefined,
                key: 'warehouse',
                url: '/warehouse',
                group: [
                    {
                        groupTitle: '本土代发',
                        key: "dropShip",
                        style: undefined,
                        content: [
                            { url: '/poperty_manage', iconType: 'pushpin', name: '库存管理' },
                            { url: '/ready_to_ship', iconType: 'pushpin', name: '等待处理' },
                        ]
                    },
                    {
                        groupTitle: '跨境小包',
                        key: "expressLightWeightParcel",
                        style: { marginTop: 16 },
                        content: [
                            { url: '/check_in_parcel', iconType: 'snippets', name: '等待收货' },
                            { url: '/ready_to_forward', iconType: 'pushpin', name: '等待处理' },
                        ]
                    },
                    {
                        groupTitle: '处理记录',
                        key: "hisitory",
                        style: { marginTop: 16 },
                        content: [
                            { url: '/ship', iconType: 'carry-out', name: '完成订单' },
                            { url: '/problem', iconType: 'exclamation-circle', name: '问题订单' },
                        ]
                    }
                ]
            }
            break;
        case 'client':
            return {
                name: "客户管理",
                iconType: undefined,
                key: 'client',
                url: '/client',
                content: [
                    { url: '/activated', iconType: 'snippets', name: '活跃客户' },
                    { url: '/unactivate', iconType: 'pushpin', name: '7天无登录' },
                    { url: '/frozen_client', iconType: 'exclamation-circle', name: '已停用' },
                ]
            }
            break;
        default:
            return {
                name: "不匹配",
                iconType: undefined,
                key: 'noMatch',
                url: '/noMatch',
                content: [
                    { url: '/error', iconType: 'snippets', name: '错误页404' },
                ]
            }
    }
}


export default pagesSwitchRouter