<template lang="html">
  <div class="sufan-search-input">
    <Input
      :placeholder="placeholder"
      :icon="keywordsIcon"
      v-model="keywords"
      @mouseover.native="doKeywordsMouseover"
      @mouseout.native="doKeywordsMouseout"
      @keyup.native="dbDoKeywordsKeyup"
      @on-click="doKeywordsIcon">
    </Input>
  </div>
</template>

<script>
import lodash from 'lodash'
export default {
  data() {
    return {
      keywords: '',
      keywordsIcon: '',
      dbDoKeywordsKeyup: ''
    }
  },
  props: {
    placeholder: {
      type: String,
      default: '关键字查询'
    },
    keywordsIconNormal: {
      type: String,
      default: 'search'
    },
    keywordsIconHover: {
      type: String,
      default: 'close-circled'
    },
    size: {
      type: String,
      default: 'default'
    },
    value: {
      type: String,
      default: ''
    },
    delay: {
      type: Number,
      default: 500
    }
  },
  created() {
    this.dbDoKeywordsKeyup = lodash.debounce(this.doKeywordsKeyup, this.delay)
    this.keywordsIcon = this.keywordsIconNormal
  },
  methods: {
    doKeywordsMouseover() {
      if (this.keywords) {
        this.keywordsIcon = this.keywordsIconHover
      }
    },
    doKeywordsMouseout() {
      this.keywordsIcon = this.keywordsIconNormal
    },
    doKeywordsKeyup() {
      this.$emit('input', this.keywords)
      this.$emit('on-change', this.keywords)
    },
    doKeywordsIcon() {
      if (this.keywords) {
        this.keywords = ''
      }
      this.doKeywordsKeyup()
      this.$emit('on-click')
    }
  },
  watch: {
    value(val) {
      this.keywords = val
      this.dbDoKeywordsKeyup()
    }
  }
}
</script>
<style lang="scss" scoped>
.sufan-search-input {
    display: inline-block;
    position: relative;
}
</style>
