<template>
	<view>
		<!-- 内容 -->
		<view class='pa'>
			<view class='container shadow-warp bg-white' v-for="(item,index) in collectlist" :key="item" @tap="godetail(item.carid,item.myopenid)">
				<view class='container-top'>
					<view class='container-top-1'>
						<image :src='item.sellavatarUrl'></image>
					</view>

					<view class='container-top-2'>
						<view class='container-top-2_1'>
							<view class='container-top-2_1_1'><text
									class='text-lg text-weigth'>{{item.sellnickname}}</text></view>
							<view><text class='text-price text-red text-lg text-weigth '>{{item.money}}</text></view>
						</view>
					</view>
				</view>

				<view class='container-ScrollImage'>
					<scroll-view scroll-x="true" style=" white-space: nowrap; display: flex" class='top-20'>
						<block v-for="(i,index) in getcarimg(item.carimg)" :key="index">
							<view class='item-inlines'>
								<navigator url='' hover-class='none'>
									<view class="item-inline bg-img padding-top-xl flex align-end"
										:style=" 'background-image: url('+i+');' ">
									</view>
								</navigator>
							</view>
						</block>
					</scroll-view>
				</view>

				<view class='container-title'><text>{{item.cartitle}}</text></view>

				<view class='container-UserDesc'>
					<view class='container-UserDesc-1'></view>
					<view class='container-UserDesc-2' @tap='quitCollect(item.carid,index)'>
						<view class="cu-tag line-black padding-ll"><text class="cuIcon-favorfill text-yellow"></text><text
								class='cancel text-black'>取消收藏</text>
						</view>
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
				collectlist: [], //后台返回的用户的收藏的数据

			}
		},
		methods: {
			//页面加载时查询用户的收藏
			showcollect() {
				var _this = this
				uni.request({
					url: _this.$url + '/yao/selectcollocet',
					method: 'GET',
					data: {
						myopenid: uni.getStorageSync('openid')
					},
					success(res) {
						_this.collectlist = res.data.collectlist
					}
				})
			},
			//对后台返回的图片地址进行处理
			getcarimg(e) {
				return e.split(',')
			},
			// 取消收藏
			quitCollect: function(carid,index) {
				var _this=this
				uni.request({
					url:_this.$url+'/yao/quitcollocet',
					method:'POST',
					data:{
						myopenid:uni.getStorageSync('openid'),
						carid:carid
					},
					success(res) {
						uni.showToast({
							title: res.data.message, // 提示的内容
							icon: "success", // 图标，默认success
							duration: 1500,
							success() {
								_this.collectlist.splice(index,1)//前端页面删除
							}
						})
					}
				})
			},
			//去详情页
			godetail(carid,openid){
				uni.navigateTo({
					url:'/pages/home/home_detail/home_detail?carid='+carid+'&openid='+openid
				})
			}
		},
		mounted() {
			this.showcollect()
		}
	}
</script>

<style>
	.pa {
		padding: 20rpx;
	}

	/* 内容 */
	.container {
		width: 100%;
		padding: 20rpx;
		height: 500rpx;
		margin-bottom: 20rpx;
	}

	.container-top-1 image {
		height: 120rpx;
		width: 120rpx;
	}

	.container-top {
		display: flex;
		align-items: center;
	}

	.container-top-2 {
		margin-left: 20rpx;
		width: 90%;
	}

	.container-top-2_1 {
		display: flex;
		margin-bottom: 20rpx;
	}

	.container-top-2_1_1 {
		width: 80%;
	}

	.text-weigth {
		font-weight: 550;
	}

	.padding-left {
		padding-left: 10rpx
	}

	.item-inlines {
		display: inline-block;
	}

	.item-inline {
		display: inline-block;
		margin-right: 10rpx;
		height: 150rpx;
		width: 230rpx;
	}

	.container-ScrollImage {
		margin-top: 20rpx;
	}

	.container-title {
		margin-top: 20rpx;
	}

	.container-title text {
		font-size: 30rpx;
		color: black;
		font-weight: 700;
	}

	.container-UserDesc {
		margin-top: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.container-UserDesc-1 {
		font-size: 22rpx;
		color: var(--cyan);
		font-weight: 600;
	}

	.container-UserDesc-2 {
		margin-right: 20rpx;
	}

	.padding-ll {
		padding-left: 40rpx;
		padding-right: 40rpx;
		padding-top: 38rpx;
		padding-bottom: 38rpx;
	}

	.cancel {
		padding-left: 8rpx;
		font-weight: 550;
	}

	/* end */
</style>
