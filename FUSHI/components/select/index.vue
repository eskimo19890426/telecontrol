<template lang="html">
  <div class="sufan-select">
    <Select
      v-model="selectedRows"
      :placeholder="placeholder"
      :clearable="clearable"
      :loading="loading"
      :remote-method="remoteQuery"
      :remote="remote"
      :label-in-value="remote"
      :filterable="remote"
      :loading-text="loadingText"
      :not-found-text="notFoundText"
      @on-change="doChange">
      <Option v-for="item in dataRows"
      :value="item[defaultkeys.value]"
      :key="item[defaultkeys.value]"
      >{{item[defaultkeys.name]}}</Option>
    </Select>
  </div>
</template>

<script>
import lodash from 'lodash'
export default {
  data() {
    return {
      dataRows: [],
      selectedRows: '',
      loading: false,
      dbRemoteQuery: lodash.debounce(this.remoteQuery, 500),
      dbQuerylist: lodash.debounce(this.querylist, 500)
    }
  },
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number]
    },
    clearable: {
      type: Boolean,
      default: true
    },
    url: {
      type: String,
      default: ''
    },
    queryData: {
      type: Object
    },
    defaultkeys: {
      type: Object,
      default: () => {
        return {
          name: 'name',
          value: 'value',
          searchkey: 'StrWhere'
        }
      }
    },
    // 是否远程搜索
    remote: {
      type: Boolean,
      default: false
    },
    // 远程搜索地址
    remoteUrl: {
      type: String,
      default: ''
    },
    // 远程查询条件
    remoteQueryData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    loadingText: {
      type: String,
      default: ''
    },
    notFoundText: {
      type: String,
      default: ''
    },
    // 参数形式
    qstype: {
      type: String
    }
  },
  methods: {
    querylist() {
      this.$axios.post(this.url, this.qstype === 'object' ? this.queryData : {
        queryData: JSON.stringify([this.queryData])
      }).then(rs => {
        let result = rs.data.Data
        if (result.Status === 1) {
          this.dataRows = result.RetrunObjectData
        } else {
          this.$Message.error(result.Message)
        }
      })
    },
    // 远程加载
    remoteQuery(name) {
      let queryData = JSON.parse(JSON.stringify(this.remoteQueryData))
      queryData[this.defaultkeys['searchkey']] = name || ''
      if (!this.remoteUrl) {
        return
      }
      this.loading = true
      this.$axios.post(this.remoteUrl, {
        queryData: JSON.stringify([queryData])
      }).then(rs => {
        this.loading = false
        let result = rs.data.Data
        if (result.Status === 1) {
          this.dataRows = result.RetrunObjectData
        }
      })
    },
    // 选中的时候返回整个对象
    doChange(item) {
      this.$emit('on-change', item)
    }
  },
  watch: {
    selectedRows: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    },
    value: {
      immediate: true,
      handler: function(val, oldVal) {
        this.selectedRows = val
      }
    },
    queryData: {
      immediate: true,
      deep: true,
      handler: function(val, oldVal) {
        // 如果是远程加载则取消常规搜索
        if (this.remote) {
          return
        }
        this.dbQuerylist()
      }
    },
    remoteQueryData: {
      immediate: true,
      deep: true,
      handler: function(val, oldVal) {
        // 如果不是远程加载则不执行
        if (!this.remote) {
          return
        }
        this.dbRemoteQuery()
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
