<template>
<section>
  <div class="sufan-setting">
    <sufan-steps :list="lists"></sufan-steps>
    <div class="sufan-title">
      <div class="title-left">
        部门及职务管理
      </div>
      <div class="title-new clear">
        <div class="title-new-left">
          <ul>
            <li v-for="item in listTile" :class="{item: item.check}">{{item.name}}<span></span></li>
          </ul>
        </div>
        <span class="title-new-right">
          <i class="iconfont">&#xe638;</i>
          <span>新增</span>
        </span>
      </div>
    </div>
    <div class="sufuan-list">
      <sufan-list :columns="columns"
          :data="dataRows"></sufan-list>
    </div>
    <div class="sufan-footer">
      <Page :total="80" show-elevator></Page>
    </div>
  </div>
</section>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
      listTile: [{
        name: '总部一',
        check: true
      }, {
        name: '总部二',
        check: false
      }],
      lists: [{
        name: '设置',
        path: ''
      }, {
        name: '部门及职务管理',
        path: ''
      }],
      columns: [{
        title: '总部',
        span: 0
      }, {
        title: '分部',
        span: 0
      }, {
        title: '部门',
        span: 0
      }, {
        title: '计量百分比',
        span: 0,
        custom: 'render'
      }, {
        title: '操作',
        span: 0,
        buton: [{
          name: '查看',
          color: ''
        }, {
          name: '修改',
          color: ''
        }, {
          name: '删除',
          color: 1
        }]
      }],
      dataRows: [
        [{
          title: '总部1'
        }, {
          title: '分部1'
        }, {
          title: '住院部'
        }, {
          title: '住院部'
        }],
        [{
          title: '总部1'
        }, {
          title: '分部1'
        }, {
          title: '住院部'
        }, {
          title: '住院部'
        }],
        [{
          title: '总部1'
        }, {
          title: '分部1'
        }, {
          title: '住院部'
        }]
      ]
    }
  },
  mounted() {},
  methods: {

  }
}
</script>
<style lang="scss" scoped>
  .clear::after{
    content: '';
    display: block;
    clear: both;
  }
  .sufan-setting{
    padding: 30px 30px 50px 50px;
    box-sizing: border-box;
    .sufuan-list{
      border: 1px solid #EEEEEE;
    }
    .sufan-title{
      padding: 30px 0 15px;
      box-sizing: border-box;
      .title-left{
        height: 30px;
        font-size: 15px;
        color: #6E6A8D;
        padding-left: 10px;
        line-height: 30px;
        border-left: 2px solid #6E6A8D;
      }
      .title-new{
        margin-top: 30px;
        .title-new-left{
          float: left;
          ul{
            li{
              position: relative;
              cursor: pointer;
              float:left;
              font-size: 15px;
              color: #fff;
              padding: 5px 25px;
              box-sizing: border-box;
              background: #A8A6BC;
              span{
                position: absolute;
                right: -20px;
                top: 0;
                display: block;
                border-top: 16px solid transparent;
                border-bottom: 16px solid transparent;
                border-left: 20px solid #A8A6BC;
                z-index: 9;
              }
            }
            li.item{
              background: #8484A0;
              span{
                border-left: 20px solid #8484A0;
              }
            }
          }
        }
        .title-new-right{
          float: right;
          display: block;
          padding: 3px 15px;
          box-sizing: border-box;
          background: #B5B0CE;
          font-size: 16px;
          text-align: center;
          cursor: pointer;
          i{
            display: block;
            float: left;
            color: #fff;
            margin: 3px 5px 0 0;
          }
          span{
            display: block;
            float: left;
            color: #fff;
            line-height: 30px;
          }
        }
        span:after{
          content: '';
          display: block;
          clear: both;
        }
      }
    }
    .sufan-footer{
      text-align: center;
      margin-top: 40px;
    }
  }
</style>
