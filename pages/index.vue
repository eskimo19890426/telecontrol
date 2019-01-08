<template>
  <div class="container">
    <div class="main">
      <div class="camera">
        <div class="item">
          <ul>
            <li><img 
              :src="active==1?onimg:offimg"
              index="1"
              row="1" 
              cell="1" 
              position="449.9,265.1"
              @click="handleClick($event)" 
            >
            </li>
            <li><img 
              :src="active==2?onimg:offimg"
              index="2"
              row="2" 
              cell="1" 
              position="338.9,535.6"
              @click="handleClick($event)" 
            >
            </li>
          </ul>
        </div>
        <div class="item">
          <ul>
            <li><img 
              :src="active==3?onimg:offimg"
              index="3"
              row="1" 
              cell="2" 
              position="1546.0,270.4"
              @click="handleClick($event)" 
            ></li><li><img 
              :src="active==4?onimg:offimg"
              index="4"
              row="2" 
              cell="2" 
              position="1546.0,542.2"
              @click="handleClick($event)" 
            ></li>
          </ul>
        </div>
        <div class="item">
          <ul>
            <li><img 
              :src="active==5?onimg:offimg"
              index="5"
              row="1" 
              cell="3" 
              position="2143.3,13.3"
              @click="handleClick($event)" 
            ></li><li><img 
              :src="active==6?onimg:offimg"
              index="6"
              row="2" 
              cell="3" 
              position="2143.3,282.9"
              @click="handleClick($event)" 
            ></li><li><img 
              :src="active==7?onimg:offimg"
              index="7"
              row="3" 
              cell="3" 
              position="2143.3,534.3"
              @click="handleClick($event)" 
            ></li>
          </ul>
        </div>
        <div class="item">
          <ul>
            <li><img 
              :src="active==8?onimg:offimg"
              index="8"
              row="1" 
              cell="4" 
              position="2743.8,281.4"
              @click="handleClick($event)" 
            ></li><li><img 
              :src="active==9?onimg:offimg"
              index="9"
              row="2" 
              cell="4" 
              position="2743.8,534.3"
              @click="handleClick($event)" 
            ></li>
          </ul>
        </div>
        <div class="item">
          <ul>
            <li><img 
              :src="active==10?onimg:offimg"
              index="10"
              row="1" 
              cell="5" 
              position="3355.3,14.0"
              @click="handleClick($event)" 
            ></li><li><img 
              :src="active==11?onimg:offimg"
              index="11"
              row="2" 
              cell="5" 
              position="3355.3,281.4"
              @click="handleClick($event)" 
            ></li><li><img 
              :src="active==12?onimg:offimg"
              index="12"
              row="3" 
              cell="5" 
              position="3355.3,550.2"
              @click="handleClick($event)" 
            ></li><li><img 
              :src="active==13?onimg:offimg"
              index="13"
              row="4" 
              cell="5" 
              position="3355.3,811.3"
              @click="handleClick($event)" 
            ></li>
          </ul>
        </div>
      </div>
      <div style="clear:both;display:none;">&nbsp;</div>
    </div>
    <div style="clear:both;display:none;">&nbsp;</div>
    <div class="info">
      <div class="title">机位信息</div>
      <div class="text">机位{{ rowcell }}</div>
      <div class="text">X方向:{{ xposition }}</div>
      <div class="text">Y方向:{{ yposition }}</div>
    </div>
    <div class="group">
      <div class="half">
        <input 
          :disabled="!hasSelected"
          value="移动到该位置"
          type="button" 
          @click="handleMove" >
      </div>
      <div class="half">
        <input 
          :disabled="!hasSelected"
          value="查看历史记录"
          type="button" 
          @click="handleHistory" >
      </div>
      
    </div>

    <div class="user">
      <ul>
        
        <li class="account">
          <Poptip 
            placement="left-start" 
            width="1rem">
            <img 
              src="~/static/images/account.png"
            >
            <div 
              slot="content"
              class="api" >
              <div 
                class="item"
                @click="handleAccountClick($event)" 
              ><p><img src="~/static/images/account.png"></p><span>个人信息</span></div>
              <div 
                class="item" 
                @click="handleUpdatePSDClick($event)"><p><img src="~/static/images/edit.png"></p><span>修改密码</span></div>
              <div 
                class="item" 
                @click="handleLogoutClick($event)"><p><img src="~/static/images/logout.png"></p><span>退出登陆</span></div>
            </div>
          </Poptip>
        </li>
        <li 
          class="users"><img 
            src="~/static/images/user.png"
            @click="handleUserClick($event)" 
        ></li>
      </ul>
    </div>

  </div>
</template>

<script>
import onimg from '~/static/images/on.png'
import offimg from '~/static/images/off.png'
import {
  mapState
} from 'vuex'
export default {
  components: {
    
  },
  data() {
    return {
      onimg,
      offimg,

      row:"",
      cell:"",
      position:"",
      MessageStr:1,
      hasSelected:false,
      active:0
    }
  },
  computed: {
    ...mapState('app', {
      account: 'account'
    }),
    rowcell: function () {
      return this.cell+this.row
    },
    xposition: function () {
      return this.position.split(",")[0]
    },
    yposition: function () {
      return this.position.split(",")[1]
    }
    
  },
  methods: {
    handleClick(e) {
      console.log(e.currentTarget, 'e')
      console.log(e.currentTarget.getAttribute("row"), 'row')
      console.log(e.currentTarget.getAttribute("cell"), 'cell')
      console.log(e.currentTarget.getAttribute("position"), 'position')
      let row = e.currentTarget.getAttribute("row")
      let cell = e.currentTarget.getAttribute("cell")
      let position = e.currentTarget.getAttribute("position")
      let index = e.currentTarget.getAttribute("index")
      this.row = row
      this.cell = cell
      this.position = position
      this.hasSelected = true;
      this.MessageStr = cell+'|'+row+'|'+this.xposition+'|'+this.yposition+'|'+index
      this.active = Number(index)
    },
    handleMove() {
      this.$Loading.start()
      this.hasSelected=false
      this.$axios.post('/api/Login/SimulationRequest', {
        MessageStr:this.MessageStr
      }).then(rs => {
        this.hasSelected=true
        let result = rs.data
        this.$Loading.finish()
        if (result.success) {
          this.$Message.success(result.message)
        } else {
          this.$Message.error(result.message)
        }
      })
    },
    handleHistory() {
      this.$router.push({path: '/history', query: {Cabinets: 1,Locations:1}})
    },
    handleAccountClick() {
      this.$router.push({path: '/accountinfo', query: {userID: this.account.ID}})
    },
    handleUserClick() {
      this.$router.push('/accountlist')
    },
    handleUpdatePSDClick() {
      this.$router.push({path: '/updatepsd', query: {userID: this.account.ID}})
    },
    handleLogoutClick() {
      this.logout()
    },
    // 退出登录
    logout() {
      this.$store.commit('app/logout')
      this.$router.push('/account/login')
    }

  }


}
</script>

<style lang="scss" scoped>
.container {
  /* min-height: 100vh; */
  padding-top:8vh;
  height: 90vh;
  display: block;
  width:100%;
  float:left;
}
.main {
  display: block;
  height: 60%;
  width: 100%;
  background: url("~static/images/4.png") no-repeat center ;
  background-size: 90%;
  float: left;
  .camera{
    display:block;
    width:80%;
    height:80%;
    margin: auto auto;
    padding-left:5%;
    margin-top:13%;

    .item{    
      width:20%;
      height: 100%;
      float:left;
      display:flex;
      justify-content:center;
      align-items: flex-start;
      ul{
        display:flex;
        justify-content:center;
        align-items: center;
        flex-direction: column;
        li{
        width: 60%;
        padding-bottom:1rem; 
        z-index: 2;
        }
      }
      

      img{
        width:100%;
        height:100%;
      }


    }

  }



}
.info{
  display:block;
  width:90%;
  margin: auto auto;
  height: 30%;
  padding-top:5%;
  padding-left:5%;
  float: left;

  .title{
    padding-left:1rem;
    background: url("~static/images/5.png") no-repeat left ;
    background-size: contain;
    height: 1.5rem;
    line-height: 1.5rem;
    font-size: 1.1rem;
  }
  .text{
    padding-left:1rem;
    padding-top:0.5rem;
    margin-top:0.5rem;
    border-top:1px solid #ddd;
    height:2rem;
    line-height: 2rem;
    font-size: 1rem;
  }


}

.group{
  width:100%;
  display:flex;
  justify-content:center;
  align-items: center;
  padding-top:5%;
  .half{
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    input{
        text-align: center;
        width: 9rem;
        height:2rem;
        line-height:2rem;
        font-size:0.8rem;
        color:white;
        background:#05449b;
        border-radius: 0.5rem;
        &:disabled{
          background:#aaa;
        }
    }
  }
  
}

.user{
    display: flex;
    width: 3rem;
    position: absolute;
    top: 8vh;
    margin-left: calc(100% - 3rem);
    align-items: center;
    z-index: 2;
    ul{
      width:100%;
      height: 100%;
      li{
          display: block;
          width:1.8rem;
          height:1.8rem;
          padding: 0.2rem;
          margin: 0.8rem 0.4rem;
          background: #05449b;
          border-radius: 0.9rem;
          img{
            width: 100%;
            height: 100%;
          }
          .api{
            width:7rem;

              .item{
                display: flex;
                width:100%;
                height: 2rem;
                line-height: 2rem;
                align-items:center;
                padding:0.5rem 0;
                font-size: 1rem;
                p{
                  display: flex;
                  width:1rem;
                  height:1rem;
                  align-items: center;
                  img{
                    width:100%;
                    height:100%;

                  }
                }
                span{
                  margin-left:0.8rem; 
                }
                
              }
          }


      }
      .account{
        background: url("~static/images/9.png") no-repeat center ;
        background-size: 1.8rem 1.8rem;
      }
      .users{
        background-color: #a4554d;
      }

    }
    

}


</style>
