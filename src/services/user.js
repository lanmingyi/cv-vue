/*** 
 * @Description: 用户登录、退出登录、获取系统配置
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:31
 * @LastEditTime: 2021-09-15 09:53:40
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\services\user.js
 */
import { axios } from '@/utils/request'
import { baseUrl } from './baseUrl.js'
import qs from 'qs'

// 登录
export function login(parameter) {
    return axios({
        url: baseUrl + '/system/jwtLogin',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: parameter
    })
}

// 获取用户信息
export function getInfo(url, parameter) {
    return axios({
        url: baseUrl + url,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: parameter
    })
}

// 获取系统配置
// export function getAllConfigData () {
//   return axios({
//     url: baseUrl + '/system/config/getAllConfigData.api',
//     method: 'post'
//   })
// }
export function getAllConfigData() {
    return axios.post('/system/config/getAllConfigData.api');
}


// 获取验证码
export function getVerificationCode() {
    return axios({
        url: baseUrl + '/system/genCodes',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

// 获取授权
export function getListMenuByRoleId(url, parameter) {
    return axios({
        url: baseUrl + url,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: parameter
    })
}

// 获取门户菜单
export function getCurrentUserIndexPage() {
    return axios({
        url: baseUrl + '/system/sysPortal/getCurrentUserIndexPage',
        method: 'post'
    })
}

// 退出登录
export function logout() {
    return axios({
        url: '/system/login/logout',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

/**
 * 企业微信扫码登录
 * @param parameter
 * @returns {*}
 */
export function enterpriseWeChatLogin(parameter) {
    return axios.post(baseUrl + '/system/qiyeweixin/qywxLogin.api', qs.stringify(parameter));
}

/**
 * 钉钉扫码登录
 * @param parameter
 * @returns {*}
 */
export function enterpriseDingtalkLogin(parameter) {
    return axios.post(baseUrl + '/system/dingding/ddLogin.api', qs.stringify(parameter));
}


export function loginByPhoneNumber(parameter) {
    return null;
}