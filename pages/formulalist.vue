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
          :ID="item.ID"
          class="carditem" 
          @click="handleClick($event)">
            <div class="info">
                <div class="title"><span class="span1">{{item.FormulaName}}</span><span class="span2">{{item.UpDateTime}}</span><div style="clear:both;"></div></div>
                <template v-for="child in item.FormulaContent">
                    <div v-if="child.name" class="text" :code="child.code">{{child.name}}</div>
                    <div v-else class="text" :code="child.code">{{child.code}}</div>
                </template>
                <div class="clearfloat"></div>
            </div>


          <!-- <div class="itemleft"><img :src="item.FilePath?picUrl+item.FilePath:img"></div>
          <div class="itemright">
            <div class="text">拍摄内容:{{ item.ShootingContent }}</div>
            <div class="text">{{ item.ShootingTime }}</div>
          </div> -->
        </div>
      </Card>
    </Scroll>
  </div>
</template>

<script>
import img from '~/static/images/head.png'
import config from '~/app.config.js'
export default {
  computed:{
    mapist: function(){
      let result = {}
      let positionlist = config.position
      let templist = this.namelist
      for(let i =0;i<13;i++){
        result[templist[i]]=positionlist[i]
      }
      return result
    }
  },
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
        pageSize:10,

        namelist:[
          '一号机柜|位置一',
          '一号机柜|位置二',
          '二号机柜|位置一',
          '二号机柜|位置二',
          '三号机柜|位置一',
          '三号机柜|位置二',
          '三号机柜|位置三',
          '四号机柜|位置一',
          '四号机柜|位置二',
          '五号机柜|位置一',
          '五号机柜|位置二',
          '五号机柜|位置三',
          '五号机柜|位置四',
        ]

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
      this.$axios.post('/api/Formula/GetFormulaInfo', {
        FormulaID:'',
        _pageIndex:this.pageIndex,
        _pageSize:this.pageSize
      }).then(rs => {
        this.pageIndex+=1
        let result = rs.data
        if(result.data.length>0){
          for(let i = 0;i<result.data.length;i++){
            if(result.data[i].FormulaContent){
              let templist = result.data[i].FormulaContent.split(';')
              let tempobj = {}
              for(let j=0;j<templist.length-1;j++){
                let tempname = this.mapped(templist[j])
                templist[j] = {
                  'code' : templist[j],
                  'name' : tempname.length>14?tempname.substring(0,14)+'..':tempname
                }
              }
              result.data[i].FormulaContent = templist.slice(0,-1)
            }
            result.data[i].FormulaName = result.data[i].FormulaName
          }
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
    mapped(name) {
      let result = this.mapist
      console.log(result)
      return result[name]
    },
    handleReachEdge (dir) {
        console.log(dir,'dir')
        if (dir < 0) {
          this.queryData()
        }

    },
    handleClick(e) {
        this.$router.push({path: '/editformula', query: {id:e.currentTarget.getAttribute("ID") }})
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
            height:auto;
            .info{
                display: block;
                width: 100%;
                margin: auto auto;
                height: auto;

            .title{
                padding-left:1.5rem;
                background: url("~static/images/5.png") no-repeat left ;
                background-position:0.5rem 0.4rem;
                background-size:auto 1.5rem;
                //height: 2.5rem;
                line-height: 2.5rem;
                font-size: 1.2rem;
                position: relative;
                border-bottom: 1px solid #ddd;
                margin-bottom:0.5rem;
                .span1{
                  width:50%;
                  display: block;
                  float: left;
                  word-wrap: break-word;
                }
                .span2{
                    width:50%;
                    text-align: right;
                    display: block;
                    float: left;
                }
            }
            .text{
                //border-bottom: 1px solid #ddd;
                height: 2rem;
                line-height: 2rem;
                font-size: 1rem;
                width: 50%;
                float:left;
                position: relative;
            }


            }


        }
    }
}
.clearfloat{
    clear:both;height:0;font-size: 1px;line-height: 0px;
}

</style>
