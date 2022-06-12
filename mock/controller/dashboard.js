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


const attendanceData = [
    { label: '应到人数', value: '@natural(20,2000)', icon: 'icon-iconyingdaorenshu' },
    { label: '目前在校人数', value: '@natural(20,2000)', icon: 'icon-zaixiaorenshu1' },
    { label: '正常到校人数', value: '@natural(20,2000)', icon: 'icon-zaixiaorenshu' },
    { label: '全天请假人数', value: '@natural(20,100)', icon: 'icon-qingjiarenyuan' },
    { label: '部分时段请假人数', value: '@natural(20,100)', icon: 'icon-qingjiarenyuan1' },
    { label: '迟到人数', value: '@natural(20,100)', icon: 'icon-d6221a' },
    { label: '早退人数', value: '@natural(20,100)', icon: 'icon-zaotui' },
    { label: '正常离校人数', value: '@natural(20,100)', icon: 'icon-lixiaoxueyuan' },
]

const feesData = [
    { name: '已缴费', value: '@natural(20,2000)' },
    { name: '未交费', value: '@natural(20,500)' },
    { name: '欠费', value: '@natural(20,100)' }
]


// 获取当前月份天数
function mGetDate(year, month) {
    var d = new Date(year, month, 0);
    return d.getDate();
}

function lineData(type) {
    return Array.from({
        length: xDataList[type].length
    }, () => {
        return Mock.mock('@natural(20,2000)')
    })
}

function lineList(year, month) {
    let length = mGetDate(year, month)
    return Array.from({
        length: length
    }, () => {
        return Mock.mock('@natural(0,100)')
    })
}

function lineDataByMonth(year, month) {
    let length = mGetDate(year, month)
    return Mock.Random.range(1, length)
}


function rankData() {
    let obj = Mock.mock({
        'name|10': {
            东湖店: '@natural(20,2000)',
            江汉路店: '@natural(20,2000)',
            欢乐谷店: '@natural(20,2000)',
            楚河汉街店: '@natural(20,2000)',
            黄鹤楼店: '@natural(20,2000)',
            木兰草原店: '@natural(20,2000)',
            户部巷店: '@natural(20,2000)',
            长江大桥店: '@natural(20,2000)',
            汉口江滩店: '@natural(20,2000)',
            中山公园店: '@natural(20,2000)',
            光谷店: '@natural(20,2000)',
            晴川阁店: '@natural(20,2000)',
        },
    })
    let list = []
    for (let i in obj.name) {
        list.push({
            area: i,
            value: obj.name[i],
        })
    }
    return list.sort((a, b) => {
        return b.value - a.value
    })
}

function pieData() {
    let obj = Mock.mock({
        'name|6': {
            火锅: '@natural(100,500)',
            奶茶: '@natural(100,500)',
            KTV: '@natural(100,500)',
            电影院: '@natural(100,500)',
            烤肉: '@natural(100,500)',
            服饰: '@natural(100,500)',
            网咖: '@natural(100,500)',
            酒店: '@natural(100,500)',
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

function hotData() {
    let obj = Mock.mock({
        'name|15': {
            欢乐谷: '@natural(500,2000)',
            玛雅: '@natural(500,2000)',
            动物园: '@natural(500,2000)',
            植物园: '@natural(500,2000)',
            科技馆: '@natural(500,2000)',
            博物馆: '@natural(500,2000)',
            中山公园: '@natural(500,2000)',
            黄鹤楼: '@natural(500,2000)',
            晴川阁: '@natural(500,2000)',
            汉口江滩: '@natural(500,2000)',
            东湖磨山: '@natural(500,2000)',
            杜莎夫人蜡像馆: '@natural(500,2000)',
            木兰草原: '@natural(500,2000)',
            海洋公园: '@natural(500,2000)',
            园博园: '@natural(500,2000)',
            古琴台: '@natural(500,2000)',
            九峰山: '@natural(500,2000)',
            户部巷: '@natural(500,2000)',
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

function moreData() {
    let obj = Mock.mock({
        'name|6': {
            欢乐谷: '@natural(500,2000)',
            玛雅: '@natural(500,2000)',
            动物园: '@natural(500,2000)',
            植物园: '@natural(500,2000)',
            科技馆: '@natural(500,2000)',
            博物馆: '@natural(500,2000)',
            中山公园: '@natural(500,2000)',
            黄鹤楼: '@natural(500,2000)',
            晴川阁: '@natural(500,2000)',
            汉口江滩: '@natural(500,2000)',
            东湖磨山: '@natural(500,2000)',
            杜莎夫人蜡像馆: '@natural(500,2000)',
            木兰草原: '@natural(500,2000)',
            海洋公园: '@natural(500,2000)',
            古琴台: '@natural(500,2000)',
            户部巷: '@natural(500,2000)',
        },
    })
    let list = []
    for (let i in obj.name) {
        let random = Math.floor(Math.random() * obj.name[i])
        list.push({
            name: i,
            male: random,
            female: obj.name[i] - random,
            value: obj.name[i],
        })
    }
    return list
}

// function contactsData() {

// 	Mock.Random.extend({
// 		phone: function () {
// 			var phonePrefixs = ['132', '135', '189'] // 自己写前缀哈
// 			return this.pick(phonePrefixs) + Mock.mock(/\d{8}/) //Number()
// 		}
// 	})
// 	let list = []
// 	for (let i = 0; i <= 10; i++) {
// 		list.push({
// 			name: Mock.Random.cname(),
// 			avatar: Mock.Random.image('64*64'),
// 			value: Mock.Random.phone(),
// 		})
// 	}
// 	return list
// }


module.exports = [{
        url: '/dashboard/lineChart',
        type: 'post',
        response: (config) => {
            const {
                type
            } = config.body
            console.log(type)
            return {
                data: {
                    xData: xDataList[type],
                    yData: lineData(type),
                    lastData: lineData(type),
                },
                statusCode: 200,
                message: '数据获取成功',
            }
        },
    }, {
        url: '/dashboard/lineDataByMonth',
        type: 'post',
        response: (config) => {
            const {
                year,
                month
            } = config.body
            return {
                data: {
                    xData: lineDataByMonth(year, month),
                    yData: lineList(year, month),
                    lastData: lineList(year, month),
                },
                statusCode: 200,
                message: '数据获取成功',
            }
        },
    },
    {
        url: '/dashboard/rankData',
        type: 'post',
        response: () => {
            return {
                data: rankData(),
                statusCode: 200,
                message: '数据获取成功',
            }
        },
    },
    {
        url: '/dashboard/pieTypeData',
        type: 'post',
        response: () => {
            return {
                data: pieData(),
                statusCode: 200,
                message: '数据获取成功',
            }
        },
    },
    {
        url: '/dashboard/hotSearchData',
        type: 'post',
        response: () => {
            return {
                data: hotData(),
                statusCode: 200,
                message: '数据获取成功',
            }
        },
    },
    {
        url: '/dashboard/moreData',
        type: 'post',
        response: () => {
            return {
                data: moreData(),
                statusCode: 200,
                message: '数据获取成功',
            }
        },
    },
    {
        url: '/dashboard/getNumByGrade',
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
        url: '/dashboard/getAttendance',
        type: 'post',
        response: () => {
            return {
                data: attendanceData,
                statusCode: 200,
                message: '数据获取成功',
            }
        },
    },
    {
        url: '/dashboard/getFees',
        type: 'post',
        response: () => {
            return {
                data: feesData,
                statusCode: 200,
                message: '数据获取成功',
            }
        },
    },
]