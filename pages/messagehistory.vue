<template>
  <div class="container">
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
          <Col span="20">
            <DatePicker v-model="datePicker" format="yyyy-MM-dd" type="daterange" placement="bottom" placeholder="选择日期" clearable style="width: 100%;" @on-change="doTimerChange"></DatePicker>
          </Col>
        </Row>
        <Row>
          <Col span="4" style="height:2rem; line-height:2rem;">
            <span>状态</span>
          </Col>
          <Col span="20">
            
            <Select v-model="model1" style="width:200px" placeholder="全部" @on-change="handleSelect">
              <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
        <Row>
           <Col span="4" style="height:2rem; line-height:2rem;">
            <span>关键字</span>
          </Col>
          
          <Col span="20">
            <Input search enter-button="查询" placeholder="请输入关键字..." @on-search="handleSearch" />
          </Col>
        </Row>
        
      </Card>
      <Card 
        v-for="(item, index) in dataList" 
        :key="index" 
        dis-hover 
        style="margin: 0.25rem 0">
        <div 
          :HistoryID="item.ID"
          :message="item.SmsContent"
          class="carditem">
          <div class="itemright" 
          :HistoryID="item.ID"
          :message="item.SmsContent"
          @click="handleClick($event)">
            <div class="text">{{ item.Commands }}</div>
            <div class="text" v-if="item.SmsContent">原始短信:{{ item.SmsContent }}</div>
            <div class="text">{{ item.CreateTime }}</div>
          </div>
          <div class="deleteBtn">
            <Icon type="ios-trash" size="24" :HistoryID="item.ID" @click="doDelete($event)" />
          </div>
          <div style="clear:both;"></div>
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
        selectList: [
          {
              value: '-1',
              label: '全部'
          },
          {
              value: '1',
              label: '已读'
          },
          {
              value: '0',
              label: '未读'
          },
                   
        ],
        datePicker:['', ''],

        keyWord:'',
        StartTime:'',
        EndTime:'',
        Status:'' //0:未读，1：已读，2：删除
    }
  },
  mounted() {
    
    this.sHeight = document.body.offsetHeight*0.95

    this.queryData()
  },
  methods: {
    queryData() {
      console.log(this.keyWord)
      console.log(this.datePicker)
      this.$Loading.start()
      this.$axios.post('/api/Formula/SelectCommandList', {
        _pageIndex:this.pageIndex,
        _pageSize:this.pageSize,
        KeyWord:this.keyWord,
        StartTime:this.StartTime,
        EndTime:this.EndTime,
        Status:this.Status,
      }).then(rs => {
        //this.pageIndex+=1
        let result = rs.data
        console.log(result)
        //if(result.data.length>0){
          //this.dataList.push.apply(this.dataList,result.data)
          this.dataList=result.data.recordcommandinfos;
          this.total=result.data.RowCount;
        //}
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
        // }

    },
    handleClick(e) {

        this.$router.push({path: '/messagedetail', query: {id: e.currentTarget.getAttribute("HistoryID"),message:e.currentTarget.getAttribute("message") }})
    },
    handlePage(index){
      this.pageIndex=index;
      this.queryData();
      
    },
    handleSearch(value){
      this.keyWord=value;
      this.pageIndex=1;
      this.queryData();
    },
    doTimerChange(time) {
      this.StartTime = time[0]
      this.EndTime = time[1]
      this.datePicker= [time[0],time[1]]
    },
    handleSelect(e){
      console.log(e);
      this.Status=e;
    },
    doDelete(e){
        let ID = e.currentTarget.getAttribute("HistoryID")

        this.$Modal.confirm({
            title: '是否确认删除?',
            onOk: () => {
              this.$Loading.start()
              this.$axios.post('/api/Formula/UpDateSmsContent', {
                'SmsID':ID,
                'Status':2
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

    .scroll{
        //padding-top:2.2rem;
        .carditem{
            width: 100%;
            //height:4rem;
            .itemright{
              width:100%;
              //height:4rem;
              float:left;
              padding:0 0 0 1rem;
              display:flex;
              align-items: center;
              flex-direction: column ;
              justify-content:center;
              .text{
                width:100%;
                //height:50%;
                line-height:2rem;
                padding-top: 0.8rem;
                // word-wrap: break-word;
                // word-break:keep-all;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
              }
            }


        }
    }
}
.deleteBtn{position:absolute;top:5%;right:5%;z-index:10;}

</style>
