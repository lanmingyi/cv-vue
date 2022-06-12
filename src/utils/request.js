/*** 
 * @Description: axios请求
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:31
 * @LastEditTime: 2021-08-25 09:21:12
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\utils\request.js
 */
import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { Modal, notification } from 'ant-design-vue'

// 创建 axios 实例
const service = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
    timeout: 60000, // 请求超时时间
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    withCredentials: false //默认值
})

// 是否正在刷新的标记
let isRefreshing = false
    //重试队列
let requests = []
const err = (error) => {
    if (error.response) {
        console.log(error.response)
        const data = error.response.data
        const token = Vue.ls.get(ACCESS_TOKEN)
        switch (error.response.status) {
            case 403:
                notification.error({ message: '系统提示', description: '拒绝访问', duration: 4 })
                break
            case 500:
                notification.error({ message: '系统提示', description: '服务未启动', duration: 3 })
                break
            case 404:
                notification.error({ message: '系统提示', description: '很抱歉，资源未找到!', duration: 4 })
                break
            case 504:
                notification.error({ message: '系统提示', description: '网络超时', duration: 4 })
                break
            case 503:
                notification.error({ message: '系统提示', description: '服务未启动', duration: 4 })
                break
            case 401:
                console.log(token, 'token is invalid===========')
                if (!isRefreshing) {
                    // notification.error({ message: '系统提示', description: '很抱歉，登录已失效，正在重新登录', duration: 5 })
                    isRefreshing = true
                        //调用刷新token的接口
                    store.dispatch('LogoutByErrorCode').then(() => {}).catch(err => {
                        //跳到登录页
                        // return Promise.reject(err)
                    }).finally(() => {
                        location.reload();
                    })
                } else {
                    // 返回未执行 resolve 的 Promise
                    return new Promise(resolve => {
                        // 用函数形式将 resolve 存入，等待刷新后再执行
                        requests.push(token => {
                            response.headers.Authorization = `${token}`
                            resolve(service(response.config))
                        })
                    })
                }
                break
            default:
                notification.error({
                    message: '系统提示',
                    description: data.message,
                    duration: 4
                })
                break
        }

    }
    return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (token) {
        config.headers['token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
    }
    return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
    return response.data
}, err)

const installer = {
    vm: {},
    install(Vue) {
        Vue.use(VueAxios, service)
    }
}

export {
    installer as VueAxios,
    service as axios
}