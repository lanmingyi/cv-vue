/*** 
 * @Description: 本地路由配置
 * @Author:
 * @Date: 2021-01-18 15:17:27
 * @LastEditTime: 2021-09-17 10:49:46
 * @LastEditors:
 * @FilePath:
 */
// eslint-disable-next-line
import { AdminLayout, CommonLayout, TabsView, RouteView, PageView, BlankView, PageLayout } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [

    {
        path: '/',
        name: 'index',
        component: AdminLayout,
        meta: { title: '首页' },
        redirect: '/dashboard/analysis',
        children: []
    },
    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
]

/**
 * vue版基础路由
 * @type { *[] }
 */
export const constantRouterMap = [{
        // oss在线编辑页面配置
        path: '/document/oss/viewFile',
        name: 'viewFile',
        meta: { title: 'wps在线编辑', keepAlive: true, icon: 'home' },
        component: () =>
            import ('@/pages/document/oss/viewFile')
    }, { // 测试页面菜单配置
        path: '/test',
        component: RouteView,
        hidden: true,
        children: [{
            path: '/test/portal/index',
            name: '测试页面',
            component: () =>
                import ('@/pages/test/index'),
            meta: { title: '测试页面', keepAlive: true }
        }, {
            path: '/test/design/index',
            name: '表单设计',
            component: () =>
                import ('@/pages/workflow/apiFlowableProcessDefinition/index'),
            meta: { title: '表单设计', keepAlive: true }
        }, ]
    },
    // 没有门户管理的情况下,门户首页的路由配置
    // {
    //     path: '/system/portal',
    //     component: TabsView,
    //     meta: { title: '平台管理', icon: 'home' },
    //     children: [{
    //         path: '/system/portal/index',
    //         meta: { title: '平台门户', keepAlive: true, icon: 'home' },
    //         component: PageView,
    //         children: [{
    //             path: '/system/portal/index',
    //             meta: { title: '平台门户', keepAlive: true, icon: 'home' },
    //             component: () =>
    //                 import ('@/pages/system/portal/index')
    //         }]
    //     }]
    // },
    // {
    //     path: '/office/portal',
    //     component: TabsView,
    //     meta: { title: '协同办公', icon: 'home' },
    //     children: [{
    //         path: '/office/portal/index',
    //         meta: { title: '办公门户', keepAlive: true, icon: 'home' },
    //         component: PageView,
    //         children: [{
    //             path: '/office/portal/index',
    //             meta: { title: '办公门户', keepAlive: true, icon: 'home' },
    //             component: () =>
    //                 import ('@/pages/office/portal/index')
    //         }]
    //     }]
    // },
    {
        path: '/lock',
        component: RouteView,
        hidden: true,
        name: 'lock',
        component: () =>
            import ('@/pages/account/lock/index'),
        meta: { title: '锁屏页', keepAlive: true, }
    },
    { // 表单设计预览配置
        path: '/formDefine',
        component: TabsView,
        name: '平台管理',
        meta: { title: '平台管理' },
        children: [{
            path: '/form/formDefine',
            name: '表单中心',
            component: PageView,
            meta: { title: '表单中心', keepAlive: true, },
            children: [{
                    path: '/form/formDefine/',
                    name: '表单在线设计',
                    component: RouteView,
                    meta: { title: '表单在线设计', keepAlive: true, },
                    children: [{
                        path: '/form/formDefine/index',
                        name: '表单预览',
                        component: () =>
                            import ('@/pages/form/formDefine/index'),
                        meta: { title: '表单预览', keepAlive: true, icon: 'table' },
                    }, ]
                },
                {
                    path: '/form/formPreview',
                    name: '表单在线设计',
                    component: RouteView,
                    meta: { title: '表单在线设计', keepAlive: true, },
                    children: [{
                        path: '/form/formPreview/index',
                        name: '表单模板页面',
                        component: () =>
                            import ('@/pages/form/formPreview/index'),
                        meta: { title: '表单模板页面', keepAlive: true, icon: 'table' },
                    }]
                },
                {
                    path: '/form/formGeneration',
                    name: '表单在线设计',
                    component: RouteView,
                    meta: { title: '表单在线设计', keepAlive: true, },
                    children: [{
                        path: '/form/formGeneration/index',
                        name: '表单模板页面',
                        component: () =>
                            import ('@/pages/form/formGeneration/index'),
                        meta: { title: '表单模板页面', keepAlive: true, icon: 'table' },
                    }]
                },
                {
                    path: '/form/formTemplate',
                    name: '表单设计模板',
                    component: RouteView,
                    meta: { title: '表单设计模板', keepAlive: true, },
                    children: [{
                        path: '/form/formTemplate/tableView',
                        name: '表单设计模板',
                        component: () =>
                            import ('@/pages/form/formTemplate/tableView'),
                        meta: { title: '表单设计模板', keepAlive: true, icon: 'table' },
                    }]
                }
            ]
        }]
    },
    { //报表管理菜单配置
        path: '/report',
        component: TabsView,
        name: '报表管理',
        meta: { title: '报表管理' },
        children: [{
            path: '/report/ureport',
            name: '报表中心',
            component: PageView,
            meta: { title: '报表中心', keepAlive: true, },
            children: [{
                path: '/report/ureport/',
                name: '报表在线设计',
                component: RouteView,
                meta: { title: '报表在线设计', keepAlive: true, },
                children: [{
                    path: '/report/ureport/pdf',
                    name: '报表预览',
                    component: () =>
                        import ('@/pages/report/ureport/show'),
                    meta: { title: '报表预览', keepAlive: true },
                }]
            }]
        }]
    },
    { //加载页面 topjui版用到
        path: '/login',
        redirect: '/login/loading',
        component: RouteView,
        hidden: false,
        children: [{
                path: 'loading',
                name: 'loading',
                meta: { keepAlive: true, title: '加载', },
                component: () =>
                    import ( /* webpackChunkName: "user" */ '@/pages/login/Loading')
            },

        ]
    },
    { //用户信息单配置
        path: '/user',
        component: CommonLayout,
        hidden: false,
        children: [{
                path: 'login',
                name: 'login',
                meta: { keepAlive: true, title: '登录' },
                component: () =>
                    import ( /* webpackChunkName: "user" */ '@/pages/user/Login')
            },
            {
                path: 'QywxLogin',
                name: 'QywxLogin',
                meta: { keepAlive: true, title: '企业微信登录' },
                component: () =>
                    import ( /* webpackChunkName: "user" */ '@/pages/user/QywxLogin')
            },
            {
                path: 'DingtalkLogin',
                name: 'DingtalkLogin',
                meta: { keepAlive: true, title: '钉钉登录' },
                component: () =>
                    import ( /* webpackChunkName: "user" */ '@/pages/user/DingtalkLogin')
            },
            {
                path: 'ForgetPwd',
                name: 'ForgetPwd',
                meta: { keepAlive: true, title: '忘记密码' },
                component: () =>
                    import ( /* webpackChunkName: "user" */ '@/pages/user/ForgetPwd')
            },
            {
                path: 'register',
                name: 'register',
                meta: { keepAlive: true, title: '注册' },
                component: () =>
                    import ( /* webpackChunkName: "user" */ '@/pages/user/Register')
            },
        ]
    },
    // 钉钉企业微信登录的回调页面
    {
        path: '/user/weChatBack',
        name: 'weChatBack',
        component: () =>
            import ('@/pages/user/weChatBack'),
        meta: { title: '企业微信绑定回调页面', icon: 'sound', hidden: true, keepAlive: true, permission: ['user'] }
    },
    {
        path: '/user/dingTalkBack',
        name: 'dingTalkBack',
        component: () =>
            import ('@/pages/user/dingTalkBack'),
        meta: { title: '钉钉绑定回调页面', icon: 'sound', hidden: true, keepAlive: true, permission: ['user'] }
    },
    {
        path: '/user/qywxLoginBack',
        name: 'qywxLoginBack',
        component: () =>
            import ('@/pages/user/qywxLoginBack'),
        meta: { title: '企业微信登录回调页面', icon: 'sound', hidden: true, keepAlive: true, permission: ['user'] }
    },
    {
        path: '/user/ddLoginBack',
        name: 'ddLoginBack',
        component: () =>
            import ('@/pages/user/ddLoginBack'),
        meta: { title: '钉钉登录回调页面', icon: 'sound', hidden: true, keepAlive: true, permission: ['user'] }
    },
    { //个人信息设置配置
        path: '/account/settings',
        component: TabsView,
        name: '设置',
        meta: { title: '个人页', icon: 'user', keepAlive: true, permission: ['user'] },
        children: [{
            path: '/account/settings/Index',
            name: 'settings',
            component: () =>
                import ('@/pages/account/settings/Index'),
            meta: { title: '账户设置', icon: 'user', hideHeader: true, keepAlive: true, permission: ['user'] },
            hideChildrenInMenu: true,
            children: [{
                    path: '/account/settings/base',
                    name: 'BaseSettings',
                    component: () =>
                        import ('@/pages/account/settings/BaseSetting'),
                    meta: { title: '基本设置', icon: 'form', hidden: true, keepAlive: true, permission: ['user'] }
                },
                {
                    path: '/account/settings/security',
                    name: 'SecuritySettings',
                    component: () =>
                        import ('@/pages/account/settings/Security'),
                    meta: { title: '安全设置', icon: 'file-protect', hidden: true, keepAlive: true, permission: ['user'] }
                },
                {
                    path: '/account/settings/custom',
                    name: 'CustomSettings',
                    component: () =>
                        import ('@/pages/account/settings/Custom'),
                    meta: { title: '个性化设置', icon: 'robot', hidden: true, keepAlive: true, permission: ['user'] }
                },
                {
                    path: '/account/settings/binding',
                    name: 'BindingSettings',
                    component: () =>
                        import ('@/pages/account/settings/Binding'),
                    meta: { title: '账户绑定', icon: 'solution', hidden: true, keepAlive: true, permission: ['user'] }
                },
                {
                    path: '/account/settings/notification',
                    name: 'NotificationSettings',
                    component: () =>
                        import ('@/pages/account/settings/Notification'),
                    meta: { title: '新消息通知', icon: 'sound', hidden: true, keepAlive: true, permission: ['user'] }
                },
            ]
        }]
    },
    // Exception
    {
        path: '/exception',
        name: 'exception',
        component: TabsView,
        redirect: '/exception/403',
        meta: { title: '异常页', icon: 'warning' },
        children: [{
                path: '/exception/403',
                name: 'Exception403',
                component: () =>
                    import ( /* webpackChunkName: "fail" */ '@/pages/exception/403'),
                meta: { title: '403', icon: 'warning' }
            },
            {
                path: '/exception/404',
                name: 'Exception404',
                component: () =>
                    import ( /* webpackChunkName: "fail" */ '@/pages/exception/404'),
                meta: { title: '404', icon: 'warning' }
            },
            {
                path: '/exception/500',
                name: 'Exception500',
                component: () =>
                    import ( /* webpackChunkName: "fail" */ '@/pages/exception/500'),
                meta: { title: '500', icon: 'warning' }
            }
        ]
    },
    { //404页面配置
        path: '/404',
        component: () =>
            import ( /* webpackChunkName: "fail" */ '@/pages/exception/404')
    },
]

// TopJUI版本菜单配置
export const constantRouterMapByTopJUI = [{
        path: '/system/portal',
        component: TabsView,
        meta: { title: '平台门户', icon: 'home' },
        children: [{
            path: '/system/portal/index',
            meta: { title: '平台门户', keepAlive: true, icon: 'home' },
            component: RouteView,
            children: [{
                path: '/system/portal/index',
                meta: { title: '平台门户', keepAlive: true, icon: 'home' },
                component: () =>
                    import ('@/pages/system/portal/index')
            }]
        }]
    },
    { //加载页面 topjui版用到
        path: '/login',
        redirect: '/login/loading',
        component: RouteView,
        hidden: false,
        children: [{
                path: 'loading',
                name: 'loading',
                meta: { keepAlive: true, title: '加载', },
                component: () =>
                    import ( /* webpackChunkName: "user" */ '@/pages/login/Loading')
            },


        ]
    },
    {
        path: '/user',
        component: CommonLayout,
        hidden: false,
        children: [{
            path: 'login',
            name: 'login',
            meta: { keepAlive: true, title: '登录' },
            component: () =>
                import ( /* webpackChunkName: "user" */ '@/pages/user/Login')
        }, ]
    },
    {
        path: '/account/settings',
        component: TabsView,
        name: '设置',
        meta: { title: '个人页', icon: 'user', keepAlive: true, permission: ['user'] },
        children: [{
            path: '/account/settings/Index',
            name: 'settings',
            component: () =>
                import ('@/pages/account/settings/Index'),
            meta: { title: '账户设置', icon: 'user', hideHeader: false, keepAlive: true, permission: ['user'] },
            hideChildrenInMenu: true,
            children: [{
                    path: '/account/settings/base',
                    name: 'BaseSettings',
                    component: () =>
                        import ('@/pages/account/settings/BaseSetting'),
                    meta: { title: '基本设置', icon: 'form', hideHeader: false, keepAlive: true, permission: ['user'] }
                },
                {
                    path: '/account/settings/security',
                    name: 'SecuritySettings',
                    component: () =>
                        import ('@/pages/account/settings/Security'),
                    meta: { title: '安全设置', icon: 'file-protect', hideHeader: true, keepAlive: true, permission: ['user'] }
                },
                {
                    path: '/account/settings/custom',
                    name: 'CustomSettings',
                    component: () =>
                        import ('@/pages/account/settings/Custom'),
                    meta: { title: '个性化设置', icon: 'robot', hideHeader: true, keepAlive: true, permission: ['user'] }
                },
                {
                    path: '/account/settings/binding',
                    name: 'BindingSettings',
                    component: () =>
                        import ('@/pages/account/settings/Binding'),
                    meta: { title: '账户绑定', icon: 'solution', hideHeader: true, keepAlive: true, permission: ['user'] }
                },
                {
                    path: '/account/settings/notification',
                    name: 'NotificationSettings',
                    component: () =>
                        import ('@/pages/account/settings/Notification'),
                    meta: { title: '新消息通知', icon: 'sound', hideHeader: true, keepAlive: true, permission: ['user'] }
                }
            ]
        }]
    },
    {
        path: '/404',
        component: () =>
            import ( /* webpackChunkName: "fail" */ '@/pages/exception/404')
    }
]