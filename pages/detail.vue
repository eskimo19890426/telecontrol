<template>
  <div class="container">
    <div class="topinfo">
      <div class="left"><img src="~static/images/on.png"></div>
      <div class="righttop">相机位置:{{dataObj.Position}}</div>
      <div class="rightbottom">
        <div class="item">X方向:{{dataObj.XCoordinate}}</div>
        <div class="item">Y方向:{{dataObj.YCoordinate}}</div>
      </div>
    </div>
    <div style="clear:both;display:none;">&nbsp;</div>
    <div class="info">
      <div class="title">拍摄数据</div>
      <div class="text">拍摄编号<span>{{dataObj.HistoryID}}</span></div>
      <div class="text">拍摄内容<span>{{dataObj.ShootingContent}}</span></div>
      <div class="text">拍摄时间<span>{{dataObj.ShootingTime}}</span></div>
    </div>
    <div style="clear:both;display:none;">&nbsp;</div>
    <div class="picinfo">
      <div class="title">拍摄图片</div>
      <div class="pic">
        <img :src="picUrl+dataObj.FilePath">
      </div>
    </div>

  </div>
</template>


<script>
import img from '~/static/images/head.png'
import config from '~/app.config.js'

export default {
  data() {
    return {
      img,
      dataObj:{},
      picUrl:null,

    }
  },
  mounted() {
    this.picUrl = config.urlhost+'/'

    this.dataObj= JSON.parse(this.$route.query.dataJson)
    console.log(this.dataObj)
  },
  methods: {

  }
}
</script>


<style lang="scss" scoped>
.container{
    padding-top:8vh;
    width:100%;
    height: 92vh;
    background: #f5f5f5;
    .topinfo{
        width:100%;
        height:4rem;
        margin-top:0.5rem;
        background:white;
        .left{
          display:flex;
          width:20%;
          height:4rem;
          float: left;
          justify-content: center;
          align-items: center;
          img{
              height: 70%;
          }
        }
        .righttop{
          display:flex;
          width:80%;
          height:2rem;
          float: left;
          padding-left:0.5rem;
          align-items: center;

        }
        .rightbottom{
          display:flex;
          width:80%;
          height:2rem;
          float: left;
          padding-left:0.5rem;
          align-items: center;
            .item{
                flex:1;

            }


        }

    }

    .info{
        width:95%;
        height:10.5rem;
        margin:auto auto;
        background:white;
        margin-top:1rem;
        border-radius: 0.5rem;
        .title{
            padding-left:1rem;
            background: url("~static/images/5.png") no-repeat  ;
            background-position:0.5rem 0.6rem;
            background-size:auto 1.5rem;
            height: 2.2rem;
            line-height: 2.2rem;
            font-size: 1.1rem;
            padding: 0.35rem 0 0.35rem 2rem;
            
        }
        .text{
            padding-left:1rem;
            padding-right:1rem;
            padding-top:0.5rem;
            margin-top:0.5rem;
            border-top:1px solid #ddd;
            height:2rem;
            line-height: 2rem;
            font-size: 1rem;
            span{
              float:right;

            }


        }
        



    }

    .picinfo{
        width:95%;
        height:15rem;
        margin:auto auto;
        background:white;
        margin-top:1rem;
        border-radius: 0.5rem;


        .title{
            padding-left:1rem;
            background: url("~static/images/5.png") no-repeat  ;
            background-position:0.5rem 0.6rem;
            background-size:auto 1.5rem;
            height: 2.2rem;
            line-height: 2.2rem;
            font-size: 1.1rem;
            padding: 0.35rem 0 0.35rem 2rem;
            border-bottom:1px solid #ddd;

        }
        .pic{
            width:90%;
            height:12.2rem;
            display:block;
            text-align: center;
            padding: 0.5rem;
            margin:auto auto;
            img{
                height: 100%;
                
            }

        }

    }


   
}


</style>
