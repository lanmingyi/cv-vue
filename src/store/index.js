import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'

// default router permission control
import permission from './modules/permission'
import setting from './modules/setting'
import other from './modules/other'
// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        app,
        user,
        permission,
        setting,
        other
    },
    state: {
			loadding: false
    },
    mutations: {

    },
    actions: {

    },
    getters
})