/*** 
 * @Description: 门户数据请求
 * @Author: lmy
 * @Date: 2021-08-23 16:51:13
 * @LastEditTime: 2021-09-15 09:51:55
 * @LastEditors: lmy
 * @FilePath:
 */
import request from '@/utils/mock'
import axios from '@/utils/requestByPortal'
import qs from 'qs'


/**
 * @description  门户管理数据请求方法
 * @param {string} method  请求方式
 * @param {string} url 接口地址
 * @param {Object} data 参数
 * @returns {Object}
 */
export function axiosRequest(method, url, data) {
    if (method == 'post') {
        if (isMock) {
            return request.post(url, data);
        } else {
            return axios.post(url, data);
        }
    } else {
        if (isMock) {
            return request.get(url, data);
        } else {
            return axios.get(url, data);
        }
    }
}
// 判断是否请求的是mock数据
function isMock(url) {
    return url.indexOf("/mockXHR/") != -1
}