<template lang="html">
  <section class="sufan-list">
    <div class="list-box">
      <div class="list-boxs" ref="boxs">
        <!-- 左侧表 -->
        <ul class="list-left">
          <li class="left-check table-columns" @click="doAllCheck">
            <Radio v-model="checkAll" :disabled="!multiple"></Radio>
            <span>全选</span>
          </li>
          <li class="left-check" v-for="(item, index) in data" :class="{marks: item.mark && highlightRow}" @click="doSelectClick(item)">
            <Radio v-model="item.mark"></Radio>
          </li>
        </ul>
        <!-- 左侧表// -->
        <!-- 中间表 -->
        <div class="list-content-coulmn" :style="{'width': tableWidth + 'px'}">
          <div class="list-content-box" v-iscroll>
            <table cellspacing="0" cellpadding="0" border="0" :style="{'width': spanNum + 'px'}">
              <colgroup>
                <col :width="columns[index].width" v-for="(data, index) in columns" v-if="index < columns.length - 1" :key="index"></col>
              </colgroup>
              <tbody>
                <!-- 表头 -->
                <tr class="table-list-line table-columns" v-if="columns[columns.length - 1].actions">
                  <td v-for="(data, index) in columns" v-if="index < columns.length - 1" :key="index">
                    <span>{{data.title}}</span>
                  </td>
                </tr>
                <tr class="table-list-line table-columns" v-else>
                  <td v-for="(data, index) in columns" :key="index">
                    <span>{{data.title}}</span>
                  </td>
                </tr>
                <!-- 表头 //-->
                <tr class="table-list-line" v-for="item in data" v-if="columns[columns.length - 1].actions" :class="{marks: item.mark && highlightRow}" @click="doRowClcik(item)" @dblclick="doDbClick(item)">
                  <td v-for="(data, index) in columns" v-if="index < columns.length - 1" :key="index" class="col-list-center">
                    <div class="columns-title columns-center" v-if="columns[index].render">
                      <cellRender :renders="columns[index].render" class="colunms" :data="item[[columns[index].key]]">
                      </cellRender>
                    </div>
                    <div class="columns-title columns-center" v-else>
                      <div class="colums-text">{{item[columns[index].key]}}</div>
                    </div>
                  </td>
                </tr>

                <tr class="table-list-line" v-for="item in data" v-else :class="{marks: item.mark && highlightRow}" @click="doRowClcik(item)" @dblclick="doDbClick(item)">
                  <td v-for="(data, index) in columns" :key="index" class="col-list-center">
                    <div class="columns-title columns-center" v-if="columns[index].render">
                      <cellRender :renders="columns[index].render" class="colunms" :data="item[[columns[index].key]]">
                      </cellRender>
                    </div>
                    <div class="columns-title columns-center" v-else>
                      <div class="colums-text">{{item[columns[index].key]}}</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- 中间表// -->
        <!-- 右侧表 -->
        <div class="list-right" :style="{'width': btnWidth() + 'px'}" v-if="columns[columns.length - 1].actions">
          <ul>
            <li class="list-content-carder">
              <div class="columns-title btn-left-line">
                <span>{{columns[columns.length - 1].title}}</span>
              </div>
            </li>
            <li v-for="(item, index) in data" :class="{marks: item.mark && highlightRow}">
              <div class="columns-btn-group">
                <div class="columns-title-btn">
                  <span class="spanBtn" @click.stop="doBtnClick(list, item)" :class="{'colorOne': list.color === 1}" v-for="(list, index) in columns[columns.length - 1].actions" :key="index">{{list.name}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 右侧表// -->
      </div>
      <!-- ///////////////////////////////////////////////////////////////////// -->
      <Spin fix v-show="loading">
          <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
      </Spin>
    </div>
  </section>
</template>
<script>
import cellRender from './cellRender.vue'
import TableRenderHeader from './header'
export default {
  data() {
    return {
      checkAll: false,
      spans: 24,
      isDbclick: false,
      loading: false,
      spanNum: 24,
      conentWidth: '100%',
      tableWidth: '',
      boxWidth: '',
      scrolll: {
        bounce: false
      }
    }
  },
  props: {
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    data: {
      type: Array,
      default () {
        return []
      }
    },
    noDataText: {
      type: String,
      default () {
        return '暂无数据'
      }
    },
    highlightRow: {
      type: Boolean,
      default () {
        return false
      }
    },
    multiple: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  created() {
    this.loading = true
  },
  mounted() {
    this.spanCum()
    for (let i in this.data) {
      this.$set(this.data[i], 'mark', false)
    }
  },
  methods: {
    btnWidth() {
      if (this.columns[this.columns.length - 1].width) {
        return this.columns[this.columns.length - 1].width
      } else {
        return ''
      }
    },
    // ---------------------------------------------------------------------------
    doBtnClick(action, data) {
      this.$emit('on-action-click', {
        code: action.code,
        action,
        data
      })
    },
    // span宽度计算
    spanCum() {
      this.boxWidth = this.$refs.boxs.getBoundingClientRect().width
      if (this.columns[this.columns.length - 1].width && this.columns[this.columns.length - 1].actions) { // 减去按钮组宽度
        this.boxWidth = this.boxWidth - this.columns[this.columns.length - 1].width - 100
      } else if (this.columns[this.columns.length - 1].actions) {
        this.columns[this.columns.length - 1].width = 200
        this.boxWidth = this.boxWidth - 200 - 100
      } else {
        this.boxWidth = this.boxWidth - 100
      }
      this.tableWidth = this.boxWidth
      let aullWidth = this.boxWidth // 总的中心宽度
      let num = 0 // 没有宽度的表格
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].width > 0) {
          aullWidth -= this.columns[i].width
        } else {
          num += 1
        }
      }
      for (let f = 0; f < this.columns.length - 1; f++) {
        if (aullWidth / num < 200) {
          if (!this.columns[f].width || this.columns[f].width === 0) {
            this.columns[f].width = 200
          }
        } else {
          if (!this.columns[f].width || this.columns[f].width === 0) {
            this.columns[f].width = aullWidth / num
          }
        }
      }
      this.spanNum = 0
      for (let i in this.columns) {
        this.spanNum += this.columns[i].width
      }
      if (this.spanNum < this.boxWidth) {
        this.spanNum = this.boxWidth
      }
      this.loading = false
    },
    // 单击一行触发
    doRowClcik(item) {
      this.isDbclick = false
      setTimeout(() => {
        if (this.isDbclick) {
          return ''
        } else {
          this.doSelectClick(item)
        }
      }, 250)
    },
    // 双击行触发
    doDbClick(item) {
      this.isDbclick = true
      for (let i in this.data) {
        this.data[i].mark = false
      }
      item.mark = true
      if (this.multiple) {
        let arr = []
        for (let l in this.data) {
          if (this.data[l].mark) {
            arr.push(this.data[l])
          }
        }
        this.$emit('on-select', arr)
      }
      this.$emit('on-row-dbclick', item)
    },
    // 选择
    doSelectClick(val) {
      // 多选
      if (this.multiple) {
        val.mark = !val.mark
        let l = 0
        for (let i in this.data) {
          if (!this.data[i].mark) {
            l += 1
          }
        }
        if (l > 0) {
          this.checkAll = false
        } else {
          this.checkAll = true
        }
        let arr = []
        for (let l in this.data) {
          if (this.data[l].mark) {
            arr.push(this.data[l])
          }
        }
        this.$emit('on-select', arr)
      } else {
        if (val.mark) {
          val.mark = !val.mark
        } else {
          for (let i in this.data) {
            this.data[i].mark = false
          }
          val.mark = true
        }
      }
    },
    // 全选
    doAllCheck() {
      if (!this.multiple) {
        return ''
      }
      let m = 0
      for (let i in this.data) {
        if (!this.data[i].mark) {
          m += 1
        }
      }
      // 全选
      if (m > 0) {
        for (let o in this.data) {
          this.data[o].mark = true
        }
        this.checkAll = true
      } else {
        // 取消全选
        for (let p in this.data) {
          this.data[p].mark = false
        }
        this.checkAll = false
      }
    }
  },
  components: {
    cellRender,
    TableRenderHeader
  },
  watch: {
    columns() {
      this.loading = true
      this.spanCum()
    },
    data() {
      for (let i in this.data) {
        this.$set(this.data[i], 'mark', false)
      }
    }
  }
}
</script>
<style>

</style>
<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";
.list-boxs {
    display: flex;
    display: -webkit-flex;
    display: -ms-flex;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    flex-direction: row;
    .list-left {
        width: 100px;
        border-right: 1px solid #EEE;
        .left-check {
            height: 45px;
            line-height: 45px;
            text-align: center;
        }
        .left-check:nth-child(n + 2) {
            border-top: 1px solid #EEEEEE;
        }
    }
    .list-content-coulmn {
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        position: relative;
        overflow: hidden;
        width: 100%;
    }
    .list-content-box {
        width: 100%;
        position: relative;
    }
    .list-row::after {
        content: '';
        display: block;
        clear: both;
    }
    .list-row .col-list-center {
        height: 45px;
    }
    .list-content-carder {
        background: #B5B0CE;
    }
    .btn-left-line {
        border-left: 1px solid #EEE;
    }
    .columns-title {
        height: 45px;
        line-height: 45px;
        text-align: center;
    }
    .list-right {
        min-width: 200px;
    }
    .columns-btn-group {
        height: 45px;
        border-top: 1px solid #EEE;
        line-height: 45px;
        text-align: center;
        border-left: 1px solid #EEE;
    }
    .columns-title-btn {
        display: inline-block;
    }
    .spanBtn {
        padding: 3px 15px;
        border-radius: 3px;
        font-size: 14px;
        background: #2BE7CE;
        color: #fff;
        cursor: pointer;
    }
    .spanBtn:not(:nth-last-child(1)) {
        margin-right: 15px;
    }
    .spanBtn.colorOne {
        background: #FDAC6A;
    }
    .columns-center:nth-child(n + 1) {
        border-top: 1px solid #EEE;
    }
    .data-list .col-list-center:not(:nth-last-child(1)) {
        border-right: 1px solid #EEE;
    }
    .list-content-carder .col-list-center:not(:nth-last-child(1)) {
        border-right: 1px solid #EEE;
    }
    // table
    .table-list-line {
        text-align: center;
        line-height: 45px;
    }
    .table-columns {
        background: #B5B0CE;
    }
    tr {
        display: table-row;
        vertical-align: inherit;
        border-color: inherit;
    }
    .table-list-line td {
        height: 45px;
    }
    .table-list-line td:not(:nth-last-child(1)) {
        border-right: 1px solid #EEE;
    }
    .table-content-line td:not(:nth-last-child(1)) {
        border-right: 1px solid #EEE;
    }
    .table-content-line td {
        border-top: 1px solid #EEE;
    }
    .marks {
        background: #e6fffc;
    }
}
// ------------------------------------------
// .sufan-list {
//     height: 100%;
//     .list-box {
//         border-bottom: 1px solid #EEEEEE;
//         position: relative;
//         height: 100%;
//         ul {
//             border-bottom: 1px solid #EEEEEE;
//             li {
//                 // height: 45px;
//             }
//             .list-columns {
//                 background: #B5B0CE;
//                 .columns-title {
//                     text-align: center;
//                     line-height: 45px;
//                     font-size: 14px;
//                 }
//                 .col-list:nth-child(1) {
//                     cursor: pointer;
//                 }
//                 .col-list:not(:nth-last-child(1)) .columns-title {
//                     border-right: 1px solid #EEEEF0;
//                 }
//             }
//             .check {
//                 cursor: pointer;
//             }
//             .list-form {
//                 border-top: 1px solid #EEEEEE;
//                 .no-data {
//                     text-align: center;
//                     height: 45px;
//                     line-height: 35px;
//                 }
//                 .columns-title {
//                     line-height: 45px;
//                     height: 45px;
//                     display: flex;
//                     display: -webkit-flex;
//                     display: -ms-flex;
//                     text-align: center;
//                     justify-content: center;
//                     .colums-text {
//                         font-size: 14px;
//                     }
//                     .columns-title-btn {
//                         display: inline-block;
//                     }
//                     .spanBtn {
//                         padding: 3px 15px;
//                         border-radius: 3px;
//                         font-size: 14px;
//                         background: #2BE7CE;
//                         color: #fff;
//                         cursor: pointer;
//                     }
//                     .spanBtn:not(:nth-last-child(1)) {
//                         margin-right: 15px;
//                     }
//                     .spanBtn.colorOne {
//                         background: #FDAC6A;
//                     }
//                 }
//                 .col-list:not(:nth-last-child(1)) .columns-title {
//                     border-right: 1px solid #EEEEEE;
//                 }
//             }
//
//         }
//     }
//     .colunms {
//         margin: auto;
//     }
// }
</style>
