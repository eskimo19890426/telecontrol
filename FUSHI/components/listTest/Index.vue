<template lang="html">
  <section class="sufan-list" ref="boxs">
    <div v-show="tableShow">
    <!-- 顶部固定 -->
    <div class="sufan-header">
      <ul class="list-left header-left">
        <li class="table-columns checked" @click="doAllCheck">
          <Radio v-model="checkAll" :disabled="!multiple"></Radio>
          <span>全选</span>
        </li>
      </ul>
      <div class="header-columns" :style="{'width': tableWidth + 'px'}">
        <div  class="list-content-box" v-iscroll:test="options" id="head" ref="head">
          <div :style="{'width': spanNum + 'px'}">
            <table cellspacing="0" cellpadding="0" border="0" :style="{'width': spanNum + 'px'}">
              <colgroup>
                <col :width="columns[index].width" v-for="(data, index) in columns" v-if="index < columns.length - 1" :key="index"></col>
              </colgroup>
              <tbody>
                <tr class="table-list-line table-columns" v-if="columns[columns.length - 1].actions">
                  <td v-for="(data, index) in columns" v-if="index < columns.length - 1" :key="index">
                    <div :class="{'textLeft': columns[indexs].position && columns[indexs].position === 'left', 'textRight': columns[indexs].position && columns[indexs].position === 'right'}">{{data.title}}</div>
                  </td>
                </tr>
                <tr class="table-list-line table-columns" v-else>
                  <td v-for="(data, index) in columns" :key="index">
                    <span>{{data.title}}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="list-right head-ccolumn" :style="{'width': btnWidth() + 'px'}" v-if="columns[columns.length - 1].actions">
        <ul>
          <li class="list-content-carder">
            <div class="columns-title btn-left-line">
              <span>{{columns[columns.length - 1].title}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 顶部固定 //-->
    <div class="list-box" v-iscroll>
      <div class="list-boxs">
        <!-- 左侧表 -->
        <ul class="list-left">
          <li class="left-check table-columns opacity">
            <Radio v-model="checkAll" :disabled="!multiple"></Radio>
            <span>全选</span>
          </li>
          <li class="left-check" v-for="(item, index) in data" :key="index" :class="{marks: item.mark && highlightRow}" @click="doSelectClick(item)">
            <Radio v-model="item.mark"></Radio>
          </li>
        </ul>
        <!-- 左侧表// -->
        <!-- 中间表 -->
        <div class="list-content-coulmn" :style="{'width': tableWidth + 'px'}">
          <div class="list-content-box" v-iscroll:table="optionsTable" id="table" ref="table">
            <div :style="{'width': spanNum + 'px'}">
            <table cellspacing="0" cellpadding="0" border="0" :style="{'width': spanNum + 'px'}">
              <colgroup>
                <col :width="columns[index].width" v-for="(data, index) in columns" v-if="index < columns.length - 1" :key="index"></col>
              </colgroup>
              <tbody>
                <!-- 表头 -->
                <tr class="table-list-line table-columns opacity" v-if="columns[columns.length - 1].actions">
                  <td v-for="(data, index) in columns" v-if="index < columns.length - 1" :key="index">
                    <span>{{data.title}}</span>
                  </td>
                </tr>
                <tr class="table-list-line table-columns opacity" v-else>
                  <td v-for="(data, index) in columns" :key="index">
                    <span>{{data.title}}</span>
                  </td>
                </tr>
                <!-- 表头 //-->
                <tr class="table-list-line" v-if="columns[columns.length - 1].actions" v-for="(item, keys) in data" :key="keys" :class="{marks: item.mark && highlightRow}" @click.stop="doRowClcik(item)" @dblclick="doDbClick(item)">
                  <td v-for="(data, indexs) in columns" v-if="indexs < columns.length - 1" :key="indexs" class="col-list-center">
                    <div class="columns-title columns-center" v-if="columns[indexs].render">
                      <cellRender :renders="columns[indexs].render" class="colunms" :data="item[[columns[indexs].key]]">
                      </cellRender>
                    </div>
                    <div class="columns-title columns-center" v-else>
                      <div class="colums-text" :class="{'textLeft': columns[indexs].position && columns[indexs].position === 'left', 'textRight': columns[indexs].position && columns[indexs].position === 'right'}">{{item[columns[indexs].key]}}</div>
                    </div>
                  </td>
                </tr>
                <tr class="table-list-line" v-if="!columns[columns.length - 1].actions" v-for="(item, keys) in data" :key="keys" :class="{marks: item.mark && highlightRow}" @click.stop="doRowClcik(item)" @dblclick="doDbClick(item)">
                  <td v-for="(data, indexs) in columns" :key="indexs" class="col-list-center">
                    <div class="columns-title columns-center" v-if="columns[indexs].render">
                      <cellRender :renders="columns[indexs].render" class="colunms" :data="item[[columns[indexs].key]]">
                      </cellRender>
                    </div>
                    <div class="columns-title columns-center" v-else>
                      <div class="colums-text" :class="{'textLeft': columns[indexs].position && columns[indexs].position === 'left', 'textRight': columns[indexs].position && columns[indexs].position === 'right'}">{{item[columns[indexs].key]}}</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>
        <!-- 中间表// -->
        <!-- 右侧表 -->
        <div class="list-right" :style="{'width': btnWidth() + 'px'}" v-if="columns[columns.length - 1].actions">
          <ul>
            <li class="list-content-carder opacity">
              <div class="columns-title btn-left-line">
                <span>{{columns[columns.length - 1].title}}</span>
              </div>
            </li>
            <li v-for="(item, index) in data" :class="{marks: item.mark && highlightRow}" :key="index">
              <div class="columns-btn-group">
                <div class="columns-title-btn">
                  <span class="spanBtn" @click.stop="doBtnClick(list, item)" :class="{'colorOne': list.color === 1}" v-for="(list, indexs) in columns[columns.length - 1].actions" :key="indexs">{{list.name}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 右侧表// -->
      </div>
      <!-- ///////////////////////////////////////////////////////////////////// -->
    </div>
    </div>
    <div v-show="!tableShow" class="no-datas">
      暂无数据
      <!-- <Spin fix>
          <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
      </Spin> -->
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
      tableShow: false,
      scrolll: {
        bounce: false
      },
      time: 0,
      options: {
        scrollbars: false,
        bounce: false
      },
      optionsTable: {
        scrollbars: 'custom',
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
    this.data.length > 0 ? this.tableShow = true : this.tableShow = false
    window.onresize = () => {
      this.spanCum()
    }
    this.spanCum()
    // this.spanCum()
    for (let i in this.data) {
      this.$set(this.data[i], 'mark', false)
    }
    this.test.on('scroll', (e) => {
      this.table.scrollTo(this.test.x, 0)
    })
    this.table.on('scroll', (e) => {
      this.test.scrollTo(this.table.x, 0)
    })
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
      this.time += 1
      setTimeout(() => {
        this.time -= 1
        if (this.time === 0) {
          this.$emit('on-action-click', {
            code: action.code,
            action,
            data
          })
        }
      }, 150)
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
        this.$emit('on-select', this.data)
      } else {
        // 取消全选
        for (let p in this.data) {
          this.data[p].mark = false
        }
        this.checkAll = false
        this.$emit('on-select', [])
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
      this.data.length > 0 ? this.tableShow = true : this.tableShow = false
      this.checkAll = false
      for (let i in this.data) {
        this.$set(this.data[i], 'mark', false)
      }
    }
  }
}
</script>
<style>

</style>
<style lang="scss" scoped>@import "~assets/themes/default/colors.scss";
.checked {
    height: 45px;
    border-right: 1px solid #EEE;
    width: 100px !important;
    text-align: center;
    line-height: 45px;
}
.header-left {
    float: left;
}
.no-datas {
    padding: 15px;
    text-align: center;
    box-sizing: border-box;
}
.sufan-header::after {
    content: '';
    clear: both;
    clear: both;
}
.head-ccolumn {
    float: left;
    text-align: center;
    line-height: 45px;
    height: 45px;
    background: #B5B0CE;
}
.sufan-list {
    position: relative;
    overflow: hidden;
    height: 100%;
}
.sufan-list > div {
    position: relative;
    height: 100%;
}
.sufan-header {
    position: fixed;
    z-index: 9;
    left: 0;
    top: 0;
    height: 45px;
}
.header-columns {
    float: left;
}
.list-box {
    height: 100%;
    position: relative;
}
.opacity {
    opacity: 0;
}
.list-left {
    width: 100px;
    // position: relative;
    border-right: 1px solid #EEE;
    .left-check {
        height: 45px;
        line-height: 45px;
        text-align: center;
    }
    .left-check:nth-child(n + 2) {
        border-top: 1px solid #EEEEEE;
    }
    // .left-check:nth-child(2) {
    //     margin-top: 45px;
    // }
}
.list-content-coulmn {
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    overflow: hidden;
    width: 100%;
}
.list-content-box {
    width: 100%;
    position: relative;
}
.table-columns {
    background: #B5B0CE;
}
.list-boxs {
    display: flex;
    display: -webkit-flex;
    display: -ms-flex;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    flex-direction: row;
    border-bottom: 1px solid #EEEEEE;
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
        padding: 0 10px;
        box-sizing: border-box;
        .textLeft {
          text-align: left;
        }
        .textRight {
          text-align: right;
        }
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
    // table
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
.table-list-line {
    text-align: center;
    line-height: 45px;
}
tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
}
.table-list-line td {
    height: 45px;
}
.table-list-line td:not(:nth-last-child(0)) {
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
</style>
