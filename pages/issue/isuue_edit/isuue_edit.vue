<template>
	<view>
		<form @bindsubmit="formSubmit" @reset="">
			<!-- 标题 -->
			<view class="cu-form-group margin-top">
				<view class="title">标题</view>
				<input @input="getTitle" :value="title" type="text" placeholder="车系品牌是买家喜欢搜索的"></input>
			</view>
			<!-- end -->

			<!-- 内容 -->
			<view class="cu-form-group margin-top">
				<textarea name="content" maxlength="1000" @input="textareaAInput" placeholder="可以描述车的转手原因和使用感受"
					:value="description"></textarea>
			</view>
			<!-- end -->

			<!-- 图片 -->
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					图片上传(第一张图为标题图)
				</view>
				<view class="action">
					{{imgList.length}}/5
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage"
						:data-url="imgList[index]">
						<image :src="imgList[index]" mode='aspectFill'></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class="cuIcon-close"></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage" v-if="imgList.length < 6">
						<text class="cuIcon-cameraadd"></text>
					</view>
				</view>
			</view>
			<!-- end -->

			<!-- 地址 -->
			<view class='container-address bg-white' >
				<view class='container-address-1'><text>二手车自提或面交地址</text></view>
				<view class='container-address-2' @tap='toadress'>
					<view class='container-address-2_1'><text>{{userName}}</text><text>{{phone}}</text></view>
					<view class='container-address-2_2'><text>{{address}} </text></view>
					<view class='container-address-2_2'><text
							v-if="addressdetail!=null">{{addressdetail}}</text></view>
				</view>
				<view class='container-address-3'>
					<view class="cuIcon-right"></view>
				</view>
			</view>
			<!-- end -->
			<!-- 价钱 -->
			<view class="cu-form-group margin-top">
				<view class="title">出售价:</view>
				<input type="digit" @input="moneyInput" :value="money" placeholder="请输入价钱" maxlength='7'
					name="newPrice"></input>

				<view class="title">原价:</view>
				<input type="digit" @input="newInput" :value="newMoney" placeholder="请输入原价" maxlength='7'
					name="oriPrice"></input>

			</view>
			<!-- end -->

			<!-- 选择分类  -->
			<view class="cu-form-group">
				<view class="title">分类:</view>
				<input disabled="true" name="brandname" :value='brandname'></input>
				<button class="cu-btn  bg-green" role="button" aria-disabled="false" @tap="showModal"
					data-target="DrawerModalL">选择</button>
			</view>
			<!-- end -->

			<!-- 新旧 -->
			<view class="cu-form-group">
				<view class="title">新旧:</view>
				<input disabled="true" name="itemLists" :value='itemLists[itemListsIndex]'></input>
				<button class="cu-btn  bg-green" role="button" aria-disabled="false" @tap="newState">选择</button>
			</view>
			<!-- end -->
			<!-- 确定发布 -->
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-green margin-tb-sm lg" form-type="formSubmit" @tap="gocarinfo">重新发布</button>
			</view>
			<!-- end -->
		</form>

		<!-- 模态框 -->
		<view @touchmove.stop="modeMove" class=" cu-modal drawer-modal justify-start "
			:class=" modalName == 'DrawerModalL'?'show':'' " @tap="hideModal">
			<scroll-view scroll-with-animation='true' scroll-y='true' class="cu-dialog basis-lg">
				<view class="cu-list menu text-left">
					<view class="cu-item " v-for=" (item,index) in  picker" :key="index" @tap="getbrandname"
						:data-name="item.brandname_name" :data-value="item.brandname_id">
						<view class="content">
							<view>{{item.brandname_name}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalName: '', //模态框开关
				picker: [{
						brandname_id: 1,
						brandname_name: '宝马'
					},
					{
						brandname_id: 2,
						brandname_name: '本田'
					},
					{
						brandname_id: 3,
						brandname_name: '大众'
					},
					{
						brandname_id: 4,
						brandname_name: '五菱宏光'
					},
					{
						brandname_id: 5,
						brandname_name: '奥迪'
					},
					{
						brandname_id: 6,
						brandname_name: '比亚迪'
					},
					{
						brandname_id: 7,
						brandname_name: '别克'
					},
					{
						brandname_id: 8,
						brandname_name: '日产'
					},
					{
						brandname_id: 9,
						brandname_name: '奔驰'
					},
					{
						brandname_id: 10,
						brandname_name: '其他车系'
					},

				],
				title: '', //标题
				description: '', //描述
				carnew: '', //（默认全新）新旧程度
				itemLists: ['全新', '9新', '8新', '7新', '6新'], //几新
				itemListsIndex: 0, //新旧下标
				brandname: '其他车系', //选择默认其他车系 ，车系选择
				money: '', //出售价
				newMoney: '', //原价
				imgList: [], //图片上传
				carid: '',
				// addresscarid: '', //该用户的之前填写的面交地址的id
				addresslist: [], //用户的之前填写的面交地址
				userName:'',
				address:'',
				addressdetail:"",
				phone:""
			}
		},
		methods: {
			//得到标题
			getTitle: function(e) {
				console.log(e.detail.value)
				this.title = e.detail.value
			},
			//获取文本域
			textareaAInput(e) {
				console.log(e.detail.value)
				this.description = e.detail.value
			},
			// 图片上传
			ChooseImage() {
				uni.chooseImage({
					count: 5, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						//图片文件的地址
						console.log(res.tempFilePaths)
						if (this.imgList.length != 0) {
							this.imgList.push(res.tempFilePaths[0])
							console.log(this.imgList)
						} else {
							this.imgList = res.tempFilePaths
						}
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			// 删除照片
			DelImg(e) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这个照片吗？',
					cancelText: '再看看',
					confirmText: '删除',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1);
							this.imgList = this.imgList
						}
					}
				})
			},
			//售价
			//限制只能到小数点2位
			moneyInput: function(e) {
				var money;
				if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) { //正则验证，小数点后不能大于两位数字
					money = e.detail.value;
				} else {
					money = e.detail.value.substring(0, e.detail.value.length - 1);
				}
				this.money = money;
			},

			//原价验证
			newInput: function(e) {
				var money;
				if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) { //正则验证，小数点后不能大于两位数字
					money = e.detail.value;
				} else {
					money = e.detail.value.substring(0, e.detail.value.length - 1);
				}
				this.newMoney = money;
			},


			// 选择交易方式
			checkboxChange: function(e) {
				console.log(e);
				//获取选择状态
				var item = this.checkboxs,
					values = e.detail.value;
				for (var i = 0; i < item.length; i++) {
					item[i].checked = false; //初始化选择状态
					for (var j = 0; j < values.length; j++) {
						if (item[i].value == values[j]) {
							item[i].checked = true;
							break;
						}
					}
				}
			},

			// 新旧程度
			newState: function(e) {
				var that = this;
				uni.showActionSheet({
					itemList: that.itemLists,
					success(e) {
						that.itemListsIndex = e.tapIndex
						if (e.tapIndex == 0) {
							that.carnew = '全新'
						} else if (e.tapIndex == 1) {
							that.carnew = '9新'
						} else if (e.tapIndex == 2) {
							that.carnew = '8新'
						} else if (e.tapIndex == 3) {
							that.carnew = '7新'
						} else if (e.tapIndex == 4) {
							that.carnew = '6新'
						}
						console.log(that.carnew)
					}
				})
			},
			// 拦截模态框滚动事件
			modeMove: function() {

			},

			// 显示分类模态框
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			// 隐藏分类模态框
			hideModal(e) {
				this.modalName = null
			},
			// 得到分类的值
			getbrandname: function(e) {
				this.brandname = e.currentTarget.dataset.name,
					this.brandname_id = e.currentTarget.dataset.value
				this.hideModal();
				console.log(this.brandname)
			},

			//得到腾讯云返回的图片的地址
			carimgshow() {
				var _this = this
				var returnList = []
				var tempFilePaths = _this.imgList
				// //多图片上传，imgs本地图片地址为一个数组，遍历调用服务器图片上传接口即可实现多图保存
				return new Promise(resolve => {
					let len = tempFilePaths.length // 获取图片地址的数量
					let timer = null // 创建变量，用来创建定时器
					for (let i = 0; i < tempFilePaths.length; i++) {
						uni.uploadFile({
							url: _this.$url + '/yao/upload',
							filePath: tempFilePaths[i], //单文件上传
							// files:imgs,//多文件上传
							name: 'file',
							success: function(res) {
								// console.log(JSON.parse(res.data).img)
								var imgs = 'https://' + JSON.parse(res.data).img
								returnList.push(imgs)

							},
							complete: (X) => {
								console.log('完成..: ' + len)
								len--; // 不论success还是fail，都把len-1
							}
						})
					}
					// 关键部分
					// 通过此部分来延续方法的时长，待到异步的回调执行完毕后则关闭
					// 以防万一，建议设定一个阈值，防止出现意外导致无限循环
					timer = setInterval(() => {
						// console.log(len);
						if (!len || len < -5000) { // 只要len结束，将定时器清除
							// console.log("同步结束");
							resolve(returnList)
							clearInterval(timer) // 上传操作完成，消除阻塞
						}
					}, 1) // 这个参数一定要写，如果不写在IOS端会报错导致同步失败		
				})
			},
			//上传数据库
			gocarinfo() {
				if (this.title != '' && this.description != '' && this.carnew != '' && this.newMoney != '' && this
					.imgList != '') {
					this.carimgshow().then(results => {
						var _this = this
						const str = {
							title: _this.title, //标题
							description: _this.description, //描述
							carnew: _this.carnew, //（默认全新）新旧程度
							brandname: _this.brandname, //选择默认其他车系 ，车系选择
							money: _this.money, //出售价
							newMoney: _this.newMoney, //原价
							imgList: results, //图片上传
							carid: _this.carid,
							addresscarid: _this.addresslist[0].addresscarid, //地址的addresscarid
						}
						// console.log(str)
						uni.request({
							url: _this.$url + '/yao/updatemyissue',
							method: 'POST',
							data: {
								str: str
							},
							success(res) {
								console.log('修改发布成功后返回的信息', res)
								if (res.data.message == '重新发布成功') {
									uni.showToast({
										title: res.data.message, // 提示的内容
										icon: "success", // 图标，默认success
										duration: 3000,
									})
								} else {
									uni.showToast({
										title: '重新发布失败', // 提示的内容
										duration: 1500, // 提示的延迟时间，默认1500
									})
								}
							},
						})
					})
				} else {
					uni.showToast({
						title: '请填写完整!',
						icon: 'none'
					})
				}
			},
			//将原来的信息显示上去
			getcarinfo() {
				var _this = this
				uni.request({
					url: _this.$url + "/yao/cardetail",
					method: 'GET',
					data: {
						carid: _this.carid
					},
					success(res) {
						console.log(res.data)
						_this.title = res.data.carlist[0].title;
						_this.brandname = res.data.carlist[0].brandname;
						_this.imgList = res.data.carlist[0].carimg.split(',');
						_this.carnew = res.data.carlist[0].carnew;
						_this.money = res.data.carlist[0].money;
						_this.newMoney = res.data.carlist[0].newMoney;
						_this.description = res.data.carlist[0].description;
						// _this.addresscarid = res.data.carlist[0].addresscarid;
						// _this.getoldaddress(res.data.carlist[0].addresscarid) //回显面交地址
						_this.userName=res.data.carlist[0].userName;
						_this.address=res.data.carlist[0].address;
						_this.addressdetail=res.data.carlist[0].addressdetail;
						_this.phone=res.data.carlist[0].phone
					}
				})
			},
			//根据得到的addresscarid将原来的面交地址显示上去
			getoldaddress(addresscarid) {
				var _this = this
				uni.request({
					url: _this.$url + "/yao/getaddressdetail",
					method: 'GET',
					data: {
						addresscarid: addresscarid
					},
					success(res) {
						_this.addresslist = res.data.addresslist
					}
				})
			},
			// //显示用户的默认面交地址
			// getaddress() {
			// 	var _this = this
			// 	uni.request({
			// 		url: _this.$url + '/yao/getaddressdefault',
			// 		method: 'GET',
			// 		data: {
			// 			openid: uni.getStorageSync('openid')
			// 		},
			// 		success(res) {
			// 			_this.addresslist = res.data.addresslist
			// 		},
			// 	})
			// },
			//去地址管理
			toadress() {
				uni.navigateTo({
					url: '/pages/my/my_address/my_address?issue="true"'
				})
			}
		},
		onLoad(options) {
			console.log(options)
			this.carid = options.carid
			this.getcarinfo() //回显车信息

		},

		// 出发下拉刷新
		onPullDownRefresh() {
			// 模拟刷新完成
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 2000);
		}
	}
</script>

<style>
	.rule {
		display: flex;
		justify-content: space-between;
	}

	.margin-top-xl-170 {
		margin-top: 170rpx;
	}

	/* 地址 */
	.container-address {
		height: 200rpx;
		width: 100%;
		margin-top: 30rpx;
		padding: 20rpx;
		display: flex;
		align-items: center;
	}

	.container-address-1 {
		width: 20%;
	}

	.container-address-1 text {
		font-weight: 600;
	}

	.container-address-2 {
		width: 55%;
		margin-right: 20rpx;
		margin-left: 100rpx
	}

	.container-address-2_1 {
		direction: rtl;
		margin-bottom: 10rpx;
	}

	.container-address-2_1 text {
		font-weight: 550;
	}

	.container-address-2_2 {
		direction: rtl;
	}

	.container-address-2_2 text {
		font-size: 25rpx;
		font-weight: 550;

	}
</style>
