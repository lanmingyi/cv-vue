/*** 
 * @Description: 
 * @Author: 黄婷
 * @Date: 2021-07-06 15:42:22
 * @LastEditTime: 2021-07-06 15:42:32
 * @LastEditors: 黄婷
 * @FilePath: \misboot-cloud-vue\src\utils\pluginsConfig.js
 */
const CDN = 'https://lib.baomitu.com/' // CDN Homepage: https://cdn.baomitu.com/
const publicPath = process.env.BASE_URL

function splicingPluginUrl(PluginName, version, fileName) {
    return `${CDN}${PluginName}/${version}/${fileName}`
}

export default {
    beautifierUrl: splicingPluginUrl('js-beautify', '1.13.5', 'beautifier.min.js'),
    // monacoEditorUrl: splicingPluginUrl('monaco-editor', '0.19.3', 'min/vs'), // 使用 monaco-editor CDN 链接
    monacoEditorUrl: `${publicPath}libs/monaco-editor/vs`, // 使用 monaco-editor 本地代码
}