<template>
  <div class="container">
    <div class="main">
      <div class="camera">
        <div class="item">
          <ul>
            <li><img 
              row="1" 
              cell="1" 
              position="449.9,265.1"
              src="~static/images/off.png"
              @click="handleClick($event)" 
            ></li>
            <li><img 
              row="2" 
              cell="1" 
              position="338.9,535.6"
              src="~static/images/off.png"
              @click="handleClick($event)" 
            ></li>
          </ul>
        </div>
        <div class="item">
          <ul>
            <li><img 
              row="1" 
              cell="2" 
              position="1546.0,270.4"
              src="~static/images/off.png"
              @click="handleClick($event)" 
            ></li><li><img 
              row="2" 
              cell="2" 
              position="1546.0,542.2"
              src="~static/images/off.png"
              @click="handleClick($event)" 
            ></li>
          </ul>
        </div>
        <div class="item">
          <ul>
            <li><img 
              row="1" 
              cell="3" 
              position="2143.3,13.3"
              src="~static/images/off.png"
              @click="handleClick($event)" 
            ></li><li><img 
              row="2" 
              cell="3" 
              position="2143.3,282.9"
              src="~static/images/off.png"
              @click="handleClick($event)" 
            ></li><li><img 
              row="3" 
              cell="3" 
              position="2143.3,534.3"
              src="~static/images/off.png"
              @click="handleClick($event)" 
            ></li>
          </ul>
        </div>
        <div class="item">
          <ul>
            <li><img 
              row="1" 
              cell="4" 
              position="2743.8,281.4"
              src="~static/images/off.png"
              @click="handleClick($event)" 
            ></li><li><img 
              row="2" 
              cell="4" 
              position="2743.8,534.3"
              src="~static/images/off.png"
              @click="handleClick($event)" 
            ></li>
          </ul>
        </div>
        <div class="item">
          <ul>
            <li><img 
              row="1" 
              cell="5" 
              position="3355.3,14.0"
              src="~static/images/off.png"
              @click="handleClick($event)" 
            ></li><li><img 
              row="2" 
              cell="5" 
              position="3355.3,281.4"
              src="~static/images/off.png"
              @click="handleClick($event)" 
            ></li><li><img 
              row="3" 
              cell="5" 
              position="3355.3,550.2"
              src="~static/images/off.png"
              @click="handleClick($event)" 
            ></li><li><img 
              row="4" 
              cell="5" 
              position="3355.3,811.3"
              src="~static/images/off.png"
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
  </div>
</template>

<script>

export default {
  components: {
    
  },
  data() {
    return {
      row:"",
      cell:"",
      position:"",
      MessageStr:1,
      hasSelected:false
    }
  },
  computed: {
    rowcell: function () {
      return this.row+this.cell
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
      this.row = row
      this.cell = cell
      this.position = position
      this.hasSelected=true;

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


</style>
