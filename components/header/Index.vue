<template lang="html">
  <header class="sufan-header">
    <div class="row">
      <span>标题</span>
    </div>
  </header>
</template>

<script>
export default {
  methods: {
    logout() {

    }
  }
}
</script>


<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";

.sufan-header {
  position: fixed;
  background: black;
  width:100%;
  height: 8vh;
  background: #05449b;
  color: #fff;
  top:0;
  left: 0;
  z-index:2;
  .row{




    span{
      height:8vh;
      line-height: 8vh;
      padding-left:1rem;
      font-size:1.1rem;

    }

  }



}




</style>
