// src/utils/behavior.js

/* 百度统计-页面切换 */
/******* 
 * @description: 百度统计-页面切换
 * @param {*} url
 * @return {*}
 */
export function trackPageView(url) {
  if (!url) {
    return
  }
  window._hmt.push(['_trackPageview', url])
}