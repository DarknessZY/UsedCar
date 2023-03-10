<template>
	<view>
		<!-- 内容 -->
		<view class='pa'>
			<view v-if="mybuycar.length==0">
				<h1>暂无购买，请用户去首页看看车吧！</h1>
			</view>
			<view class='container bg-white shadow-warp' v-if="mybuycar.length!=0" v-for="(item,index) in mybuycar"
				:key="index">

				<view class='container-top'>
					<view class='container-top-1'>
						<image :src='item.carimg'></image>
					</view>
					<view class='container-top-2'>
						<view class='container-top-2_1 text-cut'><text>{{item.cartitle}}</text></view>
						<view class='container-top-2_2'><text
								class='text-price text-sm text-red'>{{item.jiaoyimoney}}</text></view>
						<view>
							<text class='cuIcon-time lg text-gray'></text>
							<text class='text-xxm' v-if="item.issend==0">等待卖家发货</text>
							<text class='text-xxm' v-if="item.issend==1">确认订单</text>
							<text class='text-xxm' v-if="item.issend==2">交易完成</text>
						</view>
					</view>
				</view>

				<view class='container-line'></view>

				<view class='container-under'>
					<view class='container-under-1'><text class='cuIcon-message font-size-lg text-black '></text><text
							class='text-sm text-black' @tap="getphone(item.phone)">联系卖家</text></view>
					<view class='container-under-2'>
						<view class="cu-tag line-black padding" v-if="item.issend==1" @tap='gosend(item.ordersid)'>确认订单
						</view>
						<view class="cu-tag line-black padding" v-if="item.issend==2">评价</view>
					</view>
					<view>
						<view class="cu-tag line-black padding" @tap="getordersdetail(index)">订单详情</view>
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
					<view>卖家：{{ordersdetail.userName}}</view>
					<view>卖家电话：{{ordersdetail.phone}}</view>
					<view>订单创建时间：{{ordersdetail.createtime | dateFilter("yyyy-mm-dd hh:mm:ss")}}</view>
					<view>订单编号：{{ordersdetail.ordersnumber}}</view>
					<view>交易地址：{{ordersdetail.address}} <text
							v-if="ordersdetail.addressdetail!=null">{{ordersdetail.addressdetail}}</text>
					</view>
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
				mybuycar: [], //用户的订单
				orders: '', //订单详情的显示与隐藏
				ordersdetail: [], //订单详情
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
			//得到自己买的车订单
			getbuycar() {
				var _this = this
				uni.request({
					url: _this.$url + '/yao/getbuycar',
					method: 'GET',
					data: {
						openid: wx.getStorageSync('openid')
					},
					success(res) {
						_this.mybuycar = res.data.mybuycar
					}
				})
			},
			//联系卖家
			getphone(phone) {

				//根据用户点的订单的电话联系
				uni.makePhoneCall({
					phoneNumber: phone
				});

			},
			//查看订单详情
			getordersdetail(index) {
				this.ordersdetail = this.mybuycar[index]
				// console.log(this.ordersdetail)
				this.orders = 'DialogModal1'
			},
			//关闭弹出框
			hideModal() {
				this.orders = ''
			},
			//改变订单状态
			gosend(ordersid) {
				var _this = this
				uni.request({
					url: _this.$url + '/yao/updateorders',
					method: 'post',
					data: {
						ordersid: ordersid,
						issend: '2'
					},
					success(res) {
						uni.showToast({
							title: '确认订单', // 提示的内容
							icon: "success", // 图标，默认success
							duration: 800,
							success() {
								_this.getbuycar()
							}
						})
					}
				})
			}

		},
		onLoad() {
			this.getbuycar()
		}
	}
</script>

<style scoped>
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
	.popup-box {
		text-align: center;
		background-color: #fff;
		padding: 30rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		width: 100%;
		height: 100px;
	}
</style>
