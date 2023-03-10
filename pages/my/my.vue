<template>
	<view>
		<myinfo v-if="islogin"></myinfo>
		<mylogin @childFn='parentFn' v-if="nologin"></mylogin>
	</view>
</template>

<script>
	import mylogin from './my_info/my-login.vue'
	import myinfo from './my_info/myinfo.vue'
	export default {
		components: {
			myinfo,
			mylogin
		},
		data() {
			return {
				islogin: false,
				nologin: true, //用于判断是否登录
			}
		},
		methods: {
			parentFn(msg) {
				console.log(msg)
				this.islogin = msg,
					this.nologin = false
				this.$store.commit('setHasLogin', true);
			},
		},
		onLoad() {
			// console.log(this.$Route)
		},
		onTabItemTap(e) {
			// console.log(e) 
			//  this.$href(e.pagePath)
			 this.$Router.forceGuardEach();
		}
	}
</script>

<style scoped='scoped'>
</style>
