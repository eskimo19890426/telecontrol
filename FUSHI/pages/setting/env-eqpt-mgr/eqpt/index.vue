<template>
<section>
  <div class="sufan-module-section no-select">
    <div>
      <sufan-steps :list="steps"></sufan-steps>
    </div>
    <div class="sufan-option-bar">
      <div class="row">
        <div class="col">
          <i class="iconfont"
            style="font-size:18px;">&#xe7a4;</i>
          <span>当前区域:&nbsp;</span>
          <sufan-select style="width:200px;"
            placeholder="当前区域"
            v-model="queryData.RegionID"
            url="/api/User/GetData"
            :query-data="{OperationType:9,PageIndex:0,PageSize:5000}"
            :defaultkeys="{name:'RegionName',value:'RegionID'}">
          </sufan-select>
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
        :editStatus="editStatus"
        @on-cancel="doCloseModal"
        @on-submit="doActionStart"></component>
    </div>
    <!-- 清空页脚 -->
    <div slot="footer"></div>
  </Modal>
</section>
</template>
<script type="text/javascript">
import formEc from './eqpt-ec'
import formV0 from './eqpt-v0'
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
      areaList: [],
      positionList: [],
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
        name: '环境设备管理',
        path: '/setting/env-eqpt-mgr'
      }, {
        name: '设备管理',
        path: '/setting/env-eqpt-mgr/eqpt'
      }],
      columns: [ {
        title: '区域',
        width: 120,
        key: 'RegionName'
      }, {
        title: '设备id',
        width: 100,
        key: 'DevNumber'
      }, {
        title: '设备类型',
        width: 100,
        key: 'DevType'
      }, {
        title: '位置',
        width: 100,
        key: 'PositionName'
      }, {
        title: '剂量率阈值',
        width: 100,
        key: 'CurrentThreshold'
      }, {
        title: '累积阈值',
        width: 100,
        key: 'SumThreshold'
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
        'ProjectID',
        'RegionID',
        'DevNumber',
        'DevType',
        'PositionID',
        'CurrentThreshold',
        'SumThreshold'
      ],
      // 当前活动的表单
      activeForm: '',
      // 查询条件
      queryData: {
        ProjectID: 0,
        RegionID: 0,
        PageIndex: 1,
        PageSize: 18,
        TotalCount: 0
      },
      // 当前模式,判断(位置)能否被修改,true/false
      editStatus: false
    }
  },
  mounted() {
    this.querylist()
  },
  watch: {
    // 阀值联动
    'queryData.ProjectID': {
      deep: true,
      handler() {
        this.querylist()
      }
    },
    'queryData.RegionID': {
      deep: true,
      handler() {
        this.querylist()
      }
    }
  },
  methods: {
    // 获取用户数据
    querylist() {
      this.$Loading.start()
      this.$axios.post('/api/DeviceEnv/GetDeviceEnvList', this.queryData).then(rs => {
        if (rs.data.Data.Status === -1) {
          this.$Message.info(rs.data.Data.Message)
        } else {
          this.$Loading.finish()
          // 结果
          let result = rs.data.Data
          // 提取数据
          this.dataRows = result.RetrunObjectData
          // 设置分页
          this.queryData.TotalCount = result.TotalCount
          this.queryData.PageIndex = result.PageCount
        }
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
      // 启用(位置)
      this.editStatus = false
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
      // 强行赋值项目id
      params['ProjectID'] = 56
      this.$Loading.start()
      this.$axios.post('/api/DeviceEnv/OperationDeviceEnv', params).then(rs => {
        let result = rs.data
        this.$Loading.finish()
        if (result.Data !== undefined) {
          if (result.Data.Status === 1) {
            this.$Message.success('添加成功')
            // 复原查询索引
            this.queryData.PageIndex = 0
            // 查询
            this.querylist()
            // 关闭弹窗
            this.doCloseModal()
          } else {
            this.$Message.error(result.Data.Message || '系统错误请稍后再试')
          }
        } else {
          this.$Message.error(result.Message || '系统错误请稍后再试')
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
      // 禁用(位置)
      this.editStatus = true
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
      // 操作用户id
      params.OperationUserID = this.account.UserID
      // 更新标志
      params.OperationType = 2
      this.$Loading.start()
      this.$axios.post('/api/DeviceEnv/OperationDeviceEnv', params).then(rs => {
        let result = rs.data
        this.$Loading.finish()
        if (result.Data.Status === 1) {
          this.$Message.success('更新成功')
          // 复原查询索引
          this.queryData.PageIndex = 0
          // 查询
          this.querylist()
          // 关闭弹窗
          this.doCloseModal()
        } else {
          this.$Message.error(result.Data.Message || '系统错误请稍后重试')
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
      // 判断删除的数据是多行还是单行
      let IDs = ''
      if (data instanceof Array) {
        for (let item of data) {
          IDs += item.DevID + ','
        }
        IDs = IDs.substr(0, IDs.length - 1)
      } else {
        IDs = data.DevID
      }
      this.$axios.post('/api/DeviceEnv/OperationDeviceEnv', {
        OperationType: 3,
        IDs: IDs
      }).then(rs => {
        let result = rs.data.Data
        if (result.Status === 1) {
          this.$Message.success(result.Message || '删除成功')
          // 复原查询索引
          this.queryData.PageIndex = 0
          // 查询
          this.querylist()
        } else {
          this.$Message.error(result.Message || '系统错误请稍后重试')
        }
      })
    },
    // 请求项目
    queryPosition() {
      // let params = {
      //   OperationType: 3
      // }
      this.$axios.post('/api/PersonalDev/GetPersonalDevDDL', {
        // queryData: JSON.stringify([params])
        OperationType: 3
      }).then(rs => {
        this.positionList = rs.data.Data.RetrunObjectData
        if (this.positionList.length > 0) {
          this.queryData.ProjectID = this.positionList[0].ProjectID
        } else {
          this.queryData.ProjectID = 0
        }
        this.querylist()
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
