<template lang="html">
  <section class="sufan-bcnav">
    <ul>
      <li v-for="(o,index) in list"
        @click="doClick({item:o,index:index})"
        v-show="index<=activeIndex&&!o.hide">{{o.name}}</li>
    </ul>
  </section>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    value: {
      type: String
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val, oldVal) {
        this.doInitNav()
      }
    },
    list: {
      deep: true,
      immediate: true,
      handler(val, oldVal) {
        this.clearInactiveItem()
      }
    }
  },
  methods: {
    // 初始化
    doInitNav() {
      for (let i = 0; i < this.list.length; i++) {
        let item = this.list[i]
        this.$set(item, 'hide', false)
        if (this.value === item.value) {
          this.activeIndex = i
          this.clearInactiveItem()
          break
        }
      }
    },
    // 清除非活动项目的数据
    clearInactiveItem() {
      for (let i = 0; i < this.list.length; i++) {
        let item = this.list[i]
        if (i > this.activeIndex - 1) {
          this.$set(item, 'hide', true)
        }
      }
    },
    doClick(params) {
      this.activeIndex = params.index
      this.$emit('input', this.list[params.index].value)
      this.$emit('on-click', params.item)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";

.sufan-bcnav {
    position: relative;
    ul {
        display: flex;
        align-items: center;
        font-size: 16px;
        li {
            position: relative;
            color: #fff;
            height: 32px;
            font-size: 12px;
            line-height: 32px;
            padding: 0 15px;
            background: $primary;
            &:not(:first-child) {
                padding-left: 30px;
            }
            &:not(:first-child)::before {
                position: absolute;
                content: '\e602';
                font-family: 'iconfont';
                font-size: 46px;
                left: -20px;
                color: #fff !important;
            }
        }
        li:hover {
            cursor: pointer;
            color: $yellow;
        }
    }
}
</style>
