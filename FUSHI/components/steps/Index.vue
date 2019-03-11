<template lang="html">
  <section class="sufan-steps">
    <ul>
      <li class="top-left">
        <span class="round"></span>
        <span>当前位置:</span>
      </li>
      <li v-for="(o,index) in list" :class="{checked:o.checked}" @click="doClick(o)"><i class="num" v-if="index > 0"></i>{{o.name}}</li>
    </ul>
  </section>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    doClick(o) {
      // this.$router.push(o.path)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";

.sufan-steps {
    position: relative;
    margin: 15px 0;
    border-bottom: 1px solid #E5E5E5;
    ul {
        position: relative;
        display: inline-block;
        padding: 10px 0;
        box-sizing: border-box;
        li {
            float: left;
            color: #6C6B8B;
            line-height: 20px;
            .num {
                display: block;
                float: left;
                width: 20px;
                height: 20px;
                margin-right: -4px;
                border-top: 10px solid transparent;
                border-bottom: 10px solid transparent;
                border-left: 9px solid #505050;
                transform: scale(0.5);
            }
        }
        li:nth-child(n + 2) {
            cursor: pointer;
        }
        .top-left {
            span {
                display: block;
                float: left;
                line-height: 20px;
                color: #6C6B8B;
            }
            .round {
                display: block;
                float: left;
                width: 18px;
                height: 18px;
                background: #fff;
                border-radius: 50%;
                border: 5px solid #68668B;
                color: #6C6B8B;
                margin: 0 5px;
            }
        }
    }
    ul:after {
        content: '';
        display: block;
        clear: both;
    }
    ul:before {
        content: '';
        display: block;
        position: absolute;
        bottom: -6px;
        width: 100%;
        height: 1px;
        left: 0;
        border-bottom: 2px solid #6C6B8B;
    }
}
</style>
