// router.js
import {
	RouterMount,
	createRouter
} from 'uni-simple-router';
import store from '../store'
const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,
	routes: [...ROUTES]
});
//全局路由前置守卫
router.beforeEach((to, from, next) => {
	if (!store.state.hasLogin) {
		if (to.path != '/pages/my/my') {

			uni.showToast({
				title: '请先登录!',
				image: '/static/错误.png',
				success() {
					setTimeout(function() {
						next('/pages/my/my')
					}, 1000);
				}
			})

		}
		next();
	} else {
		next();
	}

});
export {
	router,
	RouterMount
}
