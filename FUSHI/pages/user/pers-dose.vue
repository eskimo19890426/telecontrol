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
        <!-- <div class="date-select">
          <span class="time">选择导出数据时间</span>
          <date-select style="width:200px"
              class="select time-slect"
              v-model="times">
          </date-select>
        </div>
        <div class="export" @click="queryExe">
          导出个人数据报告
        </div> -->
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
                <p class="home">{{baseMsgData.Owner}}</p>
                <p class="pet">部门：{{baseMsgData.DepartName}}</p>
                <p class="pet">职位：{{baseMsgData.DutyName}}</p>
                <!-- <p class="num"><span>8.20</span>μSv</p>
                <div class="totle">85%</div> -->
              </div>
              <div class="type">
                <div class="list clear">
                  <div class="round"></div>
                  <div class="ment">设备类型：<span>{{baseMsgData.DevName}}</span></div>
                </div>
                <div class="list clear">
                  <div class="round roundID"></div>
                  <div class="ment">设备ID：<span>{{baseMsgData.DevNumber}}</span></div>
                </div>
              </div>
              <div class="leable">
                <!-- <div class="alls clear"><span>当前剂量</span><span>8.20μSv</span></div> -->
                <div class="alls clear"><span>法规限值</span><span>{{baseMsgData.SumThreshold}}μSv</span></div>
                <div class="alls clear"><span>剂量百分比</span><span v-if="infoDataRows">{{infoDataRows.RDPercent}}%</span><span v-else>暂无数据</span></div>
                <div class="alls clear"><span>剂量最大值</span><span v-if="infoDataRows">{{infoDataRows.MaxRD}}%</span><span v-else>暂无数据</span></div>
                <!-- <div class="alls clear"><span>剂量最大值时间</span><span v-if="infoDataRows.MaxRDTime">{{infoDataRows.MaxRDTime}}</span><span v-else>暂无数据</span></div> -->
                <!-- <div class="alls clear"><span>最大值时间</span><span class="addcoler" @click="doDetails" v-if="infoDataRows.length>0">详情>></span><span v-else>暂无数据</span></div> -->
                <div class="alls clear"><span>最大值时间</span><span  v-if="infoDataRows">{{infoDataRows.MaxRDTime}}</span><span v-else>暂无数据</span></div>
              </div>
            </div>
          </div>
          <div class="charts">
            <div id="charts"></div>
            <div class="charst-list" v-show="curdateData.x.length <= 0">暂无数据</div>
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
          <!-- <li v-for="item in infoDataRows"> -->
          <li>
            <span>剂量值：{{infoDataRows.MaxRD}}μSv</span>
            <span>时间：{{infoDataRows.MaxRDTime}}</span>
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
        name: '人员剂量',
        path: '/user/pers-dose'
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
      userDataRows: {},
      infoDataRows: {},
      ifrSrc: '',
      timer: '',
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
    this.timer = setInterval(() => {
      this.queryCurdateInfo()
    }, 5000)
  },
  destroyed() {
    clearInterval(this.timer)
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
      this.$axios.post('/api/PM/GetRDBaseMsg', {
        TimeValue: this.detailsParams.TimeValue,
        Type: this.detailsParams.Type,
        Year: this.detailsParams.Year,
        Numble: this.detailsParams.Numble,
        Id: this.detailsParams.Id
      }).then(rs => {
        this.baseMsgData = rs.data.Data.RetrunObjectData[0]
        // this.initChart()
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
        this.initChart()
      })
    },
    queryCurdateInfo() {
      this.$axios.post('/api/PM/GetPersonCurdateInfo', {
        Id: this.detailsParams.Id
      }).then(rs => {
        console.log(rs, '人员剂量')
        this.curdateData = {
          x: [],
          y: []
        }
        if (rs.data.Data.RetrunObjectData && rs.data.Data.RetrunObjectData.length > 0) {
          let data = rs.data.Data.RetrunObjectData.reverse()
          for (let i in data) {
            this.curdateData.x.push(data[i].XTime)
            this.curdateData.y.push(data[i].RdValue)
          }
          this.initChart()
        } else {
          this.chartsList = false
        }
      })
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
    // 导出表格
    queryExe() {
      this.$axios.post('/api/PM/PersonRDExportExcel', {
        TimeValue: this.detailsParams.TimeValue,
        Type: this.detailsParams.Type,
        Year: this.detailsParams.Year,
        Numble: this.detailsParams.Numble,
        Id: this.detailsParams.Id
      }).then(rs => {
        if (rs.data.Success) {
          if (!rs.data.Data) {
            return this.$Message.info('暂无数据')
          }
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
    doModelCancel() {},
    // 初始化表格
    initChart() {
      let chartHis = echarts.init(document.getElementById('charts'))
      let chartPerson = echarts.init(document.getElementById('person'))
      chartHis.setOption({
        xAxis: {
          name: '(时间/h)',
          type: 'category',
          boundaryGap: false,
          data: this.curdateData.x,
          axisLabel: {
            rotate: 0,
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
        grid: {
          bottom: 100
        },
        yAxis: {
          type: 'value',
          name: '吸收剂量率(μSv/h)',
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
          offset: [0, -20],
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
        'path://M14.942,58.585C15.098,58.709,10.807,55.192,10,55  c-0.759-2.489-3.143-3.259-2-4c1.162-1.312,2.69-2.834,4-4c-0.398-7.806-1.582-13.701-1-22c3.254-2.135,2.517-4.268,5-7  c2.644-2.91,8.367-2.998,11-6c7.699-0.3,12.831,0.867,16,5c4.321,5.347,8.313,11.133,9,20c-4.015,5.574-8.524,24.243-15,22  c-1.724-1.732-1.499-2.783-4-4c0,1,0,2,0,3c3.345,3.554,5.476,10.65,5,15c-0.667,0-1.333,0-2,0c0,0.333,0,0.667,0,1  c-1.01,0.99-0.988-0.985-1-1c-7.044-2.166-13.847-11.064-16-18c2.467-1.294,0.681,0.429,2-2c-1.333,0-1.917,0.583-3.25,0.583  c-0.917,2.333-1.668,5.454-0.986,5.24 M16.764,58.824C18.639,58.657,23.376,72.208,39,78c0.468,4.42,3.6,15.124,7,17c0-2,0-4,0-6  c-5.331-6.976-5.007-16.117-7-25c0.667,0,1.333,0,2,0c2.948,3.545,6.778,2.528,11,5c3.256,1.907,22.257,32.306,23,37  c-2.031,1.896-1.868,2.872-5,4c-4.49,2.759-12.294-0.454-17-1c0,0.667,0,1.333,0,2c1.744,3.139,1.24,9.935,3,16  c4.734,16.314,6.963,39.449,7,61c-3.236,1.676-9.476,3.382-11,7c-1.899,2.472-3.939,11.644-3,14c-9.193,16.126-7.383,40.305-8,61  c5.131,3.411,8.661,7.256,15,10c-0.631,1.754-0.193,0.971-1,2c-1.69,1.142-4.896,1.066-8,1c-1.69-1.142-4.896-1.066-8-1  c0.702,5.596,0.201,8.005-1,13c-2.473,0.482-3.684,0.862-7,1c-2.333-2.667-4.667-5.333-7-8c-0.045-7.03,0.333-8.268,1-14  c-5.668-1.181-7.256-2.674-7-10c3.342-5.573-0.883-12.446,1-21c2.803-12.732,3.331-21.609,5-32c0.627-3.905-1.535-16.394-2-17  c-2.891-3.025-8.801-2.22-11-6c-2.722-3.222-1.26-15.446-1-23c0.66-19.153,7.137-35.527,8-54C9.781,105.469-2.7,77.038,2,65  c3.908-2.313,13.109-7.234,12.942-6.415'
      let bodyMax = 100
      let fillColor = ''
      if (this.infoDataRows.RDPercent < 50) {
        fillColor = '#68CE4E'
      } else if (this.infoDataRows.RDPercent >= 50 && this.infoDataRows.RDPercent < 80) {
        fillColor = 'yellow'
      } else if (this.infoDataRows.RDPercent >= 80 && this.infoDataRows.RDPercent < 100) {
        fillColor = 'orange'
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
      this.queryBaseMsg()
      this.queryCurdateInfo()
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
    height: calc(100vh - 310px);
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
    padding: 0 0 25px;
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
        margin-left: 60px;
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
            width: 35%;
            margin-top: 30px;
        }
        .charts {
            position: relative;
            float: left;
            width: 65%;
            #charts {
                width: 100%;
                height: 500px;
                margin-top: 0;
            }
            .charst-list {
                text-align: center;
                padding: 25px;
                box-sizing: border-box;
                position: absolute;
                width: 100%;
                height: 500px;
                background: #fff;
                z-index: 7;
                left: 0;
                top: 0;
            }
        }
    }
    .person-chart {
        float: left;
        width: 100px;
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
</style>
