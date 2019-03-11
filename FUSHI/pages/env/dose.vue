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

    <div class="box-img"
      v-iscroll>
      <div>
        <div class="box-content clear">
          <!-- <div class="box-left box-icons"
          @click="doLeftClick"><span class="iconfont">&#xe7a5;</span></div> -->
          <iframe src="http://36.22.179.211:8111/Home/Index?MileageID=4"
            class="iramscs"></iframe>
          <!-- <ul class="box-show">
          <li>
            <sufan-envmap ref="envmap"
              :data="mapData"
              @on-collect="doMapCollect"
              @on-select="doSelect"></sufan-envmap>
          </li>
        </ul> -->
          <!-- <div class="box-right box-icons"
          @click="doRightClick"><span class="iconfont">&#xe602;</span></div> -->
        </div>
      </div>
    </div>
  </div>
</section>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
      model1: '',
      steps: [{
        name: '环境管理',
        path: '/env/dose'
      }, {
        name: '剂量分布',
        path: '/env/dose'
      }],
      queryParams: {
        RegionID: '',
        PositionID: ''
      },
      areaList: [],
      positionList: [],
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
        // this.queryRegionData()
        this.queryPosition()
      })
    },
    // 请求位置信息
    // queryRegionData() {
    //   let params = {}
    //   params.OperationType = 10
    //   params.PageIndex = 1
    //   params.PageSize = 100
    //   params.RegionID = this.queryParams.RegionID
    //   this.$axios.post('/api/User/GetData', {
    //     queryData: JSON.stringify([params])
    //   }).then(rs => {
    //     this.formData.dataRows = rs.data.Data.RetrunObjectData
    //     this.reloadMap()
    //   })
    // },
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
        this.formData.dataRows = this.positionList[0]
        if (this.positionList.length > 0) {
          this.queryParams.PositionID = this.positionList[0].PositionID
        } else {
          this.queryParams.PositionID = 0
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
    doPositionIDChange(item) {
      this.formData.dataRows = []
      for (let i in this.positionList) {
        if (this.positionList[i].PositionID === this.queryParams.PositionID) {
          this.formData.dataRows.push(this.positionList[i])
        }
      }
      this.reloadMap()
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
    // 点击地图
    doSelect(evt) {
      this.$router.push({
        path: '/env/rtdata',
        query: {
          value: evt.value || ''
        }
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

.box-img {
    // width: 60%;
    margin: 0 auto;
    text-align: center;
    position: relative;
    overflow: hidden;
    // display: flex;
    // display: -webkit-flex;
    // display: -ms-flex;
    height: calc(100vh - 300px);
    margin-top: 40px;
    overflow: hidden;
    .box-content {
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
.iramscs{
  width: 100%;
  height: calc(100vh - 350px);
}
@media screen and (max-width: 1400px) {
    .box-show {
        min-height: 300px !important;
    }
    .box-img {
        margin-top: 20px;
    }
}
</style>
