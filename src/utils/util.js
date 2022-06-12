import enquireJs from 'enquire.js'
import Vue from 'vue'
export default new Vue

// import store from '../store'

export function timeFix() {
    const time = new Date()
    const hour = time.getHours()
    return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome() {
    const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
    const index = Math.floor(Math.random() * arr.length)
    return arr[index]
}


/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
    const event = document.createEvent('HTMLEvents')
    event.initEvent('resize', true, true)
    event.eventType = 'message'
    window.dispatchEvent(event)
}


/**
 * 根据数组对象值返回下标
 * @param vm
 * @param name
 * @returns {Vue | null|null|Vue}
 */
export function getArrayIndex(list, text, val) {
    var index = list.map(item => item[text]).indexOf(val)
    return index
}


export function handleScrollHeader(callback) {
    let timer = 0

    let beforeScrollTop = window.pageYOffset
    callback = callback || function() {}
    window.addEventListener(
        'scroll',
        event => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                let direction = 'up'
                const afterScrollTop = window.pageYOffset
                const delta = afterScrollTop - beforeScrollTop
                if (delta === 0) {
                    return false
                }
                direction = delta > 0 ? 'down' : 'up'
                callback(direction)
                beforeScrollTop = afterScrollTop
            }, 50)
        },
        false
    )
}

export function isDef(v) {
    return v !== undefined && v !== null
}
/**
 * 随机生成数字
 *
 * 示例：生成长度为 12 的随机数：randomNumber(12)
 * 示例：生成 3~23 之间的随机数：randomNumber(3, 23)
 *
 * @param1 最小值 | 长度
 * @param2 最大值
 * @return int 生成后的数字
 */
export function randomNumber() {
    // 生成 最小值 到 最大值 区间的随机数
    const random = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    if (arguments.length === 1) {
        let [length] = arguments
        // 生成指定长度的随机数字，首位一定不是 0
        let nums = [...Array(length).keys()].map((i) => (i > 0 ? random(0, 9) : random(1, 9)))
        return parseInt(nums.join(''))
    } else if (arguments.length >= 2) {
        let [min, max] = arguments
        return random(min, max)
    } else {
        return Number.NaN
    }
}


/**
 * 随机生成字符串
 * @param length 字符串的长度
 * @param chats 可选字符串区间（只会生成传入的字符串中的字符）
 * @return string 生成的字符串
 */
export function randomString(length, chats) {
    if (!length) length = 1
    if (!chats) chats = '0123456789qwertyuioplkjhgfdsazxcvbnm'
    let str = ''
    for (let i = 0; i < length; i++) {
        let num = randomNumber(0, chats.length - 1)
        str += chats[num]
    }
    return str
}

/**
 * 随机生成uuid
 * @return string 生成的uuid
 */
export function randomUUID() {
    let chats = '0123456789abcdef'
    return randomString(32, chats)
}

/**
 * 获取事件冒泡路径，兼容 IE11，Edge，Chrome，Firefox，Safari
 * 目前使用的地方：JEditableTable Span模式
 */
export function getEventPath(event) {
    let target = event.target
    let path = (event.composedPath && event.composedPath()) || event.path

    if (path != null) {
        return (path.indexOf(window) < 0) ? path.concat(window) : path
    }

    if (target === window) {
        return [window]
    }

    let getParents = (node, memo) => {
        memo = memo || []
        const parentNode = node.parentNode

        if (!parentNode) {
            return memo
        } else {
            return getParents(parentNode, memo.concat(parentNode))
        }
    }
    return [target].concat(getParents(target), window)
}

/**
 * 如果值不存在就 push 进数组，反之不处理
 * @param array 要操作的数据
 * @param value 要添加的值
 * @param key 可空，如果比较的是对象，可能存在地址不一样但值实际上是一样的情况，可以传此字段判断对象中唯一的字段，例如 id。不传则直接比较实际值
 * @returns {boolean} 成功 push 返回 true，不处理返回 false
 */
export function pushIfNotExist(array, value, key) {
    for (let item of array) {
        if (key && (item[key] === value[key])) {
            return false
        } else if (item === value) {
            return false
        }
    }
    array.push(value)
    return true
}
/**
 * Remove an item from an array.
 */
export function remove(arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(index, 1)
        }
    }
}

export function isRegExp(v) {
    return _toString.call(v) === '[object RegExp]'
}

export function enquireScreen(call) {
    const handler = {
        match: function() {
            call && call(true)
        },
        unmatch: function() {
            call && call(false)
        }
    }
    enquireJs.register('only screen and (max-width: 767.99px)', handler)
}
/**
 * 日期格式化
 */
export function dateFormat(date) {
    let format = 'yyyy-MM-dd hh:mm:ss';
    if (date != 'Invalid Date') {
        var o = {
            "M+": date.getMonth() + 1, //month
            "d+": date.getDate(), //day
            "h+": date.getHours(), //hour
            "m+": date.getMinutes(), //minute
            "s+": date.getSeconds(), //second
            "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
            "S": date.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1,
                    RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    }
    return '';

}

/**
 * 过滤对象中为空的属性
 * @param obj
 * @returns {*}
 */
export function filterObj(obj) {
    if (!(typeof obj === 'object')) {
        return
    }
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && (obj[key] === null || obj[key] === undefined || obj[key] === '')) {
            delete obj[key]
        }
    }
    return obj
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
    if (id === '') {
        return
    }
    setTimeout(() => {
        document.body.removeChild(document.getElementById(id))
    }, timeout)
}
/**
 * 深度克隆对象、数组
 * @param obj 被克隆的对象
 * @return 克隆后的对象
 */
export function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj))
}

/**
 * components util
 */

/**
 * 清理空值，对象
 * @param children
 * @returns {*[]}
 */
export function filterEmpty(children = []) {
    return children.filter(c => c.tag || (c.text && c.text.trim() !== ''))
}

/**
 * 获取字符串长度，英文字符 长度1，中文字符长度2
 * @param {*} str
 */
export const getStrFullLength = (str = '') =>
    str.split('').reduce((pre, cur) => {
        const charCode = cur.charCodeAt(0)
        if (charCode >= 0 && charCode <= 128) {
            return pre + 1
        }
        return pre + 2
    }, 0)

/**
 * 截取字符串，根据 maxLength 截取后返回
 * @param {*} str
 * @param {*} maxLength
 */
export const cutStrByFullLength = (str = '', maxLength) => {
    let showLength = 0
    return str.split('').reduce((pre, cur) => {
        const charCode = cur.charCodeAt(0)
        if (charCode >= 0 && charCode <= 128) {
            showLength += 1
        } else {
            showLength += 2
        }
        if (showLength <= maxLength) {
            return pre + cur
        }
        return pre
    }, '')
}
const _toString = Object.prototype.toString

/**
 * 根据组件名获取父级
 * @param vm
 * @param name
 * @returns {Vue | null|null|Vue}
 */
export function getVmParentByName(vm, name) {
    let parent = vm.$parent
    if (parent && parent.$options) {
        if (parent.$options.name === name) {
            return parent
        } else {
            let res = getVmParentByName(parent, name)
            if (res) {
                return res
            }
        }
    }
    return null
}

/**
 * 使一个值永远不会为（null | undefined）
 *
 * @param value 要处理的值
 * @param def 默认值，如果value为（null | undefined）则返回的默认值，可不传，默认为''
 */
export function neverNull(value, def) {
    return value == null ? (neverNull(def, '')) : value
}

/**
 * 获取当前日期
 *
 * 
 * 
 */
export function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

// 获取当前星期
export function getWeekDate() {

    var myDate = new Date();

    var days = myDate.getDay();

    switch (days) {
        case 1:
            days = '星期一';
            break;
        case 2:
            days = '星期二';
            break;
        case 3:
            days = '星期三';
            break;
        case 4:
            days = '星期四';
            break;
        case 5:
            days = '星期五';
            break;
        case 6:
            days = '星期六';
            break;
        case 0:
            days = '星期日';
            break;
    }
    var str = days;
    return str;
}



/**
 * 页面跳转
 * @param url   请求地址xxx\xxx?xxx=xx&xx=xx
 * @param data 可选参数 json对象数据{‘a’:1}
 */

export function submitForm(url, data) {　　
    var eleForm = document.body.appendChild(document.createElement('form'));　　
    eleForm.action = url;
    eleForm.target = "_blank";　　
    for (var property in data)　　 {　　　　
        var hiddenInput = document.createElement('input');　　　　
        hiddenInput.type = 'hidden';　　　　
        hiddenInput.name = property;　　　　
        hiddenInput.value = data[property];　　　　
        eleForm.appendChild(hiddenInput);　　
    }　　
    this.eleForm = eleForm;　　
    if (!submitForm._initialized)　　 {　　　　
        submitForm.prototype.get = function()　　　 {　　　　　　
            this.eleForm.method = 'get';　　　　　　
            this.eleForm.submit();　　　　
        };　　
        submitForm._initialized = true;　　
    }
}


/**
 * 获取url后面的参数转换成一个对象
 * @param url  url地址
 */
export function GetUrlParam(url) {
    // let url = document.location.toString();
    let arrObj = url.split("?");
    let params = Object.create(null)
    if (arrObj.length > 1) {
        arrObj = arrObj[1].split("&");
        arrObj.forEach(item => {
            item = item.split("=");
            params[item[0]] = item[1]
        })
    }
    return params;
}

/**
 * wps可在线编辑文件类型 /文件后缀
 */
export const fileSuffix = [
    'xls', 'xlt', 'et', 'xlsx', 'xltx', 'csv', 'xlsm', 'xltm',
    'doc', 'dot', 'wps', 'wpt', 'docx', 'dotx', 'docm', 'dotm',
    'ppt', 'pptx', 'pptm', 'ppsx', 'ppsm', 'pps', 'potx', 'potm', 'dpt', 'dps'
];

export const kkFileViewType = [
    ".txt", ".html", ".htm", ".asp", ".jsp", ".xml", ".json", ".properties", ".md",
    ".gitignore", ".log", ".java", ".py", ".c", ".cpp", ".sql", ".sh", ".bat", ".m",
    ".bas", ".prg", ".cmd", ".jpg", ".jpeg", ".png", ".gif", ".doc", ".docx", ".pdf",
    ".ppt", ".pptx", ".xls", ".xlsx", ".zip", ".rar", ".jar", ".tar", ".gzip", ".mp3",
    ".wav", ".mp4", ".flv", ".dwg", ".txt",".java",".php",".py",".md",".js",".css"
]


/**
 * 根据文件名后缀获取对应图标
 * @param text  文件名
 */

export function getIconFont(text) {
    let fileType = ['.doc', '.ppt', '.pdf', '.xls', '.xlt', '.txt', '.exe', '.mp3', '.mp4'] //文件后缀
    let iconList = ['icon-word', 'icon-ppt', 'icon-pdf', 'icon-xls', 'icon-xls', 'icon-TXT', 'icon-exe', 'icon-yinpin', 'icon-ziyuan'] //文件类型对应图标
    for (var i = 0; i <= fileType.length; i++) {
        let index = text.indexOf(fileType[i])
        if (index > 0) {
            return iconList[i]
            break;
        }
    }
    // 图片类型多样，单独处理
    const imgType = ['.jpeg', '.gif', '.png', '.jpg', '.JPG', '.PNG', '.GIF', '.JPEG']
    for (var i = 0; i <= imgType.length; i++) {
        let index = text.indexOf(imgType[i])
        if (index > 0) {
            return 'icon-tupian'
            break;
        }
    }
    return 'icon-qita' //没有上述两个数组对应的后缀时 返回
}

/**
 * 判断数组对象是否包含某个字符串
 * @param arry  数组
 * @param file  字符串
 */
export function getTypeByList(arry, file) {
    for (var i = 0; i <= arry.length; i++) {
        let index = file.indexOf(arry[i])
        if (index > 0) {
            return true
            break;
        }
    }
}

/**
 * 合并数组对象
 * @param master  主数组
 * @param sub  子数组
 * @param key  标识
 */
export function mergeArry(master, sub, key) {
    // const arr1 = [{ name: 'name5', id: 1 }, { name: 'name2', id: 2 }, { name: 'name3', id: 3 }];
    // const arr2 = [{ name: 'name1', id: 1 }, { name: 'name4', id: 4 }, { name: 'name5', id: 5 }];
    let arr = master.concat(sub);
    let result = [];
    let obj = [];
    result = arr.reduce(function(prev, cur, index, arr) {
        obj[cur[key]] ? '' : obj[cur[key]] = true && prev.push(cur);
        return prev;
    }, []);
    console.log(result);
    return result
}


/**
 * 字符串转成对象
 * @param master  主数组
 * @param sub  子数组
 * @param key  标识
 */

export function getObjectByString(params, symbol1, symbol2) {
    if (!params) return {};
    params = params.split(symbol1);
    var obj = {};
    for (var i = 0; i < params.length; i++) {
        var param = params[i].split(symbol2);
        obj[param[0]] = param[1];
    }
    params.map((item) => (obj[item.split(symbol2)[0]] = item.split(symbol2)[1]));
    return obj;
}
/**
 * 将rgba颜色格式转换成十六进制
 * @param color  rgba颜色代码
 */
export function hexify(color) {
    var values = color
        .replace(/rgba?\(/, '')
        .replace(/\)/, '')
        .replace(/[\s+]/g, '')
        .split(',');
    var a = parseFloat(values[3] || 1),
        r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
        g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
        b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
    return "#" +
        ("0" + r.toString(16)).slice(-2) +
        ("0" + g.toString(16)).slice(-2) +
        ("0" + b.toString(16)).slice(-2);
}


export function isInclude(name) {
    var js = /js$/i.test(name);
    var es = document.getElementsByTagName(js ? 'script' : 'link');
    for (var i = 0; i < es.length; i++)
        if (es[i][js ? 'src' : 'href'].indexOf(name) != -1) return true;
    return false;
}
// 移除css/js文件
export function removejscssfile(filename, filetype) {
    var targetelement = filetype == 'js' ? 'script' : filetype == 'css' ? 'link' : 'none';
    var targetattr = filetype == 'js' ? 'src' : filetype == 'css' ? 'href' : 'none';
    var allsuspects = document.getElementsByTagName(targetelement);
    for (var i = allsuspects.length; i >= 0; i--) {
        if (
            allsuspects[i] &&
            allsuspects[i].getAttribute(targetattr) != null &&
            allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1
        ) {
            allsuspects[i].parentNode.removeChild(allsuspects[i]);
        }
    }
}

// 表格可拖拽列的函数

export function resizeableTitle(h, props, children, columns) {
    const draggingMap = {};
    columns.forEach((col) => {
        col.ellipsis = true
        draggingMap[col.key] = col.width;
    });
    const draggingState = Vue.observable(draggingMap);
    let thDom = null;
    const { key, ...restProps } = props;
    let index = 0
    const col = columns.find((col, colIndex) => {
        const k = col.dataIndex || col.key;
        index = colIndex
        return k === key;
    });
    if (!col?.width) {
        return <th {...restProps } > { children } < /th>;
    }
    const onDrag = (x) => {
        draggingState[key] = 0;
        col.width = Math.max(x, 1);
    };
    const onDragstop = () => {
        draggingState[key] = thDom.getBoundingClientRect().width;
    };
    return ( < th {...restProps }
        v-ant-ref = {
            (r) => (thDom = r)
        }
        width = { col.width }
        class = "resize-table-th" > { children } <
        vue-draggable-resizable key = { col.key }
        class = "table-draggable-handle"
        w = { 10 }
        x = { draggingState[key] || (col?.width && typeof col?.width === 'string'?(Number(col?.width.split('px')[0])) : col?.width) }
        z = { 1 }
        axis = "x"
        draggable = { true }
        resizable = { false }
        onDragging = { onDrag }
        onDragstop = { onDragstop } >
        <
        /vue-draggable-resizable> </th >
    );
}