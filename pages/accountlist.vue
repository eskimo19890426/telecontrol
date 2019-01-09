<template>
  <div class="container">
    <div class="whiteback">
      <div class="search">
        <p><img src="~static/images/search.png"></p>
        <input type="text" maxlength="20" >
      </div>
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
          class="carditem">
          <div class="itemleft"><img :src="item.Picture?img:item.Picture"></div>
          <div class="itemcenter">
            <div class="text">账号:{{ item.Accounts }}</div>
            <div class="text">昵称:{{ item.UserName }}</div>
            <div class="text">控制权:{{ item.ControlOver=='1'?"已开通":"未开通" }}</div>
          </div>
          <div class="itemright">
            <button 
              :userID="item.ID"
              class="editbtn"
              @click="handleEditClick($event)">修改</button>
            <button 
              :userID="item.ID"
              class="deletebtn" 
              @click="handleDeleteClick($event)">删除</button>
          </div>
        </div>
      </Card>
    </Scroll>

    <div class="bottom">
      <button 
        class="addbtn" 
        @click="handleAddClick($event)">添加人员</button>
    </div>
  </div>
</template>

<script>
import img from '~/static/images/head.png'
export default {
  data() {
    return {
        img,
        sHeight:"90%",
        distance:[30,10],
        keyword: '',
        dataList:""

    }
  },
  mounted() {
    this.sHeight = document.body.offsetHeight*0.84

    this.queryData()
  },
  methods: {
    queryData() {
      this.$Loading.start()
      this.$axios.post('/api/Login/SeleteAllUser', {
        Parameter:this.keyword
      }).then(rs => {
        let result = rs.data
        // result.data.push.apply(result.data,result.data)
        // result.data.push.apply(result.data,result.data)
        this.dataList= result.data

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
            //this.dataList.push.apply(this.dataList,this.dataList)
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
    handleEditClick(e) {
        let userID = e.currentTarget.getAttribute("userID")
        
        this.$router.push({path: '/edituser', query: {'userID': userID}})
    },
    handleAddClick() {
      this.$router.push('/edituser')
    },
    handleDeleteClick(e) {
        let userID = e.currentTarget.getAttribute("userID")

        this.$Modal.confirm({
            title: '是否确认删除?',
            onOk: () => {
              this.$Loading.start()
              this.$axios.post('/api/Login/DeleteUserInfo', {
                'UserID':userID
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
.container{
    padding-top:8vh;
    width:100%;
    height: 92vh;
    background-color:#f5f5f5;
    .whiteback{
      position: fixed;
      top: 9vh;
      width:100%;
      height: calc(2vh + 2.2rem);
      background-color: white;
      z-index: 2;
      .search{
        padding: 0.35rem 0 0.35rem 1rem;
        width:90%;
        height: 2.2rem;
        line-height: 2.2rem;
        font-size: 1.1rem;
        display:flex;
        position: absolute;
        top:1vh;
        left: 5%;
        z-index: 3;
        background-color:#f5f5f5;
        align-items: center;
        border-radius: 1.1rem;
        p{
          display:flex;
          width:1.5rem;
          height:1.5rem;
          img{
            width:100%;
            height:100%;
          }
          
        }
        input{
          margin-left:1rem; 
          width:80%;
          background:#f5f5f5;
          border: none;
          color:#05449b;
        }
      }
    }
    

    .scroll{
        padding-top:calc(2.5vh + 2.2rem);
        .carditem{
            width: 100%;
            height:5rem;

            .itemleft{
              width:5rem;
              height:5rem;
              float:left;
              text-align:center;
              img{
                height: 100%;
              }
            }
            .itemcenter{
              width:calc(80% - 5rem);
              height:5rem;
              float:left;
              padding:0 0 0 1rem;
              display:flex;
              align-items: center;
              flex-direction: column ;
              justify-content:center;
              .text{
                width:100%;
                height:33%;
                line-height:33%;
                padding-top: 0.8rem;
              }
            }
            .itemright{
              width:20%;
              height:5rem;
              float:left;
              display:flex;
              align-items: center;
              flex-direction: column ;
              justify-content:center;
              border: none;
              button{
                width:100%;
                height: 40%;
                margin: 5%;
                border-radius: 1rem;
              }
              .editbtn{
                background-color: #f5f5f5;
              }
              .deletebtn{
                background-color: #a4554d;
              }
            }
        }
    }


    .bottom{
      position: fixed;
      width:100%;
      height:8vh;
      bottom:0;
      background-color: white;
      display:flex;
      align-items: center;
      justify-content: center;


      .addbtn{
        width:80%;
        height:2rem;
        background-color: #05449b;
        border-radius: 1rem;
        color:white;
      }

    }
}


</style>
