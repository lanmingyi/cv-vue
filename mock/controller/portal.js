/*** 
 * @Description: 门户设计mock数据
 * @Author: lmy
 * @Date: 2021-08-23 17:22:50
 * @LastEditTime: 2021-09-01 14:44:57
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\mock\controller\portal.js
 */
const Mock = require('mockjs')

const xDataList = {
    day: [
        '9:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00'
    ],
    week: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
    month: Mock.Random.range(1, 31),
    year: [
        '1月',
        '2月',
        '3月',
        '4月',
        '5月',
        '6月',
        '7月',
        '8月',
        '9月',
        '10月',
        '11月',
        '12月'
    ],
}


function timeLineData() {
    // let obj = Mock.mock({
    //     'name|6': {
    //         startDate: '@datetime("yyyy-MM-dd A HH:mm:ss")',
    //         endDate: '@datetime("yyyy-MM-dd A HH:mm:ss")',
    //         text: '@string("lower", 5, 20)'
    //     },
    // })
    // let list = []
    // for (let i in obj.startDate) {
    //     list.push({
    //         startDate: obj
    //     })
    //     return list
    // }
    return Array.from({
        length: 7
    }, () => {
        return {
            startDate: '@datetime("yyyy-MM-dd A HH:mm:ss")',
            endDate: '@datetime("yyyy-MM-dd A HH:mm:ss")',
            text: '@string("lower", 5, 20)'
        }
    })
}

const feesData = [
    { name: '已缴费', value: '@natural(20,2000)' },
    { name: '未交费', value: '@natural(20,500)' },
    { name: '欠费', value: '@natural(20,100)' }
]


function lineData(type) {
    return Array.from({
        length: xDataList[type].length
    }, () => {
        return Mock.mock('@natural(20,2000)')
    })
}


function pieData() {
    let obj = Mock.mock({
        'name|6': {
            炸鸡: '@natural(100,500)',
            火锅: '@natural(100,500)',
            烤肉: '@natural(100,500)',
            料理: '@natural(100,500)',
            热干面: '@natural(100,500)',
            奶茶: '@natural(100,500)'
        },
    })
    let list = []
    for (let i in obj.name) {
        list.push({
            name: i,
            value: obj.name[i],
        })
    }
    return list
}

const treeData = [{
        text: 'Node1',
        value: '0-0',
        key: '0-0',
        id: '0-0',
        children: [{
                value: '0-0-1',
                key: '0-0-1',
                id: '0-0-1',
                text: 'Child Node1',
            },
            {
                text: 'Child Node2',
                value: '0-0-2',
                key: '0-0-2',
                id: '0-0-2',
            },
        ],
    },
    {
        text: 'Node2',
        value: '0-1',
        key: '0-1',
        id: '0-1',
    },
]

const cascaderData = [{
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [{
            value: 'hangzhou',
            label: 'Hangzhou',
            children: [{
                value: 'xihu',
                label: 'West Lake',
            }, ],
        }, ],
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [{
            value: 'nanjing',
            label: 'Nanjing',
            children: [{
                value: 'zhonghuamen',
                label: 'Zhong Hua Men',
            }, ],
        }, ],
    },
]


module.exports = [{
        url: '/mockXHR/portal/barChart',
        type: 'post',
        response: (config) => {
            const {
                type
            } = config.body
            console.log(type)
            return {
                xData: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
                seriesData: [{
                        name: "篮球",
                        data: [30, 40, 50, 50, 55, 60, 40],
                    },
                    {
                        name: "羽毛球",
                        data: [60, 60, 90, 90, 120, 120, 90],
                    },
                    {
                        name: "乒乓球",
                        data: [40, 40, 60, 60, 80, 80, 60],
                    },
                ],
            }
        },
    }, {
        url: '/mockXHR/portal/lineChart',
        type: 'post',
        response: () => {
            return {
                xData: xDataList['day'],
                yData: lineData('day'),
                seriesData: [{ name: "总时长", data: [60, 75, 55, 40, 100, 140, 160, 130, 120, 145] }, { name: "总时长11", data: [90, 45, 85, 60, 10, 30, 50, 70, 35, 15] }],
            }
        },
    },
    {
        url: '/mockXHR/portal/pieData',
        type: 'post',
        response: () => {
            return {
                legend: ["炸鸡", "火锅", "烤肉", "料理", "热干面", "奶茶"],
                seriesData: pieData(),
                statusCode: 200,
                message: '数据获取成功',
            }
        },
    },
    {
        url: '/mockXHR/portal/getNumByGrade',
        type: 'post',
        response: () => {
            return {
                data: {
                    staff: Mock.mock('@natural(20,200)'),
                    teacher: Mock.mock('@natural(20,100)'),
                    student: Mock.mock('@natural(100,5000)'),
                    grade: Mock.mock('@natural(20,50)'),
                    tranStudent: Mock.mock('@natural(1,100)')
                },
                statusCode: 200,
                message: '数据获取成功',
            }
        },
    },
    {
        url: '/mockXHR/portal/getTimeLine',
        type: 'post',
        response: () => {
            return {
                data: timeLineData(),
            }
        },
    },
    {
        url: '/mockXHR/portal/getFees',
        type: 'post',
        response: () => {
            return {
                data: feesData,
                statusCode: 200,
                message: '数据获取成功',
            }
        },
    },
    {
        url: '/mockXHR/portal/getTreeData',
        type: 'post',
        response: () => {
            return treeData
        },
    },
    {
        url: '/mockXHR/portal/getCascaderData',
        type: 'post',
        response: () => {
            return cascaderData
        },
    },


]