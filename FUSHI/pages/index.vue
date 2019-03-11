<template>
<section class="sufan-index no-select">
  <div class="row">
    <div class="col">
      <router-link to="/env">
        <div class="btn">
          <div>
            <i class="iconfont">&#xe646;</i>
            <span>环境管理</span>
          </div>
        </div>
      </router-link>
    </div>
    <div class="col">
      <router-link to="/user">
        <div class="btn">
          <div>
            <i class="iconfont">&#xe62d;</i>
            <span>人员管理</span>
          </div>
        </div>
      </router-link>
    </div>
    <div class="col">
      <router-link to="/da">
        <div class="btn">
          <div>
            <i class="iconfont">&#xe627;</i>
            <span>数据分析</span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</section>
</template>

<script>
export default {
  layout: 'onlyheader',
  components: {}
}
</script>
<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";
.sufan-index {
    padding: px;
    height: calc(100vh - 100px);
    a {
        color: #fff;
    }
    .row {
        height: 100%;
        width: 76%;
        margin: auto;
        display: flex;
        align-items: center;
        .col {
            flex-grow: 1;
            width: 5%;
            padding: 0 15px;
            &:nth-child(2) {
                width: 28%;
            }
        }
    }

    .btn {
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50vh;
        background: $primary;
        border-radius: 20px;
        color: #fff;
        cursor: pointer;
        &:hover {
            background: $primary * 0.6;
        }
        &:active {
            transform: scale(0.96);
        }
        .iconfont {
            display: block;
            font-size: 120px;
            line-height: 120px;
            text-align: center;
        }
        span {
            display: block;
            font-size: 40px;
            text-align: center;
        }
    }
}
</style>
