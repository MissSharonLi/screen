<template>
  <Frame>
    <div class="platform page-index">
      <header>
        <h1>水联网开盘抢单</h1>
        <p class="money__content">
          <span>￥</span>
          <template v-for="(item, index) in amountData">
            <span v-if="Number(item)" :key="index" class="amount">
              <CountTo
                :key="index"
                :startVal="startVal"
                :endVal="Number(item) || 0"
                :duration="3000"
              ></CountTo>
            </span>
            <span v-if="!Number(item)" :key="`c_${index}`" class="amount zero">
              <CountTo :startVal="startVal" :endVal="0" :duration="3000"></CountTo>
              <CountTo :startVal="startVal" :endVal="0" :duration="3000"></CountTo>
              <CountTo :startVal="startVal" :endVal="0" :duration="3000"></CountTo>
            </span>
            <span v-if="index < amountData.length - 1" :key="`s_${index}`">,</span>
          </template>
        </p>
      </header>
      <article>
        <ElRow type="fix" jusitify="space-between" align="center">
          <ElCol :span="12">
            <ElRow type="fix" jusitify="space-between" align="center">
              <ElCol align="center" :span="4">青岛中心</ElCol>
              <ElCol align="center" :span="4">
                <p style="cursor: pointer" @click="fullScreen()">
                  <i class="el-icon-full-screen"></i>
                  全屏
                </p>
              </ElCol>
            </ElRow>
          </ElCol>
          <ElCol :span="12" align="right">
            <i class="el-icon-time"></i>
            {{ nowTime }}
          </ElCol>
        </ElRow>
      </article>
      <section>
        <ElRow type="fix" justify="space-between" align="top">
          <ElCol :span="7">
            <h2>
              <span>区域网格</span>
              <span>金额：万元</span>
            </h2>
            <div ref="obtain" :style="{ paddingTop: '20px' }">
              <ul>
                <li v-for="(item, index) in areaData" :key="index">
                  <span>{{ item.name }}</span>
                  <span>
                    <div class="el__progress__bar">
                      <div
                        class="el__progress__bar__outer"
                        :style="{ width: item.parcent + '%' }"
                      ></div>
                    </div>
                  </span>
                  <span>{{ item.price }}</span>
                </li>
              </ul>
            </div>
          </ElCol>
          <ElCol :span="10">
            <ElImage :src="require('@assets/images/2.png')"></ElImage>
          </ElCol>
          <ElCol :span="7">
            <h2>
              <span>直营客户</span>
              <span>金额：万元</span>
            </h2>
            <div
              ref="obtain"
              class="right__content"
              :style="{ paddingTop: '20px', height: sectionHeight }"
            >
              <ul>
                <li v-for="(item, index) in listData" :key="index">
                  <span>{{ item.company }}</span>
                  <span>
                    <div class="el__progress__bar">
                      <div
                        class="el__progress__bar__outer"
                        :style="{ width: item.parcent + '%' }"
                      ></div>
                    </div>
                  </span>
                  <span>{{ item.price }}</span>
                </li>
              </ul>
            </div>
            <h2>
              <span>伞下客户</span>
              <span>金额：万元</span>
            </h2>
            <div
              ref="obtain"
              class="right__content"
              :style="{ paddingTop: '20px', height: sectionHeight }"
            >
              <ul>
                <li v-for="(item, index) in umListData" :key="index">
                  <span>{{ item.company }}</span>
                  <span>
                    <div class="el__progress__bar">
                      <div
                        class="el__progress__bar__outer"
                        :style="{ width: item.parcent + '%' }"
                      ></div>
                    </div>
                  </span>
                  <span>{{ item.price }}</span>
                </li>
              </ul>
            </div>
          </ElCol>
        </ElRow>
      </section>
      <div class="barrage__content">
        <VueBaberrage
          :isShow="barrageIsShow"
          :barrageList="barrageList"
          :loop="barrageLoop"
          :throttleGap="throttleGap"
          :extraWidth="200"
        >
          <template #default="slotProps">
            <div class="baberrage-lane">
              <div class="normal">
                <div class="baberrage-avatar"><img /></div>
                <div class="baberrage-msg" v-html="slotProps.item.msg"></div>
              </div>
            </div>
          </template>
        </VueBaberrage>
      </div>
    </div>
  </Frame>
</template>

<script>
import countTo from 'vue-count-to'
import Frame from '@/components/Frame'
import { numberToCurrencyNo } from '@/utils/auth'
import { vueBaberrage, MESSAGE_TYPE } from 'vue-baberrage'
import { getScreenList, getRollList } from '@api'

export default {
  components: { Frame, CountTo: countTo, VueBaberrage: vueBaberrage },
  data() {
    return {
      digits: 123456,
      nowTime: '',
      startVal: 0,
      endVal: 0,
      isFullScreen: false,
      minHeight: '',
      areaData: [],
      listData: [],
      umListData: [],
      loading: null,
      intervalTime: null,
      barrageIsShow: true,
      last_id: 0,
      barrageList: [],
      throttleGap: 5000,
      barrageLoop: false
    }
  },
  computed: {
    sectionHeight() {
      return this.minHeight / 1.6 + 'px'
    },
    amountData() {
      return numberToCurrencyNo(this.endVal)
        .toString()
        .split(',')
    }
  },
  created() {
    this.getData()
    this.nowTimes()
    this.onRefresh()
    this.showLoading()
    this.$nextTick(() => {
      this.minHeight = window.screen.height - this.$refs.obtain.getBoundingClientRect().top - 200
    })
  },
  beforeDestroy() {
    this.clear()
    clearInterval(this.intervalTime) // 销毁定时器
  },
  methods: {
    showLoading() {
      this.loading = this.$loading({
        lock: true,
        text: '加载中……',
        fullscreen: true,
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    hideLoading() {
      this.loading.close()
    },
    async getData() {
      const { code, data } = await getScreenList()
      if (code === 200) {
        this.areaData = data.area
        this.listData = data.order
        this.umListData = data.order_um
        this.endVal = data.sum * 10000
        this.hideLoading()
      }
    },
    async handleRefresh() {
      const { code, data } = await getRollList({ last_id: this.last_id })
      if (code === 200) {
        this.last_id = data.last_id
        data.list.forEach((item, index) => this.initBarrage(item))
      }
    },
    initBarrage(data, last_id) {
      this.barrageList.push({
        id: last_id,
        msg: `<p>${data.company}</p>${data.price}`,
        time: 10,
        type: MESSAGE_TYPE.NORMAL,
        barrageStyle: data.color
      })
    },
    // 每3秒钟刷新一次数据
    onRefresh() {
      this.intervalTime = setInterval(async () => {
        this.getData()
        await this.handleRefresh()
      }, 3000)
    },
    timeFormate(timeStamp) {
      const year = new Date(timeStamp).getFullYear()
      const month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? '0' + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1
      const date =
        new Date(timeStamp).getDate() < 10
          ? '0' + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate()
      const hh =
        new Date(timeStamp).getHours() < 10
          ? '0' + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours()
      const mm =
        new Date(timeStamp).getMinutes() < 10
          ? '0' + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes()
      const ss =
        new Date(timeStamp).getSeconds() < 10
          ? '0' + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds()
      this.nowTime = year + '年' + month + '月' + date + '日' + ' ' + hh + ':' + mm + ':' + ss
    },
    nowTimes() {
      this.timeFormate(new Date())
      setInterval(this.nowTimes, 1000)
      this.clear()
    },
    clear() {
      clearInterval(this.nowTimes)
      this.nowTimes = null
    },
    format(val) {
      return val
    },
    // 全屏显示
    fullScreen() {
      this.isFullScreen = this.checkFull()
      if (!this.isFullScreen) {
        const docElm = document.documentElement
        if (docElm.requestFullscreen) {
          // W3C
          docElm.requestFullscreen()
        } else if (docElm.mozRequestFullScreen) {
          // FireFox
          docElm.mozRequestFullScreen()
        } else if (docElm.webkitRequestFullScreen) {
          // Chrome等
          docElm.webkitRequestFullScreen()
        } else if (docElm.msRequestFullscreen) {
          // IE11
          docElm.msRequestFullscreen()
        }
      }
    },
    // 判断浏览器是否处于全屏状态
    checkFull() {
      var isFull =
        document.mozFullScreen ||
        document.fullScreen ||
        document.webkitIsFullScreen ||
        document.webkitRequestFullScreen ||
        document.mozRequestFullScreen ||
        document.msFullscreenEnabled
      if (isFull === undefined) {
        isFull = false
      }
      return isFull
    }
  }
}
</script>
<style lang="scss" scoped>
.platform {
  background: url(~@/assets/images/1.png) no-repeat center;
  background-size: 100% 100%;
  margin: 0px auto;
  height: 100vh;
  width: 100%;
  min-width: 1200px;
  position: relative;
  background-attachment: fixed;
  header {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    h1 {
      font-size: 52px;
      text-align: center;
      color: #fff;
      line-height: 60px;
      font-weight: 800;
    }
    .money__content {
      text-align: center;
      margin-top: 20px;
      span {
        font-size: 52px;
        font-family: MicrosoftYaHei-Bold;
        font-weight: 700;
        color: #e8e000;
        line-height: 38px;
        // text-shadow: 0px 3px 7px rgba(232, 98, 0, 0.55);
        // background: -webkit-linear-gradient(bottom, #e86200 0%, #f7f578 65%);
        // background: -o-linear-gradient(bottom, #e86200 0%, #f7f578 65%);
        // background: linear-gradient(to top, #e86200 0%, #f7f578 65%);
        // -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
        // background-clip: text;
        &:first-child {
          font-size: 36px;
        }
        &.amount {
          display: inline-block;
          *display: inline;
          *zoom: 1;
          padding: 8px 10px;
          background-color: blue;
          span {
            font-size: 52px;
          }
          &.zero {
            padding: 8px 15px;
            text-indent: -8px;
            span {
              letter-spacing: -8px;
            }
          }
        }
      }
    }
  }
  article {
    padding-right: 30px;
    .el-row {
      line-height: 54px;
      color: #fff;
    }
    ::v-deep .el-col,
    i,
    p {
      font-size: 22px;
    }
  }
  section {
    width: 95%;
    margin: 80px auto 0;
    ::v-deep .el-image {
      display: block;
      width: 100%;
      margin-top: 120px;
      min-width: 100px;
    }
    h2 {
      line-height: 60px;
      margin-bottom: 2px;
      border: 1px solid #5992e8;
      -webkit-box-shadow: rgba(77, 187, 251, 0.6) 0px 0px 25px 2px;
      -moz-box-shadow: rgba(77, 187, 251, 0.6) 0px 0px 25px 2px;
      -o-box-shadow: rgba(77, 187, 251, 0.6) 0px 0px 25px 2px;
      box-shadow: rgba(77, 187, 251, 0.6) 0px 0px 25px 2px;
      display: flex;
      -webkit-justify-content: space-between;
      -moz-justify-content: space-between;
      -o-justify-content: space-between;
      justify-content: space-between;
      -webkit-align-items: center;
      -moz-align-items: center;
      -o-align-items: center;
      align-items: center;
      padding: 0 40px;
      padding-right: 10px;
      width: 87%;
      position: relative;
      &::before {
        content: '';
        left: 10px;
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1px solid rgb(192, 170, 146);
        background-color: rgb(192, 170, 146);
        -webkit-box-shadow: rgba(77, 187, 251, 0.6) 0px 0px 25px 11px;
        -moz-box-shadow: rgba(77, 187, 251, 0.6) 0px 0px 25px 11px;
        -o-box-shadow: rgba(77, 187, 251, 0.6) 0px 0px 25px 11px;
        box-shadow: rgba(77, 187, 251, 0.6) 0px 0px 25px 11px;
      }
      span {
        color: #fff;
        font-size: 22px;
      }
    }
    ul {
      overflow: hidden;
    }
    li {
      display: flex;
      -webkit-justify-content: space-between;
      -moz-justify-content: space-between;
      -o-justify-content: space-between;
      justify-content: space-between;
      -webkit-align-items: center;
      -moz-align-items: center;
      -o-align-items: center;
      align-items: center;
      line-height: 40px;
      padding-right: 25px;
      padding-left: 10px;
      span {
        color: #fff;
        font-size: 20px;
        display: block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        &:nth-child(1) {
          width: 100px;
        }
        &:nth-child(2) {
          width: 50%;
          margin-left: 3%;
          .el__progress__bar {
            position: relative;
            &__outer {
              width: 100%;
              background-color: rgba(156, 214, 248, 0.6);
              height: 20px;
              border-radius: 5px;
            }
            &__inner {
              position: absolute;
              background-color: rgba(152, 222, 240, 0.5);
              height: 18px;
              left: 0;
              top: 1px;
              border-radius: 5px;
            }
            &__innerText {
              position: absolute;
              left: 0;
              top: 1px;
              height: 18px;
              line-height: 18px;
              font-size: 20px;
            }
          }
        }
        &:last-child {
          text-align: right;
          width: 16%;
        }
      }
      ::v-deep .el-progress-bar {
        &__inner {
          background: linear-gradient(
            0deg,
            rgba(0, 204, 255, 0.5) 50%,
            rgba(37, 131, 238, 0.534) 100%
          );
        }
        &__outer {
          background-color: rgba(37, 131, 238, 0.8);
        }
      }
    }
    &:nth-child(2) {
      .el-row {
        color: #fff;
      }
    }
    .right__content {
      span {
        color: #fff;
        font-size: 20px;
        display: block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        &:nth-child(1) {
          width: 210px;
        }
        &:nth-child(2) {
          width: 50%;
          margin-left: 3%;
          .el__progress__bar {
            position: relative;
            &__outer {
              width: 100%;
              background-color: rgba(156, 214, 248, 0.6);
              height: 20px;
              border-radius: 5px;
            }
            &__inner {
              position: absolute;
              background-color: rgba(152, 222, 240, 0.5);
              height: 18px;
              left: 0;
              top: 1px;
              border-radius: 5px;
            }
            &__innerText {
              position: absolute;
              left: 0;
              top: 1px;
              height: 18px;
              line-height: 18px;
              font-size: 20px;
            }
          }
        }
        &:last-child {
          text-align: right;
          width: 20%;
        }
      }
    }
  }
}
.barrage__content {
  position: fixed;
  width: 100%;
  height: 100vh;
  left: 0;
  top: 54px;
}
</style>
<style lang="scss">
.baberrage-stage {
  height: 100vh !important;
  width: 100%;
  overflow: hidden;
  top: 0;
}
.baberrage-item {
  position: absolute;
  width: auto;
  display: block;
  color: #000;
  transform: translateX(500%);
  box-sizing: border-box;
  text-align: left;
  white-space: nowrap;
  width: 280px !important;
}
.baberrage-item .normal {
  display: flex;
  box-sizing: border-box;
  padding: 15px !important;
}
.baberrage-item .normal .baberrage-avatar {
  display: none !important;
}
.baberrage-item .baberrage-msg {
  line-height: 1.8 !important;
  padding-left: 8px;
  white-space: normal !important;
  font-size: 30px;
}
.baberrage-item {
  .normal {
    border-radius: 20px !important;
    color: #fff;
    background: rgba(6, 193, 240, 0.6) !important;
  }
  &.red {
    .normal {
      background: rgba(255, 0, 0, 0.6) !important;
    }
  }
}
</style>
