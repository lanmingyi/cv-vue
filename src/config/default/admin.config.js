/*** 
 * @Description: admin 配置
 * @Author:
 * @Date: 2021-01-18 15:17:27
 * @LastEditTime: 2021-05-21 14:51:48
 * @LastEditors:
 * @FilePath:
 */

const ADMIN = {
  palettes: ['#f5222d', '#fa541c', '#fadb14', '#3eaf7c', '#13c2c2', '#1890ff', '#722ed1', '#eb2f96'],
  animates: require('./animate.config').preset,
  theme: {
    mode: {
      DARK: 'dark',
      LIGHT: 'light',
      NIGHT: 'night'
    }
  },
  crumbs:false,
  layout: {
    SIDE: 'side',
    HEAD: 'head'
  }
}

module.exports = ADMIN
