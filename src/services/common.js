/*** 
 * @Description: 数据请求
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-09-15 09:52:14
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\services\common.js
 */
import { axios } from '@/utils/request'
import { baseUrl } from './baseUrl.js'
import qs from 'qs'
import Vue from 'vue'
import { UI_CACHE_DB_DICT_DATA } from "@/store/mutation-types" //获取缓存字典值
// axios.defaults.withCredentials=true //允许携带cookie

export function getBaseList(url, parameter) {
    return axios.post(url, qs.stringify(parameter));
}

export function postAxiosRequest(url, parameter) {
    return axios.post(url, qs.stringify(parameter));
}
// get
export function getAxiosRequest(url, parameter) {
    return axios.get(url, qs.stringify(parameter));
}


// getCustomAxiosRequest
export function getCustomAxiosRequest(method, url, parameter) {
    return axios({
        url: baseUrl + url,
        method: method ? method : 'post',
        data: qs.stringify(parameter)
    })
}

// export function getAxiosRequest(url, parameter) {
// 	return axios({
// 		url: baseUrl + url,
// 		method: 'get',
// 		data: qs.stringify(parameter)
// 	})
// }

//从缓存中获取字典配置,没有则获取存储
// export function getDictItemsFromCache(dictCode) {
// 	let list = Vue.ls.get(UI_CACHE_DB_DICT_DATA)?Vue.ls.get(UI_CACHE_DB_DICT_DATA):{}
// 	if (list && list[dictCode]) {
// 		let dictItems = list[dictCode];
// 		console.log("-----------getDictItemsFromCache----------dictCode=" + dictCode + "---- dictItems=", dictItems)
// 		return dictItems;
// 	} else {
// 		postAxiosRequest('/system/dicSet/getDicItemByCode',{code:dictCode}, null).then((res) => {
// 			if(res.statusCode != 300){
// 				list[dictCode] = res
// 				Vue.ls.set(UI_CACHE_DB_DICT_DATA,list)
// 				return list[dictCode];
// 			}
// 		})
// 	}
// }
export function getDictItemsFromCache(dictCode) {
    postAxiosRequest('/system/dicSet/getDicItemByCode', { code: dictCode }, null).then((res) => {
        if (res.statusCode != 300) {
            return res;
        }
    })
}

// getMockData
export function getMockData(method, url, parameter) {
    console.log('parameter===', parameter)
    return axios({
        url: url,
        method: method,
        data: qs.stringify(parameter),
    })
}

export function pdfStreamHandeler(url, parameter) {
    return axios({
        url: baseUrl + url,
        method: 'post',
        data: qs.stringify(parameter),
        responseType: 'blob'
    })
}

export function videoStreamHandeler(url, parameter) {
    return axios({
        url: baseUrl + url,
        method: 'post',
        data: qs.stringify(parameter),
        responseType: 'application/video'
    })
}

//获取地址参数
export function getQueryString(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(
        /\+/g, '%20')) || null
}

/**
 * 获取文件服务访问路径
 * @param avatar
 * @param subStr
 * @returns {*}
 */
// window._CONFIG['staticDomainURL'] = Vue.prototype.API_BASE_URL + '/sys/common/static'
export function getFileAccessHttpUrl(avatar, subStr) {
    if (!subStr) subStr = 'http'
    if (avatar && avatar.startsWith(subStr)) {
        return avatar;
    } else {
        if (avatar && avatar.length > 0 && avatar.indexOf('[') == -1) {
            return baseUrl + '/system/attachment/showPic?path=' + avatar;
        }
    }
}