<template>
  <div class="container">
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
          :HistoryID="item.ID"
          class="carditem" 
          @click="handleClick($event)">
          <div class="itemright">
            <div class="text">{{ item.Commands }}</div>
            <div class="text">{{ item.CreateTime }}</div>
          </div>
          <div style="clear:both;"></div>
        </div>
      </Card>
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
        pageSize:10

    }
  },
  mounted() {
    
    this.sHeight = document.body.offsetHeight*0.95

    this.queryData()
  },
  methods: {
    queryData() {
      this.$Loading.start()
      this.$axios.post('/api/Formula/SelectCommandList', {
        _pageIndex:this.pageIndex,
        _pageSize:this.pageSize
      }).then(rs => {
        this.pageIndex+=1
        let result = rs.data
        if(result.data.length>0){
          this.dataList.push.apply(this.dataList,result.data)
        }
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
          this.queryData()
        }

    },
    handleClick(e) {

        this.$router.push({path: '/messagedetail', query: {id: e.currentTarget.getAttribute("HistoryID")}})
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
                word-wrap: break-word;
                word-break:keep-all;
              }
            }


        }
    }
}


</style>
