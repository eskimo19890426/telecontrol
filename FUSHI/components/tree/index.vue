<template lang="html">
  <div class="sufan-select">
    <Tree ref="tree" :data="dataRows"
      :show-checkbox="showCheckbox"
      @on-check-change="doCheckChange"
      :empty-text="loadingText">
    </Tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataRows: [],
      selectedRows: [],
      loadingText: 'loading...'
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
          value: 'value',
          children: 'children'
        }
      }
    },
    // 选中的value
    selectkeys: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.querylist().then(qrs => {
      this.convertData(qrs).then(crs => {
        this.dataRows = crs
        this.setCheckedNodes(crs)
      })
    })
  },
  methods: {
    // 查询数据
    querylist(data) {
      return new Promise((resolve, reject) => {
        // 设置请求的级数类型
        let queryData = []
        // 请求数据
        this.$axios.post(this.url, {
          queryData: JSON.stringify(queryData)
        }).then(rs => {
          let result = rs.data.Data
          if (result.Status === 1) {
            resolve(result.RetrunObjectData)
          } else {
            this.loadingText = '暂无数据'
            reject(result)
          }
        })
      })
    },
    // 转换数据
    convertData(data) {
      return new Promise((resolve, reject) => {
        this.$Treejs.each(data, node => {
          node['title'] = node[this.defaultkeys.name]
          node['value'] = node[this.defaultkeys.value]
          node['children'] = node[this.defaultkeys.children]
          node['selected'] = false
          node['checked'] = false
        })
        setTimeout(() => {
          resolve(data)
        }, 0)
      })
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
