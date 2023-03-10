import Vue from 'vue'
import App from './App'
import host from 'config.js'
import {router,RouterMount} from './router/router.js' //路由组件(第三方库)
Vue.use(router)
import store from './store'
Vue.prototype.$store = store//把vuex定义为全局组件

Vue.config.productionTip = false//这个是干掉警告语句的
Vue.prototype.$url = host
 //路由拦截(方法2)
// Vue.prototype.$href=function(url){
// 	if(!store.state.hasLogin){
// 		console.log(1)
// 		uni.switchTab({
// 			url:'/pages/my/my'
// 		})
// 	}else{
// 		 uni.switchTab({
// 		 	url:url
// 		 })
// 	}
// }

App.mpType = 'app' 

const app = new Vue({
    ...App
})
RouterMount(app,router,'#app')//路由
app.$mount()

