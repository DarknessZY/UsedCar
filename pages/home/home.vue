 <template>
	<!-- <bar></bar> -->
	<view class="">
		<!-- 搜索 -->
		<view class="cu-bar search bg-white" id="TabCurTab">
			<!-- <view class="action text-cut locaWidth">
					<text>耀车：</text>
			</view> -->
			<view class="search-form round" @click='toSearch'>
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="请搜索需要的二手车" ></input>
			</view>
			<!-- 头像 --> 
			<view class="cu-avatar round search_img">
				<view v-if="avatarUrl==''" style="font-size: 20rpx;">
					请登录
				</view>
				<image :src="avatarUrl" style="width: 80rpx;height: 60rpx;border-radius: 100%;" v-if="!avatarUrl==''">
				</image>
			</view>
		</view>
		<!-- 搜索end -->


		<!-- 轮播图 -->
		<swiper class="screen-swiper square-dot " :indicator-dots="true" :circular="true" :autoplay="true"
			interval="5000" duration="500">
			<swiper-item v-for="(item,index) in swiperList" :key="index"  @click='toSearch'>
				<image :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
<!-- 				<video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover"
					v-if="item.type=='video'"></video> -->
			</swiper-item>
		</swiper>
		<!-- 轮播图end -->

		<!--头条滚动区域-->
		<swiper class="swiperitem margin-top solid-bottom" autoplay="true" vertical="true" circular="true"
			@click="lineschange">
			<block v-for="(item,index) in Headlines" :key="index">
				<swiper-item @click="linesclick">
					<view class="cu-bar bg-white">
						<view class='action'>
							<text class="cuIcon-triangledownfill text-orange"></text>
							<text>头条：{{item.title}}</text>
						</view>
					</view>
				</swiper-item>
			</block>
		</swiper>
		<!-- end -->

		<!-- 宫格列表 -->
		<view class="cu-list no-border grid  card-menu " :class="['col-' + gridCol]">
			<view class="cu-item" v-for="(item,index) in logoList" :key="index">
				<view @tap="goselectbrandname(item.brandname)">
					<view>
						<image :src="item.logoimg" style="width: 80rpx;height:80rpx;"></image>
					</view>
					<text>{{item.brandname}}</text>
				</view>
			</view>
		</view>
		<!-- 宫格列表end -->


		<!-- 点击回到顶部 -->
		<view class='goTop'>
			<image src='../../static/img/top_top.png' v-if="!showTop" @click='goTop'></image>
		</view>
		<!-- end -->

		<!-- 导航条 -->
		<TopBar @click="tabSelect" :TabCur="TabCur" :dataList="tablist"></TopBar>
		<!-- 导航条 -->



		<!-- 内容 -->
		<view class='card-menu container margin-top ' v-for="(item,index) in carlist" :key="index">
			<navigator :url="'/pages/home/home_detail/home_detail?carid='+item.carid+'&openid='+item.openid"  hover-class='none'>
				<view class='container_img'>
					<image :src='getcarimg(item.carimg)'></image>
				</view>
				<view class='container_text'><text class=''>{{item.title}}</text></view>
				<view class='container_price'>
					<text class='container_price_text_0'>￥{{item.money}}</text>
					<view class="cu-tag line-orange">{{item.carnew}}</view>
				</view>
				<view class='container_line'></view>
				<view class='container_user'>
					<!-- 角色头像 -->
					<image :src="item.avatarUrl" style="width: 50rpx;height: 50rpx;border-radius: 100%;">
					</image>
					<text>{{item.nickName}}</text>
				</view>
			</navigator>
		</view>
		<!-- 内容end -->
	</view>


	</view>



</template>

<script>
	import bar from "../component/bar.vue";
	import TopBar from "../component/topTab.vue";
	export default {
		data() {
			return {
				avatarUrl:'',//用户头像
				selluserinfo:{},
				TabCur: 0, // 导航条下标
				scrollTop: 0, //屏幕位置
				// TabCurTab: 0, //吸附置顶的偏差值
				brandname: '', //
				ceil_top: '', //导航条置顶高度
				// 轮播图
				cardCur: 0,
				swiperList: [{
					id: 0,
					type: 'image',
					url: 'https://yaocar-1309702462.cos.ap-nanjing.myqcloud.com/homeimg/homeswiper1.jpg'
				}, {
					id: 1,
					type: 'image',
					url: 'https://yaocar-1309702462.cos.ap-nanjing.myqcloud.com/homeimg/homeswiper2.jpg',
				}, {
					id: 2,
					type: 'image',
					url: 'https://yaocar-1309702462.cos.ap-nanjing.myqcloud.com/homeimg/homeswiper3.jpg'
				}, {
					id: 3,
					type: 'image',
					url: 'https://yaocar-1309702462.cos.ap-nanjing.myqcloud.com/homeimg/homeswiper4.jpg'
				}],
				// 轮播图end
				// 宫格列表
				logoList: [],
				gridCol: 5,
				// 宫格列表end
				// 滚动title
				Headlines: [{
					id: 1,
					title: "奥迪双钻，你的伙伴",
					type: 1
				}, {
					id: 2,
					title: "耀车",
					type: 2
				}, {
					id: 3,
					title: "选车就来耀车",
					type: 3
				}, {
					id: 4,
					title: "恭喜您成为雷塞德斯奔驰的车主",
					type: 4
				}],
				//end

				//导航条
				tablist: [{
						id: 0,
						name: '宝马'
					},
					{
						id: 1,
						name: '本田'
					},
					{
						id: 2,
						name: '大众'
					},
					{
						id: 3,
						name: '五菱宏光'
					},
					{
						id: 4,
						name: '奥迪'
					},
					{
						id: 5,
						name: '比亚迪'
					},
					{
						id: 6,
						name: '别克'
					},
					{
						id: 7,
						name: '日产'
					},
					{
						id: 8,
						name: '奔驰'
					},
					{
						id: 9,
						name: '其他车系'
					},
				],
				//end
				carlist: {}, //返回的车的数据
				//显示异常屏幕回到初始化位置开关
				showTop: false, //异常
			}
		},
		components: {
			bar,
			TopBar
		},

		onShow: function() {

		},
		//上拉刷新
		onPullDownRefresh: function() {
			//模拟加载完成
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 2000);
		},
		//上拉刷新
		onReachBottom: function() {
			console.log("上拉刷新事件");

		},
		methods: {
			//去搜索页面
			toSearch(){
				uni.navigateTo({
					url:'/pages/home/HM-search/HM-search'
				})
			},
			//根据点的车标去搜索页面
			goselectbrandname(brandname){
				uni.reLaunch({
					url:'/pages/disconver/disconver?searchtext='+brandname
				})
			},
			//加载车标
			lodchebiao() {
				let _this = this
				uni.request({
					url:_this.$url+'/yao/getlogoimg',
					method: "GET",
					data: {},
					success(res) {
						console.log(res.data.logoimglist)
						_this.logoList = res.data.logoimglist
					}
				})
			},
			// 导航条点击
			tabSelect(e) {
				console.log(e);
				this.TabCur = e.currentTarget.dataset.id
				if (this.TabCur == 0) {
					this.brandname = '宝马'
				} else if (this.TabCur == 1) {
					this.brandname = '本田'
				} else if (this.TabCur == 2) {
					this.brandname = '大众'
				} else if (this.TabCur == 3) {
					this.brandname = '五菱宏光'
				} else if (this.TabCur == 4) {
					this.brandname = '奥迪'
				} else if (this.TabCur == 5) {
					this.brandname = '比亚迪'
				} else if (this.TabCur == 6) {
					this.brandname = '别克'
				} else if (this.TabCur == 7) {
					this.brandname = '日产'
				} else if (this.TabCur == 8) {
					this.brandname = '奔驰'
				} else if (this.TabCur == 9) {
					this.brandname = '其他车系'
				}
				var _this = this
				console.log(_this.brandname)
				uni.request({
					url:_this.$url+ '/yao/showbrandnamecar',
					method: 'GET',
					data: {
						brandname: _this.brandname,
					},
					success(res) {
						console.log(res.data.carlist)
						if(res.data.carlist.length==0){
							uni.showToast({
								title:'暂无出售的车'
							})
							_this.carlist = res.data.carlist
						}else{
							_this.carlist = res.data.carlist
						}
						
						
					}
				})

			},
			//对后台返回的图片进行处理
			getcarimg(e){
				return e.split(',')[0]
			},
			//页面加载时就显示宝马车系
			showbaoma(){
				var _this = this
				uni.request({
					url:_this.$url+ '/yao/showbrandnamecar',
					method: 'GET',
					data: {
						brandname: '宝马',
					},
					success(res) {
						console.log(res.data.carlist)
						_this.carlist = res.data.carlist
					}
				})
			},
			// 点击回到顶部
			onPageScroll: function(e) {
				this.scrollTop = e.scrollTop

				if (e.scrollTop > 500) {
					this.showTop = false;
				} else {
					this.showTop = true;
				}
			},
			goTop: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				})
			},
			//end
		},
		onTabItemTap(e) {
			// console.log(e)
			// this.$href(e.pagePath)
			this.$Router.forceGuardEach();
		},
		onLoad: function() {
	
			this.lodchebiao()
			this.showbaoma()
			// console.log(this.logoList)
			this.avatarUrl=wx.getStorageSync('userInfo').avatarUrl
			
		}
		
		
	}
</script>

<style>
	/* 搜索 */
	.search_img {
		margin-right: 30rpx;
	}
	/* 定位的宽度 */
	.locaWidth {
		width: 10%;
	}

	/* end */

	/* 内容 */

	.container {
		margin-left: 29rpx;
		margin-right: 20rpx;
		float: left;
		height: 530rpx;
		width: 43%;
		background: white;
		margin-bottom: 20rpx;
	}

	.container_img image {
		height: 300rpx;
		width: 100%;
	}

	.container_text {
		color: black;
		padding: 10rpx;
		font-size: 23rpx;
	}

	.container_price {
		display: flex;
		justify-content: space-between;
		padding-left: 8rpx;
		padding-right: 8rpx;
	}

	.container_price_text_0 {
		color: red;
		font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
	}

	.container_price_text_1 {
		font-size: 22rpx;
	}

	.container_line {
		width: 100%;
		background: gainsboro;
		height: 1rpx;
		margin-top: 10rpx;
	}

	.container_user {
		margin-top: 20rpx;
		display: flex;
		line-height: 50rpx;
	}

	.container_user image {
		margin-left: 10rpx;
		margin-right: 50rpx;
		height: 50rpx;
		width: 50rpx;
	}

	/* end */



	/* 滚动的title */

	.swiperitem {
		background: #fff;
		height: 40px;
		margin-left: 30rpx;
		margin-right: 30rpx;
	}

	/* end */

	.cu-list.grid.no-border {
		border-radius: 0rpx;
	}
	/* 点击回到顶部 */

	.goTop image {
		height: 60rpx;
		width: 60rpx;
		border-radius: 100%;
		position: fixed;
		bottom: 150rpx;
		right: 60rpx;
		z-index: 10000;
	}

	/* end */

	/* 撑高线条 */
	.lines {
		display: flex;
		width: 100%;
		height: 150rpx;
	}

	/* end */
</style>
