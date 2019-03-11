<template lang="html">
  <div class="sufan-select">
    <Tree ref="tree" :data="dataRows"
      :show-checkbox="showCheckbox"
      :load-data="loadData"
      @on-check-change="doCheckChange">
    </Tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataRows: [],
      selectedRows: []
    }
  },
  props: {
    // 显示多选框
    showCheckbox: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: true
    },
    levelData: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: {
      type: Array
    },
    url: {
      type: String,
      default: ''
    },
    defaultkeys: {
      type: Object,
      default: () => {
        return {
          name: 'name',
          value: 'value'
        }
      }
    },
    // 选中的value
    selectkeys: {
      type: String,
      default: ''
    }
  },
  methods: {
    // 查询数据
    querylist(data) {
      return new Promise((resolve, reject) => {
        // 判断是否还有下级
        if (data.level > this.levelData.length - 1) {
          resolve([])
          return
        }
        // 设置请求的级数类型
        let queryData = [{
          DropType: this.levelData[data.level].DropType
        }]
        // 如果不是第一级则携带父亲的id
        if (data.level > 0) {
          queryData[0][this.levelData[data.level - 1].value] = data.value
        }
        // 请求数据
        this.$axios.post(this.url, {
          queryData: JSON.stringify(queryData)
        }).then(rs => {
          let result = rs.data.Data
          if (result.Status === 1) {
            resolve(result.RetrunObjectData)
          } else {
            reject(result)
          }
        })
      })
    },
    // 懒加载
    loadData(item, call) {
      // 获取下一层数据
      this.querylist({
        level: item.level + 1,
        value: item.value
      }).then(data => {
        for (let listItem of data) {
          listItem.level = item.level + 1
        }
        // 如果没有下级则结束
        if (data.length === 0) {
          call([])
        } else {
          // 展开
          call(this.convertData(data))
        }
      })
    },
    // 转换数据
    convertData(data) {
      let treeData = []
      // 获取等级如果没有则默认为第一层
      let level = 0
      if (typeof data[0].level === 'number') {
        level = data[0].level
      }
      for (let item of data) {
        let listItem = {
          // 显示的名称
          title: item[this.levelData[level].name],
          // 值
          value: item[this.levelData[level].value],
          // 父节点的id
          ParentID: item.ParentID,
          // 记录层级
          level: level,
          // 是否加载
          loading: false,
          // 是否选中
          selected: false,
          // 是否选中
          checked: false
        }
        // 判断是否还有下级
        if (level <= this.levelData.length - 1) {
          listItem.children = []
        }
        treeData.push(listItem)
      }
      setTimeout(() => {
        this.setCheckedNodes()
      }, 0)
      return treeData
    },
    // 选中节点时触发
    doCheckChange() {
      // 提交选中结果
      this.$emit('input', this.$refs.tree.getCheckedNodes())
    },
    // 设置选中行
    setCheckedNodes() {
      if (!this.selectkeys) {
        return
      }
      let keys = this.selectkeys.split(',')
      this.$Treejs.each(this.dataRows, item => {
        for (let key of keys) {
          if (item.value.toString() === key.toString()) {
            item.checked = true
          }
        }
      })
    },
    // 清空选中
    clearCheckedNodes() {
      this.$Treejs.each(this.dataRows, item => {
        item.checked = false
      })
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler: function(val, oldVal) {
        // TODO: 设置选中
      }
    },
    levelData: {
      immediate: true,
      deep: true,
      handler: function(val, oldVal) {
        // 获取第一层数据
        this.querylist({
          level: 0
        }).then(data => {
          this.dataRows = this.convertData(data)
        })
      }
    },
    selectkeys: {
      deep: true,
      immediate: true,
      handler: function(val, oldVal) {
        // TODO: 设置选中
        if (val === '') {
          this.selectedRows = []
          this.clearCheckedNodes()
        } else {
          this.clearCheckedNodes()
          this.setCheckedNodes()
        }
      }
    },
    dataRows: {
      deep: true,
      handler: function(val, oldVal) {
        // this.setCheckedNodes()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.sufan-select {
    display: inline-block;
    position: relative;
    width: 100%;
}
</style>
