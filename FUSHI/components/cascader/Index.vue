<template lang="html">
  <div class="sufan-cascader">
    <Cascader :data="dataRows" :load-data="loadData" :placeholder="placeholder"></Cascader>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataRows: []
    }
  },
  props: {
    // 请求链接
    url: String,
    // 请求参数
    queryData: {
      type: Object,
      default: () => {
        return {
          RootDropType: 0,
          subDropType: 0,
          PageIndex: 0,
          PageSize: 1000
        }
      }
    },
    // 配置查询字段
    defaultKeys: {
      type: Object,
      default: () => {
        return {
          queryData: 'queryData',
          value: 'value',
          label: 'label',
          children: 'children',
          parentId: 'parentId'
        }
      }
    },
    // 提示
    placeholder: String
  },
  mounted() {
    // 加载数据
    this.querylist(this.queryData.RootDropType).then(data => {
      // 转化数据
      this.dataRows = this.convertData(data)
    })
  },
  methods: {
    // 加载数据
    querylist(DropType, parentId) {
      return new Promise((resolve, reject) => {
        let queryData = {
          PageSize: this.queryData.PageSize,
          PageIndex: this.queryData.PageIndex,
          DropType: DropType
        }
        if (parentId) {
          queryData[this.defaultKeys.parentId] = parentId
        }
        let params = {}
        params[this.defaultKeys.queryData] = JSON.stringify([queryData])
        this.$axios.post(this.url, params).then(rs => {
          let result = rs.data.Data
          if (result.Status === 1) {
            resolve(result.RetrunObjectData)
          } else {
            reject(rs)
          }
        }).catch(rs => {
          reject(rs)
        })
      })
    },
    // 加载数据
    loadData(item, call) {
      item.loading = true
      this.querylist(this.queryData.subDropType).then(data => {
        item.children = this.convertData(data)
        item.loading = false
        call()
      })
    },
    // 转换数据
    convertData(orgdata) {
      let data = []
      for (let item of orgdata) {
        data.push({
          value: item[this.defaultKeys.value],
          label: item[this.defaultKeys.label],
          children: [],
          loading: false
        })
      }
      return data
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";
.sufan-cascader {
    position: relative;

}
</style>
