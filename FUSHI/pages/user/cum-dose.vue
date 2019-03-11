<template lang="html">
  <section>
    <div class="sufan-dose">
      <div>
        <sufan-steps :list="steps"></sufan-steps>
      </div>
      <div class="sufan-select clear">
        <div class="search clear">
          <span class="person">高级搜索:</span>
          <div class="input">
            <input type="text" v-model="params.Owner" placeholder="快速搜索">
            <i class="iconfont icon">&#xe601;</i>
          </div>
          <span class="btn" @click="doSearchClick">搜索</span>
        </div>
        <div class="date-select">
          <span class="time">选择时间</span>
          <date-select
              class="select time-slect"
              v-model="times">
          </date-select>
        </div>
        <div class="export" @click="queryExe">
          导出个人数据报告
        </div>
      </div>
      <div class="sufan-auto" v-iscroll>
        <div>
      <!-- 人员 -->
      <div class="sufan-person-list clear">
        <div class="iconfont btn-gruop" :class="{'leftDisable': leftDisable}" @click="doLeftClick">&#xe7a5;</div>
        <ul class="user-list">
          <li class="list-li" v-for="item in userDataRows" @click="doPersonClick(item)">
            <div class="list-img" :class="{'mark': item.mark}">
              <img :src="item.FaceUrl" alt="" v-if="item.FaceUrl">
              <div v-else class="iconfont icon">&#xe63e;</div>
            </div>
            <p class="name">{{item.Owner}}</p>
            <p class="doctor">{{item.DutyName}}</p>
          </li>
        </ul>
        <div class="iconfont btn-gruop" :class="{'rightDisable': rightDisable}" @click="doRightClick">&#xe602;</div>
      </div>
      <!-- 人员 //-->
      <!-- 个人剂量数据 -->
      <div class="sufan-data">
        <div class="area-title">个人剂量数据</div>
        <div class="data-box clear">
          <div class="details-box clear">
            <div class="person-chart" id="person"></div>
            <div class="box details">
              <div class="title">
                <p class="home">{{firstBaseMsgData.Owner}}</p>
                <p class="pet">部门：{{firstBaseMsgData.DepartName}}</p>
                <p class="pet">职位：{{firstBaseMsgData.DutyName}}</p>
                <!-- <p class="num"><span>8.20</span>μSv</p>
                <div class="totle">85%</div> -->
              </div>
              <div class="type">
                <div class="list clear">
                  <div class="round"></div>
                  <div class="ment">设备类型：<span>{{firstBaseMsgData.DevName}}</span></div>
                </div>
                <div class="list clear">
                  <div class="round roundID"></div>
                  <div class="ment">设备ID：<span>{{firstBaseMsgData.DevNumber}}</span></div>
                </div>
              </div>
              <div class="leable">
                <!-- <div class="alls clear"><span>当前剂量</span><span>8.20μSv</span></div> -->
                <div class="alls clear"><span>法规限值</span><span>{{firstBaseMsgData.SumThreshold}}μSv</span></div>
                <div class="alls clear"><span>剂量百分比</span><span v-if="infoDataRows">{{infoDataRows.RDPercent}}%</span><span v-else>暂无数据</span></div>
                <div class="alls clear"><span>剂量最大值</span><span v-if="infoDataRows">{{infoDataRows.MaxRD}}%</span><span v-else>暂无数据</span></div>
                <!-- <div class="alls clear"><span>剂量百分比</span><span v-if="firstBaseMsgData.RDPercent">{{firstBaseMsgData.RDPercent}}%</span><span v-else>暂无数据</span></div> -->
                <!-- <div class="alls clear"><span>剂量最大值</span><span v-if="baseMsgData.length > 0">{{baseMsgData[0].MaxRD}}%</span><span v-else>暂无数据</span></div> -->
                <!-- <div class="alls clear"><span>剂量最大值时间</span><span v-if="infoDataRows.MaxRDTime">{{infoDataRows.MaxRDTime}}</span><span v-else>暂无数据</span></div> -->
                <!-- <div class="alls clear"><span>最大值时间</span><span class="addcoler" @click="doDetails" v-if="baseMsgData.length > 0">详情>></span><span v-else>暂无数据</span></div> -->
                <div class="alls clear"><span>最大值时间</span><span  v-if="infoDataRows">{{infoDataRows.MaxRDTime}}</span><span v-else>暂无数据</span></div>
              </div>
            </div>
          </div>
          <div class="charts">
            <div id="charts"></div>
            <div class="charst-list" v-show="this.curdateData.length <= 0">暂无数据</div>
          </div>
        </div>
      </div>
      </div>
      <iframe :src="ifrSrc" width="0" height="0"></iframe>
    </div>
    <Modal
        v-model="detailsModal"
        title="个人剂量最大值时间详情"
        @on-ok="doModelOk"
        @on-cancel="doModelCancel"
        width="800">
        <ul class="details-list">
          <li v-for="item in baseMsgData">
            <span>剂量值:{{item.MaxRD}}μSv</span>
            <span>时间:{{item.MaxRDTime}}</span>
          </li>
        </ul>
    </Modal>
    </div>
  </section>
</template>
<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      steps: [{
        name: '人员管理',
        path: '/user/pers-dose'
      }, {
        name: '累积剂量',
        path: '/user/cum-dose'
      }],
      detailsModal: false,
      chartsList: true,
      leftDisable: true,
      rightDisable: false,
      params: {
        Owner: '',
        PageIndex: 1,
        PageSize: 10
      },
      times: '',
      detailsParams: {
        TimeValue: '',
        Type: '',
        Year: '',
        Numble: '',
        Id: ''
      },
      total: '',
      baseMsgData: [],
      firstBaseMsgData: {},
      userDataRows: {},
      infoDataRows: [],
      ifrSrc: '',
      curdateData: {
        x: [],
        y: []
      }
    }
  },
  mounted() {
    this.newTimeData()
    this.initChart()
    this.queryPerson()
    this.times = {}
  },
  methods: {
    newTimeData() {
      if (!this.detailsParams.Type) {
        this.detailsParams.Type = 4
        this.detailsParams.Year = new Date().getFullYear()
        this.detailsParams.Numble = 0
        this.detailsParams.TimeValue = 0
      }
    },
    doLeftClick() {
      if (this.params.PageIndex > 1) {
        this.params.PageIndex -= 1
        this.queryPerson()
      }
      this.checkBtnDisable()
    },
    doRightClick() {
      let page = parseInt(this.total / this.params.PageSize) + 1
      if (this.params.PageIndex < page) {
        this.params.PageIndex += 1
        this.queryPerson()
      }
      this.checkBtnDisable()
    },
    checkBtnDisable() {
      if (this.total < this.params.PageSize) {
        this.leftDisable = false
        this.rightDisable = false
      } else {
        let page = parseInt(this.total / this.params.PageSize) + 1
        if (this.params.PageIndex < page && this.params.PageIndex > 1) {
          this.rightDisable = false
          this.leftDisable = false
        } else if (this.params.PageIndex < page && this.params.PageIndex === 1) {
          this.rightDisable = false
          this.leftDisable = true
        } else if (this.params.PageIndex === page && this.params.PageIndex > 1) {
          this.rightDisable = true
          this.leftDisable = false
        }
      }
    },
    // 请求人员数据
    queryPerson() {
      this.$axios.post('/api/PM/GetAllPerson', {
        StrWhere: this.params.Owner,
        PageIndex: this.params.PageIndex,
        PageSize: this.params.PageSize
      }).then(rs => {
        if (rs.data.Data.Status === 1) {
          this.userDataRows = rs.data.Data.RetrunObjectData
        } else {
          this.$Message.info(rs.data.Data.Message)
        }
        for (let i in this.userDataRows) {
          this.$set(this.userDataRows[i], 'mark', false)
        }
        this.total = rs.data.Data.TotalCount
        this.checkBtnDisable()
        this.userDataRows[0].mark = true
        this.detailsParams.Id = this.userDataRows[0].DevNumber
        this.queryCurdateInfo()
        this.queryBaseMsg()
      })
    },
    queryBaseMsg() {
      // 个人剂量基本信息
      this.$axios.post('/api/PM/GetSumRDBaseInfo', {
        TimeValue: this.detailsParams.TimeValue,
        Type: this.detailsParams.Type,
        Year: this.detailsParams.Year,
        Numble: this.detailsParams.Numble,
        Id: this.detailsParams.Id
      }).then(rs => {
        this.baseMsgData = rs.data.Data.RetrunObjectData
        this.firstBaseMsgData = rs.data.Data.RetrunObjectData[0]
      })
      // 个人剂量，累计剂量的报警最大值
      this.$axios.post('/api/PM/GetMaxRDAndTimeInfo', {
        TimeValue: this.detailsParams.TimeValue,
        Type: this.detailsParams.Type,
        Year: this.detailsParams.Year,
        Numble: this.detailsParams.Numble,
        Id: this.detailsParams.Id
      }).then(rs => {
        if (rs.data.Data.RetrunObjectData) {
          this.infoDataRows = rs.data.Data.RetrunObjectData[0]
        }
        // this.initChart()
      })
      this.$axios.post('/api/PM/GetSumRDDetailInfo', {
        TimeValue: this.detailsParams.TimeValue,
        Type: this.detailsParams.Type,
        Year: this.detailsParams.Year,
        Numble: this.detailsParams.Numble,
        Id: this.detailsParams.Id
      }).then(rs => {
        let data = rs.data.Data
        this.curdateData.x = []
        this.curdateData.y = []
        console.log(rs.data.Data, '折线图')
        if (data.RetrunObjectData && data.RetrunObjectData.length > 0) {
          for (let i in data.RetrunObjectData) {
            this.curdateData.y.push(data.RetrunObjectData[i].RdValue)
            this.curdateData.x.push(data.RetrunObjectData[i].XTime)
          }
          // this.initChart()
        } else {
          this.chartsList = false
          // this.initChart()
        }
      })
      setTimeout(() => {
        this.initChart()
      }, 2000)
    },
    queryCurdateInfo() {
    },
    doPersonClick(val) {
      for (let i in this.userDataRows) {
        this.userDataRows[i].mark = false
      }
      val.mark = true
      this.detailsParams.Id = val.DevNumber
      this.queryCurdateInfo()
      this.queryBaseMsg()
    },
    queryExe() {
      this.$axios.post('/api/PM/SumRDExportExcel', {
        TimeValue: this.detailsParams.TimeValue,
        Type: this.detailsParams.Type,
        Year: this.detailsParams.Year,
        Numble: this.detailsParams.Numble,
        Id: this.detailsParams.Id
      }).then(rs => {
        if (rs.data.Success) {
          this.ifrSrc = `${rs.data.Data}?${new Date()}`
          this.$Message.info('请求成功')
        } else {
          this.$Message.info('导出失败')
        }
      })
    },
    doSearchClick() {
      this.params.PageIndex = 1
      this.queryPerson()
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
    doModelCancel() {
    },
    // 初始化表格
    initChart() {
      let chartHis = echarts.init(document.getElementById('charts'))
      let chartPerson = echarts.init(document.getElementById('person'))
      let xName = ''
      console.log(this.detailsParams.Type)
      switch (this.detailsParams.Type) {
        case 4:
          xName = '月'
          break
        case 3:
          xName = '月'
          break
        case 2:
          xName = '日'
          break
        case 1:
          xName = 'h'
          break
        default:
      }
      chartHis.setOption({
        xAxis: {
          name: `时间/${xName}`,
          type: 'category',
          boundaryGap: false,
          data: this.curdateData.x
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
          name: '累积剂量/μSv',
          max: function(value) {
            return (value.max * 5)
          }
        },
        color: '#EBF8FF',
        series: [{
          data: this.curdateData.y,
          type: 'line',
          areaStyle: {}
        }]
      })

      let labelSetting = {
        normal: {
          show: true,
          position: 'outside',
          offset: [0, -40],
          formatter: function(param) {
            return (param.value / 100 * 100).toFixed(0) + '%'
          },
          textStyle: {
            fontSize: 18,
            fontFamily: 'Arial'
          }
        }
      }

      let symbols =
        'path://M337,364c0.193,15.232,3.939,27.586,7,40  c1.493,6.056-2.1,11.611-2,15c0.341,11.542,2.903,28.532,5,40c1.053,5.758-3.442,7.226-2,14c4.01,18.831,4.884,39.988,9,58  c2.525,11.05,0.033,20.789,3,31c0.09,0.31,3.842,12.802,4,13c4.127,5.171,15.715,1.117,18,10c-2.031,1.896-1.868,2.872-5,4  c-7.753,6.208-27.104-2.881-33-6c0,1,0,2,0,3c-5.067,0.076-7.766-0.653-11-2c-1.971-6.077-4.099-12.038-2-20  c0.315-1.197,2.188-1.694,2-4c-0.373-4.55-2.853-13.887-4-19c-2.357-10.503-0.931-21.626-3-31c-2.98-13.504,0.841-29.442-6-39  c-1.18-0.803-1.681-0.773-4-1c0,0.333,0,0.667,0,1c-0.333,0-0.667,0-1,0c-3.866,36.722,3.961,89.39-7,121  c-4.323,2.513-7.669,3.966-15,4c-4.355-3.948-7.877-3.321-8-12c-3.267-5.27-0.25-24.592,0-32c-0.333-27.331-0.667-54.669-1-82  c-3-1-6-2-9-3c0-8.666,0-17.334,0-26c2.941-4.818-0.394-14.528,1-21c2-16.998,4-34.001,6-51c-11.947-7.648-14.46-27.056-18-43  c-2.461-11.087,0.305-25.293,7-28c4.7-4.261,15.691-3.355,20-8c2.259-2.435,2.633-5.726,5-8c-0.444-15.223-10.355-40.627,9-44  c3.274-2.239,11.538-0.783,15,0c2.071,3.614,5.081,8.07,8,11c0.051,11.941-2.34,23.714-7,31c-1.316,2.057-2.855,7.15-2,8  c5.347,8.864,15.83,7.082,24,13c3.604,2.61,4.101,8.522,6,13c5.114,12.059,14.183,26.146,15,41c-0.798,0.98-1.446,2.744-2,4  C353.229,362.305,346.4,363.971,337,364z'
      let bodyMax = 100
      let fillColor = ''
      if (this.baseMsgData.length > 0) {
        // bodyMax = this.baseMsgData[0].SumThreshold
        if (this.infoDataRows.RDPercent < 50 || !this.infoDataRows.RDPercent) {
          fillColor = '#68CE4E'
        } else if (this.infoDataRows.RDPercent >= 50 && this.infoDataRows.RDPercent < 80) {
          fillColor = 'yellow'
        } else if (this.infoDataRows.RDPercent >= 80 && this.infoDataRows.RDPercent < 100) {
          fillColor = 'orange'
        } else {
          fillColor = '#F45A58'
        }
      } else {
        fillColor = '#F45A58'
      }
      chartPerson.setOption({
        tooltip: {},
        legend: {
          // data: ['typeA', 'typeB'],
          // selectedMode: 'single'
        },
        xAxis: {
          data: ['a'],
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        yAxis: {
          show: false,
          max: bodyMax,
          offset: 20,
          splitLine: {
            show: false
          }
        },
        grid: {
          top: 'center',
          height: 230
        },
        markLine: {
          z: -100
        },
        series: [{
          // name: 'typeA',
          type: 'pictorialBar',
          symbolClip: true,
          symbolBoundingData: bodyMax,
          label: labelSetting,
          data: [{
            value: this.infoDataRows.RDPercent || 0,
            symbol: symbols
          }],
          itemStyle: {
            normal: {
              color: fillColor
            }
          },
          z: 10
        }, {
          // name: 'full',
          type: 'pictorialBar',
          symbolBoundingData: bodyMax,
          animationDuration: 0,
          itemStyle: {
            normal: {
              color: '#767C8A'
            }
          },
          data: [{
            value: 1,
            symbol: symbols
          }]
        }]
      })
    }
  },
  watch: {
    times(val) {
      console.log(val)
      switch (val.type) {
        case 'year':
          this.detailsParams.Type = 4
          this.detailsParams.Year = val.data
          this.detailsParams.Numble = 0
          this.detailsParams.TimeValue = 0
          this.queryBaseMsg()
          break
        case 'quarter':
          this.detailsParams.Type = 3
          this.detailsParams.Year = val.data.substr(0, 4)
          this.detailsParams.Numble = val.data.substr(5, 6)
          this.detailsParams.TimeValue = val.data
          this.queryBaseMsg()
          break
        case 'month':
          this.detailsParams.Type = 2
          let reg = /-\d{1,2}/
          let path = val.data.match(reg)[0]
          this.detailsParams.Year = val.data.substr(0, 4)
          this.detailsParams.Numble = path.substr(1)
          this.detailsParams.TimeValue = val.data
          this.queryBaseMsg()
          break
        case 'date':
          this.detailsParams.Type = 1
          this.detailsParams.Year = val.data.substr(0, 4)
          this.detailsParams.Numble = val.data.substr(4, 6)
          this.detailsParams.TimeValue = val.data
          this.queryBaseMsg()
          break
        default:
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
.sufan-auto{
  margin-top: 25px;
  width: 100%;
  height: calc(100vh - 320px);
  overflow: hidden;
}
//
.sufan-person-list {
    display: flex;
    display: -webkit-flex;
    display: -ms-flex;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    flex-direction: row;
    padding: 0px 0 25px 0;
    box-sizing: border-box;
    .btn-gruop {
        width: 50px;
        font-size: 45px;
        line-height: 160px;
        height: 160px;
        cursor: pointer;
        color: #D2D2D2;
        font-weight: bold;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
        user-select: none;
    }
    .user-list {
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        padding: 0 40px;
        box-sizing: border-box;
        .list-li {
            float: left;
            width: 100px;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            -o-user-select: none;
            user-select: none;
            .list-img {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                overflow: hidden;
                border: 3px solid #fff;
                img {
                    width: 100%;
                }
                .icon {
                    width: 100%;
                    height: 100%;
                    font-size: 65px;
                    line-height: 100px;
                    text-align: center;
                    color: #fff;
                    background: #ccc;
                }
            }
            .mark {
                border: 3px solid #FFAB67;
            }
            .name {
                font-size: 15px;
                font-weight: bold;
                text-align: center;
                margin-top: 10px;
            }
            .doctor {
                margin-top: 5px;
                text-align: center;
                font-size: 14px;
                color: #999999;
            }
        }
        .list-li:not(:nth-last-child(1)) {
            margin-right: 35px;
        }
    }
}
//
.sufan-dose {
    padding: 10px 20px 20px;
    box-sizing: border-box;
}
.area-title {
    padding: 3px 0 3px 15px;
    border-left: 2px solid #6F6B8C;
    color: #6F6B8C;
    font-size: 17px;
}
.sufan-select {
    margin-top: 30px;
    .search {
        float: left;
        .person {
            float: left;
            line-height: 30px;
            margin-right: 5px;
            font-size: 14px;
        }
        .input {
            float: left;
            position: relative;
            font-size: 14px;
            input {
                width: 200px;
                border: 1px solid #EEE;
                outline: none;
                height: 30px;
                text-indent: 25px;
            }
            .icon {
                position: absolute;
                left: 5px;
                top: 5px;
                font-size: 15px;
            }
        }
        .btn {
            float: left;
            height: 30px;
            padding: 0 15px;
            box-sizing: border-box;
            color: #fff;
            background: #6D6C8E;
            line-height: 30px;
            font-size: 14px;
            cursor: pointer;
            margin-left: 5px;
        }
    }
    .date-select {
        float: left;
        margin-left: 125px;
        //margin-right: 100px;
        .time {
            float: left;
            font-size: 14px;
            line-height: 30px;
            margin-right: 20px;
        }
        .time-slect {
            float: left;
        }
    }
    .export {
        float: left;
        margin-left: 40px;
        height: 30px;
        padding: 0 15px;
        box-sizing: border-box;
        background: #6D6C8E;
        line-height: 30px;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
    }
}
.sufan-data {
    margin-top: 20px;
    .data-box {
        margin-top: 20px;
        .details-box {
            float: left;
            width: 50%;
            margin-top: 30px;
        }
        .charts {
            float: left;
            width: 50%;
            position: relative;
            #charts {
                width: 100%;
                height: 400px;
                margin-top: 0px;
            }
            .charst-list {
                text-align: center;
                padding: 25px;
                box-sizing: border-box;
                position: absolute;
                left: 0;
                right: 0;
                width: 100%;
                height: 400px;
                z-index: 7;
            }
        }
    }
    .person-chart {
        float: left;
        width: 140px;
        height: 400px;
        margin-right: 40px;
    }
}
.details {
    width: 50%;
    float: left;
    border: 1px solid #EEEEEE;
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
.leftDisable {
    cursor: no-drop !important;
}
.rightDisable {
    cursor: no-drop !important;
}
.details-list{
  // padding: 15px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  li{
    width: 50%;
    padding: 10px;
    box-sizing: border-box;
    float: left;
    display: flex;
    display: -webkit-flex;
    display: -ms-flex;
    span:nth-child(1){
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
      text-align: center;
    }
    span:nth-child(2){
      -webkit-flex: 2;
      -ms-flex: 2;
      flex: 2;
      text-align: center;
    }
  }
  li:not(:nth-last-child(1)){
    border-bottom: 1px solid #ccc;
  }
  li:nth-child(2n - 1) {
    border-right: 1px solid #ccc;
  }
}
.details-list::after{
  content: '';
  display: block;
  clear: both;
}
</style>
