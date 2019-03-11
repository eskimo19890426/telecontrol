<template>
<section>
  <div class="sufan-env">
    <div>
      <sufan-steps :list="steps"></sufan-steps>
    </div>
    <!-- 选择器 -->
    <div class="sufan-select">
      <ul class="clear">
        <li class="select-list clear">
          <div class="iconfont icon">&#xe7a4;</div>
          <div class="text">当前区域</div>
          <Select v-model="queryParams.RegionID"
              style="width:200px"
              class="select"
              @on-change="doRegionIDChange">
             <Option v-for="item in areaList" :value="item.RegionID" :key="item.RegionID">{{ item.RegionName }}</Option>
         </Select>
        </li>
        <li class="select-list clear list-left">
          <div class="iconfont icon">&#xe7a4;</div>
          <div class="text">当前位置</div>
          <Select v-model="queryParams.PositionID"
              style="width:200px"
              class="select"
              @on-change="doPositionIDChange">
             <Option v-for="item in positionList" :value="item.PositionID" :key="item.PositionID">{{ item.PositionName }}</Option>
         </Select>
        </li>
        <li class="select-list clear list-left">
          <div class="text">选择时间</div>
          <date-select style="width:200px"
              class="select"
              v-model="times">
          </date-select>
        </li>
      </ul>
    </div>
    <!-- 选择器 //-->
    <div class="sufan-auto"
        v-iscroll>
      <div>
        <!-- 区域展示 -->
        <div class="sufan-eare">
          <div class="eare-left">
            <div class="area-title">区域展示</div>
            <div class="box-img">
              <div class="box-content clear">
                <div class="box-left box-icons"
                    @click="doLeftClick"><span class="iconfont">&#xe7a5;</span></div>
                <ul class="box-show">
                  <li>
                    <sufan-envmap ref="envmap"
                        :data="mapData"
                        @on-collect="doMapCollect"></sufan-envmap>
                  </li>
                </ul>
                <div class="box-right box-icons"
                    @click="doRightClick"><span class="iconfont">&#xe602;</span></div>
              </div>
            </div>
          </div>
          <div class="eare-right">
            <div class="area-title">所在位置数据报告</div>
            <div class="box details">
              <div class="title">
                <p class="home">设备房</p>
                <p class="pet">当前区域：{{positionDetais.eare}}&nbsp;&nbsp;&nbsp;当前位置：{{positionDetais.positon}}</p>
                <p class="num">累计剂量：<span>{{detailsInfoData.Total}}</span>μSv</p>
                <div class="totle">{{detailsInfoData.TotalPercent}}</div>
              </div>
              <div class="type">
                <div class="list clear">
                  <div class="round"></div>
                  <div class="ment">设备类型：<span>{{detailsInfoData.DevType}}</span></div>
                </div>
                <div class="list clear">
                  <div class="round roundID"></div>
                  <div class="ment">设备ID：<span>{{detailsInfoData.DevNumber}}</span></div>
                </div>
              </div>
              <div class="leable">
                <div class="alls clear"><span>累计剂量</span><span>{{detailsInfoData.Total}}μSv</span></div>
                <div class="alls clear"><span>法规限值</span><span>{{detailsInfoData.CurrentThreshold}}μSv</span></div>
                <div class="alls clear"><span>剂量百分比</span><span>{{detailsInfoData.TotalPercent}}</span></div>
                <!-- <div class="alls clear"><span>与平均值比较</span><span>150%</span></div> -->
                <div class="alls clear"><span>报警最大值</span><span v-if="araeData.length > 0">{{araeData[0].WaringValue}}μSv</span><span v-else>暂无数据</span></div>
                <div class="alls clear"><span>最大值时间</span><span class="addcoler"
                      @click="doDetails"
                      v-if="araeData.length > 0">详情>></span><span v-else>暂无数据</span></div>
                <!-- <div class="alls clear"><span>报警日期</span><span>{{araeData.TimeQuarter}}</span></div> -->
                <!-- <div class="alls clear">
                  <span>状态</span>
                  <span v-if="araeData.Status === '1'">成功</span>
                  <span v-else-if="araeData.Status === '1'">失败</span>
                  <span v-else-if="araeData.Status === '-1'"
                      异常</span>
                </div> -->
                <!-- <div class="alls clear"><span>状态结果</span><span>{{araeData.Message}}</span></div> -->
              </div>
            </div>
          </div>
        </div>
        <!-- 区域展示 //-->
      </div>
    </div>
    <Modal v-model="detailsModal"
        title="设备报警最大值详情"
        @on-ok="doModelOk"
        @on-cancel="doModelCancel"
        width="800">
      <ul class="details-list">
        <li v-for="item in araeData">
          <span>剂量值：{{item.WaringValue}}μSv</span>
          <span>时间：{{item.WaringTime}}</span>
        </li>
      </ul>
    </Modal>
  </div>
</section>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
      times: '',
      steps: [{
        name: '环境管理',
        path: '/env/cum-dose'
      }, {
        name: '累积剂量',
        path: '/env/cum-dose'
      }],
      detailsModal: false,
      areaList: [],
      positionList: [],
      araeData: {},
      detailsInfoData: {},
      queryParams: {
        RegionID: 1,
        PositionID: 1,
        SearchType: '',
        SearchValue: ''
      },
      positionDetais: { // 具体位置
        positon: '',
        eare: ''
      },
      mapData: {
        url: '',
        proportion: 0,
        positions: []
      },
      formData: {
        MapPath: '',
        dataRows: []
      },
      // 左右切换第几个
      areaNum: 0
    }
  },
  mounted() {
    this.queryEare()
  },
  methods: {
    // 请求区域
    queryEare() {
      let params = {
        OperationType: 9,
        PageIndex: 1,
        PageSize: 1000
      }
      this.$axios.post('/api/User/GetData', {
        queryData: JSON.stringify([params])
      }).then(rs => {
        this.areaList = rs.data.Data.RetrunObjectData
        if (this.areaList.length > 0) {
          this.queryParams.RegionID = this.areaList[0].RegionID
          this.formData.MapPath = this.areaList[0].MapPath
          this.positionDetais.eare = this.areaList[0].RegionName
        } else {
          this.queryParams.RegionID = 0
          this.positionDetais.eare = ''
        }
        this.areaNum = 0
        this.queryPosition()
      })
    },
    // 请求位置
    queryPosition() {
      let params = {}
      params.OperationType = 10
      params.PageIndex = 1
      params.PageSize = 1000
      params.RegionID = this.queryParams.RegionID
      this.$axios.post('/api/User/GetData', {
        queryData: JSON.stringify([params])
      }).then(rs => {
        this.positionList = rs.data.Data.RetrunObjectData
        this.formData.dataRows = this.positionList[0]
        if (this.positionList.length > 0) {
          this.queryParams.PositionID = this.positionList[0].PositionID
          this.positionDetais.positon = this.positionList[0].PositionName
        } else {
          this.queryParams.PositionID = 0
          this.positionDetais.positon = ''
        }
      })
    },
    doRegionIDChange(item) {
      for (let i in this.areaList) {
        if (this.areaList[i].RegionID === item) {
          this.positionDetais.eare = this.areaList[i].RegionName
          this.formData.MapPath = this.areaList[i].MapPath
          this.areaNum = i
        }
      }
      // this.queryDetailInfo()
      // this.queryRegionData()
      this.queryPosition()
    },
    doPositionIDChange() {
      this.formData.dataRows = []
      for (let i in this.positionList) {
        if (this.positionList[i].PositionID === this.queryParams.PositionID) {
          this.positionDetais.positon = this.positionList[i].PositionName
          this.formData.dataRows.push(this.positionList[i])
        }
      }
      this.reloadMap()
      this.queryDetailInfo()
    },
    queryDetailInfo() {
      if (!this.queryParams.SearchType) {
        this.queryParams.SearchType = '1'
        this.queryParams.SearchValue = new Date().getFullYear()
      }
      this.$axios.post('/api/DeviceEnvRecord/GetDeviceDetailInfo', {
        RegionID: Number(this.queryParams.RegionID),
        PositionID: Number(this.queryParams.PositionID),
        SearchType: String(this.queryParams.SearchType),
        SearchValue: String(this.queryParams.SearchValue)
      }).then(rs => {
        if (rs.data.Data.Status === 1) {
          this.detailsInfoData = rs.data.Data.RetrunObjectData
        } else {
          this.detailsInfoData = []
          this.$Message.info(rs.data.Data.Message)
        }
      })
      this.$axios.post('/api/DeviceEnvRecord/GetDeviceWaringValueList', {
        RegionID: Number(this.queryParams.RegionID),
        PositionID: Number(this.queryParams.PositionID),
        SearchType: String(this.queryParams.SearchType),
        SearchValue: String(this.queryParams.SearchValue)
      }).then(rs => {
        if (rs.data.Data.Status === 1) {
          this.araeData = rs.data.Data.RetrunObjectData || []
        } else {
          this.araeData = []
          this.$Message.info(rs.data.Data.Message)
        }
      })
    },
    // 地图选中
    doMapCollect(evt) {
      // 设置比例
      this.formData.Proportion = evt.proportion
      // 设置坐标点
      this.formData.LeftTopX = evt.points[0].x
      this.formData.LeftTopY = evt.points[0].y
      this.formData.RightTopX = evt.points[1].x
      this.formData.RightTopY = evt.points[1].y
      this.formData.RightBottomX = evt.points[2].x
      this.formData.RightBottomY = evt.points[2].y
      this.formData.LeftBottomX = evt.points[3].x
      this.formData.LeftBottomY = evt.points[3].y
      // 重载地图
      this.reloadMap()
      this.isCollect = false
      this.$Message.success('采集成功')
    },
    // 初始化地图数据
    reloadMap() {
      if (this.formData.dataRows.length === 0) {
        this.mapData.proportion = 0
        this.mapData.positions = []
        return
      }
      this.mapData.positions = []
      this.mapData.url = this.formData.MapPath
      this.mapData.proportion = this.formData.dataRows[0].Proportion
      this.mapData.pointNumber = 4
      for (let i in this.formData.dataRows) {
        let arr = {}
        arr.name = this.formData.dataRows[i].PositionName
        arr.value = this.formData.dataRows[i].PositionNumber
        arr.points = [{
          x: this.formData.dataRows[i].LeftTopX,
          y: this.formData.dataRows[i].LeftTopY
        }, {
          x: this.formData.dataRows[i].RightTopX,
          y: this.formData.dataRows[i].RightTopY
        }, {
          x: this.formData.dataRows[i].RightBottomX,
          y: this.formData.dataRows[i].RightBottomY
        }, {
          x: this.formData.dataRows[i].LeftBottomX,
          y: this.formData.dataRows[i].LeftBottomY
        }]
        this.mapData.positions.push(arr)
      }
    },
    // 左侧切换
    doLeftClick() {
      if (this.areaNum <= 0) {
        this.areaNum = this.areaList.length - 1
      } else {
        this.areaNum -= 1
      }
      this.queryParams.RegionID = this.areaList[this.areaNum].RegionID
    },
    // 右侧切换
    doRightClick() {
      if (this.areaNum >= this.areaList.length - 1) {
        this.areaNum = 0
      } else {
        this.areaNum = Number(this.areaNum) + 1
      }
      this.queryParams.RegionID = this.areaList[this.areaNum].RegionID
    },
    // 报警最大值
    doDetails() {
      this.detailsModal = true
    },
    // 确认
    doModelOk() {
      this.detailsModal = false
    },
    // 取消弹窗
    doModelCancel() {}
  },
  watch: {
    times(val) {
      switch (val.type) {
        case 'year':
          this.queryParams.SearchType = 1
          break
        case 'quarter':
          this.queryParams.SearchType = 2
          break
        case 'month':
          this.queryParams.SearchType = 3
          break
        case 'date':
          this.queryParams.SearchType = 4
          break
        default:
      }
      this.queryParams.SearchValue = val.data
      this.queryDetailInfo()
    }
  }
}
</script>
<style lang="scss" scoped>
.clear::after {
    content: '';
    display: block;
    clear: both;
}
.sufan-auto {
    margin-top: 25px;
    width: 100%;
    height: calc(100vh - 300px);
    overflow: hidden;
}
.sufan-env {
    padding: 10px 20px 20px;
    // height: calc(100vh - 100px);
    box-sizing: border-box;
    .sufan-select {
        margin-top: 30px;
    }
    .select-list {
        float: left;
        .icon {
            float: left;
            font-size: 25px;
            margin-top: -2px;
        }
        .text {
            float: left;
            font-size: 15px;
            margin: 6px 0 0 5px;
        }
        .select {
            float: left;
            margin-left: 20px;
        }
    }
    .list-left {
        margin-left: 5%;
    }
}
// 区域展示
.sufan-eare {
    display: flex;
    display: -webkit-flex;
    display: -ms-flex;
    .eare-left {
        -webkit-flex: 5;
        -ms-flex: 5;
        flex: 5;
    }
    .eare-right {
        margin-left: 20px;
        -webkit-flex: 4;
        -ms-flex: 4;
        flex: 4;
    }
    .area-title {
        padding: 3px 0 3px 15px;
        border-left: 2px solid #6F6B8C;
        color: #6F6B8C;
        font-size: 17px;
    }
    .box {
        margin-top: 25px;
        .canvas-map {
            overflow: hidden;
            position: relative;
        }
    }
    .details {
        border: 1px solid #EEEEEE;
        // padding: 15px;
        box-sizing: border-box;
        .title {
            position: relative;
            padding: 15px;
            box-sizing: border-box;
            .home {
                font-size: 20px;
            }
            .pet {
                margin-top: 15px;
                font-size: 15px;
            }
            .num {
                font-size: 15px;
                margin-top: 15px;
                span {
                    color: #EE6E6F;
                }
            }
            .totle {
                position: absolute;
                right: 15px;
                top: 50%;
                margin-top: -35px;
                color: #EE6E6F;
                font-size: 45px;
            }
        }
        .type {
            padding: 15px;
            border-top: 1px solid #EEE;
            border-bottom: 1px solid #EEE;
            .list:nth-child(2) {
                margin-top: 5px;
            }
            .list {
                .round {
                    float: left;
                    width: 12px;
                    height: 12px;
                    background: #fff;
                    border-radius: 50%;
                    margin-top: 6px;
                    border: 4px solid #68CE4E;
                }
                .roundID {
                    border-color: #FFAA60;
                }
                .ment {
                    float: left;
                    font-size: 15px;
                    margin-left: 10px;
                    span {
                        font-weight: bold;
                    }
                }
            }
        }
        .leable {
            padding: 15px;
            box-sizing: border-box;
            .alls {
                font-size: 14px;
                span:nth-child(1) {
                    float: left;
                }
                span:nth-child(2) {
                    float: right;
                }
                .addcoler {
                    color: #F17B8B;
                    cursor: pointer;
                }
            }
            .alls:not(:nth-last-child(1)) {
                margin-bottom: 5px;
            }
        }
    }
}
// 区域展示--
.box-img {
    text-align: center;
    vertical-align: middle;
    // display: flex;
    // display: -webkit-flex;
    // display: -ms-flex;
    // height: calc(100vh - 480px);
    .box-content {
        // margin: auto;
        // display: inline-block;
        position: relative;
        text-align: center;
        .box-icons {
            position: absolute;
            width: 30px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            border-radius: 50%;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            -o-user-select: none;
            user-select: none;
            background: #DDE8EE;
            top: 50%;
            margin-top: -15px;
            font-size: 20px;
            color: #fff;
        }
        .box-icons:active {
            opacity: 0.6;
        }
        .box-left {
            left: 0;
        }
        .box-right {
            right: 0;
        }
        .box-show {
            position: relative;
            width: 80%;
            margin-left: 10%;
            min-height: 400px;
            li {
                width: 100%;
            }
        }
    }
}
.details-list {
    // padding: 15px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    li {
        width: 50%;
        padding: 10px;
        box-sizing: border-box;
        float: left;
        display: flex;
        display: -webkit-flex;
        display: -ms-flex;
        span:nth-child(1) {
            -webkit-flex: 1;
            -ms-flex: 1;
            flex: 1;
            text-align: center;
        }
        span:nth-child(2) {
            -webkit-flex: 2;
            -ms-flex: 2;
            flex: 2;
            text-align: center;
        }
    }
    li:not(:nth-last-child(1)) {
        border-bottom: 1px solid #ccc;
    }
    li:nth-child(2n - 1) {
        border-right: 1px solid #ccc;
    }
}
.details-list::after {
    content: '';
    display: block;
    clear: both;
}
@media screen and (max-width: 1400px) {
  .totle {
      top: 35% !important;
      font-size: 25px !important;
  }
}
</style>
