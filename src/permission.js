/*** 
 * @Description: 路由导航守卫
 * @Author:
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-09-15 09:35:50
 * @LastEditors:
 * @FilePath:
 */
import Vue from 'vue'
import router from './router'
import store from './store'
import storage from 'vue-ls';
import { trackPageView } from '@/utils/behavior';
import {
    mergeI18nFromRoutes
} from '@/utils/i18n';
import {
    initI18n
} from '@/utils/i18n'
const i18n = initI18n('CN', 'US')
const options = {
    namespace: 'vuejs__',
    name: 'ls',
    storage: 'local',
}

Vue.use(storage, options)
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
// import notification from 'ant-design-vue/es/notification'
import {
    ACCESS_TOKEN
} from '@/store/mutation-types'

NProgress.configure({
    showSpinner: false
});
// NProgress Configuration
// 配置页面地址  白名单
const whiteList = ['login', 'register', '404', 'QywxLogin', 'ForgetPwd', 'DingtalkLogin', 'qywxLoginBack', 'ddLoginBack'] // no redirect whitelist
const loginRoutePath = '/user/login'
let defaultRoutePath = '/system/portal/index'
const errPage = '/404'
const lockPage = '/lock'; //锁屏页
const token = Vue.ls.get(ACCESS_TOKEN)
router.beforeEach((to, from, next) => {
    // console.log(to, from)
    trackPageView(window.location.pathname + '#' + to.fullPath) //百度统计代码，抓取内页
        // 刷新页面 切换缓存状态
    // to.meta.keepAlive = !to.meta.keepAlive
    // from.meta.keepAlive = !from.meta.keepAlive
		// if(to.meta.keepAlive == true){
		// 	store.commit('TOGGLE_MULTI_TAB', false)
		// }else{
		// 	store.commit('TOGGLE_MULTI_TAB', true)
		// }
    NProgress.start() // start progress bar
        // if (store.getters.isLock && to.path != lockPage) { //如果系统激活锁屏，全部跳转到锁屏页
        //     next({ path: lockPage })
        // }
    if (Vue.ls.get(ACCESS_TOKEN)) {
        /* has token */
        if (to.path === loginRoutePath) {
            next({
                path: defaultRoutePath
            })
            NProgress.done()
        } else {
            if (store.getters.roles.length === 0) {
                store.dispatch('GetAllConfigData').then(() => {
                        console.log('获取系统配置成功')
                    })
                    // 获取按钮权限数据
                store.dispatch('getUserInForAndButtonPermissions', {
                        token
                    })
                    .then(res => {
                        const roles = res && res.role
                        store.dispatch('GenerateRoutes', {
                            roles
                        }).then(() => {
                            // 根据roles权限生成可访问的路由表
                            defaultRoutePath = store.getters.addRouters[0].path + '/portal/index'
                                // 动态添加可访问路由表
                            router.addRoutes(store.getters.addRouters)
                                // 提取路由国际化数据
                            mergeI18nFromRoutes(i18n, router.options.routes)
                                // console.log(mergeI18nFromRoutes(i18n, router.options.routes))
                                // 请求带有 redirect 重定向时，登录自动重定向到该地址
                            const redirect = decodeURIComponent(from.query.redirect || to.path)
                            if (to.path === redirect) {
                                if (to.path === '/system/portal/index' || to.path === '/') {
                                    next({
                                        path: defaultRoutePath
                                    })
                                    return
                                }
                                // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                                next({
                                        ...to,
                                        replace: true
                                    })
                                    // next({ path: defaultRoutePath })
                            } else {
                                if (to.path === '/system/portal/index' || to.path === '/') {
                                    next({
                                        path: defaultRoutePath
                                    })
                                    return
                                }
                                // 跳转到目的路由
                                next({
                                    path: redirect
                                })
                            }
                        })
                    }).catch(() => {
                        // notification.error({ message: '系统提示', description: '该账号授权异常，请重新授权', duration: 5 })
                        // 不同环境下 退出登录显示页面处理
                        store.dispatch('LogoutByErrorCode').then(() => {
                          location.reload();
                        })
                    })
            } else {
                next()
            }
        }
    } else {
        sessionStorage.removeItem(process.env.VUE_APP_TBAS_KEY)
        if (whiteList.includes(to.name)) {
            console.log('whiteList', whiteList)
            // console.log(Vue.ls.get(ACCESS_TOKEN), '没有登录=====', to)
                // 在免登录白名单，直接进入
            next()
        } else {
            next({
                path: loginRoutePath,
                query: {
                    redirect: to.path
                }
            })
            NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
        }
    }
})

router.afterEach((to) => {
    NProgress.done() // finish progress bar
})