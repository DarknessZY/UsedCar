<template>
	<view class="">
		<!-- 搜索 -->
		<view class="cu-bar search bg-white" id="TabCurTab">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="请搜索需要的二手车" confirm-type="search" :value="searchtext"
					@confirm="getsearchtext"></input>
			</view>
		</view>
		<!-- 搜索end -->
		<!-- 轮播图 -->
		<min-swiper></min-swiper>
		<!-- end -->
		<!-- 筛选条 -->
		<view class="content_saixuan">
			<sl-filter  :color="titleColor" :themeColor="themeColor" :menuList.sync="menuList" @result="result"></sl-filter>
		</view>
		<!-- end -->
		<!-- 内容 -->
		<view class='container bg-white' v-for="(item,index) in carlist" :key="index"
			@tap='gohomedetail(item.carid,item.openid)'>
			<view class='container-top'>
				<image :src='getcarimg(item.carimg)'></image>
			</view>
			<view class='container-top_rigth'>
				<!-- 标题 -->
				<view class='container-top_rigth_1'><text>{{item.title}}</text>
					<view class="cu-tag line-orange">{{item.carnew}}</view>
				</view>
				<!-- 描述 -->
				<view class='container-top_rigth_1_1'><text>{{item.description}}</text></view>
				<!-- 价格 -->
				<view class='container-top_rigth_2'>
					<view><text class='text-price text-red text-xl'>{{item.money}}</text></view>
					<view class='container-top_rigth_2_2'><text class='text-price'>{{item.newMoney}}</text>
					</view>
				</view>
				<!-- 卖家头像 -->
				<view class='container_user'>

					<image :src="item.avatarUrl" style="width: 50rpx;height: 50rpx;border-radius: 100%;">
					</image>
					<text style="margin-left: 30rpx;">{{item.nickName}}</text>
				</view>

			</view>

		</view>
		<!-- end -->

	</view>



</template>

<script>
	import minSwiper from "../component/minSwiper.vue";
	import slFilter from '../component/sl-filter/sl-filter.vue';
	export default {
		data() {
			return {
				carlist: [], //车数据 
				searchtext: '', //搜索的内容
				//后面是筛选条的内容
				themeColor: '#000000',
				titleColor: '#666666',
				// filterResult: '',
				menuList: [{
						'title': '车系',
						'detailTitle': '请选择车系类型（可多选）',
						'isMutiple': true,
						'key': 'brandname',
						'detailList': [{
								'title': '不限',
								'value': 'all'
							},
							{
								'title': '宝马',
								'value': '宝马'
							},
							{
								'title': '本田',
								'value': '本田'
							},
							{
								'title': '大众',
								'value': '大众'
							},
							{
								'title': '五菱宏光',
								'value': '五菱宏光'
							},
							{
								'title': '奔驰',
								'value': '奔驰'
							},
							{
								'title': '奥迪',
								'value': '奥迪'
							},
							{
								'title': '别克',
								'value': '别克'
							},
							{
								'title': '日产',
								'value': '日产'
							},
							{
								'title': '其他车系',
								'value': '其他车系'
							},
						]
				
					},
					{
						'title': '车磨损度',
						'key': 'carnew',
						'isMutiple': true,
						'detailTitle': '请选择车新旧程度',
						'detailList': [{
								'title': '不限',
								'value': 'all'
							},
							{
								'title': '全新',
								'value': '全新'
							},
							{
								'title': '9新',
								'value': '9新'
							},
							{
								'title': '8新',
								'value': '8新'
							},
							{
								'title': '7新',
								'value': '7新'
							},
							{
								'title': '6新',
								'value': '6新'
							},
						]
					},
					{
						'title': '价格(元)',
						'key': 'money',
						'isMutiple': false,
						'detailTitle': '请选择二手车价格(默认不限)',
						'detailList': [
							{
								'title': '不限',
								'value': 'all'
							},
							{
								'title': '10万元以下',
								'value':[0,100000]
							},
							{
								'title': '10万元~30万元',
								'value':  [100000,300000]
							},
							{
								'title': '30万元~50万元',
								'value':  [300000,500000]
							},
							{
								'title': '50万元以上',
								'value':[500000,999999999] 
							},
									
						]
									
					},
					{
						'title': '价格排序',
						'key': 'sort',
						'detailTitle': '请选择排序方式',
						'isSort': true,
						'reflexTitle': true,
						'detailList': [{
								'title': '默认排序(低到高)',
								'value': ''
							},
							{
								'title': '低到高',
								'value': 'asc'
							},
							{
								'title': '高到低',
								'value': 'desc'
							}
						]
					}
				]
			}
		},
		components: {
			minSwiper,
			slFilter
		},
		methods: {
			//筛选返回的结果
			result(val) {
				// val就是该插件返回的结果
				console.log(val)
				var Fresult=JSON.stringify(val)
				var _this=this
				uni.request({
					url: _this.$url+'/yao/filterinfo',
					method: 'GET',
					data:{ Fresult},
					success(res) {
						if(res.data.carlist.length==0){
							uni.showToast({
								title: '筛选的车已无', // 提示的内容
							})
							_this.carlist=res.data.carlist
						}else{
							_this.carlist=res.data.carlist
						}
						
					}
				})
			},
			//搜索
			getsearchtext: function(e) {
					this.searchtext = e.detail.value	
				if (this.searchtext == '') {
					this.showcarinfo()
				} else {
					var _this = this
					uni.request({
						url: _this.$url + '/yao/searchinfo',
						method: 'POST',
						data: {
							searchtext: _this.searchtext
						},
						success(res) {
							console.log(res.data.carlist)
							if (res.data.carlist.length > 0) {
								_this.carlist = res.data.carlist
							} else {
								uni.showToast({
									title: '没有该车!', // 提示的内容
									duration: 3000,
								})
							}

						}
					})
				}

			},
			getsearchtext2: function() {
				if (this.searchtext == '') {
					this.showcarinfo()
				} else {
					var _this = this
					uni.request({
						url: _this.$url + '/yao/searchinfo',
						method: 'POST',
						data: {
							searchtext: _this.searchtext
						},
						success(res) {
							console.log(res.data.carlist)
							if (res.data.carlist.length > 0) {
								_this.carlist = res.data.carlist
							} else {
								uni.showToast({
									title: '没有该车!', // 提示的内容
									duration: 3000,
								})
							}
			
						}
					})
				}
			
			},
			//最开始加载的车信息
			showcarinfo() {
				var _this = this
				uni.request({
					url: _this.$url + '/yao/randcarinfo',
					method: 'GET',
					data: {},
					success(res) {
						console.log(res.data.carlist)
						_this.carlist = res.data.carlist
					}
				})
			},
			//去商品的详情页面
			gohomedetail(carid, openid) {
				uni.navigateTo({
					url: '/pages/home/home_detail/home_detail?carid=' + carid + '&openid=' + openid
				})
			},
			//图片过滤器
			getcarimg(e) {
				return e.split(',')[0]
			},
		},
		onLoad: function(option) {
			console.log(option)
			 if(option.searchtext!=undefined){
				 this.searchtext=option.searchtext
				 this.getsearchtext2()
			 }else{
				 this.showcarinfo()
			 }
			

		},
		onShow: function() {},
		//上拉刷新
		onPullDownRefresh: function() {
			//模拟加载完成
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 2000);
		},
		//上拉刷新
		onReachBottom: function() {
			console.log("出发上拉刷新事件");

		},
		//tabbar点击
		onTabItemTap(e) {
			// this.$href(e.pagePath)
			this.$Router.forceGuardEach();
		}

	}
</script>

<style>
	/* 卖家头像 */
	.container_user {
		display: flex;
		align-items: center;
		position: absolute;
		bottom: 10rpx;
	}

	/* end */
	/* 主体内容 */
	.container {
		position: relative;
		padding: 20rpx;
		height: 280rpx;
		width: 100%;
		display: flex;

	}

	.container-top image {
		height: 250rpx;
		width: 280rpx;
	}

	.container-top_rigth {
		margin-left: 30rpx;
		width: 470rpx;
	}

	.container-top_rigth_2 {
		position: absolute;
		display: flex;
		align-items: center;
		bottom: 60rpx;
	}

	.container-top_rigth_2_2 text {
		margin-left: 20rpx;
		text-decoration: line-through;
		padding-left: 5rpx;
		padding-right: 5rpx;
	}

	.container-top_rigth_1 {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.container-top_rigth_1 text {
		font-size: 30rpx;
		font-weight: 550;
		margin-top: 5rpx;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		/* 可以把 块容器 中的内容限制为指定的行数. */
		overflow: hidden;


	}

	.container-top_rigth_1_1 text {
		font-size: 25rpx;
		margin-top: 10rpx;
		overflow: hidden;
		display: -webkit-box;
		text-overflow: ellipsis;
		-webkit-line-clamp: 3;
		/* 可以把 块容器 中的内容限制为指定的行数. */
		-webkit-box-orient: vertical;

	}

	/* end */
	/* 轮播图 */
	.place {
		width: 100%;
		height: auto;
		padding-top: 0rpx;
		margin-bottom: 20rpx;
	}

	.swiper {
		width: 100%;
		margin-top: 10rpx;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-pack: center;
		-webkit-justify-content: center;
		-ms-flex-pack: center;
		justify-content: center;
	}

	.swiper .swiper-box {
		width: 95%;
		height: 30.7vw;
		overflow: hidden;
		-webkit-border-radius: 15rpx;
		border-radius: 15rpx;
		-webkit-box-shadow: 0rpx 8rpx 25rpx rgba(0, 0, 0, 0.2);
		box-shadow: 0rpx 8rpx 25rpx rgba(0, 0, 0, 0.2);
		position: relative;
		z-index: 1;
	}

	.swiper .swiper-box swiper {
		width: 100%;
		height: 30.7vw;
	}

	.swiper .swiper-box swiper swiper-item image {
		width: 100%;
		height: 30.7vw;
	}

	.swiper .swiper-box .indicator {

		position: absolute;
		bottom: 20rpx;
		left: 20rpx;
		background-color: rgba(255, 255, 255, 0.4);
		width: 150rpx;
		height: 5rpx;
		-webkit-border-radius: 3rpx;
		border-radius: 3rpx;
		overflow: hidden;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
	}

	.swiper .swiper-box .indicator .dots {
		width: 100%;
	}

	.swiper .swiper-box .indicator .dots.on {
		background-color: white;
	}

	/* 轮播图end */
</style>
