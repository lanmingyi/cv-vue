import {
    constantRouterMap
} from '@/config/router.config'
import {
    getListMenuByRoleId,
    getCurrentUserIndexPage
} from '@/services/user'
import {
    BlankView,
    CommonLayout,
    TabsView,
    PageView,
    RouteView,
    PageLayout,
} from '@/layouts'

let portalRoutersData = []
    /**
     * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
     *
     * @param permission
     * @param route
     * @returns {boolean}
     */
function hasPermission(permission, route) {
    if (route.meta && route.meta.permission) {
        let flag = false
        for (let i = 0, len = permission.length; i < len; i++) {
            flag = route.meta.permission.includes(permission[i])
            if (flag) {
                return true
            }
        }
        return false
    }
    return true
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
    if (route.meta && route.meta.roles) {
        return route.meta.roles.includes(roles.id)
    } else {
        return true
    }
}

// 匹配路由组件
function filterAsyncRouter(routerMap, roles) {
    const accessedRouters = routerMap.filter((route) => {
        // 门户首页数据处理
        if (process.env.VUE_APP_TYPE === 'mis_vue' && portalRoutersData && portalRoutersData.length != 0) {
            let index = portalRoutersData.findIndex(item => item.path === route.path)
            if (index !== -1 && route.id) {
                portalRoutersData[index].children[0].hidden = true
                if (!route.children) route.children = []
                route.children.push(portalRoutersData[index].children[0])
            }
        }
        if (route.component) {
            // Layout组件特殊处理
            if (route.component === 'TabsView') {
                route.component = TabsView
            } else if (route.component === 'CommonLayout') {
                route.component = CommonLayout
            } else if (route.component === 'PageLayout') {
                route.component = PageLayout
            } else if (route.component === 'BlankLayout') {
                route.component = BlankView
            } else if (route.component === 'PageView') {
                route.component = PageView
            } else if (route.component === 'RouteView') {
                route.component = RouteView
            } else if (route.component === 'BlankView') {
                route.component = BlankView
            } else {
                route.component = loadView(route.component)
            }
            if (route.meta) {
                route.meta.keepAlive = route.meta.keepAlive ? route.meta.keepAlive : route.keepAlive;
                route.meta.icon = route.meta.icon ? route.meta.icon : (route.iconCls ? route.iconCls :
                    'solution');
            }
            // 新窗口打开的路由
            if (route.resourceType === 'urlNewWindows') {
                route.meta.target = '_blank'
                route.meta.link = route.path
                delete route['component']
            }
        }
        if (hasPermission(roles.permissionList, route)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, roles)
                if (route.name != 8) {
                    delete route['redirect']
                }
            } else {
                delete route['redirect'] // 删除redirect重定向  防止堆用栈溢出
                delete route['children'] // 删除没有数据的children  防止左侧菜单显示异常; 
            }
            return true
        }
        return false
    })
    return accessedRouters
}

// 加载视图页面
export const loadView = (view) => { // 路由懒加载
    return (resolve) => require([`@/pages${view}`], resolve)
}

const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: [],
        menuData: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers
            state.menuData = routers
            state.menuData.push({ path: '*', redirect: '/404', hidden: true })
            state.routers = constantRouterMap.concat(routers)
        }
    },
    actions: {
        GenerateRoutes({
            commit,
            state
        }, data) { //获取动态路由数据
            return new Promise(resolve => {
                let url = ''
                let ajaxData = {
                        type: 'dev'
                    }
                    // 判断是vue版还是topjui版本
                if (process.env.VUE_APP_TYPE === 'mis_vue') {
                    url = '/system/menu/getListMenuByRoleId'
                } else {
                    url = '/system/menu/getAllVueMenuData'
                    if (process.env.NODE_ENV === 'production') { //判断取用那个菜单，主要针对于topjui版本的流程和表单
                        ajaxData = {
                            type: 'production'
                        }
                    }
                }
                // vue版本菜单数据获取
                if (process.env.VUE_APP_TYPE === 'mis_vue') {
                    // 门户页面菜单获取
                    getCurrentUserIndexPage().then(res => {
                        portalRoutersData = res
                            // 菜单
                        getListMenuByRoleId(url).then(res => {
                            const { roles } = data
                            const array = []
                            const menuData = res.children
                            array.push(menuData)
                            const accessedRouters = filterAsyncRouter(menuData, roles)
                            commit('SET_ROUTERS', accessedRouters)
                            resolve(accessedRouters)
                        })
                    })
                } else {
                    // topjui版本菜单获取
                    getListMenuByRoleId(url, ajaxData).then(res => {
                        const { roles } = data
                        const array = []
                        const menuData = res.children
                        array.push(menuData)
                        const accessedRouters = filterAsyncRouter(menuData, roles)
                        commit('SET_ROUTERS', accessedRouters)
                        resolve(accessedRouters)
                    })
                }

            })
        }
    }
}

export default permission