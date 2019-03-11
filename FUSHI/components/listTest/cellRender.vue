
<script>
export default {
  data() {
    return {}
  },
  props: {
    renders: {
      type: Function
    },
    data: {},
    title: ''
  },
  created() {
  },
  mounted() {
  },
  render(h) {
    return this.$props.renders(h, this.data)
  },
  methods: {},
  watch: {
  }
}
</script>
<style lang="scss">@import "~assets/themes/default/colors.scss";
.sufan-list {}
</style>
