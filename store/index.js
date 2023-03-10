import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);


const store= new Vuex.Store({
    state: {
        hasLogin: false, // 登录状态
    },
    mutations: {
        setHasLogin(state, value){
            state.hasLogin = value
            console.log(state.hasLogin)
        }
    },
    actions: {},
    getters: {}
})
export default store