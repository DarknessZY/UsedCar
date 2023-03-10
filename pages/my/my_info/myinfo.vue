<template>
	<view>
		<view class="UCenter-bg" catchtap='toMy_detail'>
			<image :src="touxiangimg" class="png"></image>
			<view class="text-xl">
			</view>
			<view class="margin-top-sm">
				<text style="color: #ff0000;">{{nickName}}</text>
			</view>
		</view>
		<!-- 用户详细 -->
		<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
			<view class="cu-item arrow">
				<view class="content" @click="gouserphone">
					<text class="cuIcon-mobile text-blue"></text>
					<text class="text-grey">绑定手机</text>
				</view>
			</view>
			<view class="cu-item arrow">
				<view class="content" @click="toIssue_page">
					<text class="cuIcon-moneybagfill text-red"></text>
					<text class="text-grey">我的发布</text>
				</view>
			</view>

			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" url='/pages/my/my_sale/my_sale'>
					<text class="cuIcon-titles text-green"></text>
					<text class="text-grey">我卖的车</text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" url="/pages/my/my_buy/my_buy">
					<text class="cuIcon-formfill text-green"></text>
					<text class="text-grey">我买的车</text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<view class="content" bindtap="toCollect" @click="mycollect">
					<text class="cuIcon-appreciatefill text-red"></text>
					<text class="text-grey">我的收藏</text>
				</view>
			</view>

			<view class="cu-item arrow content">
				<button class='cu-btn content' @click="toadress">
					<text class="cuIcon-creativefill text-orange"></text>
					<text class="text-grey">交易地址</text>
				</button>
			</view>
			<view class="cu-item arrow">
				<button class='cu-btn content' bindtap='toChat' open-type="contact">
					<text class="cuIcon-evaluate_fill text-orange"></text>
					<text class="text-grey">客服中心</text>
				</button>
			</view>
			<view class="cu-item arrow content">
				<button class='cu-btn content' @click="quitlogin">
					<text class=".cuIcon-group_fill text-red"></text>
					<text class="text-grey">退出登录</text>
				</button>
			</view>
		</view>
		<view class="cu-tabbar-height"></view>
		<!-- 设置详细end -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				touxiangimg: '',
				nickName: '',
			}
		},
		methods: {
			//获取个人信息
			getuserinfo() {
				this.touxiangimg = wx.getStorageSync('userInfo').avatarUrl
				this.nickName = wx.getStorageSync('userInfo').nickName
			},
			//去绑定手机页面
			gouserphone() {
				uni.navigateTo({
					url: '/pages/my/my_phone/my_phone'
				})
			},
			//去地址管理页面
			toadress() {
				console.log(1)
				uni.navigateTo({
					url: '/pages/my/my_address/my_address'
				})
			},
			//退出登录
			quitlogin() {

			},

			// 我的发布跳转
			toIssue_page: function() {
				uni.navigateTo({
					url: "/pages/my/my_issue/my_issue"
				})
			},
			//我的收藏跳转
			mycollect() {
				uni.navigateTo({
					url: "/pages/my/my_collect/my_collect"
				})
			},
			//管理员给的消息已看不再提示
			nomessage(url) {
				var _this = this
				uni.request({
					url: _this.$url + '/yao/delmessage',
					method: 'POST',
					data: {
						openid: wx.getStorageSync('openid')
					},
					success(res) {
						if (res.data.status == 0) {

							uni.showToast({
								title: '消息已阅',
								success() {
									setTimeout(function() {
										uni.navigateTo({
											url: url
										})
									}, 1000)
								}
							})
						}
					}
				})
			},
			//判断管理员给了消息提示没
			getmessage() {
				var _this = this
				uni.request({ 
					url: _this.$url + '/yao/getmessage',
					method: 'GET',
					data: {
						openid: wx.getStorageSync('openid')
					},
					success(res) {
						if (res.data.message.length != 0) {
							uni.showModal({
								title: "消息提示", // 提示的标题
								content: "您有订单还未完成请及时完成！", // 提示的内容
								success: function(result) {
									if (result.confirm) {
										if (res.data.message[0].isidentity == 0) {
											_this.nomessage('/pages/my/my_sale/my_sale')

										} else {
											_this.nomessage('/pages/my/my_buy/my_buy')
										}
									}
								},
							})
						}
					}
				})
			}
		},
		mounted() {
			this.getuserinfo()
			this.getmessage()
		}
	}
</script>

<style scoped="scoped">
	/* pages/my/my.wxss */
	/* 用户信息 组件*/


	.UCenter-bg {
		background-size: cover;
		height: 450rpx;
		display: flex;
		justify-content: center;
		padding-top: 40rpx;
		overflow: hidden;
		position: relative;
		flex-direction: column;
		align-items: center;
		color: #fff;
		font-weight: 300;
		text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
	}

	.UCenter-bg text {
		opacity: 0.8;
	}

	.UCenter-bg image {
		width: 200rpx;
		height: 200rpx;
	}

	.UCenter-bg .gif-wave {
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	map,
	.mapBox {
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	map,
	.mapBox {
		width: 750rpx;
		height: 300rpx;
	}

	.text-xl image {
		height: 100rpx;
		width: 100rpx;
	}

	.png {

		border-radius: 100%;
	}


	.num {
		direction: rtl;
		margin-left: 58%;
		font-size: 25rpx;
	}
</style>
