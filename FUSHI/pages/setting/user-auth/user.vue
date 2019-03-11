<template>
<section>
  <div class="sufan-module-section no-select">
    <div>
      <sufan-steps :list="steps"></sufan-steps>
    </div>
    <div class="sufan-option-bar">
      <div class="row">
        <div class="col"
          style="width:220px;">
          <span>总部:&nbsp;</span>
          <sufan-select placeholder="总部"
            v-model="queryData.GeneralID"
            url="/api/User/GetData"
            :query-data="{DropType:1}"
            :defaultkeys="{name:'GeneralName',value:'GeneralID'}">
          </sufan-select>
        </div>
        <div class="col"
          style="width:220px;">
          <span>分部:&nbsp;</span>
          <sufan-select placeholder="分部"
            v-model="queryData.BranchID"
            url="/api/User/GetData"
            :query-data="{DropType:2,GeneralID:queryData.GeneralID}"
            :defaultkeys="{name:'BranchName',value:'BranchID'}">
          </sufan-select>
        </div>
        <div class="col"
          style="width:200px;">
          <span>部门:&nbsp;</span>
          <sufan-select placeholder="部门"
            v-model="queryData.DepartID"
            url="/api/User/GetData"
            :query-data="{DropType:3,BranchID:queryData.BranchID}"
            :defaultkeys="{name:'DepartName',value:'DepartID'}">
          </sufan-select>
        </div>
        <div class="col"
          style="width:200px;">
          <span>职务:&nbsp;</span>
          <sufan-select placeholder="职务"
            v-model="queryData.DutyID"
            url="/api/User/GetData"
            :query-data="{DropType:4,DepartID:queryData.DepartID}"
            :defaultkeys="{name:'DutyName',value:'DutyID'}">
          </sufan-select>
        </div>
        <div class="col">
          <span>高级筛选:&nbsp;</span>
          <sufan-search-input style="width:200px;"
            placeholder="用户名、姓名、手机号、邮箱"
            v-model="queryData.StrWhere"
            @on-click="doSearch">
          </sufan-search-input>
        </div>
        <div class="col">
          <Button type="primary"
            icon="search"
            @click="doSearch">查询
          </Button>
          <Button type="primary"
            icon="ios-plus-outline"
            @click="doBeforeCreate">新增
          </Button>
          <Button type="warning"
            icon="ios-trash-outline"
            @click="doBeforeDelete()">批量删除
          </Button>
        </div>
      </div>
    </div>
    <div class="sufuan-list"
      v-iscroll>
      <sufan-list :columns="columns"
        :data="dataRows"
        :multiple="true"
        @on-action-click="doActionStart"
        @on-select="doSelect"></sufan-list>
    </div>
    <div class="sufan-footer">
      <Page :total="queryData.TotalCount"
        :page-size="queryData.PageSize"
        show-total
        show-elevator
        @on-change="doPageSize"></Page>
    </div>
  </div>
  <!-- 弹窗 -->
  <Modal v-model="modalVisible"
    :closable="false"
    :title="modalTitle"
    :loading="loading"
    width="800"
    class-name="no-footer">
    <div>
      <component :is="activeForm"
        :dataObject="dataObject"
        @on-cancel="doCloseModal"
        @on-submit="doActionStart"></component>
    </div>
    <!-- 清空页脚 -->
    <div slot="footer"></div>
  </Modal>
</section>
</template>
<script type="text/javascript">
import formEc from './user-ec'
import formV0 from './user-v0'
import formEpwd from './user-epwd'
import {
  Avatar
} from 'iview'
import {
  mapState
} from 'vuex'
export default {
  computed: {
    ...mapState('app', {
      account: 'account'
    })
  },
  data() {
    return {
      // ajax加载
      loading: false,
      // 弹窗控制
      modalVisible: false,
      // 弹窗标题
      modalTitle: '',
      // 面包屑导航
      steps: [{
        name: '设置',
        path: '/setting'
      }, {
        name: '人员及权限管理',
        path: '/setting/user-auth'
      }, {
        name: '人员管理',
        path: '/setting/user-auth/user'
      }],
      columns: [{
        title: '头像',
        width: 100,
        key: 'FaceUrl',
        render(h, data) {
          return h(Avatar, {
            props: {
              icon: 'person',
              src: data
            }
          })
        }
      }, {
        title: '用户名',
        width: 220,
        key: 'UserAccount'
      }, {
        title: '姓名',
        width: 220,
        key: 'RealName'
      }, {
        title: '性别',
        width: 100,
        render: function(h, val) {
          let sex = '保密'
          if (val === 1) {
            sex = '男'
          }
          if (val === 2) {
            sex = '女'
          }
          return h('span', sex)
        },
        key: 'Sexy'
      }, {
        title: '手机号',
        width: 150,
        key: 'Mobile'
      }, {
        title: '邮箱',
        width: 150,
        key: 'Email'
      }, {
        title: '总部',
        width: 220,
        key: 'GeneralName'
      }, {
        title: '分部',
        width: 220,
        key: 'BranchName'
      }, {
        title: '部门',
        width: 220,
        key: 'DepartName'
      }, {
        title: '职务',
        width: 220,
        key: 'DutyName'
      }, {
        title: '权限组',
        width: 220,
        key: 'RoleName'
      }, {
        title: '操作',
        width: 280,
        actions: [{
          name: '修改',
          code: 'BeforeUpdate',
          color: ''
        }, {
          name: '重置密码',
          code: 'BeforeRepassword',
          color: ''
        }, {
          name: '删除',
          code: 'BeforeDelete',
          color: 1
        }]
      }],
      // 数据列表
      dataRows: [],
      // 选中行集合,单选则只有一条，多选多条
      selectedRows: [],
      // 表单详情-传给v0,ec
      dataObject: {},
      dataObjectKes: [
        'OperationType',
        'UserAccount',
        'RealName',
        'Sexy',
        'RoleID',
        'DepartID',
        'DutyID',
        'FaceUrl',
        'Mobile',
        'Email'
      ],
      // 当前活动的表单
      activeForm: '',
      // 查询条件
      queryData: {
        OperationType: 2,
        DutyID: 0,
        GeneralID: 0,
        BranchID: 0,
        StrWhere: '',
        PageIndex: 1,
        PageSize: 18,
        TotalCount: 0
      }
    }
  },
  mounted() {
    this.querylist()
  },
  watch: {
    'queryData': {
      deep: true,
      immediate: true,
      handler(val) {
        if (val.GeneralID === '') val.GeneralID = 0
        if (val.BranchID === '') val.BranchID = 0
        if (val.DutyID === '') val.DutyID = 0
      }
    }
  },
  methods: {
    // 获取用户数据
    querylist() {
      this.$Loading.start()
      this.$axios.post('/api/User/GetData', {
        queryData: JSON.stringify([this.queryData])
      }).then(rs => {
        this.$Loading.finish()
        // 结果
        let result = rs.data.Data
        // 提取数据
        this.dataRows = result.RetrunObjectData
        result.PageCount = 1
        // 设置分页
        this.queryData.TotalCount = result.TotalCount
        this.queryData.PageIndex = result.PageCount
      })
    },
    // 分页改变
    doPageSize(index) {
      // 设置查询分页
      this.queryData.PageIndex = index
      // 重新请求
      this.querylist()
    },
    doSearch() {
      this.querylist()
    },
    // 关闭弹窗
    doCloseModal() {
      console.log(1)
      this.modalVisible = false
      this.activeForm = formV0
    },
    // 查看
    doBeforeView() {
      this.modalVisible = true
      this.activeForm = formV0
    },
    // 查看
    doView() {

    },
    // 创建前
    doBeforeCreate() {
      // 加载数据模型
      this.dataObject = {}
      this.dataObjectKes.forEach(key => {
        this.$set(this.dataObject, key, '')
      })
      // 修改操作类型
      this.dataObject.OperationType = 1
      // 显示弹窗
      this.modalVisible = true
      // 切换表单
      this.activeForm = formEc
      // 修改弹窗标题
      this.modalTitle = '创建用户'
    },
    // 创建
    doCreate(data) {
      console.log('创建用户')
      let UsersData = [{
        OperationUserID: this.account.UserID
      }]
      // 赋值
      for (let key in data) {
        UsersData[0][key] = data[key]
      }
      this.$Loading.start()
      this.$axios.post('/api/User/OperationUser', {
        UsersData: JSON.stringify(UsersData)
      }).then(rs => {
        let result = rs.data
        this.$Loading.finish()
        if (result.Success) {
          this.$Message.success(result.Message)
          // 复原查询索引
          this.queryData.PageIndex = 0
          // 查询
          this.querylist()
          // 关闭弹窗
          this.doCloseModal()
        } else {
          this.$Message.error(result.Message)
        }
      })
    },
    // 选择函数
    doSelect(data) {
      this.selectedRows = data
    },
    // 开始执行操作按钮
    doActionStart(action) {
      if (typeof this[`do${action.code}`] === 'function') {
        this[`do${action.code}`](action.data)
      } else {
        this.$Message.warning(`没有找到do${action.code}的操作`)
      }
    },
    // 更新前
    doBeforeUpdate(data) {
      // 显示弹窗
      this.modalVisible = true
      // 切换表单
      this.activeForm = formEc
      // 修改弹窗标题
      this.modalTitle = '修改用户信息'
      // 赋值给表单对象
      this.dataObject = data
      // 修改操作类型
      this.$set(this.dataObject, 'OperationType', 2)
    },
    // 更新
    doUpdate(data) {
      console.log('更新用户')
      let UsersData = [{
        OperationUserID: this.account.UserID
      }]
      // 赋值
      for (let key in data) {
        UsersData[0][key] = data[key]
      }
      this.$Loading.start()
      this.$axios.post('/api/User/OperationUser', {
        UsersData: JSON.stringify(UsersData)
      }).then(rs => {
        let result = rs.data
        this.$Loading.finish()
        if (result.Success) {
          this.$Message.success(result.Message)
          // 复原查询索引
          this.queryData.PageIndex = 0
          // 查询
          this.querylist()
          // 关闭弹窗
          this.doCloseModal()
        } else {
          this.$Message.error(result.Message)
        }
      })
    },
    // 重置前
    doBeforeRepassword(data) {
      // 显示弹窗
      this.modalVisible = true
      // 切换表单
      this.activeForm = formEpwd
      // 修改弹窗标题
      this.modalTitle = '修改用户密码'
      // 赋值给表单对象
      this.dataObject = data
      // 修改操作类型
      this.$set(this.dataObject, 'OperationType', 5)
      this.$set(this.dataObject, 'Password', '')
      this.$set(this.dataObject, 'ConfirmPassword', '')
    },
    // 重置密码
    doRepassword(data) {
      console.log('更新密码')
      let UsersData = [{}]
      // 赋值
      for (let key in data) {
        UsersData[0][key] = data[key]
      }
      UsersData[0].OperationUserID = this.account.UserID
      this.$Loading.start()
      this.$axios.post('/api/User/OperationUser', {
        UsersData: JSON.stringify(UsersData)
      }).then(rs => {
        let result = rs.data
        this.$Loading.finish()
        if (result.Success) {
          this.$Message.success(result.Message)
          // 复原查询索引
          this.queryData.PageIndex = 0
          // 查询
          this.querylist()
          // 关闭弹窗
          this.doCloseModal()
        } else {
          this.$Message.error(result.Message)
        }
      })
    },
    // 删除前确认
    doBeforeDelete(data) {
      let params = {
        title: '警告！',
        content: '删除此信息之后将不可恢复，是否确认删除？'
      }
      this.$Modal.confirm({
        title: params.title,
        content: `<p>${params.content}</p>`,
        onOk: () => {
          this.doDelete(data || this.selectedRows)
        }
      })
    },
    // 删除
    doDelete(data) {
      let usersData = [{
        OperationType: 3,
        UserIDs: '',
        OperationUserID: this.account.UserID
      }]
      // 判断删除的数据是多行还是单行
      if (data instanceof Array) {
        for (let item of data) {
          usersData[0].UserIDs += item.UserID + ','
        }
        usersData[0].UserIDs = usersData[0].UserIDs.substr(0, usersData[0].UserIDs.length - 1)
      } else {
        usersData[0].UserIDs = data.UserID
      }
      console.log(usersData)
      this.$axios.post('/api/User/OperationUser', {
        UsersData: JSON.stringify(usersData)
      }).then(rs => {
        let result = rs.data
        if (result.Success) {
          this.$Message.success(result.Message)
          // 复原查询索引
          this.queryData.PageIndex = 0
          // 查询
          this.querylist()
        } else {
          this.$Message.error(result.Message)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.sufan-module-section {
    padding: 10px 20px 20px;
    height: calc(100vh - 100px);
    box-sizing: border-box;
    overflow: hidden;
    .sufuan-list {
        border: 1px solid #eee;
        height: calc(100% - 191px);
    }
    .sufan-option-bar {
        padding-bottom: 30px;
        box-sizing: border-box;
        .row {
            display: flex;
            align-items: center;
            .col {
                padding-right: 20px;
                display: flex;
                align-items: center;
                white-space: nowrap;
                &:last-child {
                    padding-right: 0;
                }
                button {
                    margin-right: 10px;
                }
            }
        }
    }
    .sufan-footer {
        text-align: center;
        padding-top: 20px;
    }
}
</style>
