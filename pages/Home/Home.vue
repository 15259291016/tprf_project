<template>
  <view class="container">
    <view class="header">
      <text class="title">我的植物</text>
	  <div></div>
      <text class="subtitle">观察并记录植物生长过程</text>
	  <div></div>
      <text class="participation">1553人已参与</text> <!-- 增加参与人数 -->
    </view>

    <view class="grid">
<!--      <view class="grid-item yellow">
        校园动态
      </view> -->
      <view class="grid-item pink">
        云上的植物
        <text class="small-text">高科技的远程种植</text> <!-- 增加小字 -->
      </view>
      <view class="grid-item green">
        身边的植物
        <text class="small-text">已点亮966株植物</text> <!-- 增加小字 -->
      </view>
      <view class="grid-item blue" @click="goToDetailPage()">
        拍照识花
      </view>
<!--      <view class="grid-item dark-green">
        更多
      </view> -->
      <view class="grid-item purple">
        智能设备
        <text class="small-text">学习编程 体验智慧农业</text> <!-- 增加小字 -->
      </view>
      <view class="grid-item dark-green">
        留言互动
      </view>
    </view>
  </view>
</template>



<script>
	export default {
		name: 'Home',
		data() {
			return {
				
			}
		},
		methods: {
			goToDetailPage() {
				uni.navigateTo({
					url: '/pages/index/index' // 跳转的目标页面路径
				});
			}
		}
	}
</script>

<style>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx;
	background-color: #F5F5F5; /* 更柔和的背景色 */
	background-image: url('/static/bg.jpg'); /* 设置背景图片 */
	background-size: cover; /* 使图片覆盖容器 */
	background-position: center; /* 居中显示 */
	background-repeat: no-repeat; /* 不重复 */
}

.header {
  margin-bottom: 40px;
  text-align: center;
  background-color: #FFFFFF; /* 白色背景 */
  padding: 20rpx;
  border-radius: 30rpx;
  box-shadow: 0 0rpx 20rpx rgba(0, 0, 0, 0.1); /* 增加阴影效果 */
  width: 90%;
  background-image: url('/static/flowerbg.png'); /* 设置背景图片 */
  padding-bottom:160px;
  padding-right:0px;
  text-align: left; /* 设置文本左对齐 */
  border-bottom-width: 10px;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  color: #2C3E50; /* 更深的文字颜色 */
}

.subtitle {
  font-size: 32rpx;
  color: #95A5A6; /* 灰色文字 */
}

.participation {
  font-size: 28rpx;
  color: #16A085; /* 绿色文字 */
  margin-top: 10rpx;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 30rpx; /* 增加间距 */
  width: 100%;
}

.grid-item {
  background-color: #fff;
  padding: 40rpx;
  border-radius: 25rpx; /* 圆角 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 32rpx;
  text-align: center;
  box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.1); /* 增加阴影效果 */
  transition: transform 0.2s;
}

.grid-item:active {
  transform: scale(0.98);
}

.small-text {
  font-size: 26rpx;
  color: #7F8C8D; /* 灰色小字 */
  margin-top: 10rpx;
}

.yellow { background-color: #FFEB3B; }
.pink { background-color: #FFC1C1; }
.green { background-color: #A8E6CF; }
.blue { background-color: #B3E5FC; }
.dark-green { background-color: #689F38; }
.purple { background-color: #D1C4E9; }

</style>
