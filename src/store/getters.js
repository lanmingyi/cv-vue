/*** 
 * @Description: getters
 * @Author: lmy
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-09-15 09:58:22
 * @LastEditors: lmy
 * @FilePath:
 */
const getters = {
    device: state => state.app.device,
    theme: state => state.app.theme,
    animate: state => state.app.animate,
    palettes: state => state.app.palettes,
    color: state => state.app.color,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    nickname: state => state.user.name,
    welcome: state => state.user.welcome,
    roles: state => state.user.roles,
    userInfo: state => state.user.info,
    addRouters: state => state.permission.addRouters,
    multiTab: state => state.app.multiTab,
    lang: state => state.app.lang,
    configData: state => state.user.configData,
    wpsUrl: state => state.other.wpsUrl,
    isLock: state => state.app.isLock,
    lockPasswd: state => state.app.lockPasswd,
}

export default getters