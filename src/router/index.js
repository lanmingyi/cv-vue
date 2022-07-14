/*** 
 * @Description: 初始化路由
 * @Author: lmy
 * @Date: 2021-01-18 15:17:31
 * @LastEditTime: 2021-06-07 11:41:43
 * @LastEditors: lmy
 * @FilePath:
 */
import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from '@/config/router.config'

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
