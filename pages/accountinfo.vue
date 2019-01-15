<template>
  <div class="container">
    <div class="topinfo">
      <div class="left"><img :src="user.Picture?picUrl+user.Picture:''"></div>
      <div class="righttop">
        <p><img src="~static/images/2.png"></p>
        <span>{{ user.UserName }}</span>
        <span @click="doEdit()"><img src="~static/images/update.png"></span>
      </div>
      <div class="rightbottom">
        <p><img src="~static/images/7.png"></p>
        <span>{{ user.RoleName }}</span>
      </div>
    </div>
    <div style="clear:both;display:none;">&nbsp;</div>
    <div class="info">
      <div class="title">账号：{{ user.Accounts }}</div>
      <div class="text">昵称：{{ user.UserName }}</div>
      <div class="text">角色：{{ user.RoleName }}</div>
      <div class="text">控制权：{{ user.ControlOver=='1'?"已开通":"未开通" }}</div>
    </div>
    <div style="clear:both;display:none;">&nbsp;</div>

  </div>
</template>


<script>
import img from '~/static/images/head.png'
import config from '~/app.config.js'
export default {
  data() {
    return {
        userID:'',
        user:{
            Accounts: "",
            ControlOver: "",
            ID: "",
            Picture: "",
            RoleName: "",
            UserName: ""

        },
        img,
        picUrl:null,

    }
  },
  mounted() {
    this.picUrl = config.urlhost+'/'

    this.userID= this.$route.query.userID
    this.queryData()

  },
  methods: {
    queryData() {
      this.$Loading.start()
      this.$axios.post('/api/Login/SelectUserInfo', {
        userID:this.userID
      }).then(rs => {
        this.user = rs.data.data
        console.log(rs.data)
        this.$Loading.finish()
        if (rs.data.success) {
          // this.$Message.success(result.message)
        } else {
          this.$Message.error(rs.data.message)
        }
      })

    },
    doEdit() {
      this.$router.push({path: '/edituser', query: {'userID': this.userID}})
    }

  }
}
</script>


<style lang="scss" scoped>
.container{
    padding-top:8vh;
    width:100%;
    height: 92vh;
    background: url("~static/images/8.png") no-repeat  ;
    background-size:contain;
    background-color:#f5f5f5;
    .topinfo{
        width:100%;
        height:5rem;
        padding-top:1rem;
        color:white;
        .left{
          display:flex;
          width:30%;
          height:4rem;
          float: left;
          justify-content: center;
          align-items: center;
          
          img{
              height: 100%;
          }
        }
        .righttop{
          display:flex;
          width:70%;
          height:2rem;
          float: left;
          padding-left:0.5rem;
          align-items: center;
          line-height: 2rem;
          font-size: 1rem;
            p{
                display: flex;
                width:1rem;
                height:1rem;
                align-items: center;
                img{
                    width:100%;
                    height: 100%;
                }


            }
            span{
                margin-left:1rem;
                display: flex;
                align-items: center;
                img{
                  width:1rem;
                  height: 1rem;
                }
            }
        }
        .rightbottom{
          display:flex;
          width:70%;
          height:2rem;
          float: left;
          padding-left:0.5rem;
          align-items: center;
          font-size: 1rem;
            .item{
                flex:1;

            }
            p{
                display: flex;
                width:1rem;
                height:1rem;
                align-items: center;
                img{
                    width:100%;
                    height: 100%;
                }


            }
            
            span{
                margin-left:1rem;
            }
        }

    }

    .info{
        width:95%;
        height:14.5rem;
        margin:auto auto;
        background:white;
        margin-top:1rem;
        border-radius: 0.5rem;
        .title{
            padding-left:1rem;
            // padding:1rem;
            // margin:1rem 0;
            border-top:1px solid #ddd;
            height:3.5rem;
            line-height: 3.5rem;
            font-size: 1rem;
            
        }
        .text{
            padding-left:1rem;
            // padding:1rem;
            // margin:1rem 0;
            border-top:1px solid #ddd;
            height:3.5rem;
            line-height: 3.5rem;
            font-size: 1rem;



        }
        



    }



   
}


</style>
