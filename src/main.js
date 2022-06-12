/*** 
 * @Description: 应用入口js
 * @Author:
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-08 14:19:42
 * @LastEditors:
 * @FilePath:
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './theme/index.less'
import Antd from 'ant-design-vue'
import Viser from 'viser-vue' //图表
// import '@/mock'
import store from './store'
import 'animate.css/source/animate.css'
import Plugins from '@/plugins'
import { initI18n } from '@/utils/i18n'
const i18n = initI18n('CN', 'US')
import bootstrap from './core/bootstrap'
import routerMix from './core/routerMix'
import './permission'
import '@/assets/style/TopVUI.less' // TopVUI css
import '@/assets/style/common.css' // 公共 css

import { ACCESS_TOKEN } from '@/store/mutation-types'
routerMix({ router, store, i18n, message: Vue.prototype.$message }) //混合菜单过滤
import '@/utils/drag' //弹窗可拖拽js
import Print from 'vue-print-nb' //页面打印插件
Vue.use(Print);
// 按钮权限控制
import './core/directives/action'
// 字体库图标
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// 全局引入请求
import { postAxiosRequest, getAxiosRequest, getCustomAxiosRequest } from '@/services/common';
Vue.prototype.$get = getAxiosRequest; //get请求
Vue.prototype.$post = postAxiosRequest; //post请求
Vue.prototype.$axios = getCustomAxiosRequest; //自定义请求
// Vue.component('tinymce', Tinymce) 富文本
// 自定义表单设计
import KFormDesign from '@/components/TopVUI/k-form-design/packages'
import '@/assets/style/form-design.less'
Vue.use(KFormDesign)
    // 分屏布局
import splitPane from 'vue-splitpane'
Vue.component('split-pane', splitPane)

// 组件全局注册
import topVUIComponents from '@/components/TopVUI'
Vue.use(topVUIComponents)

// 粘贴
import clipboard from 'clipboard';
Vue.prototype.clipboard = clipboard;

// 省市区级联
import 'vue-area-linkage/dist/index.css'; // v2 or higher
import VueAreaLinkage from 'vue-area-linkage';
Vue.use(VueAreaLinkage)

// 生成pdf
import htmlToPdf from "@/plugins/htmlToPdf"
Vue.use(htmlToPdf)

// 手写签名
import vueEsign from 'vue-esign'
Vue.use(vueEsign)

// mock数据
import { mockXHR } from '../mock';
if (process.env.NODE_ENV === 'production') {
    mockXHR();
}

Vue.config.productionTip = false
Vue.use(Antd)
    // Vue.use(window['vue-cropper'].default)
import VueCropper from 'vue-cropper'
Vue.use(VueCropper)
Vue.use(Viser)
Vue.use(Plugins)

import loading from '@/components/loading/loading'; // 引入loading
Vue.use(loading); // 全局使用loading

// wps在线编辑
import * as WPS from '@/plugins/jwps.es6.js'
Vue.prototype.wps = WPS;
new Vue({
    router,
    store,
    i18n,
    created: bootstrap,
    render: h => h(App),
}).$mount('#app')