<template>
  <div class="container">
    <div class="title">
      <div class="titleItem">机位{{ rowcell }}</div>
      <div class="titleItem">X方向:{{ xposition }}</div>
      <div class="titleItem">Y方向:{{ yposition }}</div>
    </div>
    <Scroll 
      :on-reach-edge="handleReachEdge"
      :height="sHeight" 
      :distance-to-edge="distance"
      class="scroll">
      <Card 
        v-for="(item, index) in dataList" 
        :key="index" 
        dis-hover 
        style="margin: 0.25rem 0">
        <div 
          :historyid="item.HistoryID"
          class="carditem" 
          @click="handleClick($event)">{{ item.ShootingContent }}</div>
      </Card>
    </Scroll>
  </div>
</template>

<script>
export default {
  data() {
    return {
        sHeight:"90%",
        distance:[30,10],

        Cabinets:"",
        Locations:"",

        rowcell:"测试",
        xposition:"测试",
        yposition:"测试",

        dataList:""

    }
  },
  mounted() {
    this.Cabinets= this.$route.query.Cabinets
    this.Locations= this.$route.query.Locations
    
    this.sHeight = document.body.offsetHeight*0.95

    this.queryData()
  },
  methods: {
    queryData() {
      this.$Loading.start()
      this.$axios.post('/api/Login/SelectHistory', {
        Cabinets:this.Cabinets,
        Locations:this.Locations
      }).then(rs => {
        let result = rs.data
        result.data.push.apply(result.data,result.data)
        this.dataList= result.data
        console.log(result, "data")
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
        if (dir < 0) {
            this.dataList.push.apply(this.dataList,this.dataList)
        }

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
            'id':1
        }
        this.$router.push({path: '/detail', query: {dataJson: JSON.stringify(dataObj)}})
    }

  }
}


</script>

<style lang="scss" scoped>
.container{
    padding-top:8vh;
    width:100%;
    height: 92vh;

    .title{
        padding: 0.35rem 0 0.35rem 1rem;
        background: url("~static/images/5.png") no-repeat ;
        background-position:left center;
        background-size:auto 1.5rem;
        width:100%;
        height: 2.2rem;
        line-height: 2.2rem;
        font-size: 1.1rem;
        display:flex;
        position:fixed;
        top:8vh;
        left: 0;
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
            height:100%;
        }
    }
}


</style>
