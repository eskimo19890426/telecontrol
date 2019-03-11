export default {
  install(Vue, options) {
    // 混入组件
    Vue.mixin({
      created() {
        // 逻辑
        this.syncState()
      },
      methods: {
        // 缓存状态
        cacheState() {
          let state = this.$store.state
          let sessionkey = this.$config.sessionkey
          // 当路由改变的时候存储状态
          window.sessionStorage.setItem('state', JSON.stringify(state))
          if (sessionkey) {
            window.sessionStorage.setItem('sessionkey', sessionkey)
          }
        },
        // 同步状态
        syncState() {
          let state = window.sessionStorage.getItem('state')
          let sessionkey = window.sessionStorage.getItem('sessionkey')
          // 同步状态数
          if (state && this.$root.$store) {
            this.$root.$store.replaceState(JSON.parse(state))
          }
          // 同步sessionkey
          if (sessionkey) {
            this.$config.sessionkey = sessionkey
          }
        }
      },
      watch: {
        // 监听状态树的改变
        '$store.state': {
          deep: true,
          handler(val, oval) {
            this.cacheState()
          }
        }
      }
    })
  }
}
