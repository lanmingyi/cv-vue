/*** 
 * @Description: 工具类
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-06-22 10:58:13
 * @LastEditors: 黄婷
 * @FilePath: \vue-antd-admine:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\utils\filter.js
 */
import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

/* 
 * 日期时间处理
 */
Vue.filter('NumberFormat', function(value) {
    if (!value) {
        return '0'
    }
    const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
    return intPartFormat
})

Vue.filter('dayjs', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
    return moment(dataStr).format(pattern)
})

Vue.filter('moment', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
        return moment(dataStr).format(pattern)
    })
    /** 字符串超长截取省略号显示 */
Vue.filter('ellipsis', function(value, vlength = 25) {
    if (!value) {
        return "";
    }
    if (value.length > vlength) {
        return value.slice(0, vlength) + '...'
    }
    return value
})