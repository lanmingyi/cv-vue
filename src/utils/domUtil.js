import store from '@/store'

/* 
 * 获取权限数据
 */
export function getRoleList(value) {
    const permissions = store.getters.roles.permissions
    if (value && value instanceof Array && value.length > 0) {
        const [permission, action] = value[0].split('.')
        const permissionId = permissions.find((val) => {
            return val.permissionId === permission
        })
        let actions = ''
        if (permissionId && permissionId.actionEntitySet.length != 0) {
            actions = permissionId.actionList.find((val) => {
                return val === action
            })
        }
        if (!permissionId || !actions) {
            return false
        } else {
            return true
        }
    } else {
        throw new Error(`请设置操作权限标签值`)
    }
}

/*
 * 设置浏览器标题
 */
export const setDocumentTitle = function(title) {
    document.title = title
    const ua = navigator.userAgent
        // eslint-disable-next-line
    const regex = /\bMicroMessenger\/([\d\.]+)/
    if (regex.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
        const i = document.createElement('iframe')
        i.src = '/favicon.ico'
        i.style.display = 'none'
        i.onload = function() {
            setTimeout(function() {
                i.remove()
            }, 9)
        }
        document.body.appendChild(i)
    }
}

/* 
 * 设置浏览器图标
 */
export const setDocumentIco = function(icon) {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = icon ? icon : 'public/logo.png';
    document.getElementsByTagName('head')[0].appendChild(link);
}

export const domTitle = '智能运输管理ERP系统'