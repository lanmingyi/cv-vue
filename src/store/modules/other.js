import Vue from 'vue'

const other = {
  state: {
    wpsUrl:''
  },
  mutations: {
    SET_WPSURL: (state, url) => {
		console.log(url)
      state.wpsUrl = url
    },
  },
  actions: {
	  
  }
}

export default other
