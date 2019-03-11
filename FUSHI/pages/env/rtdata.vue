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
      </ul>
    </div>
    <!-- 选择器 //-->
    <div class="sufan-auto"
        v-iscroll>
      <div>
        <!-- 动态数据 -->
        <div class="data">
          <div class="area-title">动态数据</div>
          <div class="data-chart clear">
            <div class="chart-round">
              <div id="round">
              </div>
              <div v-show="!recordData.RD"
                  class="no-data">暂无数据</div>
              <div class="status clear"
                  v-show="recordData.RD">
                <span class="text">当前状态</span>
                <span class="alert paramity"
                    v-if="recordData.RD < 20 || !recordData">正常</span>
                <span class="alert waring"
                    v-if="recordData.RD > 20 && recordData.RD < 80">警告</span>
                <span class="alert danger"
                    v-if="recordData.RD > 80">危险</span>
              </div>
            </div>
            <div class="chart-histogram">
              <div id="histogram">
              </div>
              <div class="no-data"
                  v-show="chartX.length <= 0">
                暂无数据
              </div>
            </div>
          </div>
        </div>
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
                        :data="mapData"></sufan-envmap>
                  </li>
                </ul>
                <div class="box-right box-icons"
                    @click="doRightClick"><span class="iconfont">&#xe602;</span></div>
              </div>
            </div>
          </div>
          <div class="eare-right">
            <div class="area-title">摄像抓拍</div>
            <div class="box details">
              <img :src="pathImg"
                  alt=""
                  v-if="pathImg">
              <div v-else class="no-pictu">暂无图片</div>
            </div>
          </div>
        </div>
        <!-- 区域展示 //-->
      </div>
    </div>
  </div>
</section>
</template>
<script type="text/javascript">
import echarts from 'echarts'
export default {
  data() {
    return {
      model1: '',
      steps: [{
        name: '环境管理',
        path: '/env/cum-dose'
      }, {
        name: '实时数据',
        path: '/env/rtdata'
      }],
      queryParams: {
        RegionID: '',
        PositionID: ''
      },
      areaList: [],
      positionList: [],
      recordData: {},
      minituData: [],
      chartX: [],
      chartY: [],
      chartTimeTile: '',
      formData: {
        MapPath: '',
        dataRows: []
      },
      pathImg: '',
      linkParams: '',
      mapData: {
        url: '',
        proportion: 0,
        positions: []
      },
      // 左右切换第几个
      areaNum: 0,
      timer: ''
    }
  },
  mounted() {
    this.queryEare()
    this.paramsQuery()
    this.doChart()
    this.timer = setInterval(() => {
      this.queryDetailInfo()
    }, 5000)
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    paramsQuery() {
      this.$route.query.value ? this.linkParams = this.$route.query.value : ''
    },
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
        } else {
          this.queryParams.RegionID = 0
        }
        this.areaNum = 0
        this.queryPosition()
      })
    },
    // 请求位置
    queryPosition(val) {
      let params = {}
      params.OperationType = 10
      params.PageIndex = 1
      params.PageSize = 1000
      params.RegionID = this.queryParams.RegionID
      this.$axios.post('/api/User/GetData', {
        queryData: JSON.stringify([params])
      }).then(rs => {
        this.positionList = rs.data.Data.RetrunObjectData || []
        this.formData.dataRows = []
        if (this.linkParams) {
          for (let i in this.positionList) {
            if (this.linkParams === this.positionList[i].PositionNumber) {
              this.formData.dataRows = this.positionList[i]
              this.positionList.length > 0 ? this.queryParams.PositionID = this.positionList[i].PositionID : this.queryParams.PositionID = 0
            }
          }
        } else {
          this.formData.dataRows = this.positionList[0]
          this.positionList.length > 0 ? this.queryParams.PositionID = this.positionList[0].PositionID : this.queryParams.PositionID = 0
        }
      })
    },
    // 请求实时图片
    queryPicture() {
      let sRegionID = String(this.queryParams.RegionID)
      let sPositionID = String(this.queryParams.PositionID)
      this.$axios.post('api/DeviceEnv/GetInfo', {
        RegionID: sRegionID,
        PositionID: sPositionID
      }).then(rs => {
        if (rs.data.Data) {
          this.pathImg = rs.data.Data.ImgPath || ''
        } else {
          this.pathImg = ''
        }
      })
    },
    queryDetailInfo() {
      if (!this.queryParams.RegionID) {
        this.queryParams.RegionID = 0
      }
      if (!this.queryParams.PositionID) {
        this.queryParams.PositionID = 0
      }
      let sRegionID = String(this.queryParams.RegionID)
      let sPositionID = String(this.queryParams.PositionID)
      this.$axios.post('/api/DeviceEnvRecord/GetLastedRecord', {
        RegionID: sRegionID,
        PositionID: sPositionID
      }).then(rs => {
        if (rs.data.Message) {
          this.$Message.info(rs.data.Message)
          this.recordData = {}
        } else if (rs.data.Data.Status === 1) {
          this.recordData = rs.data.Data.RetrunObjectData
          this.doChart()
        } else {
          this.$Message.info(rs.data.Data.Message)
          this.recordData = {}
        }
      })
      this.$axios.post('/api/DeviceEnvRecord/GetRecentDeviceInfoByMinute', {
        RegionID: Number(this.queryParams.RegionID),
        PositionID: Number(this.queryParams.PositionID)
      }).then(rs => {
        let data = []
        if (rs.data.Message) {
          this.$Message.info(rs.data.Message)
        } else if (rs.data.Data.Status === 1) {
          data = rs.data.Data.RetrunObjectData
          this.chartX = []
          this.chartY = []
          this.chartTimeTile = data[0].Time.substr(0, 4) + '\n' + data[0].Time.substr(6, 5)
          for (let i in data) {
            this.chartX.push(data[i].Time.substr(10, 9))
            this.chartY.push(data[i].RD)
          }
          this.doChart()
        } else {
          this.chartX = []
          this.chartY = []
          this.$Message.info(rs.data.Data.Message)
        }
      })
    },
    doRegionIDChange(item) {
      for (let i in this.areaList) {
        if (this.areaList[i].RegionID === item) {
          this.formData.MapPath = this.areaList[i].MapPath
          this.areaNum = i
        }
      }
      this.queryPosition()
    },
    doPositionIDChange() {
      this.formData.dataRows = []
      for (let i in this.positionList) {
        if (this.positionList[i].PositionID === this.queryParams.PositionID) {
          this.formData.dataRows.push(this.positionList[i])
        }
      }
      this.reloadMap()
      this.queryDetailInfo()
      this.queryPicture()
    },
    doChart() {
      let round = echarts.init(document.getElementById('round'))
      let histogram = echarts.init(document.getElementById('histogram'))
      round.setOption({
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%'
        },
        toolbox: {
          // feature: {
          //   restore: {},
          //   saveAsImage: {}
          // }
        },
        series: [{
          name: '业务指标',
          type: 'gauge',
          detail: {
            formatter: '{value}μSv/h',
            offsetCenter: [0, '70%'],
            fontSize: 23
          },
          axisLine: { // 坐标轴线
            lineStyle: { // 属性lineStyle控制线条样式
              color: [
                [0.20, '#2CCBC7'],
                [0.80, '#FFAA67'],
                [1, '#D87D82']
              ],
              width: 15,
              shadowColor: '#000', // 默认透明
              shadowBlur: 0
            }
          },
          data: [{
            value: `${this.recordData.RD}`,
            name: '实时剂量'
          }]
        }]
      })
      histogram.setOption({
        xAxis: {
          name: `${this.chartTimeTile}`,
          type: 'category',
          boundaryGap: false,
          data: this.chartX,
          axisLabel: {
            rotate: 35,
            interval: 0
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '吸收剂量率(μSv/h)',
          max: function(value) {
            return (value.max * 5)
          }
        },
        legend: {},
        color: '#EBF8FF',
        series: [{
          data: this.chartY,
          type: 'line',
          areaStyle: {}
        }]
      })
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
    margin-top: 15px;
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

    .box {
        margin-top: 25px;
    }
    .details {
        // border: 1px solid #EEEEEE;
        // padding: 15px;
        box-sizing: border-box;
        width: 80%;
        img {
            width: 100%;
        }
    }
}
.area-title {
    padding: 3px 0 3px 15px;
    border-left: 2px solid #6F6B8C;
    color: #6F6B8C;
    font-size: 17px;
}
.chart-round {
    width: 30%;
    height: 500px;
    float: left;
    position: relative;
    .status {
        position: absolute;
        z-index: 99;
        bottom: 0;
        left: 50%;
        margin-left: -80px;
        .text {
            display: block;
            float: left;
            color: #4AABE0;
            font-size: 17px;
            margin-right: 15px;
            line-height: 40px;
        }
        .alert {
            display: block;
            float: left;
            padding: 5px 20px;
            border-radius: 30px;
            color: #fff;
            font-size: 17px;
        }
        .waring {
            background: #FCAB6A;
        }
        .paramity {
            background: #33C4C7;
        }
        .danger {
            background: #DF7B83;
        }
    }
    #round {
        width: 100%;
        height: 500px;
        div {
            width: 100% !important;
        }
    }
}
.chart-histogram {
    position: relative;
    text-align: center;
    float: left;
    // margin-left: 5%;
    width: 65%;
    #histogram {
        width: 100%;
        height: 500px;
    }
}
.no-data {
    line-height: 150px;
    font-size: 18px;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 500px;
    z-index: 88;
    background: #fff;
    text-align: center;
}
.no-pictu{
  text-align: center;
  font-size: 18px;
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
            width: 80%;
            margin-left: 10%;
            min-height: 300px;
            li {
                img {
                    width: 100%;
                }
            }
        }
    }
}
</style>
