export default {
  install(Vue, options) {
    // 混入组件
    Vue.mixin({
      created() {
        // this.auth()
      },
      methods: {
        // 检查授权
        auth() {
          if (this.$store && this.$store.state) {
            let account = this.$store.state.app.account
            if (JSON.stringify(account) === '{}' && this.$route.path !== this.$config.loginurl) {
              this.$router.push(this.$config.loginurl)
            }
          }
        }
      },
      watch: {
        '$store.state.app.account': {
          deep: true,
          handler(val, oval) {
            this.auth()
          }
        }
      }
    })
  }
}
