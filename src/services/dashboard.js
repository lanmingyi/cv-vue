/*** 
 * @Description: 门户页面mock数据
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-09-15 09:52:29
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\services\dashboard.js
 */
import request from '@/utils/mock.js'
import qs from 'qs'
/**
 * @description  获取card echarts图
 * @param {string} type  类型
 * @param {currentKey}   销售或访问量等类型
 * @param {string} startTime 开始时间  可选
 * @param {string} endTime  结束时间  可选
 * @returns {Object}
 */
export function getLineChartData(data) {
    return request.post('/dashboard/lineChart', data);
}
/**
 * @description  获取card echarts图
 * @param {string} month 月份  可选
 * @returns {Object}
 */

export function getLineChartDataByMonth(data) {
    return request.post('/dashboard/lineDataByMonth', data);
}

/**
 * @description  获取card echarts图
 * @param {string} Grade 月份  可选
 * @returns {Object}
 */

export function getNumDataByGrade(data) {
    return request.post('/dashboard/getNumByGrade', data);
}

/**
 * @description  获取card echarts图
 * @param {string} Grade 年级  可选
 * @returns {Object}
 */

export function getContacts(data) {
    return request.post('/dashboard/getContacts', data);
}

/**
 * @description  获取card echarts图
 * @param {string} Grade 年级  可选
 * @returns {Object}
 */

export function getAttendance(data) {
    return request.post('/dashboard/getAttendance', data);
}

/**
 * @description  获取card echarts图
 * @param {string} Grade 年级  可选
 * @returns {Object}
 */

export function getFeesData(data) {
    return request.post('/dashboard/getFees', data);
}

/**
 * @description  获取card 排行榜
 * @param {string} type  类型
 * @param {currentKey}   销售或访问量等类型
 * @param {string} startTime 开始时间  可选
 * @param {string} endTime  结束时间  可选
 * @returns {Object}
 */

export function getRankShopData(data) {
    return request.post('/dashboard/rankData', data);
}

/**
 * @description  获取销售种类 饼图
 * @param {string} type  类型
 * @returns {Array}
 */

export function getPieTypeData(data) {
    return request.post('/dashboard/pieTypeData', data);
}

/**
 * @description  获取热门搜索   柱状图
 * @param {string} type  类型
 * @returns {Array}
 */

export function getHotSearchData(data) {
    return request.post('/dashboard/hotSearchData', data);
}

/**
 * @description  获取热门搜索   柱状图
 * @param {string} type  类型
 * @returns {Array}
 */

export function getMoreData(data) {
    return request.post('/dashboard/moreData', data);
}