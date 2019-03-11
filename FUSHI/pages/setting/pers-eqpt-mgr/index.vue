<template>
<section>
  <div class="sufan-module-section no-select">
    <div>
      <sufan-steps :list="steps"></sufan-steps>
    </div>
    <div class="sufan-option-bar">
      <div class="row">
        <!-- <div class="col" style="width:300px;">
          <span>项目类型:&nbsp;</span>
          <sufan-select placeholder="项目类型" v-model="queryData.DevName" url="/api/User/GetData" :query-data="{OperationType:8,PageIndex:0,PageSize:5000}" :defaultkeys="{name:'ProjectName',value:'ProjectID'}">
          </sufan-select>
        </div> -->
        <div class="col">
          <span>阈值:&nbsp;</span>
          <Input type="text" v-model="queryData.StartValue" style="width:50px;"></Input>&nbsp;-&nbsp;
          <Input type="text" v-model="queryData.EndValue" style="width:50px;"></Input>&nbsp;
        </div>
        <div class="col" style="width:220px;">
          <span>部门:&nbsp;</span>
          <sufan-select placeholder="部门" v-model="queryData.DepartID" url="/api/User/GetData" :query-data="{DropType:3,BranchID:0}" :defaultkeys="{name:'DepartName',value:'DepartID'}">
          </sufan-select>
        </div>
        <div class="col" style="width:220px;">
          <span>职务:&nbsp;</span>
          <sufan-select placeholder="职务" v-model="queryData.DutyID" url="/api/User/GetData" :query-data="{DropType:4,DepartID:queryData.DepartID||0}" :defaultkeys="{name:'DutyName',value:'DutyID'}">
          </sufan-select>
        </div>
        <div class="col">
          <span>高级筛选:&nbsp;</span>
          <sufan-search-input style="width:200px;" placeholder="" v-model="queryData.StrWhere" @on-click="doSearch">
          </sufan-search-input>
        </div>
        <div class="col">
          <Button type="primary" icon="search" @click="doSearch">查询
          </Button>
          <Button type="primary" icon="ios-plus-outline" @click="doBeforeCreate">新增
          </Button>
          <Button type="warning" icon="ios-trash-outline" @click="doBeforeDelete()">批量删除
          </Button>
        </div>
      </div>
    </div>
    <div class="sufuan-list" v-iscroll>
      <sufan-list :columns="columns" :data="dataRows" :multiple="true" @on-action-click="doActionStart" @on-select="doSelect"></sufan-list>
    </div>
    <div class="sufan-footer">
      <Page :total="queryData.TotalCount" :page-size="queryData.PageSize" show-total show-elevator @on-change="doPageSize"></Page>
    </div>
  </div>
  <!-- 弹窗 -->
  <Modal v-model="modalVisible" :title="modalTitle" :loading="loading" width="800" class-name="no-footer">
    <div>
      <component :is="activeForm" :dataObject="dataObject" @on-cancel="doCloseModal" @on-submit="doActionStart"></component>
    </div>
    <!-- 清空页脚 -->
    <div slot="footer"></div>
  </Modal>
</section>
</template>
<script type="text/javascript">
// import lodash from 'lodash'
import formEc from './pers-eqpt-mgr-ec'
import formV0 from './pers-eqpt-mgr-v0'
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
        name: '个人设备管理',
        path: '/setting/pers-eqpt-mgr'
      }],
      columns: [{
        title: '设备信息id',
        width: 150,
        key: 'DevID'
      }, {
        title: '个人设备id',
        width: 150,
        key: 'DevNumber'
      }, {
        title: '个人设备类型',
        width: 220,
        key: 'DevName'
      }, {
        title: '拥有者',
        width: 300,
        key: 'Owner'
      }, {
        title: '当前阈值',
        width: 300,
        key: 'SumThreshold'
      }, {
        title: '累计阈值',
        width: 100,
        key: 'CurrentThreshold'
      }, {
        title: '部门名称',
        width: 300,
        key: 'DepartName'
      }, {
        title: '职务名称',
        width: 300,
        key: 'DutyName'
      }, {
        title: '设备创建日期',
        width: 300,
        key: 'CreateTime'
      }, {
        title: '操作',
        width: 220,
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
        'DevName',
        'DevNumber',
        'ProjectID',
        'DepartID',
        'DutyID',
        'Owner',
        'UserID',
        'SumThreshold',
        'CurrentThreshold'
      ],
      // 当前活动的表单
      activeForm: '',
      // 查询条件
      queryData: {
        // 设备类型
        DevName: '',
        // 阀值开始
        StartValue: 0,
        // 阀值结束
        EndValue: 0,
        // 部门id
        DepartID: 0,
        // 职务id
        DutyID: 0,
        // 搜索
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
    // // 阀值联动
    // 'queryData.StartValue' (val) {
    //   this.StartValue()
    // },
    // 'queryData.EndValue' (val) {
    //   this.EndValue()
    // }
  },
  methods: {
    checkRange() {
      let StartValue = Number(this.queryData.StartValue)
      let EndValue = Number(this.queryData.EndValue)
      if (EndValue < StartValue) {
        this.$Message.error('阈值范围输入有误')
        return false
      } else {
        return true
      }
    },
    // 获取用户数据
    querylist() {
      this.$Loading.start()
      this.$axios.post('/api/PersonalDev/GetPersonalDevList', this.queryData).then(rs => {
        this.$Loading.finish()
        // 结果
        let result = rs.data.Data
        // 提取数据
        this.dataRows = result.RetrunObjectData || []
        // 自动删除项目名称数据
        for (var i in this.dataRows) {
          delete this.dataRows[i].ProjectName
        }
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
      if (this.checkRange()) {
        this.querylist()
      }
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
      this.modalTitle = '创建设备'
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
      let params = {
        OperationUserID: this.account.UserID
      }
      // 赋值
      for (let key in data) {
        params[key] = data[key]
      }
      params['ProjectID'] = '56'
      this.$Loading.start()
      this.$axios.post('/api/PersonalDev/OperationPersonalDev', params).then(rs => {
        let result = rs.data.Data || rs.data || {}
        this.$Loading.finish()
        if (result.Status && result.Status === 1) {
          this.$Message.success(result.Message || '创建成功')
          // 复原查询索引
          this.queryData.PageIndex = 0
          // 查询
          this.querylist()
          // 关闭弹窗
          this.doCloseModal()
          // return
        } else {
          this.$Message.error(result.Message || '该设备ID已被占用，请换新的设备ID')
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
      this.modalTitle = '修改设备信息'
      // 赋值给表单对象
      this.dataObject = data
      // 修改操作类型
      this.$set(this.dataObject, 'OperationType', 2)
    },
    // 更新
    doUpdate(data) {
      let params = {}
      // 赋值
      for (let key in data) {
        params[key] = data[key]
      }
      params.OperationUserID = this.account.UserID
      this.$Loading.start()
      this.$axios.post('/api/PersonalDev/OperationPersonalDev', params).then(rs => {
        let result = rs.data.Data
        this.$Loading.finish()
        if (result.Status === 1) {
          this.$Message.success(result.Message || '修改成功')
          // 复原查询索引
          this.queryData.PageIndex = 0
          // 查询
          this.querylist()
          // 关闭弹窗
          this.doCloseModal()
        } else {
          this.$Message.error(result.Message || '该设备ID已被占用，请换新的设备ID')
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
      let params = {
        OperationType: 3,
        DevIDs: '',
        UserID: this.account.UserID
      }
      // 判断删除的数据是多行还是单行
      if (data instanceof Array) {
        for (let item of data) {
          params.DevIDs += item.DevID + ','
        }
        params.DevIDs = params.DevIDs.substr(0, params.DevIDs.length - 1)
      } else {
        params.DevIDs = data.DevID
      }
      this.$axios.post('/api/PersonalDev/OperationPersonalDev', params).then(rs => {
        let result = rs.data.Data
        if (result.Status === 1) {
          this.$Message.success(result.Message || '删除成功')
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
