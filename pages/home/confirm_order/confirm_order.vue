<template>
	<view>
		<!-- 内容 -->
		<view class='pg'>
			<!-- 购买的商品 -->
			<view class='container bg-white'>
				<view class='container-top'>
					<image :src='carimg[0]'> </image>
				</view>

				<view class='container-top_rigth'>
					<view class='container-top_rigth_1'><text>{{carlist[0].title}}</text></view>
					<view class='container-top_rigth_2'>
						<view class='container-top_rigth_2_1'><text
								class='text-price text-red text-xl'>{{carlist[0].money}}</text></view>
						<view class='container-top_rigth_2_2'><text class='text-price'>{{carlist[0].newMoney}}</text>
						</view>
					</view>
				</view>

			</view>

			<!-- 地址 -->

			<view class='container-address bg-white' v-for="(item,index) in carlist" :key='index'>

				<view class='container-address-1'><text>二手车交易地址</text></view>
				<view class='container-address-2'>
					<view class='container-address-2_1'><text>卖家联系方式购买后可查看</text></view>
					<view class='container-address-2_2'><text>{{item.address}}</text></view>
					<view class='container-address-2_2'>
						<text v-if="item.addressdetail!=null">{{item.addressdetail}}</text>
					</view>
				</view>

			</view>

			<view class='freight bg-white' v-for="(item,index) in carlist" :key='index'>
				<view class='line-freight'></view>

				<view class='freight-price'>
					<view class='freight-price-1'>平台交易费</view>
					<view><text class='text-price text-red freight-price-1'>{{item.money|ptmoney}}</text></view>
				</view>

			</view>
		</view>
		<!-- end -->

		<!-- 底部操作栏 -->

		<view class='foot bg-white' v-for="(item,index) in carlist" :key='index'>
			<view class='foot-1'><text class='foot-1_1'>实付款:</text><text
					class='text-price text-red foot-1_2'>{{item.money|allmoney}}</text></view>
			<view class='foot-2' @tap="confim"><text>确定</text></view>
		</view>

		<!-- end -->

	</view>
</template>

<script>
	export default {
		data() {
			return {
				carid: '', //可以根据这个id查询到详细的车信息
				sellopenid: '', //商家openid
				carlist: [], //车详情
				carimg: [], //车图片

			}
		},
		//过滤器
		filters: {
			// 平台交易费 取整
			ptmoney(m) {
				return Math.round(m * 0.001)
			},
			// 总价 取整
			allmoney(m) {
				return Math.round(m * 0.001) + m
			}
		},
		methods: {

			/**
			 * 确定付款,创建订单
			 */
			confim: function() {
				var _this = this
				var orders = {
					carimg: _this.carimg[0],
					cartitle: _this.carlist[0].title,
					money: _this.carlist[0].money,
					jiaoyimoney: Math.round(_this.carlist[0].money * 0.001) + _this.carlist[0].money,
					openid: uni.getStorageSync('openid'),
					sellopenid: _this.sellopenid,
					userName: _this.carlist[0].userName,
					address: _this.carlist[0].address,
					addressdetail: _this.carlist[0].addressdetail,
					phone: _this.carlist[0].phone,
					ordersnumber: _this.getodersnumber(),
					createtime: _this.getnowtime()
				}
				console.log(orders)
				uni.request({
					url: _this.$url + '/yao/addorders',
					method: 'post', 
					data: {
						orders
					},
					success(res) {
						//购买成功
						if (res.data.status == 0) {
							//判断是否被收藏
							uni.request({
								url: _this.$url + '/yao/iscollocet',
								method: 'POST',
								data: {
									myopenid: uni.getStorageSync('openid'),
									carid: _this.carlist[0].carid
								},
								success(res2) {
									if (res2.data.results == 1) {
										//是被收藏的车，从删除表中干掉
										_this.quitCollect(_this.carlist[0].carid) //取消收藏
										_this.delcar() 
										//二手车下架
										//跳转订单页面
										uni.navigateTo({
											url: '/pages/home/order_detail/order_detail?ordersnumber=' +
												orders.ordersnumber,
										})
									}else{
										_this.delcar()
										//二手车下架
										//跳转订单页面
										console.log('页面1')
										uni.navigateTo({
											url: '/pages/home/order_detail/order_detail?ordersnumber=' +
												orders.ordersnumber,
										})
									}
								}
							})
						} else {
							uni.showToast({
								title: '请联系管理员',
								image: '/static/错误.png',
								success() {
									console.log(res.data.message)
								}
							})
						}
					}
				})
			},
			// 取消收藏
			quitCollect: function(carid) {
				var _this = this
				uni.request({
					url: _this.$url + '/yao/quitcollocet',
					method: 'POST',
					data: {
						myopenid: uni.getStorageSync('openid'),
						carid: carid
					},
					success(res) {}
				})
			},
			//得到这个车的详情
			showcardetail() {
				var _this = this
				uni.request({
					url: _this.$url + '/yao/cardetail',
					method: 'GET',
					data: {
						carid: _this.carid
					},
					success(res) {
						console.log(res.data.carlist)
						_this.carlist = res.data.carlist
						//处理图片
						_this.carimg = res.data.carlist[0].carimg.split(',')
						//买家提供的交易地址的id
						_this.addresscarid = res.data.carlist[0].addresscarid
					}
				})
			},
			// 获取当前时间用于订单的创建时间
			getnowtime() {
				//获取当前时间并打印
				var _this = this;
				let yy = new Date().getFullYear();
				let mm = new Date().getMonth() + 1;
				let dd = new Date().getDate();
				let hh = new Date().getHours();
				let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
				let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
				const gettime = yy + '/' + mm + '/' + dd + ' ' + hh + ':' + mf + ':' + ss;
				return gettime
			},
			//当付款时创建一个订单号
			getodersnumber() {
				const now = new Date()
				const year = now.getFullYear();
				let month = now.getMonth() + 1;
				let day = now.getDate();
				let hour = now.getHours();
				let minutes = now.getMinutes();
				let seconds = now.getSeconds();
				String(month).length < 2 ? (month = Number("0" + month)) : month;
				String(day).length < 2 ? (day = Number("0" + day)) : day;
				String(hour).length < 2 ? (hour = Number("0" + hour)) : hour;
				String(minutes).length < 2 ? (minutes = Number("0" + minutes)) : minutes;
				String(seconds).length < 2 ? (seconds = Number("0" + seconds)) : seconds;
				const yyyyMMddHHmmss = `${year}${month}${day}${hour}${minutes}${seconds}`;
				return yyyyMMddHHmmss + '_' + Math.random().toString(36).substr(2, 9);
			},
			// 购买成功后下架二手车
			delcar() {
				var _this = this
				uni.request({
					url: _this.$url + '/yao/delmyissue',
					method: 'post',
					data: {
						carid: _this.carid,
						carimg:_this.carimg
					},
					success(res) {
						if (res.data.status == 0) {} else {
							uni.showToast({
								title: '失败,请留言客服', // 提示的内容
								duration: 1500, // 提示的延迟时间，默认1500
							})
						}
					}
				})
			},
		},
		onLoad(option) {
			this.carid = option.carid
			this.sellopenid = option.openid
			this.showcardetail()
			this.getnowtime()

		}
	}
</script>

<style>
	/* 内容 */
	.pg {
		padding: 20rpx;
	}

	.container {
		padding: 20rpx;
		height: 280rpx;
		width: 100%;
		display: flex;

	}

	.container-top image {
		height: 240rpx;
		width: 230rpx;
	}

	.container-top_rigth {
		margin-left: 20rpx;
	}

	.container-top_rigth_2 {
		display: flex;
		align-items: center;
		margin-top: 110rpx;
	}

	.container-top_rigth_2_2 text {
		margin-left: 20rpx;
		text-decoration: line-through;
		padding-left: 5rpx;
		padding-right: 5rpx;
	}

	.container-top_rigth_1 text {
		font-size: 30rpx;
		font-weight: 550;
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;

	}

	/* end */

	/* 地址位置 */
	.container-address {
		height: 200rpx;
		width: 100%;
		margin-top: 30rpx;
		padding: 20rpx;
		display: flex;
		align-items: center;
	}

	.container-address-1 {
		width: 20%;
	}

	.container-address-1 text {
		font-weight: 600;
	}

	.container-address-2 {
		width: 55%;
		margin-right: 20rpx;
		margin-left: 100rpx
	}

	.container-address-2_1 {
		direction: rtl;
		margin-bottom: 10rpx;
	}

	.container-address-2_1 text {
		font-weight: 550;
	}

	.container-address-2_2 {
		direction: rtl;
	}

	.container-address-2_2 text {
		font-size: 25rpx;
		font-weight: 550;

	}

	.freight {
		height: 100rpx;
		width: 100%;
		padding: 20rpx;
	}

	.line-freight {
		width: 100%;
		height: 2rpx;
		background: gainsboro;
	}

	.freight-price {
		display: flex;
		justify-content: space-between;
		margin-top: 25rpx;
	}

	.freight-price-1 {
		font-weight: 600;
	}

	/* end */

	/* 底部栏 */
	.foot {
		position: fixed;
		bottom: 0;
		display: flex;
		width: 100%;
		height: 100rpx;

	}

	.foot-1 {
		width: 70%;
		display: flex;
		align-items: center;
		padding-left: 20rpx;
	}

	.foot-2 {
		background: red;
		width: 30%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.foot-2 text {
		color: white;
	}

	.foot-1_1 {
		font-weight: 600;
		color: black;
	}

	.foot-1_2 {
		padding-left: 10rpx;
		font-weight: 550;
	}

	/* end */
</style>
