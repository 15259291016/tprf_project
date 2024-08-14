<template>
  <view class="page">
    <div class="ai-con">
      <div class="temp">
        <image width="100%"
               class="userpic"
               v-if="tempUrl"
               height="100%"
               :src="tempUrl"></image>
        <div class="nopic-text"
             v-if="!tempUrl">等待上传照片</div>
        <div class="matchname"
             v-if="currentName">
          {{currentName}}
        </div>
      </div>
      <div class="airesult"
           :class="[{loading:!AILoading}]">
        <div class="loadingcon"
             v-if="AILoading">
          物种识别中...
        </div>
        <swiper class="swiper"
                v-else
                :indicator-dots="true"
                indicator-active-color="#65BA94"
                :autoplay="false"
                @change="swiperChange">
          <swiper-item v-for="(item,index) in AIRes"
                       class="u-swiper-item"
                       :key="index">
            <view class="swiper-item u-list-image-wrap">
              <div class="avatar">
                <image class="avatar"
                       v-if="item.avatar"
                       :src="item.avatar">
                </image>
              </div>
              <div class="intro ">
                <div class="hd">
                  {{item.name}}
                </div>
                <div class="score">
                  匹配度 {{item.scoreStr}}
                </div>
                <div class="bd "
                     v-if="item.baike_info.description">
                  {{item.baike_info.description}}
                </div>
              </div>
            </view>
          </swiper-item>
        </swiper>

      </div>

    </div>
    <div class="butcon">
      <div class="btn"
           @click="chooseImage('tempLogAvatar')">
        <text class="text">拍照识花</text>
      </div>
    </div>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: "Hello",
      tempUrl: "",
      AILoading: false,
      currentIndex: 0,

      AIRes: [],
    };
  },
  onLoad() {},
  computed: {
    currentName() {
      let { currentIndex, AIRes } = this;
      if (AIRes.length) {
        return AIRes[currentIndex].name;
      }
      return "";
    },
  },
  methods: {
    swiperChange(e) {
      this.currentIndex = e.detail.current;
    },
    /**
     * 获取百度AI的token  由云函数获取
     */
    async getAIToken() {
      let result = await uniCloud.callFunction({
        name: "getBaiduAiToken",
        data: { a: 1 },
      });

      this.AIToken = result.result.access_token;
    },
    /**
     * 调用百度AI的识别接口
     */
    async AiIdentify(url) {
      this.AILoading = true;

      await this.getAIToken();
      uni.request({
        url: "https://aip.baidubce.com/rest/2.0/image-classify/v1/plant", //仅为示例，并非真实接口地址。
        data: {
          access_token: this.AIToken,
          url,

          baike_num: 4,
        },

        success: (res) => {
          console.log(res.data);
          this.text = "request success";

          this.AILoading = false;
          if (res.error_code) {
            return;
          }
          if (res.data.error_code) {
            uni.showToast({
              icon: "none",
              title: "识别失败，请重试",
            });
          } else {
            this.AIRes = res.data.result.map((item) => {
              item.scoreStr = (item.score * 100).toFixed(3) + "%";
              item.avatar = item.baike_info.image_url;
              return item;
            });
          }
        },
      });
    },
    /**
     * 上传文件处理
     */
    async chooseImage(field) {
      let that = this;
      let { title } = this;
      this.AIRes = [];
      this.tempUrl = "";
      uni.chooseImage({
        count: 1, //默认9
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        // sourceType: ["album"], //从相册选择
        success: async (res) => {
          uni.showLoading({
            title: "图片上传中",
          });

          if (res.tempFilePaths.length != 0) {
            // promise方式
            let filePath = res.tempFilePaths[0];

            const result = await uniCloud.uploadFile({
              filePath: filePath,
              cloudPath: "temp.jpg",
              onUploadProgress: function (progressEvent) {
                console.log(progressEvent);
                var percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
              },
            });

            if (result.success) {
              uni.hideLoading();
              that.AiIdentify(result.fileID);
              that.tempUrl = result.fileID;
              that.AILoading = true;
            } else {
              uni.showToast({
                title: "上传失败",
                duration: 1000,
              });
              uni.hideLoading();
            }
          }
        },
      });
    },
  },
};
</script>

<style lang='scss'>
.page {
  background: url("https://nongmo-plant.oss-cn-beijing.aliyuncs.com/dCloud/plugin-plant/bg.png")
    left bottom no-repeat;
  background-size: 676rpx auto;
  min-height: 100vh;
  .ai-con {
    // height: 716rpx;
    background: url("https://nongmo-plant.oss-cn-beijing.aliyuncs.com/dCloud/plugin-plant/headerbg.png")
      right top no-repeat;
    background-size: 676rpx auto;
    .temp {
      margin: 0 auto;
      width: 692rpx;
      height: 476rpx;
      //   background: #ccc;
      border-radius: 36rpx;
      overflow: hidden;
      background: url("https://nongmo-plant.oss-cn-beijing.aliyuncs.com/weapp/nopic.png")
        center center no-repeat;
      background-size: 232rpx auto;
      position: relative;
      .userpic {
        display: block;
        width: 100%;
        height: 100%;
      }
      .matchname {
        bottom: 0;
        left: 0;
        position: absolute;
        font-size: 34rpx;
        text-align: center;
        font-weight: 500;
        width: 100%;
        height: 84rpx;
        font-size: 43rpx;
        color: #fff;
        line-height: 84rpx;
        background: #65ba94;
        border-radius: 36rpx;
        opacity: 0.73;
      }
      .nopic-text {
        bottom: 10rpx;
        width: 100%;
        left: 0;
        position: absolute;
        font-size: 40rpx;
        text-align: center;
        padding: 20rpx;
        color: #d0e0dd;
      }
    }
    .imgcon {
      width: 200px;
      height: 200px;
      background: #ccc;
      margin: 0 auto;
    }
    .loading {
      text-align: center;
    }
  }
  .airesult {
    margin: 0 auto;
    margin-top: 40rpx;
    width: 692rpx;
    background: #fff;
    border-radius: 36rpx;
    padding: 20rpx 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    .loadingcon {
      width: 100%;
      text-align: center;
      padding-top: 180rpx;
      background: url("https://nongmo-plant.oss-cn-beijing.aliyuncs.com/weapp/loading.png")
        #fff center top no-repeat;
      background-size: 200rpx auto;

      color: #92b5ad;
    }
    .swiper {
      width: 100%;
      height: 303rpx;
      .swiper-item {
        display: flex;
        justify-content: space-between;
        background: #fff;

        padding: 20rpx 30rpx;
        .avatar {
          width: 284rpx;
          height: 255rpx;
          flex: 0 0 284rpx;
          border-radius: 10rpx;
          overflow: hidden;
          background: url("https://nongmo-plant.oss-cn-beijing.aliyuncs.com/weapp/nopic.png")
            #fff center center no-repeat;
          background-size: 100% auto;
        }
        .intro {
          width: 284rpx;
          height: 228rpx;
          color: #2a6456;
          overflow: hidden;
          .hd {
            font-size: 38rpx;
          }
          .bd {
            font-size: 24rpx;
            line-height: 1.2;
          }
        }
      }
    }
  }
  .butcon {
    margin: 0 auto;
    text-align: center;
    .btn {
      height: 118rpx;
      background: url("https://nongmo-plant.oss-cn-beijing.aliyuncs.com/dCloud/plugin-plant/button_bg.png")
        center center no-repeat;
      background-size: auto 100%;
      line-height: 110rpx;
      color: #fff;
      .text {
        padding-left: 14px;
      }
    }
  }
}
</style>
