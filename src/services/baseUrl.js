/*** 
 * @Description: 公用基础配置
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-07-30 16:35:31
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\services\baseUrl.js
 */
let domainUrl = process.env.VUE_APP_API_DOMAIN_URL // 钉钉、企业微信回调域名设置：项目访问ip或者域名
let baseUrl = process.env.VUE_APP_API_BASE_URL // 这里是一个默认的url，数据请求地址
let jobUrl = process.env.VUE_APP_API_JOB_BASE_URL // 这里是一个默认的url  xxl-job
let qywxAppId = process.env.VUE_APP_QYWX_APPID //企业微信登录的企业ID
let qywxAgentId = process.env.VUE_APP_QYWX_AGENTID //企业微信登录的企业应用ID
let dingtalkAppId = process.env.VUE_APP_DINGTAIK_APPID //钉钉登录的APPID
let mobileUrl = process.env.VUE_APP_API_MOBILE_URL //移动在线开发url

export { domainUrl, baseUrl, jobUrl, qywxAppId, qywxAgentId, dingtalkAppId, mobileUrl }