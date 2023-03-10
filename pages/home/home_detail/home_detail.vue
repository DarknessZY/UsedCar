<template>
	<view>

		<!-- 商品内容 -->
		<view class='contanier bg-white padding-sm top-20' v-for="(item,index) in carlist" :key="index">
			<!-- 标题 -->
			<view
				style="color: #000000;font-size: 80rpx; display: flex;align-items: center;justify-content: space-between;">
				{{item.title}}
				<view class="cu-tag line-orange">{{item.carnew}}</view>
			</view>
			<view class='price'>
				<text class='price-symbol'>￥</text>
				<text class='price-size'>{{item.money}}</text>
				<text class='price-ori'>原价：￥{{item.newMoney}}</text>
				<view class="cu-tag">不讲价</view>
			</view>

			<view class='bg-white top-20 font-size'>
				<text>
					{{item.description}}
				</text>
			</view>

			<!-- 交易方式 -->
			<view class='hint'>
				<text>本交易仅支持自提、当面交易</text>
			</view>
			<!-- end -->

			<!-- 图片位置 -->
			<block v-for="(item,index) in carimg" :key="index">
				<image class='img' :src='item'></image>
			</block>
			<!--图片位置end  -->

		</view>
		<!-- 商品内容end -->

		<!-- 商家信息 -->
		<view class='bg-white top-20 padding-sm '>
			<view class='in_regard_to'>
				<view>
					<text class='in_regard_to_text'>关于卖家</text>
				</view>
			</view>

			<navigator :url="'/pages/home/userissue/userissue?sellopenid='+selluserinfo[0].openid">
				<view class="cu-list menu-avatar">
					<view class="cu-item arrow ">
						<image :src="selluserinfo[0].avatarUrl" class="cu-avatar round lg"></image>
						<view class="content">
							<view class="text-grey">{{selluserinfo[0].nickName}}</view>
						</view>
						<view class="action arrow">
							<view class="cuIcon-right"></view>
						</view>
		 		</view>
				</view>
			</navigator>

			<view class='bg-gray top-30 information '>

				<view class='Business_information'>
					<view>{{issuecarlength}}</view>
					<view>
						<text>在售二手车</text>
					</view>
				</view>

				<view class='Business_information'>
					<view>{{sellcarlength}}</view>
					<view>
						<text>累计交易</text>
					</view>
				</view>
			</view>
		</view>

		<!-- end -->
		<!-- 更多好车 -->
		<view class='bg-white top-20 '>
			<view class='in_regard_to'>
				<view>
					<text class='in_regard_to_text'>更多好车</text>
				</view>
			</view>


			<!-- 内容 -->
			<view class='container-flex '>
				<view class='card-menu container margin-top' v-for="(item,index) in morecarlist" :key="index">
					<navigator :url="'/pages/home/home_detail/home_detail?carid='+item.carid+'&openid='+item.openid"
						hover-class='none'>
						<view class='container_img'>
							<image :src='getcarimg(item.carimg)'></image>
						</view>
						<view class='container_text'><text>{{item.title}}</text></view>
						<view class='container_price'>
							<text class='container_price_text_0'>￥{{item.money}}</text>
							<view class="cu-tag line-orange">{{item.carnew}}</view>
						</view>
						<view class='container_line'></view>
						<view class='container_user'>
							<image :src='item.avatarUrl'></image>
							<text>{{item.nickName}}</text>
						</view>
					</navigator>
				</view>
			</view>
			<!-- 内容end -->
		</view>

		<!-- end -->


		<!-- 操作选项卡 -->
		<view class="cu-bar bg-white tabbar border shop fixation">
			<button class="action" bindtap='toChat' open-type="contact">
				<view class="cuIcon-service text-green">
					<view class="cu-tag badge"></view>
				</view>
				聊一聊
			</button>
			<button class="action" @tap='tocollect' v-if="iscollected==0">
				<view class="cuIcon-favor text-yellow">
				</view>
				收藏
			</button>
			<button class="action" @tap='quitcollect' v-if="iscollected==1">
				<view class="cuIcon-favorfill text-yellow">
				</view>
			 取消收藏
			</button>
			<view class="bg-red submit margin-rigth-20" @tap="buy">立即购买</view>
		</view>
		<!-- end -->

	</view>
</template>

<script>
	export default {
		data() {
			return {
				morecarlist: [], //更多二手车的数据
				carid: 0, //需要传给后台的车id
				carlist: [], //后台返回来的车详情
				carimg: [], //车的图片
				sellopenid: '', //卖家openid
				selluserinfo: [], //后台返回的卖家的信息
				issuecarlength:0,//卖家发布的车的数量
				sellcarlength:0,//卖家交易完成的数量
				userinfo: [], //后台返回的买家的信息
				iscollected: 0, //用于判断是否被收藏,0用户没收藏,1用户收藏了
			}
		},
		methods: {
			//加载这个车的详情
			showcardetail() {
				var _this = this
				uni.request({
					url: _this.$url + '/yao/cardetail',
					method: 'GET',
					data: {
						carid: _this.carid
					},
					success(res) {
						// console.log(res.data.carlist)
						_this.carlist = res.data.carlist
						//处理图片
						_this.carimg = res.data.carlist[0].carimg.split(',')
						_this.showsellinfo() //获取卖家的详细信息
					}
				})
			},
			//得到更多好车
			showmorecar() {
				var _this = this
				uni.request({
					url: _this.$url + '/yao/randcarinfo',
					method: 'GET',
					data: {},
					success(res) {
						console.log(res.data.carlist)
						_this.morecarlist = res.data.carlist

					}
				})
			}, //图片过滤器
			getcarimg(e) {
				return e.split(',')[0]
			},
			//得到卖家信息
			showsellinfo() {
				var _this = this
				uni.request({
					url: _this.$url + '/yao/userinfo',
					method: 'GET',
					data: {
						openid: _this.sellopenid
					},
					success(res) {
						// console.log('卖家信息：' + res.data)
						_this.selluserinfo = res.data.userinfo
					}
				})
			},
			//得到卖家的发布上架了的车的数量
			showissue(){
				var _this = this
				uni.request({
					url: _this.$url + '/yao/getmyissue',
					method: 'GET',
					data: {
						openid: _this.sellopenid
					},
					success(res) {
						let issuecarlength=0
						for(var i=0;i<res.data.carinfo.length;i++){
							if(res.data.carinfo[i].ischeck==1){
								issuecarlength++
							}
						}
						_this.issuecarlength=issuecarlength
					}
				})
			},
			//累计交易的车的数量
			showjiaoyicar(){
				var _this = this
				uni.request({
					url: _this.$url + '/yao/getsellcar',
					method: 'GET',
					data: {
						openid: _this.sellopenid
					},
					success(res) {
						// console.log('交易的车的数量'+res.data.mysellcar[0])
						let sellcarlength=0	
						for(var i=0;i<res.data.mysellcar.length;i++){
							if(res.data.mysellcar[i].issend==2){
								sellcarlength++
							}
						}
						_this.sellcarlength=sellcarlength
					}
				})
			},
			
			
			//得到买家信息,看绑定了手机号没
			showmyinfo() {
				var _this = this
				uni.request({
					url: _this.$url + '/yao/userinfo',
					method: 'GET',
					data: {
						openid: uni.getStorageSync('openid')
					},
					success(res) {
						_this.userinfo = res.data.userinfo
						console.log(_this.userinfo)
					}
				})
			},
			// 点击购买跳转订单详细页面
			buy: function() {
				var that = this
				if (that.userinfo[0].phone == null) {
					uni.showToast({
						title: '请绑定手机号',
						image: '/static/错误.png',
						duration: 800
					})
				}else if(that.carlist[0].openid==uni.getStorageSync('openid')){
					uni.showToast({
						title: '这是您的发布',
						image: '/static/错误.png',
						duration: 800
					})
				} else {
					uni.navigateTo({
						url: '/pages/home/confirm_order/confirm_order?carid=' + that.carid + '&openid=' + that
							.sellopenid
					});
				}

			},
			//取消收藏
			quitcollect() {
				var _this = this
				uni.request({
					url: _this.$url + '/yao/quitcollocet',
					method: 'POST',
					data: {
						myopenid: uni.getStorageSync('openid'),
						carid: _this.carid
					},
					success(res) {
						uni.showToast({
							title: res.data.message, // 提示的内容
							icon: "success", // 图标，默认success
							duration: 1500,
							success() {
								_this.iscollected = 0
							}
						})
					}
				})
			},
			//收藏
			tocollect() {
				var _this = this
				const collectlist = {
					carid: _this.carid,
					sellavatarUrl: _this.selluserinfo[0].avatarUrl,
					sellnickname: _this.selluserinfo[0].nickName,
					cartitle: _this.carlist[0].title,
					carimg: _this.carlist[0].carimg,
					money: _this.carlist[0].money,
					sellopenid: _this.sellopenid, //商家的openid
					myopenid: uni.getStorageSync('openid') //自己的openid				
				}
				uni.request({
					url: _this.$url + '/yao/mycollocet',
					method: 'POST',
					data: {
						collectlist
					},
					success(res) {
						uni.showToast({
							title: res.data.message, // 提示的内容
							icon: "success", // 图标，默认success
							duration: 1500,
							success() {
								_this.iscollected = 1
							}
						})
					}
				})
			},
			//加载时判断该二手车是否被该用户收藏
			iscollect() {
				var _this = this
				uni.request({
					url: _this.$url + '/yao/iscollocet',
					method: 'POST',
					data: {
						myopenid: uni.getStorageSync('openid'),
						carid: _this.carid
					},
					success(res) {
						console.log(res.data)
						if (res.data.results == 1) {
							_this.iscollected = 1
						}
					}
				})
			}
		},
		onLoad: function(option) {
			console.log('参数', option.carid)
			console.log('商家openid', option.openid)
			this.carid = option.carid
			this.sellopenid = option.openid
			this.showcardetail() //页面加载就展示车的所有详情
			this.iscollect() //判断这个用户是否收藏该车
			this.showmyinfo() //得到用户自己的信息用于判断是否绑定了手机号
			this.showmorecar() //展示更多二手车
			this.showissue()//卖家在售的车的数量
			this.showjiaoyicar()//卖家累计交易车的数量
		},
	}
</script>

<style>
	/* 商家信息 */

	.padding-name {
		padding-top: 25rpx;
		padding-left: 20rpx;
	}

	.padding-name text {
		color: gray;
		font-size: 20rpx;
	}

	.fl image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 100%;
	}

	.padding-time {
		padding-top: 45rpx;
	}

	text-title-size {
		font-size: 50rpx;
		color: gray;
	}

	/* 商家信息end */

	/* 商品内容 */
	.top-20 {
		margin-top: 20rpx;
		margin-bottom: 65rpx;
	}

	.price-size {
		font-size: 50rpx;
		color: red;
	}

	.price-symbol {
		font-size: 20rpx;
		color: red;
	}

	.price-ori {
		margin-left: 25rpx;
		text-decoration: line-through;
	}

	.font-size text {
		font-size: 35rpx;
		color: black;
	}

	.hint {
		margin-top: 20rpx;
		color: black;
		font-size: 35rpx;
	}

	.img {
		margin-top: 10rpx;
		width: 100%;
		height: 800rpx;
	}

	.cu-tag {
		margin-left: 20rpx;
		/* padding: 0rpx; */
		font-size: 22rpx;
	}

	.browse {
		display: flex;
		justify-content: space-between;
	}

	.browse-tiem {
		font-size: 23rpx;
		color: gray;
	}

	.padding-browse {
		padding: 10rpx;
	}

	/* 商品内容end */

	/* 商家信息 */
	.in_regard_to {
		display: flex;
		align-items: center;
	}

	.in_regard_to image {
		width: 50rpx;
		height: 65rpx;
	}

	.in_regard_to_text {
		font-size: 35rpx;
		color: black;
		font-family: inherit;
	}

	.top-30 {
		margin-top: 30rpx;

	}

	.Business_information {
		/* width: 30%; */
		padding: 5rpx;
		display: flex;
		flex-direction: column;
		align-content: center;
		align-items: center;

	}

	.information {
		/* border-top-left-radius: 5%;
  border-top-right-radius: 5%; */
		border-radius: 20rpx;
		padding: 10rpx;
		display: flex;
		justify-content: space-around;
	}

	.item-inline {
		display: inline-block;
		margin-right: 10rpx;
		height: 150rpx;
		width: 230rpx;
	}

	/* end */

	/* 消息 */
	.msg {
		display: flex;
	}

	.msg-conetent {
		margin-left: 30rpx;
		display: flex;
		flex-direction: column;
		/* align-items: center; */
		margin-top: 10rpx;
		width: 80%;
	}

	.msg-timer {
		padding-left: 20rpx;
	}

	.msg-timers {
		color: gray;
		font-size: 22rpx;
	}

	/* end */



	/* 相似商品 */
	.container {
		margin-left: 29rpx;
		margin-right: 20rpx;
		/* float: left; */
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

	.container-flex {
		display: flex;
		flex-wrap: wrap;
	}

	/* end */

	/* 底部操作选项卡 */
	.fixation {
		position: fixed;
		bottom: 0rpx;
		width: 100%;
	}

	.margin-rigth-20 {
		margin-right: 20rpx;
	}

	/* end */
</style>
