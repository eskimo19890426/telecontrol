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
    <div class="sufan-auto"
        v-iscroll>
      <div>
        <!-- 选择器 //-->
        <div class="sufan-chart">
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
        <!-- 当前位置历史数据 -->
        <div class="sufan-history">
          <div class="area-title">当前位置历史数据</div>
          <div class="select-time check-box clear">
            <span class="check-time">选择时间:</span>
            <date-select style="width:200px"
                class="select"
                v-model="times">
            </date-select>
          </div>
          <div class="echart">
            <div id="chearts"></div>
            <div v-show="historyData.length <= 0"
                class="no-data">暂无数据</div>
          </div>
        </div>
      </div>
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
        name: '历史曲线',
        path: '/env/history'
      }],
      queryParams: {
        RegionID: '',
        PositionID: '',
        SearchType: '',
        SearchValue: ''
      },
      times: '',
      historyData: [],
      areaList: [],
      positionList: [],
      chartX: [],
      chartY: [],
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
        } else {
          this.queryParams.RegionID = 0
        }
        this.areaNum = 0
        this.queryRegionData()
        // this.queryPosition(this.queryParams.RegionID)
      })
    },
    // 请求位置
    // queryPosition(val) {
    //   let params = {}
    //   params.OperationType = 10
    //   params.PageIndex = 1
    //   params.PageSize = 1000
    //   params.RegionID = val
    //   this.$axios.post('/api/User/GetData', {
    //     queryData: JSON.stringify([params])
    //   }).then(rs => {
    //   })
    // },
    // 请求位置
    queryRegionData() {
      let params = {}
      params.OperationType = 10
      params.PageIndex = 1
      params.PageSize = 100
      params.RegionID = this.queryParams.RegionID
      this.$axios.post('/api/User/GetData', {
        queryData: JSON.stringify([params])
      }).then(rs => {
        this.positionList = rs.data.Data.RetrunObjectData
        this.formData.dataRows = this.positionList[0]
        if (this.positionList.length > 0) {
          this.queryParams.PositionID = this.positionList[0].PositionID
        } else {
          this.queryParams.PositionID = 0
        }
      })
    },
    // 折线图数据
    queryDetailInfo() {
      // 一开始时间为空，默认当年
      if (!this.queryParams.SearchType) {
        this.queryParams.SearchType = 4
        this.queryParams.SearchValue = new Date().getFullYear()
      }
      if (this.queryParams.SearchValue === undefined) {
        this.queryParams.SearchValue = ''
      }
      this.$axios.post('/api/DeviceEnvRecord/GetDeviceHistoryData', {
        RegionID: Number(this.queryParams.RegionID),
        PositionID: Number(this.queryParams.PositionID),
        SearchType: String(this.queryParams.SearchType),
        SearchValue: String(this.queryParams.SearchValue)
      }).then(rs => {
        if (rs.data.Data.Status === 1) {
          this.historyData = rs.data.Data.RetrunObjectData
        } else {
          this.historyData = []
          this.$Message.info(rs.data.Data.Message)
        }
        this.chartX = []
        this.chartY = []
        if (this.historyData && this.historyData.length > 0) {
          switch (this.queryParams.SearchType) {
            case 4:
              for (let i in this.historyData) {
                this.chartX.push(this.historyData[i].QuartTime)
                this.chartY.push(this.historyData[i].CurRD)
              }
              break
            case 3:
              for (let i in this.historyData) {
                this.chartX.push(this.historyData[i].MonthTime)
                this.chartY.push(this.historyData[i].CurRD)
              }
              break
            case 2:
              for (let i in this.historyData) {
                this.chartX.push(this.historyData[i].TimeDay)
                this.chartY.push(this.historyData[i].CurRD)
              }
              break
            case 1:
              for (let i in this.historyData) {
                this.chartX.push(this.historyData[i].TimeHour)
                this.chartY.push(this.historyData[i].RD)
              }
              break
            default:
          }
        }
        this.queryChart()
      })
    },
    doRegionIDChange(item) {
      for (let i in this.areaList) {
        if (this.areaList[i].RegionID === item) {
          this.formData.MapPath = this.areaList[i].MapPath
          this.areaNum = i
        }
      }
      // this.queryDetailInfo()
      this.queryRegionData()
      // this.queryPosition(this.queryParams.RegionID)
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
    },
    showtime(val) {
      let arr = ''
      switch (val) {
        case 4:
          arr = '(季度)'
          break
        case 3:
          arr = '(月)'
          break
        case 2:
          arr = '(天)'
          break
        case 1:
          arr = '(小时)'
          break
        default:
          arr = '(季度)'
      }
      return arr
    },
    queryChart() {
      let mychart = echarts.init(document.getElementById('chearts'))
      let _this = this
      mychart.setOption({
        xAxis: {
          name: _this.showtime(this.queryParams.SearchType),
          type: 'category',
          boundaryGap: false,
          data: this.chartX,
          axisLabel: {
            rotate: 20,
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
        grid: {
          left: 70,
          right: 70
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
    }
  },
  watch: {
    times(val) {
      switch (val.type) {
        case 'year':
          this.queryParams.SearchType = 4
          break
        case 'quarter':
          this.queryParams.SearchType = 3
          break
        case 'month':
          this.queryParams.SearchType = 2
          break
        case 'date':
          this.queryParams.SearchType = 1
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
.check-box {
    margin-top: 15px;
}
.sufan-env {
    padding: 10px 20px 20px;
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
    .area-title {
        padding: 3px 0 3px 15px;
        border-left: 2px solid #6F6B8C;
        color: #6F6B8C;
        font-size: 17px;
    }
    .sufan-chart {
        .chart {
            height: 300px;
        }
    }
    .sufan-history {
        .chart-data {
            margin-top: 15px;
            .select-time {
                margin-top: 25px;
            }

        }
    }
    .check-time {
        display: block;
        float: left;
        line-height: 34px;
        margin-right: 15px;
        font-size: 15px;
    }
    .select {
        float: left;
    }
    #chearts {
        width: 100%;
        height: 400px;
    }
    .charts {
        text-align: center;
        img {
            display: inline-block;
        }
    }
    .echart {
        position: relative;
    }
    .no-data {
        position: absolute;
        top: 0;
        left: 0;
        padding: 15px;
        box-sizing: border-box;
        text-align: center;
        font-size: 14px;
        height: 500px;
        width: 100%;
        z-index: 7;
        background: #fff;
    }
}
// 区域展示--
.box-img {
    text-align: center;
    width: 60%;
    margin: 0 auto;
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
</style>
