/*** 
 * @Description: 门户request请求
 * @Author: 黄婷
 * @Date: 2021-08-23 17:18:26
 * @LastEditTime: 2021-09-15 09:42:28
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\utils\requestByPortal.js
 */
import axios from 'axios';
import { message } from 'ant-design-vue';
import qs from 'qs';
import store from '@/store';

const service = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    timeout: 5000 // 请求超时时间
});

//请求
service.interceptors.request.use(config => {
    if (store.getters.token) {
        config.headers['token'] = store.getters.token;
    }
    return config;
});

//响应
service.interceptors.response.use(response => {
    const data = response.data;
    if (data.code === 200) {
        return Promise.resolve(response);
    } else {
        message.error(response.data.message || '');
        return Promise.reject(response);
    }
});

let http = {};

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */

http.get = function(url, params = null) {
    return new Promise((resolve, reject) => {
        service
            .get(url, qs.stringify(params))
            .then(res => {
                resolve(res.data);
            })
            .catch(e => {
                reject(e);
            });
    });
};

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */

http.post = function(url, params) {
    return new Promise((resolve, reject) => {
        service
            .post(url, qs.stringify(params))
            .then(res => {
                resolve(res.data);
            })
            .catch(e => {
                reject(e);
            });
    });
};

export default http;