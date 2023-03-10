<template>
	<view class="my_phone">
		<form>
			<view class="cu-form-group">
				<view class="title">姓名</view>
				<input placeholder="请输入姓名" name="username" @input="getname" :value='name'></input>
			</view>
			<view class="cu-form-group">
				<view class="title">手机号码</view>
				<input placeholder="输入手机号" name="phone" @input="getphone" :value='phone'></input>
				<view class="cu-capsule radius">
					<view class='cu-tag bg-blue '>+86</view>
					<view class="cu-tag line-blue">中国大陆</view>
				</view>
			</view>
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-blue margin-tb-sm lg" @tap='bindphone' v-if="userinfo[0].phone==null">确认绑定</button>
				<button class="cu-btn bg-orange margin-tb-sm lg" @tap='bindphone' v-if="userinfo[0].phone!=null">更改绑定</button>
			</view>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: '',
				phone: '',
				userinfo:[]//用户信息
			}
		},
		methods: {
			//加载时的到用户信息
			getuserinfo(){
				var _this=this
				uni.request({
					url:_this.$url+'/yao/userinfo',
					method:'GET',
					data:{
						openid:uni.getStorageSync('openid')
					},
					success(res) {
						_this.userinfo=res.data.userinfo
						if(_this.userinfo[0].phone!=null){
							_this.name=res.data.userinfo[0].name
							_this.phone=res.data.userinfo[0].phone
						}	
					}
				})
			},
			getname(e) {
				this.name = e.detail.value
			},
			getphone(e) {

				this.phone = e.detail.value;
			},
			bindphone() {
				if (/^[1]([3-9])[0-9]{9}$/.test(this.phone)) {
					var _this = this
					uni.request({
						url: _this.$url + '/yao/bindphone',
						method: 'post',
						data: {
							name: _this.name,
							phone: _this.phone,
							openid:uni.getStorageSync('openid')
						},
						success(res) {
							if(res.data.status==0){
								uni.showToast({
									title:res.data.message,
								})
							}else{
								uni.showToast({
									title:'请联系客服',
								})
							}
						},
					})
				} else {
					uni.showToast({
						title: '手机号不正确',
						icon: 'none'
					})
				}

			}
		},
		mounted() {
			this.getuserinfo()
		}
	}
</script>

<style scoped="scoped">
	.my_phone {
		width: 100%;
		height: 100%;
	}

	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
