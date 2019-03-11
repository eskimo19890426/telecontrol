<template>
<section>
  <div class="sufan-module-section no-select">
    <div>
      <sufan-steps :list="steps"></sufan-steps>
    </div>
    <div class="sufan-option-bar">
      <div class="row">
        <div class="col">
          <span>高级筛选:&nbsp;</span>
          <sufan-search-input style="width:200px;"
            placeholder="设备ID,项目,名称关键字搜索"
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
import formEc from './project-ec'
import formV0 from './project-v0'
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
        name: '系统设置',
        path: '/setting/sys'
      }, {
        name: '项目设置',
        path: '/setting/sys/project'
      }],
      columns: [{
        title: '项目ID',
        width: 100,
        key: 'ProjectID'
      }, {
        title: '项目名称',
        width: 800,
        key: 'ProjectName'
      }, {
        title: '操作',
        width: 300,
        actions: [{
          name: '修改',
          code: 'BeforeUpdate',
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
        'ProjectName'
      ],
      // 当前活动的表单
      activeForm: '',
      // 查询条件
      queryData: {
        OperationType: 8,
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
        this.dataRows = result.RetrunObjectData || []
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
      // 显示弹窗
      this.modalVisible = true
      // 切换表单
      this.activeForm = formEc
      // 修改弹窗标题
      this.modalTitle = '创建项目'
      // 加载数据模型
      this.dataObject = {}
      this.dataObjectKes.forEach(key => {
        this.$set(this.dataObject, key, '')
      })
      // 修改操作类型
      this.dataObject.OperationType = 1
    },
    // 创建
    doCreate(data) {
      console.log('创建')
      let SystemSetupData = [{
        OperationUserID: this.account.UserID,
        Type: 2
      }]
      // 赋值
      for (let key in data) {
        SystemSetupData[0][key] = data[key]
      }
      this.$Loading.start()
      this.$axios.post('/api/User/OperationSystemSetup', {
        SystemSetupData: JSON.stringify(SystemSetupData)
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
      console.log(data, 'ssss-ss')
      // 显示弹窗
      this.modalVisible = true
      // 切换表单
      this.activeForm = formEc
      // 修改弹窗标题
      this.modalTitle = '修改服务器信息'
      // 赋值给表单对象
      this.dataObject = data
      // 修改操作类型
      this.$set(this.dataObject, 'OperationType', 2)
    },
    // 更新
    doUpdate(data) {
      console.log('更新')
      let SystemSetupData = [{}]
      // 赋值
      for (let key in data) {
        SystemSetupData[0][key] = data[key]
      }
      SystemSetupData[0].OperationUserID = this.account.UserID
      SystemSetupData[0].Type = 2
      this.$Loading.start()
      this.$axios.post('/api/User/OperationSystemSetup', {
        SystemSetupData: JSON.stringify(SystemSetupData)
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
      console.log('删除')
      let SystemSetupData = [{
        OperationType: 3,
        IDs: '',
        OperationUserID: this.account.UserID,
        Type: 2
      }]
      // 判断删除的数据是多行还是单行
      if (data instanceof Array) {
        for (let item of data) {
          SystemSetupData[0].IDs += item.ProjectID + ','
        }
        SystemSetupData[0].IDs = SystemSetupData[0].IDs.substr(0, SystemSetupData[0].IDs.length - 1)
      } else {
        SystemSetupData[0].IDs = data.ProjectID
      }
      console.log(SystemSetupData)
      this.$axios.post('/api/User/OperationSystemSetup', {
        SystemSetupData: JSON.stringify(SystemSetupData)
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
