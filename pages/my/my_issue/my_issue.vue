<template>
	<view>
		<!-- 内容 -->
		<view class='pa'>

			<view class='contianer shadow-warp bg-white padding-sm' v-for="(item,index) in carinfo" :key="index">

				<view class='contianer-title'>
					<view class="cu-tag  ">
						状态：
					</view>
					<view >
						<text v-if="item.ischeck==1" class="cu-tag bg-green ">管理员已审核完,该车已经上架</text>
						<text v-if="item.ischeck==0" class="cu-tag bg-blue ">管理员正在审核中,请耐心等待</text>
						<text v-if="item.ischeck==2" class="cu-tag bg-red ">审核未通过:{{item.nocheckreason}}</text>
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


				<view class='container-compile'>
					<view class="cu-tag line-yellow" @tap='toIssue(item.carid)'  v-if="item.ischeck==0||item.ischeck==2">编辑</view>
					<view class="cu-tag line-yellow" @tap='actionSheetTap(item.carid,item.carimg,index)'  v-if="item.ischeck==1">下架</view>
					<view class="cu-tag line-yellow" @tap='delIssue(item.carid,item.carimg,index)'  v-if="item.ischeck==0||item.ischeck==2">取消发布</view>

				</view>

				<view class='container-line'></view>
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
				carinfo: [], //我发布的车
				nickName: '', //我的昵称
			}
		},
		methods: {
			//通过openid得到改卖家的发布的二手车
			getissue() {
				var openid = wx.getStorageSync('openid')
				var _this = this
				uni.request({
					url: _this.$url+'/yao/getmyissue',
					method: 'GET',
					data: {
						openid: openid
					},
					success(res) {
						console.log(res.data.carinfo)
						_this.carinfo = res.data.carinfo
					}
				})
			},
			//对后台返回的图片进行过滤处理
			getcarimg(e) {
				return e.split(',')
			},
			// 跳转到编辑页面
			toIssue: function(carid) {
				// console.log(1)
				uni.navigateTo({
					url: '/pages/issue/isuue_edit/isuue_edit?carid='+carid+''
				})
			},

			// 下架
			actionSheetTap(carid,carimg,i) {
				var _this = this
				uni.showActionSheet({
					itemList: ['确定下架'],
					success(e) {
						uni.request({
							url: _this.$url+'/yao/delmyissue',
							method: 'post',
							data: {
								carid: carid,
								carimg:_this.getcarimg( carimg)
							},
							success(res) {
								if (res.data.status == 0) {
									//前端界面先删除
									_this.carinfo.splice(i, 1)
									uni.showToast({
										title: '下架成功', // 提示的内容
										icon: "success", // 图标，默认success
										image: "", // 自定义图标的本地路径，image 的优先级高于 icon
										duration: 1500, // 提示的延迟时间，默认1500
										mask: false, // 是否显示透明蒙层，防止触摸穿透
									})
								} else {
									uni.showToast({
										title: '失败,请留言客服', // 提示的内容
										duration: 1500, // 提示的延迟时间，默认1500
									})
								}

							}
						})

					}
				})
			},
			//取消发布
			delIssue(carid,carimg, i){
				var _this = this
				uni.showActionSheet({
					itemList: ['确定取消发布'],
					success(e) {
						uni.request({
							url: _this.$url+'/yao/delmyissue',
							method: 'post',
							data: {
								carid: carid,
								carimg:_this.getcarimg( carimg)
							},
							success(res) {
								if (res.data.status == 0) {
									//前端界面先删除
									_this.carinfo.splice(i, 1)
									uni.showToast({
										title: '取消发布成功', // 提示的内容
										icon: "success", // 图标，默认success
										image: "", // 自定义图标的本地路径，image 的优先级高于 icon
										duration: 1500, // 提示的延迟时间，默认1500
										mask: false, // 是否显示透明蒙层，防止触摸穿透
									})
								} else {
									uni.showToast({
										title: '失败,请留言管理员', // 提示的内容
										duration: 1500, // 提示的延迟时间，默认1500
									})
								}
				
							}
						})
				
					}
				})
			}
		},
		onLoad() {
			this.getissue()
			this.nickName = wx.getStorageSync('userInfo').nickName
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



	/* 选择样式 */
	.select_state {
		background: #fef2ce;
	}

	/* end */
</style>
