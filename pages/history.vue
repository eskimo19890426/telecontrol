<template>
  <div class="container">
    <div class="title">
      <div class="titleItem">{{ rowcell }}</div>
      
    </div>
    <Scroll 
      :on-reach-edge="handleReachEdge"
      :height="sHeight" 
      :distance-to-edge="distance"
      class="scroll">
      <Card>
        <Row>
          <Col span="4" style="height:2rem; line-height:2rem;">
            <span>起止时间</span>
          </Col>
          <Col span="16" style="padding:0 1%">
           <DatePicker v-model="datePicker" format="yyyy-MM-dd" type="daterange" placement="bottom" placeholder="选择日期" clearable style="width: 100%;" @on-change="doTimerChange"></DatePicker>
          </Col>
          <Col span="4">
           <Button type="primary" @click="doQuery">查询</Button>
          </Col>
        </Row>
        
        <!-- <Row>
          <Col span="12">
            状态
            <Select v-model="model1" style="width:200px" placeholder="全部">
              <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
        <Row>
          关键字
          <Col span="24">
            <Input search enter-button="查询" placeholder="请输入关键字..." />
          </Col>
        </Row> -->
        
      </Card>
      <Card 
        v-for="(item, index) in dataList" 
        :key="index" 
        dis-hover 
        style="margin: 0.25rem 0">
        <div 
          :Cabinets="item.Cabinets"
          :Locations="item.Locations"
          :XCoordinate="item.XCoordinate"
          :YCoordinate="item.YCoordinate"
          :HistoryID="item.HistoryID"
          :ShootingContent="item.ShootingContent"
          :ShootingTime="item.ShootingTime"
          :FilePath="item.FilePath"
          class="carditem" 
          @click="handleClick($event)">
          <div class="itemleft"><img :src="item.FilePath?picUrl+item.FilePath:img"></div>
          <div class="itemright">
            <div class="text">拍摄内容:{{ item.ShootingContent }}</div>
            <div class="text">{{ item.ShootingTime }}</div>
          </div>
          
        </div>
        <div class="deleteBtn">
            <Icon type="ios-trash" size="24" :HistoryID="item.HistoryID" @click="doDelete($event)" />
        </div>
      </Card>
      <Page :total="total" :current="pageIndex" :page-size="pageSize" @on-change="handlePage"/>
    </Scroll>
  </div>
</template>

<script>
import img from '~/static/images/head.png'
import config from '~/app.config.js'
export default {
  data() {
    return {
        sHeight:"90%",
        distance:[30,10],

        Cabinets:"",
        Locations:"",

        rowcell:"",
        xposition:"",
        yposition:"",

        dataList:[],
        picUrl:null,

        pageIndex:1,
        pageSize:5,
        total: 0,

        datePicker:['', ''],
        
        StartTime:'',
        EndTime:'',
    }
  },
  mounted() {
    this.picUrl = config.urlhost+'/'

    this.Cabinets= this.$route.query.Cabinets
    this.Locations= this.$route.query.Locations
    this.rowcell= this.$route.query.rowcell
    this.xposition= this.$route.query.xposition
    this.yposition= this.$route.query.yposition
    
    this.sHeight = document.body.offsetHeight*0.95

    this.queryData()
  },
  methods: {
    queryData() {
      this.$Loading.start()
      this.$axios.post('/api/Login/SelectHistory', {
        Cabinets:this.Cabinets,
        Locations:this.Locations,
        _pageIndex:this.pageIndex,
        _pageSize:this.pageSize,
        StartTime:this.StartTime,
        EndTime:this.EndTime,

      }).then(rs => {
        //this.pageIndex+=1
        let result = rs.data
        //result.data.push.apply(result.data,result.data)
        //if(result.data.HistoryInfoList.length>0){
          //this.dataList.push.apply(this.dataList,result.data.HistoryInfoList)
          this.dataList=result.data.HistoryInfoList;
        //}
        this.total=result.data.RowCount;
        this.$Loading.finish()
        if (result.success) {
          this.$Message.success(result.message)
        } else {
          this.$Message.error(result.message)
        }
      })

    },
    handleReachEdge (dir) {
        console.log(dir,'dir')
        // if (dir < 0) {
        //   this.queryData()
        //   //this.dataList.push.apply(this.dataList,this.dataList)
        // }

        // return new Promise(resolve => {
        //     // setTimeout(() => {
        //     //     const last = this.dataList[this.dataList.length - 1];
        //     //     for (let i = 1; i < 31; i++) {
        //     //         this.dataList.push(last);
        //     //     }
        //     //     resolve();
        //     // }, 2000);
        // });
    },
    handleClick(e) {
        // let id = e.currentTarget.getAttribute("historyid")
        let dataObj={
          'Position':e.currentTarget.getAttribute("Locations")+e.currentTarget.getAttribute("Cabinets"),
          'XCoordinate': e.currentTarget.getAttribute("XCoordinate"),
          'YCoordinate': e.currentTarget.getAttribute("YCoordinate"),
          'HistoryID':e.currentTarget.getAttribute("HistoryID"),
          'ShootingContent': e.currentTarget.getAttribute("ShootingContent"),
          'ShootingTime': e.currentTarget.getAttribute("ShootingTime"),
          'FilePath': e.currentTarget.getAttribute("FilePath"),

        }
        this.$router.push({path: '/detail', query: {dataJson: JSON.stringify(dataObj)}})
    },
    doTimerChange(time) {
      this.StartTime = time[0]
      this.EndTime = time[1]
      this.datePicker= [time[0],time[1]]
    },
    handlePage(index){
      this.pageIndex=index;
      this.queryData();
      
    },
    doDelete(e){
        let ID = e.currentTarget.getAttribute("HistoryID")

        this.$Modal.confirm({
            title: '是否确认删除?',
            onOk: () => {
              this.$Loading.start()
              this.$axios.post('/api/Login/DelCementHistory', {
                'HistoryID':ID
              }).then(rs => {
                let result = rs.data
                this.$Loading.finish()
                if (result.success) {
                  this.queryData()
                  this.$Message.success(result.message)
                } else {
                  this.$Message.error(result.message)
                }
              })


            },
            onCancel: () => {}
        });


    },
    doQuery(){
      this.pageIndex=1;
      this.queryData();

    }
  }
}


</script>

<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";
.container{
    padding-top:8vh;
    width:100%;
    height: 92vh;

    .title{
        padding: 0.35rem 0 0.35rem 1rem;
        background: url("~static/images/5.png") no-repeat ;
        background-position:left center;
        background-size:auto 1.5rem;
        width:$pc-screen-width;
        height: 2.2rem;
        line-height: 2.2rem;
        font-size: 1.1rem;
        display:flex;
        position:fixed;
        top:8vh;
        left: $pc-fixed-left;
        z-index: 2;
        background-color:white;
        align-items: center;
        .titleItem{
            flex: 1;
            height: 2.2rem;
            line-height: 2.2rem;
            font-size: 1rem;
        }

    }

    .scroll{
        padding-top:2.2rem;
        .carditem{
            width: 100%;
            height:4rem;
            .itemleft{
              width:4rem;
              height:4rem;
              float:left;
              text-align:center;
              img{
                height: 100%;
              }
            }
            .itemright{
              width:calc(100% - 4rem);
              height:4rem;
              float:left;
              padding:0 0 0 1rem;
              display:flex;
              align-items: center;
              flex-direction: column ;
              justify-content:center;
              .text{
                width:100%;
                height:50%;
                line-height:50%;
                padding-top: 0.8rem;
              }
            }


        }
    }
}
.deleteBtn{position:absolute;top:5%;right:5%;z-index:10;}


</style>
