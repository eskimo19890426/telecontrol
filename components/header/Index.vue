<template lang="html">
  <header class="sufan-header">
    <div class="row">
      <span v-show="!showBack">远程控制系统</span>
      <span v-show="showBack" @click="doBack()"><Icon type="ios-arrow-back" />返回</span>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
        showBack:true,
    }
  },
  mounted() {
    let path = this.$route.path
    if (path=='/') {
      this.showBack=false
    }else {
      this.showBack=true
    }
  },
  methods: {
    doBack() {
      let path = this.$route.path
      
      if (path!='/') {
        this.$router.back(-1)
      } else {

      }
    }
  },
  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler(to, from) {
        if (to.path=='/') {
          this.showBack=false
        }else {
          this.showBack=true
        }
      }
    }
  },
}
</script>


<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";
.sufan-header {
  position: fixed;
  background: black;
  width:$pc-screen-width;
  height: 8vh;
  background: #05449b;
  color: #fff;
  top:0;
  left: $pc-fixed-left;
  z-index:2;

  .row{




    span{
      height:8vh;
      line-height: 8vh;
      padding-left:1rem;
      font-size:1.1rem;
      z-index:4;
    }

  }



}




</style>
