/*** 
 * @Description: 系统自定义配置，参考 ./default/setting.config.js，需要自定义的属性在这里配置即可 
 * @Author:
 * @Date: 2021-01-18 15:17:27
 * @LastEditTime: 2021-07-21 18:06:56
 * @LastEditors:
 * @FilePath:
 */
module.exports = {
    theme: {
        color: '#1890ff',
        mode: 'dark',
        success: '#52c41a', //成功色
        warning: '#faad14', //警告色
        error: '#f5222f', //错误色
    },
    multiPage: true,
    asyncRoutes: true,
    animate: {
        name: 'slide',
        direction: 'left'
    }
}