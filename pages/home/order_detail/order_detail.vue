<template>
	<view>
		<!-- 步骤条 -->
		<view class="bg-white padding-sm ">
		  <view class="cu-steps">
		    <view class="cu-item " :class="index>basics?'':'text-green'" v-for="(item,index) in basicsList" :key="index">
		      <text class="cuIcon-roundcheckfill"></text> {{item.name}}
		    </view>
		  </view>
		</view>
		<!-- end -->
		
		
		<!-- 价钱 -->
		<view class='price bg-white'>
		
		<view class='price-item'>
		<view><text class='text-sl text-red text-uni'>付款成功</text></view>
		<view class='price-explain-1s'><text>卖家若两周未发货,管理员会联系您,并将欠款会打到您的微信账户中</text></view>
		</view>
		</view>
		<!-- end -->
		
		<!-- 分离线 -->
		<view class='line'></view>
		<!-- end -->
		
		<!-- 物流描述 -->
		
		<view class='logistics padding bg-white'>
		<view><text class='text-black'>见面交易，无需物流</text></view>
		</view>
		<!-- end -->
		
		
		<!-- 分离线 -->
		<view class='line'></view>
		<!-- end -->
		
		<!-- 分离线 -->
		<view class='line'></view>
		<!-- end -->
		
		<!-- 交易信息 -->
		<view class='shopping bg-white'>
		
		<view class='shopping_desc margin-bottom-xs-15'>
		<text>卖家姓名：</text>
		<text>{{orderslist[0].userName}}</text>
		</view>
		<view class='shopping_desc margin-bottom-xs-15'>
		<text>卖家手机号</text>
		<text>{{orderslist[0].phone}}</text>
		</view>
		<view class='shopping_desc margin-bottom-xs-15'>
		<text>订单编号</text>
		<text>{{ordersnumber}}</text>
		</view>	
		<view class='shopping_desc '>
		<text>交易时间</text>
		<text>{{orderslist[0].createtime}}</text>
		</view>
		
		</view>
		<!-- end -->
		
		<!-- 分离线 -->
		<view class='line'></view>
		<!-- end -->
		
		
		<!-- 确定按钮 -->
		<view class='comfirm bg-white'>
		
		<button class='bg-green cu-btn margin-tb-sm comfirm_button lg' @tap='gomy'>回到个人中心查看订单</button>
		
		</view>
		<!-- end -->
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
					ordersnumber:'',//订单编号
					orderslist:[],//这个订单
					basics: 1,//控制步骤条状态
				    // 步骤条
				    basicsList: [{
				      icon: 'roundcheckfill',
				      name: '已拍下'
				    }, {
				        icon: 'roundcheckfill',
				      name: '已付款'
				    }, {
				        icon: 'roundcheckfill',
				      name: '已发货'
				    }, {
				      icon: 'roundcheckfill',
				      name: '交易成功'
				    }
				    ]
			}
		},
		methods: {
			getorderdetail(){
				var _this=this
				uni.request({
					url: _this.$url + '/yao/getorders',
					method: 'GET',
					data: {
						search:_this.ordersnumber
					},
					success(res) {
						console.log(res.data)
						_this.orderslist=res.data.orderslist
					}
				})
			},
			//跳转到个人中心页面
			gomy(){
				uni.switchTab({
					url:'/pages/my/my'
				})
			}
		},
		onLoad(options) {

			this.ordersnumber=options.ordersnumber
			console.log(this.ordersnumber)
			this.getorderdetail()
		}
	}
</script>

<style>
/* 价钱 */
.price{
  width: 100%;
  padding: 60rpx;
  height: 380rpx;
}
/* end */
/* price */
.price-item{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.price-explain text{
  font-size: 32rpx;
  color: gray;
  font-weight: 55;
}
.price-explain-1 text{
  font-size: 25rpx;
  font-weight: 550;
  
}
.price-explain-1s text{
  font-size: 25rpx;
  color: black;
  font-weight: 550;
  
}
.price-explain-1s{
  width: 95%;
}
.line{
  width: 100%;
  height: 4rpx;
  background: gainsboro;
}
/* end */

/* 物流信息 */
.logistics{
display: flex;
justify-content: space-between;
align-items: center;
height: 170rpx;
}
/* end */

/* 商品描述 */
/* .shoppin_detail{
  display: flex; 
  padding: 20rpx;
  height: 250rpx;
  align-items: center;
}
.shoppin_detail_img image{
  height: 130rpx;
  width: 130rpx;
}
.shopping_detail{
  margin-left: 20rpx;
  width: 100%;
}
.shopping_detail-2{
  margin-top: 20rpx;
}
.shopping_detail_title{
  display: flex;
  justify-content:space-between;
  width: 95%;
}
.shopping_detail_title_1{
  width: 75%;
} */
/* end */

/* 交易信息 */
.shopping{
  padding: 30rpx;
  height: 235rpx;
}
.shopping_desc{
  display: flex;
  justify-content: space-between;
}
.shopping text{
  font-size: 28rpx;
}
.margin-bottom-xs-15{
  margin-bottom: 15rpx;
}
/* end */

/* 确定 */
.comfirm{
  width: 100%;
  height: 150rpx;
  padding: 20rpx;
}
.comfirm_button{
  width: 100%;
}
/* end */
</style>
