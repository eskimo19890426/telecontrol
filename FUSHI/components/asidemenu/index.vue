<template lang="html">
  <section class="sufan-asidemenu no-select" v-iscroll>
    <Menu theme="light" style="width:100%;" @on-select="hopRouting" :active-name="activeName" :open-names="openNames">
      <template v-for="menu in menulist">
        <Submenu :name="menu.path" :class="{disabled:menu.disabled}" v-if="menu.children&&menu.children.length>0">
          <template slot="title">
            <i class="iconfont" v-html="menu.icon"></i>
            <span v-text="menu.name"></span>
          </template>
          <MenuItem :name="submenu.path" :class="{disabled:submenu.disabled}" v-for="(submenu,key) in menu.children" :key="key" >
            <i class="iconfont" v-html="submenu.icon"></i>
            <span v-text="submenu.name"></span>
          </MenuItem>
        </Submenu>
        <MenuItem :name="menu.path" :class="{disabled:menu.disabled}" v-else>
          <i class="iconfont" v-html="menu.icon"></i>
          <span v-text="menu.name"></span>
        </MenuItem>
      </template>
    </Menu>
  </section>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      menulist: [],
      activeName: '',
      openNames: []
    }
  },
  computed: {
    ...mapState('app', {
      account: 'account'
    })
  },
  props: {},
  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler(to, from) {
        if (to.path !== '/') {
          this.init()
        }
        // 检测用户有没有权限访问当前页面
        // this.checkAuth(to, from || {})
      }
    }
  },
  methods: {
    init() {
      // 深拷贝模块
      let modules = JSON.parse(JSON.stringify(this.$config.app.modules))
      // 判断当前模块并找到相应的菜单树
      let path = this.$route.path
      this.activeName = path
      this.openNames = [path.substr(0, path.lastIndexOf('/'))]
      path = path.substr(1, path.length)
      // 解析根路由
      if (path.indexOf('/') >= 1) {
        path = path.substr(0, path.indexOf('/'))
      }
      // this.menulist = modules[path]
      if (typeof this.account.UserRoles !== 'undefined') {
        let temp = []
        for (let menu of this.account.UserRoles) {
          temp.push(menu.MenuUrl)
        }
        let tempMenulist = modules[path]
        let resultMenulist = []
        for (let mpath of tempMenulist) {
          if (mpath.children) {
            let tempChildren = []
            for (let child of mpath.children) {
              if (temp.includes(child.path)) {
                tempChildren.push(child)
              }
            }
            mpath.children = tempChildren
          }
          if (mpath.children.length > 0) {
            resultMenulist.push(mpath)
          } else {
            resultMenulist.push(mpath)
          }
        }
        this.menulist = resultMenulist
      }

      if (!this.canIterable()) {
        // return
      }

      // 权限控制
      // this.$Treejs.each(this.menulist, node => {
      //   this.$set(node, 'disabled', true)
      //   for (let menu of this.account.UserRoles) {
      //     if (node.path === menu.MenuUrl) {
      //       this.$set(node, 'disabled', false)
      //     }
      //   }
      // })
    },
    // 跳转路由
    hopRouting(path) {
      this.$router.push(path)
    },
    // 检测用户权限
    checkAuth(to, from) {
      if (!this.canIterable()) {
        return
      }
      this.$Treejs.each(this.menulist, node => {
        if (to.path === node.path && node.disabled) {
          this.$Message.warning('对不起您没有权限访问此模块')
          this.$router.push(from.fullPath || '/')
        }
      })
    },
    // 是否可以遍历
    canIterable() {
      // 判断树在不在
      if (typeof this.$Treejs === 'undefined') {
        return false
      }
      // 判断菜单有没有
      if (!(this.menulist instanceof Array)) {
        return false
      }
      // 判断菜单项有没有
      if (this.menulist.length <= 0) {
        return false
      }
      // 判断是否拥有功能菜单
      if (typeof this.account.UserRoles === 'undefined') {
        return false
      }
      if (this.account.UserRoles.length <= 0) {
        return false
      }
      return true
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";
.sufan-asidemenu {
  width: 100%;
  height: calc(100vh - 100px);
  overflow: hidden;
}
</style>
