<template>
<section>
  <div class="sufan-module-section no-select">
    <div>
      <sufan-steps :list="steps"></sufan-steps>
    </div>
    <div class="sufan-option-bar">
      <div class="row">
        <div class="col"
          style="width:50%;">
          <sufan-bcnav v-model="bcnavActive"
            :list="bcnavList"
            @on-click="doBcnavClick"></sufan-bcnav>
        </div>
        <div class="col"
          style="width:50%;text-align:right;">
          <!-- <Button type="primary"
            icon="search"
            @click="doSearch">查询
          </Button> -->
          <Button type="primary"
            icon="ios-plus-outline"
            @click="doBeforeCreate">新增
          </Button>
          <Button style="margin-right:0px;"
            type="warning"
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
        :bcnavActive="bcnavActive"
        @on-cancel="doCloseModal"
        @on-submit="doActionStart"></component>
    </div>
    <!-- 清空页脚 -->
    <div slot="footer"></div>
  </Modal>
</section>
</template>
<script type="text/javascript">
import formEc from './region-map-ec'
import formV0 from './region-map-v0'
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
        name: '环境设备管理',
        path: '/setting/env-eqpt-mgr/region-map'
      }, {
        name: '区域地图布置',
        path: '/setting/env-eqpt-mgr/region-map'
      }],
      bcnavActive: 'Region',
      bcnavList: [{
        name: '',
        value: 'Region',
        id: '',
        // 地图地址
        MapPath: ''
      }, {
        name: '',
        value: 'Position',
        id: '',
        // 地图地址
        MapPath: ''
      }],
      columns: [{
        title: '操作',
        width: 360,
        actions: [{
          name: '查看',
          code: 'BeforeView',
          color: ''
        }, {
          name: '修改',
          code: 'BeforeUpdate',
          color: ''
        }, {
          name: '删除',
          code: 'BeforeDelete',
          color: 1
        }]
      }],
      // 区域头
      columnsRegion: [{
        title: '区域图',
        width: 200,
        key: 'MapPath',
        render(h, data) {
          return h('img', {
            style: {
              'max-height': 'calc(100% - 6px)',
              'margin-top': '3px'
            },
            domProps: {
              src: data
            }
          })
        }
      }, {
        title: '区域名称',
        width: 600,
        key: 'RegionName'
      }, {
        title: '操作',
        width: 360,
        actions: [{
          name: '查看',
          code: 'BeforeView',
          color: ''
        }, {
          name: '修改',
          code: 'BeforeUpdate',
          color: ''
        }, {
          name: '删除',
          code: 'BeforeDelete',
          color: 1
        }]
      }],
      // 位置头
      columnsPosition: [{
        title: '位置ID',
        width: 158,
        key: 'PositionID'
      }, {
        title: '位置编号',
        width: 158,
        key: 'PositionNumber'
      }, {
        title: '位置名称',
        width: 500,
        key: 'PositionName'
      }, {
        title: '操作',
        width: 360,
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
      dataObjectKes: {
        Region: [
          'RegionName',
          'MapPath'
        ],
        Position: [
          'PositionName',
          'RegionID',
          'PositionNumber',
          'Proportion',
          'LeftTopX',
          'LeftTopY',
          'RightTopX',
          'RightTopY',
          'LeftBottomX',
          'LeftBottomY',
          'RightBottomX',
          'RightBottomY'
        ]
      },
      // 当前活动的表单
      activeForm: '',
      // 查询条件
      queryData: {
        // 区域：3，位置：4
        OperationType: {
          Region: 9,
          Position: 10
        },
        PageIndex: 1,
        PageSize: 18,
        TotalCount: 0
      }
    }
  },
  mounted() {
    this.initBcnav()
    this.querylist()
  },
  watch: {
    bcnavList: {
      deep: true,
      handler(val) {
        sessionStorage.setItem('setting_env_eqpt_mgr_region_map', JSON.stringify(val))
      }
    }
  },
  methods: {
    initBcnav() {
      let bcnavList = sessionStorage.getItem('setting_env_eqpt_mgr_region_map')
      let bcnav = this.$route.query.bcnav
      if (bcnavList) this.bcnavList = JSON.parse(bcnavList)
      if (bcnav) this.bcnavActive = bcnav
    },
    // 获取用户数据
    querylist() {
      this.$Loading.start()
      // 根据查询的部门设置表头
      this.columns = this[`columns${this.bcnavActive}`]
      // 修改查询条件
      let queryData = JSON.parse(JSON.stringify(this.queryData))
      // 修改操作条件
      queryData.OperationType = this.queryData.OperationType[this.bcnavActive]
      // 修改查询id
      // 判断id是否存在
      let prevItem = this.getBcnavActiveItem().prevItem
      if (prevItem.id) {
        queryData[`${prevItem.value}ID`] = prevItem.id
      }
      this.$axios.post('/api/User/GetData', {
        queryData: JSON.stringify([queryData])
      }).then(rs => {
        this.$Loading.finish()
        // 结果
        let result = rs.data.Data
        // 提取数据
        this.dataRows = result.RetrunObjectData
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
    // 搜索-暂不使用
    doSearch() {
      this.querylist()
    },
    // 面包屑导航点击
    doBcnavClick(item) {
      this.queryData.PageIndex = 0
      this.querylist()
    },
    // 获取当前活动的层级
    getBcnavActiveItem() {
      let activeItem
      let prevItem
      let nextItem
      for (let i = 0; i < this.bcnavList.length; i++) {
        let item = this.bcnavList[i]
        if (item.value === this.bcnavActive) {
          activeItem = item
          prevItem = this.bcnavList[i - 1] || {
            value: ''
          }
          nextItem = this.bcnavList[i + 1] || null
          break
        }
      }
      return {
        item: activeItem,
        prevItem: prevItem,
        nextItem: nextItem
      }
    },
    // 关闭弹窗
    doCloseModal() {
      this.modalVisible = false
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
    // 查看
    doBeforeView(data) {
      // 判断当前的层级
      let items = this.getBcnavActiveItem()
      if (items.nextItem !== null) {
        // 设置面包屑导航名称
        items.item.name = data[`${this.bcnavActive}Name`]
        // 设置id
        items.item.id = data[`${this.bcnavActive}ID`]
        // 设置地图
        items.item.MapPath = data[`MapPath`]
        // 请求下一个层级数据
        this.bcnavActive = items.nextItem.value
        // 设置页码
        this.queryData.PageIndex = 0
        this.querylist()
        // 设置导航
        this.$router.push({
          path: this.$route.path,
          query: {
            bcnav: this.bcnavActive,
            id: items.item.id
          }
        })
      } else {
        // TODO: 职务详情
        this.activeForm = formV0
      }
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
      // 加载数据模型
      this.dataObject = {}
      this.dataObjectKes[this.bcnavActive].forEach(key => {
        this.$set(this.dataObject, key, '')
      })
      // 修改操作类型
      this.dataObject.OperationType = 1
      // 设置标题
      let title
      if (this.bcnavActive === 'Region') {
        title = '区域'
      }
      if (this.bcnavActive === 'Position') {
        title = '位置'
        // 给位置传送区域图片
        this.$set(this.dataObject, 'MapPath', this.bcnavList[0].MapPath)
      }
      // 修改弹窗标题
      this.modalTitle = '创建' + title
    },
    // 创建
    doCreate(data) {
      let Type
      if (this.bcnavActive === 'Region') {
        Type = 3
      }
      if (this.bcnavActive === 'Position') {
        Type = 4
      }
      let SystemSetupData = [{
        OperationUserID: this.account.UserID,
        Type: Type
      }]
      // 赋值
      for (let key in data) {
        SystemSetupData[0][key] = data[key]
      }
      // 赋值查询条件
      if (typeof data[`${this.getBcnavActiveItem().prevItem.value}ID`] !== 'undefined') {
        SystemSetupData[0][`${this.getBcnavActiveItem().prevItem.value}ID`] = this.getBcnavActiveItem().prevItem.id
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
    // 更新前
    doBeforeUpdate(data) {
      // 显示弹窗
      this.modalVisible = true
      // 切换表单
      this.activeForm = formEc
      // 赋值给表单对象
      this.dataObject = data
      // 修改标题
      let title
      if (this.bcnavActive === 'Region') {
        title = '区域'
      }
      if (this.bcnavActive === 'Position') {
        title = '位置'
        // 给位置传送区域图片
        this.$set(this.dataObject, 'MapPath', this.bcnavList[0].MapPath)
      }

      // 修改弹窗标题
      this.modalTitle = '修改' + title
      // 修改操作类型
      this.$set(this.dataObject, 'OperationType', 2)
    },
    // 更新
    doUpdate(data) {
      let Type
      if (this.bcnavActive === 'Region') {
        Type = 3
      }
      if (this.bcnavActive === 'Position') {
        Type = 4
      }
      let SystemSetupData = [{}]
      // 赋值
      for (let key in data) {
        SystemSetupData[0][key] = data[key]
      }
      // 判断是否有上级
      let prevItem = this.getBcnavActiveItem().prevItem
      if (prevItem.id) {
        SystemSetupData[0][`${prevItem.value}ID`] = prevItem.id
      }
      SystemSetupData[0]['OperationUserID'] = this.account.UserID
      SystemSetupData[0]['Type'] = Type
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
      let Type
      if (this.bcnavActive === 'Region') {
        Type = 3
      }
      if (this.bcnavActive === 'Position') {
        Type = 4
      }
      let SystemSetupData = [{
        OperationType: 3,
        IDs: '',
        OperationUserID: this.account.UserID,
        Type: Type
      }]
      // 判断删除的数据是多行还是单行
      if (data instanceof Array) {
        for (let item of data) {
          SystemSetupData[0].IDs += item[`${this.bcnavActive}ID`] + ','
        }
        SystemSetupData[0].IDs = SystemSetupData[0].IDs.substr(0, SystemSetupData[0].IDs.length - 1)
      } else {
        SystemSetupData[0].IDs = data[`${this.bcnavActive}ID`]
      }
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
