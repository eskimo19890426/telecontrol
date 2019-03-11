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
          <div class="text">总部</div>
          <Select v-model="queryParams.RegionID"
              style="width:150px"
              class="select"
              @on-change="doParIDChange">
             <Option v-for="item in operatiosData" :value="item.GeneralID" :key="item.GeneralID">{{ item.GeneralName }}</Option>
         </Select>
        </li>
        <li class="select-list clear">
          <div class="iconfont icon">&#xe7a4;</div>
          <div class="text">分部</div>
          <Select v-model="detailsParams.comId"
              style="width:150px"
              class="select"
              @on-change="doDevIDChange">
             <Option v-for="item in parData" :value="item.BranchID" :key="item.BranchID">{{ item.BranchName }}</Option>
         </Select>
        </li>
        <!-- <li class="select-list clear">
          <div class="iconfont icon">&#xe7a4;</div>
          <div class="text">项目类型</div>
          <Select v-model="detailsParams.ProjectID"
              style="width:150px"
              class="select"
              @on-change="doProjectIDChange">
             <Option v-for="item in ProjectData" :value="item.ProjectID" :key="item.ProjectID">{{ item.ProjectName }}</Option>
         </Select>
        </li> -->
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
        <div class="check-btn">
          <ul class="clear">
            <li class="timeone"
                :class="{'time': time}"
                @click="doBtnClick('time')">职务</li>
            <li class="timetwo"
                :class="{'max': max}"
                @click="doBtnClick('max')">部门</li>
            <li class="timetwo"
                :class="{'max': mean}"
                @click="doBtnClick('mean')">累积剂量</li>
          </ul>
        </div>
        <div class="sufan-title">
          个人分析数据
        </div>
        <div class="check-list"
            v-show="!mean">
          <div class="check-lisit-box">
            <div id="round"></div>
            <div v-show="dutyInfoData.xData.length <= 0"
                class="no-data">暂无数据</div>
          </div>
          <div class="check-lisit-box">
            <div id="does"></div>
            <div v-show="dutyAvgData.xData.length <= 0"
                class="no-data">暂无数据</div>
          </div>
        </div>
        <div class="scopr-list" v-show="!mean">
          <div>
            <span class="num">60%以内</span>
            <span class="safe title">安全</span>
          </div>
          <div>
            <span class="num">60%至80%</span>
            <span class="waring title">警告</span>
          </div>
          <div>
            <span class="num">80%以上</span>
            <span class="danger title">危险</span>
          </div>
        </div>
        <div class="check-list"
            v-show="mean">
          <div class="check-lisit-box">
            <div id="OutRound"></div>
            <div v-show="OutScope.xData.length <= 0"
                class="no-data">暂无数据</div>
          </div>
          <div class="check-lisit-box">
            <div id="OutChart"></div>
            <div v-show="OutScope.xData.length <= 0"
                class="no-data">暂无数据</div>
          </div>
        </div>
        <div class="check-list"
            v-show="!mean">
          <div class="check-lisit-box">
            <div id="number"></div>
            <div v-show="dutyInfoData.xData.length <= 0"
                class="no-data">暂无数据</div>
          </div>
          <div class="check-lisit-box">
            <div id="art">
            </div>
            <div v-show="dutyAvgData.xData.length <= 0"
                class="no-data">暂无数据</div>
          </div>
          <!-- 此处相反的，需要改一下 -->
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
      time: true,
      max: false,
      mean: false,
      steps: [{
        name: '数据分析',
        path: '/da/pers-analysis'
      }, {
        name: '个人分析',
        path: '/da/pers-analysis'
      }],
      times: '',
      queryParams: {
        RegionID: ''
      },
      areaList: [],
      detailsParams: {
        Type: '',
        Year: '',
        Numble: '',
        TimeValue: '',
        comId: ''
        // ProjectID: ''
      },
      operatiosData: [],
      ProjectData: [], // 项目数据
      parData: [],
      avgInfoData: [],
      OutScope: { // 累计剂量
        xData: [],
        yData: [],
        chartX: []
      },
      dutyAvgData: {
        xData: [],
        yData: [],
        chartX: []
      },
      dutyInfoData: {
        xData: [],
        yData: [],
        chartX: []
      },
      number: {
        x: [],
        y: []
      }
    }
  },
  mounted() {
    if (!this.detailsParams.Year) {
      this.detailsParams.Type = 4
      this.detailsParams.Year = new Date().getFullYear()
      this.detailsParams.Numble = 0
      this.detailsParams.TimeValue = 0
    }
    this.queryOperation()
    this.queryGetData()
  },
  methods: {
    // 获取部门
    queryOperation() {
      let params = {
        OperationType: 3,
        PageIndex: 1,
        PageSize: 100
      }
      this.$axios.post('/api/User/GetData', {
        queryData: JSON.stringify([params])
      }).then(rs => {
        this.operatiosData = rs.data.Data.RetrunObjectData
        this.queryParams.RegionID = this.operatiosData[0].GeneralID
        this.queryDevision(this.operatiosData[0].GeneralID)
      })
    },
    // 请求分部
    queryDevision(val) {
      let paramit = {
        OperationType: 4,
        PageIndex: 1,
        PageSize: 100,
        GeneralID: val
      }
      this.$axios.post('/api/User/GetData', {
        queryData: JSON.stringify([paramit])
      }).then(rs => {
        if (rs.data.Data.RetrunObjectData.length > 0) {
          this.parData = rs.data.Data.RetrunObjectData
          this.detailsParams.comId = this.parData[0].BranchID
        } else {
          this.parData = []
          this.detailsParams.comId = 0
          this.checkRound()
        }
      })
    },
    // 请求项目数据
    queryGetData() {
      let params = {
        OperationType: 8,
        PageIndex: 0,
        PageSize: 5000
      }
      this.$axios.post('/api/User/GetData', {
        queryData: JSON.stringify([params])
      }).then(rs => {
        this.ProjectData = rs.data.Data.RetrunObjectData
      })
    },
    doParIDChange() {
      this.queryDevision(this.queryParams.RegionID)
    },
    // 选择分部查询数据
    doDevIDChange() {
      this.checkRound()
    },
    // 选择项目查询数据
    doProjectIDChange() {
      this.checkRound()
    },
    // 个人
    queryDepart() {
      if (!this.queryParams.SearchType) {
        this.queryParams.SearchType = '1'
        this.queryParams.SearchValue = new Date().getFullYear()
      }
      if (!this.detailsParams.Year) {
        this.detailsParams.Year = new Date().getFullYear()
        this.detailsParams.Type = 4
        this.detailsParams.Numble = 0
        this.detailsParams.TimeValue = 0
      }
      // 获取个人分析部门--查询数据
      this.$axios.post('/api/PA/GetPAOutDepartInfo', {
        Type: this.detailsParams.Type,
        Year: this.detailsParams.Year,
        Numble: this.detailsParams.Numble,
        TimeValue: this.detailsParams.TimeValue,
        comId: this.detailsParams.comId,
        ProjectID: this.detailsParams.ProjectID
      }).then(rs => {
        let data = rs.data.Data
        if (data.Status === 0) {
          this.dutyInfoData.xData = []
          this.dutyInfoData.yData = []
          this.dutyInfoData.chartX = []
          this.dutyInfoData.chartX = []
          let arr = {}
          for (let i in data.RetrunObjectData) {
            arr.name = data.RetrunObjectData[i].DepartName
            arr.value = data.RetrunObjectData[i].TotalCount
            this.dutyInfoData.xData.push(arr)
            this.dutyInfoData.yData.push(arr.name)
            this.dutyInfoData.chartX.push(arr.value)
          }
          this.doRoundChart()
          this.doListChart()
        }
      })
      // 获取个人分析部门--平均剂量数据
      this.$axios.post('/api/PA/GetPAOutDepartAvgInfo', {
        Type: this.detailsParams.Type,
        Year: this.detailsParams.Year,
        Numble: this.detailsParams.Numble,
        TimeValue: this.detailsParams.TimeValue,
        comId: this.detailsParams.comId,
        ProjectID: this.detailsParams.ProjectID
      }).then(rs => {
        let data = rs.data.Data
        if (data.Status === 0) {
          let arr = {}
          this.dutyAvgData.xData = []
          this.dutyAvgData.yData = []
          this.dutyAvgData.chartX = []
          this.dutyAvgData.avgRd = []
          for (let i in data.RetrunObjectData) {
            arr.name = data.RetrunObjectData[i].DepartName
            arr.value = data.RetrunObjectData[i].TotalCount
            this.dutyAvgData.xData.push(arr)
            this.dutyAvgData.yData.push(arr.name)
            this.dutyAvgData.chartX.push(arr.value)
            this.dutyAvgData.avgRd.push(data.RetrunObjectData[i].AvgRD)
          }
          this.doRoundChart()
          this.doListChart()
        } else {
          this.$Message.info(data.Message)
        }
      })
    },
    // 职务
    queryPosition() {
      // 个人分析---职务查询数据
      this.$axios.post('/api/PA/GetPAOutDutyInfo', {
        Type: this.detailsParams.Type,
        Year: this.detailsParams.Year,
        Numble: this.detailsParams.Numble,
        TimeValue: this.detailsParams.TimeValue,
        comId: this.detailsParams.comId,
        ProjectID: this.detailsParams.ProjectID
      }).then(rs => {
        let data = rs.data.Data
        if (data.Status === 0) {
          let arr = {}
          this.dutyInfoData.xData = []
          this.dutyInfoData.yData = []
          this.dutyInfoData.chartX = []
          for (let i in data.RetrunObjectData) {
            arr.name = data.RetrunObjectData[i].DutyName
            arr.value = data.RetrunObjectData[i].TotalCount
            this.dutyInfoData.xData.push(arr)
            this.dutyInfoData.yData.push(arr.name) // 人员名称
            this.dutyInfoData.chartX.push(arr.value) // 员工人数
          }
          this.doRoundChart()
          this.doListChart()
        } else {
          this.$Message.info(data.Message)
        }
      })
      // 获取个人分析职务查询---平均剂量数据
      this.$axios.post('/api/PA/GetPAOutDutyAvgRDInfo', {
        Type: this.detailsParams.Type,
        Year: this.detailsParams.Year,
        Numble: this.detailsParams.Numble,
        TimeValue: this.detailsParams.TimeValue,
        comId: this.detailsParams.comId,
        ProjectID: this.detailsParams.ProjectID
      }).then(rs => {
        let data = rs.data.Data
        if (data.Status === 0) {
          let arr = {}
          this.dutyAvgData.xData = []
          this.dutyAvgData.yData = []
          this.dutyAvgData.chartX = []
          this.dutyAvgData.avgRd = []
          for (let i in data.RetrunObjectData) {
            arr.name = data.RetrunObjectData[i].DutyName
            arr.value = data.RetrunObjectData[i].TotalCount
            this.dutyAvgData.xData.push(arr)
            this.dutyAvgData.yData.push(arr.name) // 员工名称
            this.dutyAvgData.chartX.push(arr.value)
            this.dutyAvgData.avgRd.push(data.RetrunObjectData[i].AvgRD) // 平均剂量
          }
          this.doRoundChart()
          this.doListChart()
        } else {
          this.$Message.info(data.Message)
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
    // 累计剂量分析
    queryOutScope() {
      if (!this.detailsParams.Year) {
        this.detailsParams.Year = new Date().getFullYear()
        this.detailsParams.Type = 4
        this.detailsParams.Numble = 0
        this.detailsParams.TimeValue = 0
      }
      this.$axios.post('/api/PA/GetPAOutScopeInfo', {
        Type: this.detailsParams.Type,
        Year: this.detailsParams.Year,
        Numble: this.detailsParams.Numble,
        TimeValue: this.detailsParams.TimeValue,
        comId: this.detailsParams.comId,
        ProjectID: this.detailsParams.ProjectID
      }).then(rs => {
        let data = rs.data.Data
        if (data.Status === 0) {
          this.OutScope.xData = []
          this.OutScope.yData = []
          this.OutScope.chartX = []
          data.RetrunObjectData.forEach((value, index, nery) => {
            let arr = {
              itemStyle: {
                color: ''
              }
            }
            if (index === 0) {
              arr.name = `0%-${value.Scope}%`
              arr.itemStyle.color = '#2FC7CA'
            } else {
              switch (index) {
                case 1:
                  arr.itemStyle.color = '#B6A2DF'
                  break
                case 2:
                  arr.itemStyle.color = '#5BB0F0'
                  break
                case 3:
                  arr.itemStyle.color = '#FFB981'
                  break
                case 4:
                  arr.itemStyle.color = '#D97A80'
                  break
                default:
              }
              arr.name = `${nery[index - 1].Scope}%-${value.Scope}%`
            }
            arr.value = value.TotalCount
            this.OutScope.xData.push(arr)
            this.OutScope.yData.push(arr.name)
            this.OutScope.chartX.push(arr.value)
          })
          this.outOption()
        } else {
          this.$Message.info(data.Message)
        }
      })
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
    // 元饼图
    doRoundChart() {
      let round = echarts.init(document.getElementById('round'))
      let does = echarts.init(document.getElementById('does'))
      // 左图
      round.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}位'
        },
        legend: {
          orient: 'bottom',
          x: 'right',
          y: 'center',
          data: this.dutyInfoData.chartX // 员工人数
        },
        series: [{
          name: '',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              formatter: '{b}',
              show: true,
              position: 'inside'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: this.dutyInfoData.xData
        }]
      })
      // 右图
      does.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}μSv'
        },
        legend: {
          orient: 'bottom',
          x: 'right',
          y: 'center',
          data: this.dutyAvgData.avgRd // 平均剂量
        },
        series: [{
          name: '',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              formatter: '{b}',
              show: true,
              position: 'inside'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: this.dutyAvgData.xData
        }]
      })
    },
    // 柱状图
    doListChart() {
      let number = echarts.init(document.getElementById('number'))
      let art = echarts.init(document.getElementById('art'))
      // 第一个
      number.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          orient: 'vertical'
        },
        grid: {
          left: '3%',
          right: 50,
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          name: '职务',
          type: 'category',
          data: this.dutyInfoData.yData,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          name: '人数(位)'
        }],
        series: [{
          // name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: this.dutyInfoData.chartX
        }]
      })
      // 第二个
      art.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          orient: 'vertical'
        },
        grid: {
          left: '3%',
          right: 50,
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          name: '职务',
          type: 'category',
          data: this.dutyAvgData.yData,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          name: '平均剂量(μSv)'
        }],
        series: [{
          // name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: this.dutyAvgData.avgRd
        }]
      })
    },
    // 累计剂量
    outOption() {
      let OutRound = echarts.init(document.getElementById('OutRound'))
      let OutChart = echarts.init(document.getElementById('OutChart'))
      OutRound.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}'
        },
        legend: {
          orient: 'bottom',
          x: 'right',
          y: 'center',
          data: this.OutScope.yData
        },
        series: [{
          name: '',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['45%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              formatter: '{c}',
              show: true,
              position: 'inside'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: this.OutScope.xData
        }]
      })
      //
      OutChart.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          orient: 'vertical'
        },
        grid: {
          left: '3%',
          right: 50,
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          name: '范围',
          type: 'category',
          data: this.OutScope.yData,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          name: '总条数'
        }],
        series: [{
          // name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: this.OutScope.chartX
        }]
      })
    }
  },
  watch: {
    times(val) {
      switch (val.type) {
        case 'year':
          this.detailsParams.Type = 4
          this.detailsParams.Year = val.data
          this.detailsParams.Numble = 0
          this.detailsParams.TimeValue = 0
          break
        case 'quarter':
          this.detailsParams.Type = 3
          this.detailsParams.Year = val.data.substr(0, 4)
          this.detailsParams.Numble = val.data.substr(5, 6)
          this.detailsParams.TimeValue = val.data
          break
        case 'month':
          this.detailsParams.Type = 2
          let reg = /-\d{1,2}/
          let path = val.data.match(reg)[0]
          this.detailsParams.Year = val.data.substr(0, 4)
          this.detailsParams.Numble = path.substr(1)
          this.detailsParams.TimeValue = val.data
          break
        case 'date':
          this.detailsParams.Type = 1
          this.detailsParams.Year = val.data.substr(0, 4)
          this.detailsParams.Numble = val.data.substr(4, 6)
          this.detailsParams.TimeValue = val.data
          break
        default:
      }
      this.checkRound()
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
.scopr-list{
  display: flex;
  display: -webkit-flex;
  display: -ms-flex;
  position: relative;
  z-index: 9;
  margin-bottom: 15px;
  div{
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    text-align: center;
    display: inline-block;
    .num{
      color: #96A5DF;
      font-size: 16px;
      margin-right: 5px;
    }
    .title{
      width: 80px;
      height: 40px;
      border-radius: 30px;
      font-size: 16px;
      color: #fff;
      padding: 4px 10px;
    }
    .safe{
      background: #6BCE47;
    }
    .waring{
      background: #FEAC02;
    }
    .danger{
      background: #F74828;
    }
  }
}
.no-data {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 500px;
    background: #fff;
    z-index: 7;
    text-align: center;
    padding: 25px;
    box-sizing: border-box;
    font-size: 15px;
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
            margin-right: 20px;
        }
    }
    .list-left {
        margin-left: 5%;
    }
}
.sufan-title {
    margin: 35px 0 10px;
    padding: 3px 5px;
    box-sizing: border-box;
    font-size: 16px;
    border-left: 2px solid #6E6A8D;
}
.check-btn {
    ul {
        li {
            float: left;
            height: 45px;
            border: 1px solid;
            padding: 0 50px;
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
.chart-list {
    div {
        float: left;
        width: 100%;
        height: 400px;
    }
}
.check-list > .check-lisit-box {
    position: relative;
    float: left;
    width: 50%;
    height: 400px;
}
#OutChart,
#OutRound,
#art,
#does,
#number,
#round {
    height: 400px;
}

.check-list::after {
    content: '';
    display: block;
    clear: both;
}
</style>
