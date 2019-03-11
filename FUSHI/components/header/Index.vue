<template lang="html">
  <header class="sufan-header no-select">
    <div class="row">
      <div class="col">
         <router-link to="/">
            <img src="~static/images/header-logo.png" alt="">
         </router-link>
      </div>
      <div class="col">
        <slot name="default">
          辐射监测系统
        </slot>
      </div>
      <div class="col">
        <div class="btn-group">
          <router-link to="/">
            <i class="iconfont">&#xe64d;</i>
          </router-link>
          <router-link to="/setting">
            <i class="iconfont">&#xe624;</i>
          </router-link>
          <i class="iconfont" @click="logout">&#xe622;</i>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
export default {
  methods: {
    logout() {
      this.$store.commit('app/logout')
      this.$router.push('/user/login')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";
.sufan-header {
    position: relative;
    background: #fff;
    height: 100px;
    background: $primary;
    color: #fff;
    a {
        color: #fff;
    }
    .row {
        display: flex;
        height: 100%;
        width: 100%;
        align-items: center;
        padding: 0 3%;

        .col {
            flex-grow: 1;
            width: 33.33%;

            &:nth-child(2) {
                text-align: center;
                font-size: 32px;
            }

            &:last-child {
                text-align: right;
            }
        }
    }

    .btn-group {
        font-size: 26px;
        vertical-align: middle;
        i {
            transition: all 0.3s ease;
            display: inline-block;
            vertical-align: middle;
            padding: 0 15px;
            cursor: pointer;
            text-shadow: 1px 2px 3px rgba(0,0,0,0.2);
            transform: scale(1);
            &:hover {
                text-shadow: 1px 2px 3px rgba(0,0,0,0.5);
            }
            &:active {
                transform: scale(0.8);
            }
        }
    }
}
</style>
