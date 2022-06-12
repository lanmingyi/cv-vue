/*** 
 * @Description: 
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-08-25 09:30:44
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\index.js
 */
import TModal from './custom/DragerModal/TModal'
import JModal from './custom/DragerModal/JModal'
import DragerModal from './custom/DragerModal/DragerModal'
import TDate from './custom/TDate'
import TEdataGrid from './custom/TEdataGrid'
import TDrawer from './custom/TDrawer'
import fontPicker from './font/fontPicker'
import Ellipsis from '@/components/antd/Ellipsis'
import STable from '@/components/table'
import ToolBar from './custom/ToolBar'
import IconFonts from './font/iconFont.vue'
import TEllipsis from './custom/TEllipsis.vue'
import TreeGrid from './custom/TreeGrid.vue'
import TreeSelect from './custom/TreeSelect.vue'
import ZTree from './custom/ZTree.vue'
import TImageUpload from './custom/TImageUpload.vue'
import webupload from './custom/webupload.vue'
import Editor from './custom/Editor/index.vue'
export default {
    install(Vue) {
        Vue.component(DragerModal.name, DragerModal)
        Vue.component(TModal.name, TModal)
        Vue.component(JModal.name, JModal)
        Vue.component(TDate.name, TDate)
        Vue.component(TEdataGrid.name, TEdataGrid)
        Vue.component(TDrawer.name, TDrawer)
        Vue.component(fontPicker.name, fontPicker)
        Vue.component('Ellipsis')
        Vue.component('STable')
        Vue.component(ToolBar.name, ToolBar)
        Vue.component(IconFonts.name, IconFonts)
        Vue.component(TEllipsis.name, TEllipsis)
        Vue.component(TreeGrid.name, TreeGrid)
        Vue.component(ZTree.name, ZTree)
        Vue.component(TImageUpload.name, TImageUpload)
        Vue.component(webupload.name, webupload)
        Vue.component(Editor.name, Editor)
    }
}