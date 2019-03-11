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
        <div class="date-select clear">
          <span class="time">选择时间</span>
          <date-select style="width:200px"
              class="select time-slect"
              v-model="times">
          </date-select>
        </div>
        <div class="area-title">个人历史数据</div>
        <div class="data-box clear">
          <div class="details-box clear">
            <div class="person-chart" id="person"></div>
            <div class="no-data" v-show="infoData.x.length <= 0">暂无数据</div>
          </div>
          <div class="charts">
            <div id="charts"></div>
            <div class="charst-list no-data" v-show="curdateData.x.length <= 0">暂无数据</div>
          </div>
        </div>
      </div>
      </div>
      </div>
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
        name: '历史数据',
        path: '/user/history'
      }],
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
        Id: 0
      },
      total: '',
      userDataRows: {},
      ifrSrc: '',
      timer: '',
      curdateData: {
        x: [],
        y: []
      },
      infoData: {
        x: [],
        y: []
      }
    }
  },
  mounted() {
    this.newTimeData()
    this.initChart()
    this.queryPerson()
    // this.timer = setInterval(() => {
    //   this.queryCurdateInfo()
    // }, 5000)
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
          this.userDataRows = rs.data.Data.RetrunObjectData || []
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
        this.queryBaseMsg()
      })
    },
    // 个人实时剂量
    queryCurdateInfo() {
      // 个人实时剂量
      this.$axios.post('/api/PM/GetPersonCurdateInfo', {
        Id: this.detailsParams.Id
      }).then(rs => {
        this.curdateData = {
          x: [],
          y: []
        }
        if (rs.data.Data.Status === 0) {
          for (let i in rs.data.Data.RetrunObjectData) {
            this.curdateData.x.push(rs.data.Data.RetrunObjectData[i].XTime)
            this.curdateData.y.push(rs.data.Data.RetrunObjectData[i].RdValue)
          }
          console.log(this.curdateData)
          this.initChart()
        } else {
          this.$Message.info(rs.data.Data.Message)
        }
      })
    },
    queryBaseMsg() {
      this.queryCurdateInfo()
      // 累计剂量
      this.$axios.post('/api/PM/GetPersonSumRDInfo', {
        TimeValue: this.detailsParams.TimeValue,
        Type: this.detailsParams.Type,
        Year: this.detailsParams.Year,
        Numble: this.detailsParams.Numble,
        Id: this.detailsParams.Id
      }).then(rs => {
        console.log(rs, 'GetPersonSumRDInfo')
        this.infoData = {
          x: [],
          y: []
        }
        if (rs.data.Data.Status === 0) {
          for (let i in rs.data.Data.RetrunObjectData) {
            this.infoData.x.push(rs.data.Data.RetrunObjectData[i].XTime)
            this.infoData.y.push(rs.data.Data.RetrunObjectData[i].RdValue)
          }
          this.initChart()
        } else {
          this.$Message.info(rs.data.Data.Message)
        }
      })
    },
    doPersonClick(val) {
      for (let i in this.userDataRows) {
        this.userDataRows[i].mark = false
      }
      val.mark = true
      this.detailsParams.Id = val.DevNumber
      this.queryBaseMsg()
    },
    doSearchClick() {
      this.params.PageIndex = 1
      this.queryPerson()
    },
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
          bottom: 100,
          left: 100
        },
        yAxis: {
          type: 'value',
          name: '实时剂量(μSv)',
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
      let xName = ''
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
      chartPerson.setOption({
        xAxis: {
          name: `时间/${xName}`,
          type: 'category',
          boundaryGap: false,
          data: this.infoData.x,
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
          bottom: 100,
          left: 100
        },
        yAxis: {
          type: 'value',
          name: '累计剂量(μSv)'
        },
        color: '#EBF8FF',
        series: [{
          data: this.infoData.y,
          type: 'line',
          areaStyle: {}
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
.no-data {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 500px;
    background: #fff;
    z-index: 7;
    text-align: center;
}
.sufan-auto {
    margin-top: 25px;
    width: 100%;
    height: calc(100vh - 310px);
    overflow: hidden;
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
        margin-left: 25px;
        margin-right: 100px;
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
        margin-left: 20px;
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
    .date-select {
        margin-bottom: 25px;
        .time {
            float: left;
            line-height: 32px;
            font-size: 14px;
            margin-right: 15px;
        }
        .time-slect {
            float: left;
        }
    }
    .data-box {
        margin-top: 20px;
        .details-box {
            position: relative;
            float: left;
            width: 50%;
            // margin-top: 30px;
        }
        .charts {
            position: relative;
            float: left;
            width: 50%;
            #charts {
                width: 100%;
                height: 500px;
            }
            .charst-list {
                text-align: center;
                padding: 25px;
                box-sizing: border-box;
            }
        }
    }
    .person-chart {
        float: left;
        width: 100%;
        height: 500px;
        margin-right: 15px;
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
</style>
