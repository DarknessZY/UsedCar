<template>
	<view>
		<view v-if="addressList.length==0" style="display: flex;justify-content: center;">
			<text style="font-size: 35rpx;">暂无地址信息</text>
		</view>
		<view class="address-item" v-for="(item,index) in addressList" :key="index">


			<view>
				<text class="address-item-name">{{item.userName}}</text>
				<text>{{item.phone}}</text>
			</view>
			<view>{{item.address}}<text v-if="item.addressdetail!=null">&nbsp;&nbsp;&nbsp;{{item.addressdetail}}</text></view>
			<!-- 对地址的操作 -->
			<view class="address-item-menu">
				<view class="address-item-left">
					
				</view>
				<view class="address-item-right">
					<view v-if="item.isdefault==0">
						<button class="none-btn btn-default"
							@tap="setAddressDefault(item.addresscarid)">默认使用该地址</button>
					</view>
					<button class="none-btn btn-del " @tap="delAddressinfo(item.addresscarid,index)">删除</button>
				</view>
			</view>
		</view>

		<!-- 添加 -->
		<view class="button-group">
			<button style="background-color: red;" @tap="wxAddress">
				<text class="cuIcon-add" size="35" /> 新建地址
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressList: [], //地址
				defaultaddresscarid: '', //设为默认地址的addresscarid
				issue: false, //是否从发布页面来的
			}
		},
		methods: {
			//加载该用户的地址
			showaddress() {
				var _this = this;
				uni.request({
					url: _this.$url + '/yao/getaddresscar',
					method: 'GET',
					data: {
						openid: uni.getStorageSync('openid')
					},
					success(res) {
						console.log(res)
						_this.addressList = res.data.addresslist
						for (var i = 0; i < res.data.addresslist.length; i++) {
							if (res.data.addresslist[i].isdefault == 1) {
								_this.defaultaddresscarid = res.data.addresslist[i].addresscarid
							}
						}
					}
				})
			},
			//通过微信添加地址
			wxAddress() {
				var _this = this;
				wx.chooseAddress({
					success: function(res) {
						var address = {
							userName: res.userName,
							phone: res.telNumber,
							address: res.provinceName + res.cityName + res.countyName,
							addressdetail: res.detailInfo,
							openid:uni.getStorageSync('openid')
						};
						// console.log(address)
						uni.request({
							url: _this.$url + '/yao/addresscar',
							method: 'POST',
							data: {
								address
							},
							success(res) {

								uni.showToast({
									title: res.data.message, // 提示的内容
									icon: "success", // 图标，默认success
									duration: 1500,
									success() {
										getCurrentPages()[getCurrentPages().length - 1].onLoad()
									}
								})

							}
						})
					},
				})
			},
			//设置默认地址并使用该地址
			setAddressDefault(addresscarid) {
				var _this = this
				uni.request({
					url: _this.$url + '/yao/addressdefault',
					method: 'POST',
					data: {
						addresscarid: addresscarid,
						isdefault: 1,
						defaultaddresscarid: _this.defaultaddresscarid,
						openid:uni.getStorageSync('openid')
					},
					success(res) {
						//更改默认地址完成后提示
						uni.showToast({
							title: '使用该地址', // 提示的内容
							icon: "success", // 图标，默认success
							duration: 1500,
							success() {
								//页面重加载
								// getCurrentPages()[getCurrentPages().length - 1].onLoad()
								if (_this.issue) {
									setTimeout(()=>{
										uni.navigateBack({
											delta:1
										})				
										const pages = getCurrentPages(); //获取页面栈
										const beforePage = pages[pages.length - 2]; //前一个页面
										beforePage.$vm.getaddress();   //前一个页面方法
									},1000)
									
								}else{
									_this.showaddress()
								}
									
							}
						})
					}
				})
			},
			//删除地址
			delAddressinfo(addresscarid, index) {
				console.log(addresscarid)
				var _this = this
				uni.request({
					url: _this.$url + '/yao/deladdress',
					method: 'POST',
					data: {
						addresscarid: addresscarid,
					},
					success(res) {
						uni.showToast({
							title: res.data.message, // 提示的内容
							icon: "success", // 图标，默认success
							duration: 1500,
							success() {
								//前端删除
								_this.addressList.splice(index, 1)
							}
						})
					}
				})
			}
		},
		onLoad(option) {
			
			this.showaddress()
			if (option.issue!=undefined) {
				this.issue = option.issue
			}
		},
		mounted() {
			
		}
	}
</script>

<style>
	.button-group {
		display: flex;
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		position: fixed;
		left: 0;
		bottom: 0;
	}

	.button-group button {
		display: inline-block;
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #1aad16;
		color: #fff;
		white-space: nowrap;
		text-align: center;
		font-size: 30rpx;
		border: none;
		outline: none;
		border-style: none;
		border-radius: 0;
		cursor: pointer;
	}

	.button-group button::after {
		border: none;
	}

	.address-item {
		background: #fff;
		padding: 30rpx;
		color: #555;
		margin-bottom: 20rpx;
	}

	.address-item view {
		height: 50rpx;
		line-height: 50rpx;
	}

	.address-item-name {
		font-weight: bold;
		padding-right: 10rpx;
	}

	.address-item-menu {
		display: flex;
		height: 60rpx;
		line-height: 60rpx;
	}

	.address-item-menu button {
		color: #333;
		font-size: 25rpx;
		padding: 0;
		margin: 0;
	}

	.address-item-left {
		flex: 1;
	}

	.address-item-left button {
		float: left;
	}

	.address-item-right {
		display: flex;
	}

	.address-item-right .btn-del {
		color: red;
		margin-left: 30rpx;
	}
</style>
