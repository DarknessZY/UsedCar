<template>
	<view>
		<!-- 内容 -->
		<view class='pa'>
			<view class='contianer shadow-warp bg-white padding-sm' v-for="(item,index) in carinfo" :key="index">
				<navigator :url="'/pages/home/home_detail/home_detail?carid='+item.carid+'&openid='+item.openid"
					hover-class='none'>
					<view class='contianer-title'>
						<view>
							<text v-if="item.ischeck==1" class="cu-tag bg-green ">该车已经上架,点击去看看！</text>
						</view>
					</view>
					<view class='item-inline-1_1'><text decode='true'>&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;</text></view>
					<scroll-view scroll-x="true" style=" white-space: nowrap; display: flex" class='top-20'>
						<block v-for="(itemimg,index) in getcarimg(item.carimg)" :key="item">
							<view class='item-inlines'>
								<image :src="itemimg" style="width: 250rpx;height: 200rpx;margin-left:30rpx ;"></image>
							</view>
						</block>
					</scroll-view>
					<view class='container-price_desc'>


						<view class="cu-capsule round view-width">
							<view class="cu-tag bg-yellow ">
								价钱
							</view>
							<view class="cu-tag line-red">
								{{item.money}}
							</view>
							<view class="cu-tag bg-yellow ">
								磨损度
							</view>
							<view class="cu-tag line-red">
								{{item.carnew}}
							</view>
							<view class="cu-tag bg-yellow ">
								标题
							</view>
							<view class="cu-tag line-red">
								{{item.title}}
							</view>

						</view>
					</view>
					<view class='container-line'></view>
				</navigator>
			</view>

		</view>

		<!-- end -->


	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				carinfo: [], //卖家发布的已上架的车
				sellopenid: '', //卖家的openid
				selluserinfo: '', //卖家的信息
			}
		},
		methods: {
			//通过openid得到卖家的发布的二手车
			getissue() {
				var _this = this
				_this.carinfo = [] //用之前先清空
				uni.request({
					url: _this.$url + '/yao/getmyissue',
					method: 'GET',
					data: {
						openid: _this.sellopenid
					},
					success(res) {
						console.log(res.data.carinfo)
						for (var i = 0; i < res.data.carinfo.length; i++) {
							if (res.data.carinfo[i].ischeck == 1) {
								_this.carinfo.push(res.data.carinfo[i])
							}
						}

					}
				})
			},
			//得到卖家信息
			getselluserinfo() {

			},
			//对后台返回的图片进行过滤处理
			getcarimg(e) {
				return e.split(',')
			},
		},
		onLoad(option) {
			console.log("卖家sellopenid：" + option.sellopenid)
			this.sellopenid = option.sellopenid
			this.getissue()
		}
	}
</script>

<style scoped>
	.pa {
		padding: 20rpx;
	}

	/* 内容 */
	.contianer {
		width: 100%;
		height: 400rpx;
		margin-bottom: 20rpx;

	}

	.contianer-title {
		display: flex;


	}

	.contianer-title_2 {
		margin-right: 20rpx;
	}

	.contianer-title_2 text {
		font-size: 25rpx;
		color: gray;
	}

	.item-inline-1_1 {
		width: 300rpx;
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

	.container-price_desc {
		display: flex;
		margin-top: 20rpx;
		align-items: center;
	}

	.view-width {
		width: 70%;
	}

	.margin-left {
		margin-left: 20rpx;
	}

	.container-compile {
		display: flex;
		margin-top: 15rpx;
		justify-content: flex-end;
	}
</style>
