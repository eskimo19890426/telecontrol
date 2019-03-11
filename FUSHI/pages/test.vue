<template lang="html">
  <div>
    <h4 style="padding:10px;">权限分配</h4>
    <Divider />
    <Input search enter-button="搜索" placeholder="请输入搜索内容" v-model="keyWord" @on-search="search(keyWord)" />
    <Divider />
    <Row>
      <Col span="8">
        <Menu :active-name="activeMenu" @on-select="select">
          <template v-for="item in listData">
            <MenuItem :name="item.Id">{{item.DepartmentName}}</MenuItem>
          </template>
        </Menu>
      </Col>
      <Col span="16">123
      </Col>
    </Row>
  </div>
</template>
<script>
import {
  mapState
} from 'vuex'
export default {
  layout: 'fullscreen',
  data() {
    return {
      listColumns: [
        {
          title: '桩号',
          key: 'name1'
        },
        {
          title: 'X坐标',
          key: 'name2'
        },
        {
          title: 'Y坐标',
          key: 'name3'
        },
        {
          title: '计划开始时间',
          key: 'name4'
        },
        {
          title: '计划结束时间',
          key: 'name5'
        }
      ],
      listData: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 999,
      activeMenu: '',
      keyWord: ''
    }
  },
  components: {

  },
  watch: {

  },
  computed: {
    ...mapState('app', {
      account: 'account'
    })
  },
  mounted() {
    this.loadlist()
    this.loadAllPermission()
  },
  methods: {
    loadlist(keyWord) {
      this.$axios.post('/api/Home/SelectDepartment', {
        DepartmentName: keyWord,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        CompanyId: this.account.CompanyId
      }).then(rs => {
        let result = rs.data
        if (result.success) {
          this.totalCount = result.data.RowCount
          this.listData = result.data.list
        } else {
          this.totalCount = 0
          this.listData = []
        }
      })
    },
    search(keyWord) {
      this.loadlist(keyWord)
    },
    select(name) {
      this.activeMenu = name
      console.log(name)
      if (name) {
        this.loadPermission(name)
      }
    },
    loadAllPermission() {
      this.$axios.post('/api/Home/Permission', {
      }).then(rs => {
        let result = rs.data
        if (result.success) {
          console.log(result.data, 'data')
        } else {
        }
      })
    },
    loadPermission(DepartmentId) {
      this.$axios.post('/api/Home/DepartmentPermissionInfo', {
        DepartmentId: DepartmentId
      }).then(rs => {
        let result = rs.data
        if (result.success) {
          console.log(result.data, 'data')
        } else {
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
