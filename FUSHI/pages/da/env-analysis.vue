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
          <div class="text">当前区域</div>
          <Select v-model="queryParams.RegionID"
            style="width:200px"
            class="select"
            @on-change="doRegionIDChange">
             <Option v-for="item in areaList" :value="item.RegionID" :key="item.RegionID">{{ item.RegionName }}</Option>
         </Select>
        </li>
        <li class="select-list clear">
          <div class="text">选择时间</div>
          <date-select style="width:200px"
            class="select"
            v-model="times">
          </date-select>
        </li>
      </ul>
    </div>
    <div class="sufan-auto"
      v-iscroll>
      <div>
        <!-- 选择器 //-->
        <div class="check-btn">
          <ul class="clear">
            <li class="timeone"
              :class="{'time': time}"
              @click="doBtnClick('time')">A报警次数分析</li>
            <li class="timetwo"
              :class="{'max': max}"
              @click="doBtnClick('max')">B最大值分析</li>
            <li class="timethree"
              :class="{'mean': mean}"
              @click="doBtnClick('mean')">C均值/累积分析</li>
          </ul>
        </div>
        <div class="sufan-chart clear">
          <div>
            <div class="chart-brond"
              id="bround"></div>
            <div class="no-data"
              v-show="sumRdData.xData.length <= 0">暂无数据</div>
          </div>
          <div>
            <div class="chart-cylind"
              id="cylind"></div>
            <div class="no-data"
              v-show="statisticData.length === 0">暂无数据</div>
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
      times: '',
      time: true,
      max: false,
      mean: false,
      model1: '',
      steps: [{
        name: '数据分析',
        path: '/env/analysis'
      }, {
        name: '环境分析',
        path: '/env/analysis'
      }],
      queryParams: {
        RegionID: '',
        SearchType: '',
        SearchValue: ''
      },
      statisticData: [], // 柱状图
      sumRdData: {
        xData: [],
        yData: []
      }, // 饼状图
      areaList: [],
      positionList: [],
      chartY: [],
      chartX: [],
      chartyName: '',
      chartTitle: '',
      cahrtPart: ''
    }
  },
  mounted() {
    this.queryEare()
    this.queryChart()
  },
  methods: {
    // 请求区域
    queryEare(call) {
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
        } else {
          this.queryParams.RegionID = 0
        }
      })
    },
    // 均值累计值
    queryOutScope() {
      if (!this.queryParams.SearchType) {
        this.queryParams.SearchType = 4
        this.queryParams.SearchValue = new Date().getFullYear()
      }
      this.$axios.post('/api/DeviceEnvRecord/GetDeviceAvgAndSumRDStatistic', {
        RegionID: this.queryParams.RegionID,
        SearchType: this.queryParams.SearchType,
        SearchValue: this.queryParams.SearchValue
      }).then(rs => {
        this.chartY = []
        this.chartX = []
        this.sumRdData = {
          xData: [],
          yData: []
        }
        if (rs.data.Message) {
          this.$Message.info(rs.data.Message)
        } else if (rs.data.Data.Status === 1) {
          this.statisticData = rs.data.Data.RetrunObjectData
          for (let i in this.statisticData) {
            let arr = {}
            arr.name = this.statisticData[i].PositionName
            arr.value = this.statisticData[i].AvgRD.toFixed(2) || 0 // 均值
            this.sumRdData.xData.push(arr)
            this.sumRdData.yData.push(arr.name)
            this.chartX.push(this.statisticData[i].PositionName)
            this.chartY.push(this.statisticData[i].SumRD) // 累积值
          }
          this.chartyName = '剂量率'
          this.chartTitle = '均值分析'
          this.cahrtPart = 'μSv/h'
          this.queryChart()
        } else {
          this.$Message.info(rs.data.Data.Message)
        }
      })
    },
    // 最大值分析
    queryDepart() {
      this.$axios.post('/api/DeviceEnvRecord/GetDeviceAnalysisStatistic', {
        RegionID: this.queryParams.RegionID,
        SearchType: this.queryParams.SearchType,
        SearchValue: this.queryParams.SearchValue
      }).then(rs => {
        this.sumRdData = {
          xData: [],
          yData: []
        }
        this.chartY = []
        this.chartX = []
        if (rs.data.Message) {
          this.$Message.info(rs.data.Message)
        } else if (rs.data.Data.Status === 1) {
          let data = rs.data.Data.RetrunObjectData
          for (let i in data) {
            let arr = {}
            arr.name = data[i].PositionName
            arr.value = data[i].MaxRD
            this.sumRdData.xData.push(arr)
            this.sumRdData.yData.push(arr.name)
            this.chartX.push(data[i].PositionName)
            this.chartY.push(data[i].MaxRD)
          }
          this.chartyName = '剂量率'
          this.chartTitle = '最大值分析'
          this.cahrtPart = 'μSv/h'
          this.queryChart()
        } else {
          this.$Message.info(rs.data.Data.Message)
        }
      })
    },
    // 报警次数分析
    queryPosition() {
      this.$axios.post('/api/DeviceEnvRecord/GetDeviceAnalysisStatistic', {
        RegionID: this.queryParams.RegionID,
        SearchType: this.queryParams.SearchType,
        SearchValue: this.queryParams.SearchValue
      }).then(rs => {
        this.sumRdData = {
          xData: [],
          yData: []
        }
        this.chartY = []
        this.chartX = []
        if (rs.data.Message) {
          this.$Message.info(rs.data.Message)
        } else if (rs.data.Data.Status === 1) {
          let data = rs.data.Data.RetrunObjectData
          for (let i in data) {
            let arr = {}
            arr.name = data[i].PositionName
            arr.value = data[i].WaringCount
            this.sumRdData.xData.push(arr)
            this.sumRdData.yData.push(arr.name)
            this.chartX.push(data[i].PositionName)
            this.chartY.push(data[i].WaringCount)
          }
          this.chartyName = '报警次数分析'
          this.chartTitle = '报警次数分析'
          this.cahrtPart = '次'
          this.queryChart()
        } else {
          this.$Message.info(rs.data.Data.Message)
        }
      })
    },
    // 判断获取职务还是部门
    checkRound() {
      if (this.time) {
        this.queryPosition()
      } else if (this.max) {
        this.queryDepart()
      } else if (this.mean) {
        this.queryOutScope()
      }
    },
    doRegionIDChange() {
      this.checkRound()
    },
    doBtnClick(val) {
      switch (val) {
        case 'time':
          this.time = true
          this.max = false
          this.mean = false
          break
        case 'max':
          this.time = false
          this.max = true
          this.mean = false
          break
        case 'mean':
          this.time = false
          this.max = false
          this.mean = true
          break
        default:
      }
      this.checkRound()
    },
    queryChart() {
      let round = echarts.init(document.getElementById('bround'))
      let cylind = echarts.init(document.getElementById('cylind'))
      round.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}'
        },
        legend: {
          orient: 'bottom',
          x: 'right',
          y: 'center',
          data: this.sumRdData.yData
        },
        title: {
          text: this.chartTitle,
          x: '37%',
          y: 'bottom'
        },
        series: [{
          name: '报警次数',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['45%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              formatter: `{c}${this.cahrtPart}`,
              show: true,
              position: 'inside'
            },
            emphasis: {
              show: true,
              type: 'value',
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: true
            }
          },
          data: this.sumRdData.xData
        }]
      })
      cylind.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        title: {
          left: 'center',
          text: '累积值分析',
          bottom: 0
        },
        legend: {
          orient: 'vertical'
        },
        grid: {
          left: 100,
          right: 50,
          bottom: 50,
          containLabel: true
        },
        xAxis: [{
          name: '地点',
          type: 'category',
          data: this.chartX,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          name: this.chartyName
        }],
        series: [{
          name: '',
          type: 'bar',
          barWidth: '60%',
          data: this.chartY
        }]
      })
    }
  },
  watch: {
    times: {
      handler(val) {
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
        this.checkRound()
      }
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
.no-data {
    padding: 25px;
    box-sizing: border-box;
    text-align: center;
    font-size: 15px;
    position: absolute;
    width: 100%;
    height: 500px;
    left: 0;
    top: 0;
    z-index: 7;
    background: #fff;
}
.sufan-env {
    padding: 10px 20px 20px;
    // height: calc(100vh - 100px);
    box-sizing: border-box;
    .sufan-select {
        margin-top: 25px;
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
.check-btn {
    ul {
        li {
            float: left;
            height: 45px;
            border: 1px solid;
            padding: 0 20px;
            line-height: 45px;
            cursor: pointer;
            margin-right: 10px;
            user-select: none;
        }
        .timeone {
            border-color: #FFAC66;
            color: #FFAC66;
        }
        .timetwo {
            border-color: #7BC8C2;
            color: #7BC8C2;
        }
        .timethree {
            border-color: #8B96B2;
            color: #8B96B2;
        }
        .time {
            background: #FFAC66;
            color: #fff;
        }
        .max {
            background: #7BC8C2;
            color: #fff;
        }
        .mean {
            background: #8B96B2;
            color: #fff;
        }
    }
}
.chart-brond,
.chart-cylind {
    height: 500px;
}
.sufan-chart > div {
    float: left;
    position: relative;
    height: 500px;
}
.sufan-chart > div:nth-child(1) {
    width: 40%;
}
.sufan-chart > div:nth-child(2) {
    width: 60%;
}
</style>
