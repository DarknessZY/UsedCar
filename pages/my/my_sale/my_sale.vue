<template>
	<view>
		<!-- 内容 -->
		<view class='pa'>
			<view class="" v-if="mysellcar==''" style="center">
				<h2>您还未售出任何车辆,如果要卖车您可以点下方的发布二手车</h2>
			</view>
			<view class='container bg-white shadow-warp' v-for="(item,index) in mysellcar" :key="index">

				<view class='container-top'>
					<view class='container-top-1'>
						<image :src='item.carimg'></image>
					</view>
					<view class='container-top-2'>
						<view class='container-top-2_1 text-cut'><text>{{item.cartitle}}</text></view>
						<view class='container-top-2_2'><text class='text-price text-sm text-red'>{{item.money}}</text>
						</view>
						<view>
							<text class='cuIcon-time lg text-gray'></text>
							<text class='text-xxm' v-if="item.issend==0">请发货</text>
							<text class='text-xxm' v-if="item.issend==1">等待买家确认</text>
							<text class='text-xxm' v-if="item.issend==2">交易完毕</text>
						</view>
					</view>
				</view>

				<view class='container-line'></view>

				<view class='container-under'>
					<view class='container-under-1'><text class='cuIcon-message font-size-lg text-black '></text><text
							class='text-sm text-black'  @tap="getphone(item.openid)">联系买家</text></view>
					<view class='container-under-2'>
						<view class="cu-tag line-black padding" v-if="item.issend==0" @tap='gosend(item.ordersid)'>发货</view>
					</view>
					<view>
						<view class="cu-tag line-black padding" @tap='getordersdetail(item.openid,index)'>订单详情</view>
					</view>
				</view>

			</view>

		</view>

		<!-- end -->
		
		<!-- 订单详情 -->
		<view class="cu-modal" :class="orders=='DialogModal1'?'show':''" ref='orders'>
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">订单详情</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<view>卖家：{{buyuserinfo[0].name}}</view>
					<view>卖家电话：{{buyuserinfo[0].phone}}</view>
					<view>订单创建时间：{{ordersdetail.createtime |dateFilter('yyyy-mm-dd hh:mm:ss')}}</view>
					<view>订单编号：{{ordersdetail.ordersnumber}}</view>
					<view>交易地址：{{ordersdetail.address}} <text v-if="ordersdetail.addressdetail!=null">{{ordersdetail.addressdetail}}</text></view>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green margin-left" @tap="hideModal">取消</button>
					</view>
				</view>
			</view>
		</view>
		<!-- end -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mysellcar: [],//我卖的车
				orders:'',//订单详情的显示与隐藏
				buyuserinfo:[],//买家的信息
				ordersdetail:''//订单详情
			}
		},
		//过滤器
		filters: {
			//对时间过滤
			dateFilter: function(data, format) {
				var dt = new Date(data);
				var y = dt.getFullYear();
				var m = (dt.getMonth() + 1).toString().padStart(2, "0");
				var d = dt.getDate().toString().padStart(2, "0");
				var h = dt.getHours().toString().padStart(2, "0");
				var mm = dt.getMinutes().toString().padStart(2, "0");
				var s = dt.getSeconds().toString().padStart(2, "0");
				if (format.toLocaleLowerCase() === "yyyy-mm-dd" ||
					format.toLocaleLowerCase() === "") {
					return `${y}-${m}-${d}`;
				} else if (format.toLocaleLowerCase() === "yyyy/mm/dd") {
					return `${y}/${m}/${d}`;
				} else if (format.toLocaleLowerCase() === "yyyy-mm-dd hh:mm:ss") {
					return `${y}-${m}-${d} ${h}:${mm}:${s}`;
				} else if (format.toLocaleLowerCase() === "yyyy/mm/dd hh:mm:ss") {
					return `${y}/${m}/${d} ${h}:${mm}:${s}`;
				} else {
					return `输入的时间格式有误`;
				}
			}
		},
		methods: {
			//联系买家
			getphone(openid) {
						
						//根据用户点的订单的电话联系
						var _this = this
						uni.request({
							url: _this.$url+'/yao/userinfo',
							method: 'GET',
							data: {
								openid: openid
							},
							success(res) {
								if(res.data.status==0){
									uni.makePhoneCall({
										phoneNumber: res.data.userinfo[0].phone,
									});
								}
							}
						})

			},
			//得到卖的车订单
			getsalecar() {
				var _this = this
				uni.request({
					url: _this.$url + '/yao/getsellcar',
					method: 'GET',
					data: {
						openid: wx.getStorageSync('openid')
					},
					success(res) {
						_this.mysellcar = res.data.mysellcar
					}
				})
			},
			//查看订单详情
			getordersdetail(openid,index) {
				var _this=this
				uni.request({
					url:_this.$url+'/yao/userinfo',
					method:'GET',
					data:{
						openid:openid//买家id
					},
					success(res) {
						// console.log(res.data)
						_this.buyuserinfo=res.data.userinfo
						console.log(_this.buyuserinfo)
					}
				})
				_this.ordersdetail= _this.mysellcar[index]
				_this.orders='DialogModal1'		
			},
			//关闭弹出框
			hideModal(){
				this.orders=''
			},
			//发货
			gosend(ordersid,index){
				var _this = this
				uni.request({
					url: _this.$url + '/yao/updateorders',
					method: 'post',
					data: {
						ordersid: ordersid,
						issend:'1'
					},
					success(res) {
						uni.showToast({
							title: '已发货', // 提示的内容
							icon: "success", // 图标，默认success
							duration: 800,
							success() {
								_this.getsalecar()
							}
						})
					}
				})
			}
		},
		onLoad() {
			this.getsalecar()
		}
	}
</script>

<style scoped>
	/* pages/my/my_sale/my_sale.wxss */

	.pa {
		padding: 20rpx;
	}

	/* 内容 */
	.container {
		padding: 20rpx;
		height: 300rpx;
		width: 100%;
		margin-bottom: 20rpx;
	}

	.container-top-2 {
		margin-left: 20rpx;
		width: 120%;

	}

	.container-top-1 image {
		width: 150rpx;
		height: 150rpx;
	}

	.container-top {
		display: flex;
		align-items: center;

	}

	.container-top-2_1 {
		margin-bottom: 20rpx;
		width: 50%;
	}

	.container-top-2_1 text {
		font-weight: 600;
	}

	.container-top-2_2 {
		margin-bottom: 20rpx;
	}

	.container-top-2_2 text {
		font-size: 25rpx;
		font-weight: 750;
	}

	.text-xxm {
		font-size: 22rpx;
		color: gray;
		padding-left: 10rpx;
	}

	.container-line {
		width: 95%;
		height: 3rpx;
		background: gainsboro;
		margin-top: 25rpx;
	}

	.container-under {
		display: flex;
		margin-top: 25rpx;
		align-items: center;
		justify-content: space-between;
	}

	.font-size-lg {
		font-size: 35rpx;
		padding-right: 10rpx;

	}

	.container-under-1 {
		width: 65%;
	}

	.container-under-2 {
		margin-right: 20rpx;
	}

	/* end */
</style>
