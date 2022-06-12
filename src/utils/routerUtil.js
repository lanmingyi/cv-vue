import {mergeI18nFromRoutes} from '@/utils/i18n'
//应用配置
let appOptions = {
  router: undefined,
  i18n: undefined,
  store: undefined
}

/**
 * 设置应用配置
 * @param options
 */
function setAppOptions(options) {
  const {router, store, i18n} = options
  appOptions.router = router
  appOptions.store = store
  appOptions.i18n = i18n
}

/**
 * 从路由 path 解析 i18n key
 * @param path
 * @returns {*}
 */
function getI18nKey(path) {
  const keys = path.split('/').filter(item => !item.startsWith(':') && item != '')
  keys.push('name')
  return keys.join('.')
}
/**
 * 路由过滤匹配
 * @param path
 * @returns {*}
 */
function getFilterRouter(options) {
  // console.log(options)
}
/* 加载导航守卫
 * @param guards
 * @param options
 */
function loadGuards(guards, options) {
	const { beforeEach, afterEach } = guards
	const { router } = options
	beforeEach.forEach(guard => {
		if (guard && typeof guard === 'function') {
			router.beforeEach((to, from, next) => guard(to, from, next, options))
		}
	})
	afterEach.forEach(guard => {
		if (guard && typeof guard === 'function') {
			router.afterEach((to, from) => guard(to, from, options))
		}
	})
}

export { getI18nKey, loadGuards, getFilterRouter,setAppOptions }
