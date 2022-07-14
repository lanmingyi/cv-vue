/*** 
 * @Description: 工具类
 * @Author: lmy
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-06-22 10:58:13
 * @LastEditors: lmy
 * @FilePath:
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