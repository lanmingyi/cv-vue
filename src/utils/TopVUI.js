import Vue from 'vue'
import { baseUrl } from '../services/baseUrl.js'
import store from '@/store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 使用 base64 保存图片
// 上传图片到服务器
export function createEditor(E, ed) {
    const token = storage.get(ACCESS_TOKEN)
    var editor = new E(ed)
    editor.customConfig.uploadImgShowBase64 = true
    editor.customConfig.uploadImgHeaders = { token: token }
    editor.customConfig.uploadImgServer = baseUrl + '/system/attachment/config?action=uploadimage&encode=utf-8'
    editor.customConfig.onchange = (html) => {
        editor.txt.html(html)
    }
    editor.create()
    return editor
}

// 获取token
export function getToken() {
    let token = Vue.ls.get(ACCESS_TOKEN)
    return token
}

// 通用下载方法
export function download(uuid) {
    // window.location.href = baseUrl + '/system/attachment/download?uuid=' + encodeURI(uuid) + '&token=' + Vue.ls.get(ACCESS_TOKEN)
		window.open(baseUrl + '/system/attachment/download?uuid=' + encodeURI(uuid) + '&token=' + Vue.ls.get(ACCESS_TOKEN))
}

// oss文件通用下载方法
export function downloadOss(bucketName, endpoint, objectName) {
    // window.location.href = baseUrl + '/document/oss/download?bucketName=' + bucketName + '&endpoint=' + endpoint + '&objectName=' + objectName + '&token=' + Vue.ls.get(ACCESS_TOKEN)
		window.open(baseUrl + '/document/oss/download?bucketName=' + bucketName + '&endpoint=' + endpoint + '&objectName=' + objectName + '&token=' + Vue.ls.get(ACCESS_TOKEN))
}

// fdfs通用下载方法
export function downloadDfs(fileUrl, fileName) {
    // window.location.href = baseUrl + '/document/fdfs/download?fileUrl=' + fileUrl + '&fileName=' + fileName + '&token=' + Vue.ls.get(ACCESS_TOKEN)
		// window.open(baseUrl + '/document/fdfs/download?fileUrl=' + fileUrl + '&fileName=' + fileName + '&token=' + Vue.ls.get(ACCESS_TOKEN))
		window.open(fileUrl)
}

// minio文件通用下载方法
export function downloadMinio(bucket, objectName) {
    // window.location.href = baseUrl + '/document/minio/downloadFile?bucket=' + bucket + '&objectName=' + objectName + '&token=' + Vue.ls.get(ACCESS_TOKEN)
		window.open(baseUrl + '/document/minio/downloadFile?bucket=' + bucket + '&objectName=' + objectName + '&token=' + Vue.ls.get(ACCESS_TOKEN))
}

//判断对象属性值是否存在数组，存在则转换成字符串
export function filterObject(object) {    
    for (var property in object)
        if (isArray(object[property])) object[property] = object[property].toString();
    return object;
}

//判断是否为数组
export function isArray(o) {
    return Object.prototype.toString.call(o) == '[object Array]'

}

// 获取cookie
export function getCookie(objname) {
    var arrstr = document.cookie.split("; ");
    for (var i = 0; i < arrstr.length; i++) {
        var temp = arrstr[i].split("=");
        if (temp[0] == objname) return unescape(temp[1]);
    }
}

//设置cookie 
export function setCookie(c_name, value, expire) {  
    var date = new Date();
    date.setSeconds(date.getSeconds() + expire);
    document.cookie = c_name + "=" + escape(value) + "; expires=" + date.toGMTString()   //console.log(document.cookie)
}

//删除cookie 
export function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
/**
 * 字典值替换文本通用方法
 * @param dictOptions  字典数组
 * @param text  字典值
 * @return String
 */
export function filterDictText(dictOptions, text) {
    // --update-begin----author:sunjianlei---date:20200323------for: 字典翻译 text 允许逗号分隔 ---
    if (text != null && Array.isArray(dictOptions)) {
        let result = []
            // 允许多个逗号分隔，允许传数组对象
        let splitText
        if (Array.isArray(text)) {
            splitText = text
        } else {
            splitText = text.toString().trim().split(',')
        }
        splitText.forEach((e, index) => {
            let dictText = e
            dictOptions.forEach((r) => {
                if (e.toString() === r.value.toString()) {
                    dictText = r.label
                }
            })
            result.push(dictText)
        })
        return result.join(',')
    }
    return text
        // --update-end----author:sunjianlei---date:20200323------for: 字典翻译 text 允许逗号分隔 ---
}


// 循环获取子级数据  树形通用
export function getFilter(sourceData, children) {
    let arr = []
    if (sourceData) {
        sourceData.forEach((e, index) => {
            children.forEach((c, index) => {
                if (e.id == c.pid) {
                    c.title = c.text
                    c.value = c.id
                    c.key = c.id
                    c.children = c.state === 'closed' ? [] : ''
                    if (e.children) e.children.push(c)
                }
            })
            if (e.children) { // 子级有数据的时候 循环添加数据
                getFilter(e.children, children)
            }
        })
        arr = sourceData
    }
    return arr
}

//获取url后面的参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function isBlank(str) {
    return str === undefined || str.length == 0;
}