<template>
  <div class="container">
    <template v-for="item in dataObj">
        <div :key="item.Contents">
            <div class="info">
            <div class="title">拍摄内容</div>
            <div class="text"><span>{{item.Contents}}</span></div>
            <!-- <div class="text">拍摄时间<span>{{dataObj.ShootingTime}}</span></div> -->
            <div style="clear:both;"></div>
            </div>
            <div style="clear:both;display:none;">&nbsp;</div>
            <template v-for="(child, index) in item.historyList">
                <div class="picinfo" :key="child.id">
                    <div class="title" v-if="index==0">拍摄图片<span style="float:right;margin-right:0.5rem;">{{child.ShootingTime}}</span></div>
                    <div class="pic">
                        <img :src="picUrl+child.FilePath" @click="handleClick($event)">
                    </div>
                </div>
            </template>
            <div style="clear:both;"></div>
        </div>
    </template>

    <Modal v-model="modal" width="500" :closable="false">
        <img :src="modalPicUrl">
        <div slot="footer">
            <Button type="default" long @click="modal=false">关闭</Button>
        </div>
    </Modal>

  </div>
</template>


<script>
import img from '~/static/images/head.png'
import config from '~/app.config.js'

export default {
  data() {
    return {
      img,
      id:'',
      picUrl:null,
      dataObj:{},
      title:'',
      modal:false,
      modalPicUrl:''
    }
  },
  mounted() {
    this.picUrl = config.urlhost+'/'

    this.id= JSON.parse(this.$route.query.id)
    this.queryData()
  },
  methods: {
    queryData() {
      this.$Loading.start()
      this.$axios.post('/api/Formula/GetCommandInfo', {
        commandID:this.id
      }).then(rs => {
        console.log(rs.data)
        let result = rs.data
        this.dataObj= rs.data.data
        console.log(this.dataObj, 'this.dataObj')
        this.$Loading.finish()
        if (result.success) {
          this.$Message.success(result.message)
        } else {
          this.$Message.error(result.message)
        }
      })

    },
    handleClick(e) {
        this.modal = true
        this.modalPicUrl = e.currentTarget.getAttribute("src") 
    }
  }
}
</script>


<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";
.container{
    padding-top:8vh;
    width:100%;
    height: 100%;
    background: #f5f5f5;

    .info{
        width:95%;
        //height:10.5rem;
        margin: 1rem auto 0 auto;        
        background:white;
        // border-radius: 0.5rem;
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
              float:left;

            }


        }
        



    }

    .picinfo{
        width:95%;
        // height:15rem;
        margin:auto auto;
        background:white;
        // border-radius: 0.5rem;


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
            //height:12.2rem;
            display:block;
            text-align: center;
            padding: 0.5rem;
            margin:auto auto;
            img{
                // height: 100%;
                width:100%;
            }

        }

    }


    .modalbackground{
        display:block;
        widows: 100vw;
        height:100vh;
        position: fixed;
        top:0;
        left:0;
        background:black;
        opacity: 0.5;
        .modal{
            display:block;
            width:500px;
            position: fixed;
            left:$pc-fixed-left;
            top:30%;
        }
    }
    


   
}


</style>
