/*** 
 * @Description: 
 * @Author: 黄婷
 * @Date: 2021-08-30 17:46:23
 * @LastEditTime: 2021-08-30 18:03:31
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\utils\screenLog.js
 */
/* eslint-disable */
export const printANSI = () => {
    // console.clear()
    // console.log('[Antd Pro] created()')
    // ASCII - ANSI Shadow
    let text = `
  ███╗      ╔███╗████████╗ ╔███████╗██████╗  ██████╗  ██████╗ ████████╗
  ████╗    ╔████║╚══██╔══╝╔███═════╝██╔══██╗██╔═══██╗██╔═══██╗╚══██╔══╝
  ██╔██╗  ╔██╗██║   ██║   ╚═██████╗ █████╔═╝██║   ██║██║   ██║   ██║
  ██║╚██╗╔██╝║██║   ██║        ╔███╗██║  ██╗██║   ██║██║   ██║   ██║
  ██║ ╚████╝ ║██║████████╗╔███████═╝██████╔╝╚██████╔╝╚██████╔╝   ██║
  ╚═╝  ╚══╝  ╚══╝╚═══════╝╚══════╝  ╚═════╝  ╚═════╝  ╚═════╝    ╚═╝
\t\t\t\t\tBuild date: ${BUILD_DATE}`
    console.log(`%c${text}`, 'color: #fc4d50')
    console.log('%c感谢使用 人工智能系统!', 'color: #000; font-size: 14px;    font-family: Hiragino Sans GB,Microsoft YaHei,\\\\5FAE\\8F6F\\96C5\\9ED1,Droid Sans Fallback,Source Sans,Wenquanyi Micro Hei,WenQuanYi Micro Hei Mono,WenQuanYi Zen Hei,Apple LiGothic Medium,SimHei,ST Heiti,WenQuanYi Zen Hei Sharp,sans-serif;')
    console.log('%cThanks for using AI rapid development platform!', 'color: #fff; font-size: 14px; font-weight: 300; text-shadow:#000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0;')
}