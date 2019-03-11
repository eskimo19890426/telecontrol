<template lang="html">
  <section style="width:600px;">
    <sufan-envmap ref="envmap" :data="testdata" @on-collect="docollect" @on-select="doSelect"></sufan-envmap>
  </section>
</template>
<script>
export default {
  data() {
    return {
      testdata: {}
    }
  },
  mounted() {
    // 开始收集
    this.$refs.envmap.collectStart()
    setTimeout(() => {
      this.testdata = {
        url: 'http://61.129.51.174:9070//Upload/EnvDev/a9db1e58-53a5-40ad-8c43-c0f78f193b7a%E5%9B%BE%E5%B1%82-2.jpg'
      }
    }, 2000)
  },
  methods: {
    docollect(evt) {
      console.log(JSON.stringify(evt))
    },
    doSelect(item) {
      alert(JSON.stringify(item))
    }
  }
}
</script>

<style lang="css">
</style>
