<template>
	<view class="login-container">
		<!-- 提示登录的图标 -->
		<image src="../../../static/img/m1.png" style="width: 250rpx;height: 250rpx;border-radius: 100%;"></image>
		<!-- 登录按钮 -->
		<button  class="btn-login"  @click="getuserInfo" withCredentials='true'>一键登录</button>
		<!-- 登录提示 -->
		<view class="tips-text">登录后尽享更多权益</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//用户登录的唯一标识
				openid: '',
				isreguser: true, //根据openid判断是否注册
				islogin: true, //子传父,登录成功
			}
		},
		methods: {
			// 获取微信用户的基本信息
			getuserInfo() {
				var _this = this
				uni.getUserProfile({
					desc: '注册',
					success: function(res) {
						console.log(res.userInfo)
						wx.setStorageSync('userInfo',res.userInfo)
						//是否注册
						uni.request({
							url: _this.$url+'/yao/isreguser',
							method: 'POST',
							data: {
								openid: _this.openid
							},
							success(res) {
								
								console.log('是否注册数', res.data.message[0].usernum)
								if (res.data.message[0].usernum > 0) {
									_this.isreguser = true
									_this.$emit('childFn', _this.islogin);
								} else {
									_this.isreguser = false
									// console.log(_this.isreguser)
								}
								
								//如果没有这用户直接注册
								if (_this.isreguser == false) {
									console.log(1)
									let userInfo=wx.getStorageSync('userInfo')
									
									uni.request({
										url: _this.$url+'/yao/reguser',
										method: 'POST',
										data: {
											nickName: userInfo.nickName,
											avatarUrl: userInfo.avatarUrl,
											gender: userInfo.gender,
											openid: _this.openid
										},
										success(res) {
											console.log('注册成功后返回的信息', res)
											_this.isreguser = true
										},
										fail(err) {
											console.log('失败返回的信息', err)
										}
									})
								}
								//结束
							},
						})
						
					},
					fail: function(err) {
						console.log(err)
					}
				})
				


			},
			//去后台得到openid
			gettoken() {
				var _this = this
				uni.login({
					success(res) {
						//获取code
						console.log('login success', res);
						uni.request({
							url: _this.$url+'/yao/gettoken',
							method: 'POST',
							data: {
								code: res.code
							},
							success(result) {
								console.log('登录成功后返回的信息', result.data.data)
								wx.setStorageSync('openid', JSON.parse(result.data.data).openid)
								_this.openid = wx.getStorageSync('openid')

								wx.setStorageSync('session_key', JSON.parse(result.data.data).session_key)
							},
							fail(err) {
								console.log('失败返回的信息', err);
							}
						})
					},
					fail(err) {
						console.log('login error', err);
					}
				})
			}
		},
		mounted() {
			this.gettoken()
		},
	}
</script>

<style lang="scss">
	.login-container {
		// 登录盒子的样式
		height: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #f8f8f8;
		position: relative;
		overflow: hidden;

		// 绘制登录盒子底部的半椭圆造型
		&::after {
			content: ' ';
			display: block;
			position: absolute;
			width: 100%;
			height: 40px;
			left: 0;
			bottom: 0;
			background-color: white;
			border-radius: 100%;
			transform: translateY(50%);
		}

		// 登录按钮的样式
		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #c00000;
		}

		// 按钮下方提示消息的样式
		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>
