/* 
  @Description: 门户拖拽控件项
  @Author: 黄婷
  @Date: 2021-05-20 18:13:04
  @LastEditTime: 2021-05-21 13:56:18
  @LastEditors: 黄婷
  @FilePath: \misboot-cloud-topvui\src\components\TopVUI\k-portal-design\config\formItemsConfig.js
/ */
export const colList = [{
        type: "grid",
        label: "栅格布局",
        children: []
    },
    {
        type: "tabs",
        label: "标签页布局",
        children: []
    },
    {
        type: 'card',
        label: '卡片列表',
        children: []
    },
    {
        type: 'miniCard',
        label: '小卡片',
        children: []
    },
    {
        type: 'list',
        label: '列表',
        children: []
    },
    {
        type: 'timeLine',
        label: '时间轴',
        children: []
    },
    {
        type: 'calendar',
        label: '日程',
        children: []
    },
    {
        type: 'weather',
        label: '天气',
        children: []
    },
    {
        type: 'flowCard',
        label: '待办流程',
        children: []
    },
    {
        type: 'pie',
        label: '饼图',
        children: []
    },
    {
        type: 'line',
        label: '折线图',
        children: []
    },
    {
        type: 'bar',
        label: '柱状图',
        children: []
    }
];



export const layoutList = [{
        type: "grid",
        label: "栅格布局",
        icon: "icon-zhage",
        columns: [{
                span: 12,
                list: []
            },
            {
                span: 12,
                list: []
            }
        ],
        options: {
            design: true,
            gutters: 0,
            vgutters: 0
        },
        key: "",
        model: "",
    },
    {
        type: "tabs",
        label: "标签页布局",
        icon: "icon-biaoqianye",
        options: {
            design: true,
            tabBarGutter: null,
            type: "line",
            tabPosition: "top",
            size: "default",
            animated: true
        },
        columns: [{
                value: "1",
                label: "选项1",
                list: []
            },
            {
                value: "2",
                label: "选项2",
                list: []
            }
        ],
        key: "",
        model: ""
    }
];
export const basicsList = [{
        type: 'card',
        label: '卡片列表',
        icon: 'icon-kapian',
        options: {
            design: true,
            gutters: 24,
            vgutters: 24,
            method: 'post',
            url: '/mockXHR/portal/getNumByGrade',
            parameter: '',
            iconFont: '',
            action: false,
            formType: 'combbox',
            col: {
                xs: 24,
                sm: 12,
                md: 12,
                lg: 6,
                xl: 6,
                xxl: 6
            },
            dataList: [{
                    label: '卡片1',
                    icon: 'tree',
                    count: 'grade',
                    unit: '万元',
                    explain: '卡片1说明',
                    backgroundColor: 'linear-gradient(67.0deg,#5171fd 0.0,#c97afd 100.0%)',
                },
                {
                    label: '卡片2',
                    icon: 'tree',
                    count: 'staff',
                    unit: '万元',
                    explain: '卡片2说明',
                    backgroundColor: 'linear-gradient(67.0deg,#3dadf6 0.0,#737bfc 100.0%)',
                },
                {
                    label: '卡片3',
                    icon: 'tree',
                    count: 'student',
                    unit: '万元',
                    explain: '卡片3说明',
                    backgroundColor: 'linear-gradient(67.0deg,#ea677c 0.0,#ef9b5f 100.0%)',
                },
                {
                    label: '卡片4',
                    icon: 'tree',
                    count: 'teacher',
                    unit: '万元',
                    explain: '卡片4说明',
                    backgroundColor: 'linear-gradient(67.0deg,#42d79b 0.0,#a6e25f 100.0%)',
                }
            ]
        },
        key: "",
        model: "",
    },
    {
        type: 'miniCard',
        label: '小卡片',
        icon: 'icon-dianbozhibov1213',
        options: {
            design: true,
            gutters: 24,
            vgutters: 24,
            width: '130px',
            height: '84px',
            iconFontSize: 45,
            fontSize: 16,
            // fontWeight: 'bold',
            borderRadius: '5px',
            layout: 'horizontal', //vertical
            col: {
                xs: 24,
                sm: 12,
                md: 12,
                lg: 6,
                xl: 6,
                xxl: 6
            },
            columns: [{
                    title: '小卡片1',
                    url: '/system/config/index',
                    background: '#ec1313b3',
                    iconFont: 'tree',
                },
                {
                    title: '小卡片2',
                    url: '/system/config/index',
                    background: '#ec6f15',
                    iconFont: 'tree',
                },
                {
                    title: '小卡片3',
                    url: '/system/config/index',
                    background: '#b4ec13',
                    iconFont: 'tree',
                },
                {
                    title: '小卡片4',
                    url: '/system/config/index',
                    background: '#12a2b5a6',
                    iconFont: 'tree',
                }
            ],
        },
        key: "",
        model: "",
    },
    {
        type: 'list',
        label: '列表',
        icon: 'icon-biaodanliebiao-03',
        options: {
            design: true,
            height: '400px',
            title: '新闻',
            titleShow: true,
            iconFont: 'xinwen',
            iconFontColor: '#ff0000',
            method: 'post',
            url: '/system/topicBase/getPageSet',
            isShowDetail: true,
            detailUrl: '/system/topicBase/detail',
            isShowList: true,
            listUrl: '/system/topicBase/index',
            parameter: "",
            pageSize: 7,
            pagination: false,
            action: false,
            formType: 'combbox',
            formOptions: {
                name: '查询',
                method: 'post',
                url: '/system/topicBase/getPageSet',
                parameter: "",
                staticList: [{
                    label: '选项一',
                    value: 1
                }, {
                    label: '选项二',
                    value: 2
                }],
                dynamic: 'static',
                code: 'sex',
                tabList: [{
                    label: '今日',
                    value: 1
                }, {
                    label: '本周',
                    value: 2
                }, {
                    label: '本月',
                    value: 3
                }],
                radioStyle: 'solid',
                dateType: 'date',
                rangeDefaultValue: [], // 默认值，字符串 12:00:00
                range: false, // 范围日期选择，为true则会显示两个时间选择框（同时defaultValue和placeholder要改成数组），
                showTime: false, // 是否显示时间选择器
                clearable: false, // 是否显示清除按钮
                rangePlaceholder: ["开始时间", "结束时间"],
                format: "YYYY-MM-DD", // 展示格式  （请按照这个规则写 YYYY-MM-DD HH:mm:ss，区分大小写）
                params: ''
            }
        },
        key: "",
        model: "",
    },
    {
        type: 'timeLine',
        label: '时间轴',
        icon: 'icon-shijianzhou',
        options: {
            design: true,
            title: '时间轴',
            titleShow: true,
            height: '739px',
            method: 'post',
            iconFont: 'xinwen',
            iconFontColor: '#ff0000',
            url: '/mockXHR/portal/getTimeLine',
            parameter: "",
            pageSize: 7,
            action: false,
            formType: 'combbox',
            formOptions: {
                name: '查询',
                method: 'post',
                url: '/system/topicBase/getPageSet',
                parameter: "",
                staticList: [{
                    label: '选项一',
                    value: 1
                }, {
                    label: '选项二',
                    value: 2
                }],
                dynamic: 'static',
                code: 'sex',
                tabList: [{
                    label: '今日',
                    value: 1
                }, {
                    label: '本周',
                    value: 2
                }, {
                    label: '本月',
                    value: 3
                }],
                radioStyle: 'solid',
                dateType: 'date',
                rangeDefaultValue: [], // 默认值，字符串 12:00:00
                range: false, // 范围日期选择，为true则会显示两个时间选择框（同时defaultValue和placeholder要改成数组），
                showTime: false, // 是否显示时间选择器
                clearable: false, // 是否显示清除按钮
                rangePlaceholder: ["开始时间", "结束时间"],
                format: "YYYY-MM-DD", // 展示格式  （请按照这个规则写 YYYY-MM-DD HH:mm:ss，区分大小写）
                params: ''
            },
        },
        key: "",
        model: "",
    },
    {
        type: 'calendar',
        label: '日程',
        icon: 'icon-richeng',
        options: {
            design: true,
            title: '日程',
            titleShow: true,
            height: '100%',
            method: 'post',
            iconFont: 'xinwen',
            iconFontColor: '#ff0000',
            url: '/office/scheduler/getMyScheduler',
            parameter: "",
        },
        key: "",
        model: "",
    },
    {
        type: 'weather',
        label: '天气',
        icon: 'icon-tianqi',
        options: {
            design: true,
            title: '天气',
            height: '300',
            layout: '1',
        },
        key: "",
        model: "",
    },
    {
        type: 'flowCard',
        label: '待办流程',
        icon: 'icon-liucheng',
        options: {
            design: true,
            title: '待办流程',
            titleShow: true,
            method: 'post',
            height: '370px',
            iconFont: 'xinwen',
            iconFontColor: '#ff0000',
            url: '/workflow/apiFlowableTask/getToDoTasks',
            parameter: "",
            pageSize: 7,
            isShowList: true,
            listUrl: '/workflow/apiFlowableTask/myMission/index',
            action: false,
            formType: 'combbox',
            formOptions: {
                name: '查询',
                method: 'post',
                url: '/system/topicBase/getPageSet',
                parameter: "",
                staticList: [{
                    label: '选项一',
                    value: 1
                }, {
                    label: '选项二',
                    value: 2
                }],
                dynamic: 'static',
                code: 'sex',
                tabList: [{
                    label: '今日',
                    value: 1
                }, {
                    label: '本周',
                    value: 2
                }, {
                    label: '本月',
                    value: 3
                }],
                radioStyle: 'solid',
                dateType: 'date',
                rangeDefaultValue: [], // 默认值，字符串 12:00:00
                range: false, // 范围日期选择，为true则会显示两个时间选择框（同时defaultValue和placeholder要改成数组），
                showTime: false, // 是否显示时间选择器
                clearable: false, // 是否显示清除按钮
                rangePlaceholder: ["开始时间", "结束时间"],
                format: "YYYY-MM-DD", // 展示格式  （请按照这个规则写 YYYY-MM-DD HH:mm:ss，区分大小写）
                params: ''
            }
        },
        key: "",
        model: "",
    }
];
export const chartList = [{
        type: 'pie',
        label: '饼图',
        icon: 'icon-bingtu',
        options: {
            design: true,
            title: '我的饼图',
            titleShow: true,
            text: '85%',
            textShow: true,
            subtext: '',
            textSize: 16,
            subtextSize: 14,
            textColor: '#000',
            subtextColor: '#000',
            ring: true,
            radius: '35%,55%',
            center: '50%,50%',
            roseType: false,
            position: {
                left: 'center',
                top: 'middle',
                right: 'auto',
                bottom: 'auto'
            },
            legend: {
                type: 'plain',
                textSize: 12,
                show: true,
                orient: 'horizontal',
                left: 'left',
                top: 'top',
                right: 'auto',
                bottom: 'auto',
                itemWidth: 18,
                itemHeight: 11
            },
            width: '100%',
            height: '300px',
            method: 'post',
            iconFont: 'xinwen',
            iconFontColor: '#ff0000',
            url: '/mockXHR/portal/pieData',
            parameter: "",
            pageSize: 7,
            action: false,
            formType: 'combbox',
            formOptions: {
                name: '查询',
                method: 'post',
                url: '/system/topicBase/getPageSet',
                parameter: "",
                staticList: [{
                    label: '选项一',
                    value: 1
                }, {
                    label: '选项二',
                    value: 2
                }],
                dynamic: 'static',
                code: 'sex',
                tabList: [{
                    label: '今日',
                    value: 1
                }, {
                    label: '本周',
                    value: 2
                }, {
                    label: '本月',
                    value: 3
                }],
                radioStyle: 'solid',
                dateType: 'date',
                rangeDefaultValue: [], // 默认值，字符串 12:00:00
                range: false, // 范围日期选择，为true则会显示两个时间选择框（同时defaultValue和placeholder要改成数组），
                showTime: false, // 是否显示时间选择器
                clearable: false, // 是否显示清除按钮
                rangePlaceholder: ["开始时间", "结束时间"],
                format: "YYYY-MM-DD", // 展示格式  （请按照这个规则写 YYYY-MM-DD HH:mm:ss，区分大小写）
                params: ''
            },
            colorLost: [
                { value: '#4FD8FF' },
                { value: '#C15FFF' },
                { value: '#FF5F55' },
                { value: '#FFC935' },
                { value: '#767BFB' },
                { value: 'rgb(248,70,102)' }
            ]
        },
        key: "",
        model: "",
    },
    {
        type: 'line',
        label: '折线图',
        icon: 'icon-tubiaozhexiantu',
        options: {
            design: true,
            title: '我的折线图',
            titleShow: true,
            width: '100%',
            height: '300px',
            method: 'post',
            iconFont: 'xinwen',
            iconFontColor: '#ff0000',
            url: '/mockXHR/portal/lineChart',
            parameter: "",
            pageSize: 7,
            action: false,
            formType: 'combbox',
            formOptions: {
                name: '查询',
                method: 'post',
                url: '/system/topicBase/getPageSet',
                parameter: "",
                staticList: [{
                    label: '选项一',
                    value: 1
                }, {
                    label: '选项二',
                    value: 2
                }],
                dynamic: 'static',
                code: 'sex',
                tabList: [{
                    label: '今日',
                    value: 1
                }, {
                    label: '本周',
                    value: 2
                }, {
                    label: '本月',
                    value: 3
                }],
                radioStyle: 'solid',
                dateType: 'date',
                rangeDefaultValue: [], // 默认值，字符串 12:00:00
                range: false, // 范围日期选择，为true则会显示两个时间选择框（同时defaultValue和placeholder要改成数组），
                showTime: false, // 是否显示时间选择器
                clearable: false, // 是否显示清除按钮
                rangePlaceholder: ["开始时间", "结束时间"],
                format: "YYYY-MM-DD", // 展示格式  （请按照这个规则写 YYYY-MM-DD HH:mm:ss，区分大小写）
                params: ''
            },
            text: '折线图示例',
            textShow: false,
            subtext: '',
            textSize: 16,
            subtextSize: 14,
            textColor: '#000',
            subtextColor: '#000',
            smooth: false,
            areaStyle: false,
            linewidth: 2,
            symbolSize: 5,
            position: {
                left: 'auto',
                top: 'auto',
                right: 'auto',
                bottom: 'auto'
            },
            legend: {
                type: 'plain',
                textSize: 12,
                show: true,
                orient: 'horizontal',
                left: 'center',
                top: 'top',
                right: 'auto',
                bottom: 'auto',
                itemWidth: 18,
                itemHeight: 11
            },
            grid: {
                left: 50,
                right: 20,
                bottom: 40,
                top: 30,
            },
            x: {
                names: '',
                textSize: 14,
                axisLine: true,
                splitLine: false
            },
            y: {
                names: '',
                textSize: 14,
                axisLine: true,
                splitLine: false
            },
            colorLost: [
                { value: '#4FD8FF' },
                { value: '#C15FFF' },
                { value: '#FF5F55' },
                { value: '#FFC935' },
                { value: '#767BFB' },
                { value: 'rgb(248,70,102)' }
            ]
        },
        key: "",
        model: "",
    },
    {
        type: 'bar',
        label: '柱状图',
        icon: 'icon-tubiaozhu',
        options: {
            design: true,
            title: '我的柱状图',
            titleShow: true,
            width: '100%',
            height: '300px',
            method: 'post',
            iconFont: 'xinwen',
            iconFontColor: '#ff0000',
            url: '/mockXHR/portal/barChart',
            parameter: "",
            pageSize: 7,
            action: false,
            formType: 'combbox',
            formOptions: {
                name: '查询',
                method: 'post',
                url: '/system/topicBase/getPageSet',
                parameter: "",
                staticList: [{
                    label: '选项一',
                    value: 1
                }, {
                    label: '选项二',
                    value: 2
                }],
                dynamic: 'static',
                code: 'sex',
                tabList: [{
                    label: '今日',
                    value: 1
                }, {
                    label: '本周',
                    value: 2
                }, {
                    label: '本月',
                    value: 3
                }],
                radioStyle: 'solid',
                dateType: 'date',
                rangeDefaultValue: [], // 默认值，字符串 12:00:00
                range: false, // 范围日期选择，为true则会显示两个时间选择框（同时defaultValue和placeholder要改成数组），
                showTime: false, // 是否显示时间选择器
                clearable: false, // 是否显示清除按钮
                rangePlaceholder: ["开始时间", "结束时间"],
                format: "YYYY-MM-DD", // 展示格式  （请按照这个规则写 YYYY-MM-DD HH:mm:ss，区分大小写）
                params: ''
            },
            text: '折线图示例',
            textShow: false,
            subtext: '',
            textSize: 16,
            subtextSize: 14,
            textColor: '#000',
            subtextColor: '#000',
            showBackground: false,
            barwidth: 8,
            barBorderRadius: 5,
            emphasis: false,
            stack: false,
            barGap: '20%',
            position: {
                left: 'auto',
                top: 'auto',
                right: 'auto',
                bottom: 'auto'
            },
            legend: {
                type: 'plain',
                textSize: 12,
                show: true,
                orient: 'horizontal',
                left: 'center',
                top: 'top',
                right: 'auto',
                bottom: 'auto',
                itemWidth: 18,
                itemHeight: 11
            },
            grid: {
                left: 50,
                right: 20,
                bottom: 40,
                top: 30,
            },
            x: {
                names: '',
                textSize: 14,
                axisLine: true,
                splitLine: false
            },
            y: {
                names: '',
                textSize: 14,
                axisLine: true,
                splitLine: false
            },
            colorLost: [
                { value: '#4FD8FF' },
                { value: '#C15FFF' },
                { value: '#FF5F55' },
                { value: '#FFC935' },
                { value: '#767BFB' },
                { value: 'rgb(248,70,102)' }
            ]
        },
        key: "",
        model: "",
    }
];