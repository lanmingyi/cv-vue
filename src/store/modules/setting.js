import config from '@/config'
import { ADMIN } from '@/config/default'
import { formatFullPath } from '@/utils/i18n'
import { filterMenu } from '@/utils/authority-utils'
import { getLocalSetting } from '@/utils/themeUtil'

const localSetting = getLocalSetting(true)

export default {
    namespaced: true,
    state: {
        open: true,
        isMobile: false,
        animates: ADMIN.animates,
        palettes: ADMIN.palettes,
        crumbs: ADMIN.crumbs,
        pageMinHeight: 0,
        activatedFirst: undefined,
        ...config,
        ...localSetting
    },
    getters: {
        menuData(state, getters, rootState) {
            if (state.filterMenu) {
                const { permissions, roles } = rootState
                state.menuData = rootState.permission.addRouters
                filterMenu(state.menuData, permissions, roles)
            }
            return state.menuData
        },
        firstMenu(state, getters, rootState) {
            const { menuData } = rootState.permission
            if (menuData.length > 0 && !menuData[0].fullPath) {
                formatFullPath(menuData)
            }
            return menuData.map(item => {
                const menuItem = {...item }
                delete menuItem.children
                return menuItem
            })
        },
        subMenu(state) {
            const { menuData, activatedFirst } = state
            if (!menuData[0].fullPath) {
                formatFullPath(menuData)
            }
            const current = menuData.find(menu => menu.fullPath === activatedFirst)
            return current && current.children ? current.children : []
        }
    },
    mutations: {
        setDevice(state, isMobile) {
            state.isMobile = isMobile
        },
        setTheme(state, theme) {
            state.theme = theme
        },
        setLayout(state, layout) {
            state.layout = layout
        },
        setMultiPage(state, multiPage) {
            state.multiPage = multiPage
        },
        setAnimate(state, animate) {
            state.animate = animate
        },
        setWeekMode(state, weekMode) {
            state.weekMode = weekMode
        },
        setFixedHeader(state, fixedHeader) {
            state.fixedHeader = fixedHeader
        },
        setFixedSideBar(state, fixedSideBar) {
            state.fixedSideBar = fixedSideBar
        },
        setLang(state, lang) {
            state.lang = lang
        },
        setHideSetting(state, hideSetting) {
            state.hideSetting = hideSetting
        },
        correctPageMinHeight(state, minHeight) {
            state.pageMinHeight += minHeight
        },
        setMenuData(state, menuData) {
            state.menuData = menuData
        },
        setAsyncRoutes(state, asyncRoutes) {
            state.asyncRoutes = asyncRoutes
        },
        setPageWidth(state, pageWidth) {
            state.pageWidth = pageWidth
        },
        setActivatedFirst(state, activatedFirst) {
            state.activatedFirst = activatedFirst
        },
        setFixedTabs(state, fixedTabs) {
            state.fixedTabs = fixedTabs
        },
        setCrumbs(state, crumbs) {
            state.crumbs = crumbs
        },
        TOGGLE_OPEN(state) {
            state.open = !state.open;
        },
    }
}