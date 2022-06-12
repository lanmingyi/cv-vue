/*** 
 * @Description: 基本存储变量
 * @Author:
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-15 10:47:08
 * @LastEditors:
 * @FilePath:
 */
import Vue from 'vue'
import store from '@/store'
import storage from 'vue-ls'
const options = {
    namespace: 'vuejs__',
    name: 'ls',
    storage: 'local',
}

Vue.use(storage, options)
import {
    ACCESS_TOKEN,
    DEFAULT_COLOR,
    DEFAULT_THEME,
    DEFAULT_LAYOUT_MODE,
    DEFAULT_COLOR_WEAK,
    SIDEBAR_TYPE,
    DEFAULT_FIXED_HEADER,
    DEFAULT_FIXED_HEADER_HIDDEN,
    DEFAULT_FIXED_SIDEMENU,
    DEFAULT_CONTENT_WIDTH_TYPE,
    DEFAULT_MULTI_TAB
} from '@/store/mutation-types'
import config from '@/config/default/setting.config'
import { printANSI } from '@/utils/screenLog'

export default function Initializer() {
    printANSI() // 请自行移除该行.  please remove this line
    console.log(`API_URL: ${process.env.VUE_APP_API_BASE_URL}`)
    store.commit('SET_SIDEBAR_TYPE', Vue.ls.get(SIDEBAR_TYPE, true))
    store.commit('TOGGLE_THEME', Vue.ls.get(DEFAULT_THEME, config.navTheme))
    store.commit('TOGGLE_LAYOUT_MODE', Vue.ls.get(DEFAULT_LAYOUT_MODE, config.layout))
    store.commit('TOGGLE_FIXED_HEADER', Vue.ls.get(DEFAULT_FIXED_HEADER, config.fixedHeader))
    store.commit('TOGGLE_FIXED_SIDERBAR', Vue.ls.get(DEFAULT_FIXED_SIDEMENU, config.fixSiderbar))
    store.commit('TOGGLE_CONTENT_WIDTH', Vue.ls.get(DEFAULT_CONTENT_WIDTH_TYPE, config.contentWidth))
    store.commit('TOGGLE_FIXED_HEADER_HIDDEN', Vue.ls.get(DEFAULT_FIXED_HEADER_HIDDEN, config.autoHideHeader))
    store.commit('TOGGLE_WEAK', Vue.ls.get(DEFAULT_COLOR_WEAK, config.colorWeak))
    store.commit('TOGGLE_COLOR', Vue.ls.get(DEFAULT_COLOR, config.primaryColor))
    store.commit('TOGGLE_MULTI_TAB', Vue.ls.get(DEFAULT_MULTI_TAB, config.multiPage))
    store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))
        // last step
}