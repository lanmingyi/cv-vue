/*** 
 * @Description: 响应式媒体查询
 * @Author: lmy
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-09-15 09:38:27
 * @LastEditors: lmy
 * @FilePath:
 */
import enquireJs from 'enquire.js'

export const DEVICE_TYPE = {
    DESKTOP: 'desktop',
    TABLET: 'tablet',
    MOBILE: 'mobile'
}

export const deviceEnquire = function(callback) {
    const matchDesktop = {
        match: () => {
            callback && callback(DEVICE_TYPE.DESKTOP)
        }
    }

    const matchLablet = {
        match: () => {
            callback && callback(DEVICE_TYPE.TABLET)
        }
    }

    const matchMobile = {
        match: () => {
            callback && callback(DEVICE_TYPE.MOBILE)
        }
    }

    // screen and (max-width: 1087.99px)
    enquireJs
        .register('screen and (max-width: 576px)', matchMobile)
        .register('screen and (min-width: 576px) and (max-width: 1199px)', matchLablet)
        .register('screen and (min-width: 1200px)', matchDesktop)
}