import Vue from 'vue'
import { login, getInfo, logout, getAllConfigData, enterpriseWeChatLogin, loginByPhoneNumber, enterpriseDingtalkLogin } from '@/services/user.js'
import { postAxiosRequest } from '@/services/common';
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { setDocumentTitle, setDocumentIco } from '@/utils/domUtil'
import { delCookie, setCookie } from '@/utils/TopVUI.js'
const user = {
    state: {
        token: '',
        name: '',
        welcome: '',
        avatar: '',
        roles: [],
        info: {},
        configData: []
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_INFO: (state, info) => {
            state.info = info
        },
        SET_CONFIG_DATA: (state, configData) => {
            state.configData = configData
        }
    },
    actions: {
        // 登录
        Login({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                login(userInfo).then(response => {
                    const result = response
                    if (result.statusCode === 200) {
                        const token = result.message.substring(7)
                        Vue.ls.set(ACCESS_TOKEN, token)
                        commit('SET_TOKEN', token)
                            // localStorage.setItem('token',token, 60 * 60 * 1000)
                        resolve()
                    } else {
                        reject(result)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 设置token
        SetToken({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                if (userInfo) {
                    console.log(userInfo)
                    Vue.ls.set(ACCESS_TOKEN, userInfo)
                    commit('SET_TOKEN', userInfo)
                    resolve()
                } else {
                    reject(result)
                }
            })
        },
        // 获取页面按钮授权数据
        getUserInForAndButtonPermissions({ commit }, token) {
            return new Promise((resolve, reject) => {
                let url = ''
                let ajaxData = { type: 'dev' }
                if (process.env.VUE_APP_TYPE === 'mis_vue') {
                    url = '/system/getUserInForAndButtonPermissions'
                } else {
                    url = '/system/menu/getAllVueButtonData'
                    if (process.env.NODE_ENV === 'production') { //判断取用那个菜单，主要针对于topjui版本的流程和表单
                        ajaxData = { type: 'production' }
                    }
                }
                getInfo(url, ajaxData).then(response => {
                    if (response.role && response.role.permissions.length > 0) {
                        const role = response.role
                        role.permissions = response.role.permissions
                        role.permissions.map(per => {
                            if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                                const action = per.actionEntitySet.map(action => { return action.action })
                                per.actionList = action
                            }
                        })
                        role.permissionList = role.permissions.map(permission => { return permission.permissionId })
                        commit('SET_ROLES', response.role)
                            // commit('SET_INFO', response)
                    } else {
                        reject(new Error('getInfo: roles must be a non-null array !'))
                    }
                    // commit('SET_NAME', { name: response.name, welcome: welcome() })
                    // commit('SET_AVATAR', response.avatar)
                    // commit('SET_INFO', response)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
                postAxiosRequest('/mdata/user/getCurrentUserInfor').then(res => {
                    commit('SET_NAME', res.userName)
                    commit('SET_AVATAR', res.avatar)
                    commit('SET_INFO', res)
                })
            })
        },
        // 获取用户信息
        SetUserInfo({ commit }) {
            return new Promise((resolve, reject) => {
                postAxiosRequest('/mdata/user/getCurrentUserInfor').then(res => {
                    commit('SET_NAME', res.userName)
                    commit('SET_AVATAR', res.avatar)
                    commit('SET_INFO', res)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 获取系统配置信息
        GetAllConfigData({ commit }, token) {
            return new Promise((resolve, reject) => {
                getAllConfigData(token).then(response => {
                    const result = response
                    if (result.statusCode != 300) {
                        if (!token) {
                            // console.log(result, result.findIndex(item => item.code === 'systemName'));
                            setDocumentTitle(result[result.findIndex(item => item.code === 'systemName')].value);
                        }
                        setDocumentIco(result[result.findIndex(item => item.code === 'browserIcon')].value);
                        commit('SET_CONFIG_DATA', result);
                        resolve()
                    } else {
                        reject(result)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 登出
        Logout({ commit, state }) {
            return new Promise((resolve) => {
                logout(state.token).then(() => {
                    resolve()
                }).catch(() => {
                    resolve()
                }).finally(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    localStorage.removeItem('MIS_ACCESS_TOKEN')
                    Vue.ls.remove(ACCESS_TOKEN)
                    delCookie('token')
                })
            })
        },
        // token过期登出
        LogoutByErrorCode({ commit, state }) {
            return new Promise((resolve) => {
                commit('SET_TOKEN', '')
                commit('SET_ROLES', [])
                localStorage.removeItem('MIS_ACCESS_TOKEN')
                Vue.ls.remove(ACCESS_TOKEN)
                delCookie('token')
                resolve()
            })
        },
        // 第三方登录 企业weiixn
        EnterpriseWeChatLogin({ commit }, param) {
            return new Promise((resolve, reject) => {
                enterpriseWeChatLogin(param).then(response => {
                    const result = response
                    if (result.statusCode === 200) {
                        const token = result.token
                        Vue.ls.set(ACCESS_TOKEN, token)
                        commit('SET_TOKEN', token)
                        resolve()
                    } else {
                        reject(result)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 第三方登录  钉钉
        EnterpriseDingtalkLogin({ commit }, param) {
            return new Promise((resolve, reject) => {
                enterpriseDingtalkLogin(param).then(response => {
                    const result = response
                    if (result.statusCode === 200) {
                        const token = result.token
                        Vue.ls.set(ACCESS_TOKEN, token)
                        commit('SET_TOKEN', token)
                        resolve()
                    } else {
                        reject(result)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 手机号登录
        LoginByPhoneNumber({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                loginByPhoneNumber(userInfo).then(response => {
                    const result = response
                    if (result.statusCode === 200) {
                        const token = result.message.substring(7)
                        Vue.ls.set(ACCESS_TOKEN, token)
                        commit('SET_TOKEN', token)
                            // localStorage.setItem('token',token, 60 * 60 * 1000)
                        resolve()
                    } else {
                        reject(result)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },

    }
}

export default user