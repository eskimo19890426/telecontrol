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
          <div class="clear left btn-groups">
            <div class="left text-line">设备类型:</div>
            <div class="left">
              <Select class="left" v-model="select"
                  style="width: 50px;">
                 <Option value="beijing">类型一</Option>
                 <Option value="shanghai">类型二</Option>
                 <Option value="shenzhen1">类型三</Option>
                 <Option value="shenzhen2">类型四</Option>
               </Select>
            </div>
          </div>
          <div class="clear left btn-groups">
            <div class="left text-line">阙值:</div>
            <div class="left">
              <Input v-model="input"
                  placeholder="护士"
                  style="width: 50px;"></Input>
            </div>
            <div class="left line">-</div>
            <div class="left">
              <Input v-model="input"
                  placeholder="护士"
                  style="width: 50px;"></Input>
            </div>
            <div class="left text-line line-left">μSv/h</div>
          </div>
          <div class="clear left btn-groups">
            <div class="left text-line">部门:</div>
            <div class="left">
              <Select class="left" v-model="select"
                  style="width: 50px;">
                 <Option value="beijing">住院部一</Option>
                 <Option value="shanghai">住院部二</Option>
                 <Option value="shenzhen1">住院部三</Option>
                 <Option value="shenzhen2">住院部四</Option>
               </Select>
            </div>
          </div>
          <div class="clear left btn-groups">
            <div class="left text-line">职务:</div>
            <div class="left">
              <Select class="left" v-model="select"
                  style="width: 50px;">
                 <Option value="beijing">住院部一</Option>
                 <Option value="shanghai">住院部二</Option>
                 <Option value="shenzhen1">住院部三</Option>
                 <Option value="shenzhen2">住院部四</Option>
               </Select>
            </div>
          </div>
          <div class="clear left btn-groups">
            <div class="left text-line">高级筛选:</div>
            <div class="left">
              <Input v-model="input"
                  placeholder="设备ID,项目,名称关键字搜索"
                  style="width: 150px;"></Input>
            </div>
          </div>
        </div>
        <div class="clear right">
          <span class="title-new-right color-search" style="margin-right: 10px" @click="doSearchClick">
            <i class="iconfont">&#xe601;</i>
            <span>查询</span>
          </span>
          <span class="title-new-right color-create" style="margin-right: 10px" @click="doCreateClick">
            <i class="iconfont">&#xe638;</i>
            <span>新增</span>
          </span>
          <span class="title-new-right color-delete" @click="doDeleteClick">
            <i class="iconfont">&#xe659;</i>
            <span>删除</span>
          </span>
        </div>
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
  <Modal v-model="modelChange"
      title="修改职位"
      :loading="loading"
      @on-ok="doChangeFinish">
    <div>
      <Form :model="formItem"
          :label-width="80">
        <FormItem label="区域">
          <Select v-model="formItem.select"
              style="width: '200px';">
               <Option value="beijing">PET/CT</Option>
               <Option value="shanghai">住院部</Option>
               <Option value="shenzhen1">护理部</Option>
               <Option value="shenzhen2">清洁部</Option>
               <Option value="shenzhen3">门诊</Option>
             </Select>
        </FormItem>
        <FormItem label="单位名称">
          <Select v-model="formItem.select"
              style="width: '200px';">
               <Option value="beijing">单位一</Option>
               <Option value="shanghai">省立医院</Option>
               <Option value="beijing1">单位二</Option>
               <Option value="shanghai2">省立医院</Option>
               <Option value="beijing3">单位三</Option>
               <Option value="shanghai4">省立医院</Option>
             </Select>
        </FormItem>
        <FormItem label="部门">
          <Select v-model="formItem.select"
              style="width: '200px';}">
                <Option value="shanghai">护理部</Option>
                <Option value="beijing">住院部</Option>
                <Option value="shanghai4">清洁部</Option>
                <Option value="shanghai5">门诊</Option>
             </Select>
        </FormItem>
        <FormItem label="职位">
          <Input v-model="formItem.input"
              placeholder="护士"
              style="width: '200px';"></Input>
        </FormItem>
      </Form>
    </div>
  </Modal>
</section>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
      loading: false,
      modelChange: false,
      select: '',
      input: '',
      formItem: {},
      lists: [{
        name: '设置',
        path: ''
      }, {
        name: '个人设备管理',
        path: ''
      }],
      columns: [{
        title: '序号',
        span: 0
      }, {
        title: '设备类型',
        span: 0
      }, {
        title: '设备Id',
        span: 4
      }, {
        title: '项目',
        span: 0
      }, {
        title: '部门',
        span: 0
      }, {
        title: '职务',
        span: 0
      }, {
        title: '持有人',
        span: 0
      }, {
        title: '累计阙值',
        span: 0
      }, {
        title: '操作',
        span: 0,
        buton: [{
          name: '修改',
          color: ''
        }]
      }],
      dataRows: [
        [{
          title: '01'
        }, {
          title: '类型1'
        }, {
          title: '192.168.1.2'
        }, {
          title: '省立医院'
        }, {
          title: '住院部'
        }, {
          title: '主任医师'
        }, {
          title: '陈'
        }, {
          title: '2μSv/h'
        }],
        [{
          title: '01'
        }, {
          title: '类型1'
        }, {
          title: '192.168.1.2'
        }, {
          title: '省立医院'
        }, {
          title: '住院部'
        }, {
          title: '主任医师'
        }, {
          title: '陈'
        }, {
          title: '2μSv/h'
        }],
        [{
          title: '01'
        }, {
          title: '类型1'
        }, {
          title: '192.168.1.2'
        }, {
          title: '省立医院'
        }, {
          title: '住院部'
        }, {
          title: '主任医师'
        }, {
          title: '陈'
        }, {
          title: '2μSv/h'
        }], [{
          title: '01'
        }, {
          title: '类型1'
        }, {
          title: '192.168.1.2'
        }, {
          title: '省立医院'
        }, {
          title: '住院部'
        }, {
          title: '主任医师'
        }, {
          title: '陈'
        }, {
          title: '2μSv/h'
        }], [{
          title: '01'
        }, {
          title: '类型1'
        }, {
          title: '192.168.1.2'
        }, {
          title: '省立医院'
        }, {
          title: '住院部'
        }, {
          title: '主任医师'
        }, {
          title: '陈'
        }, {
          title: '2μSv/h'
        }]
      ]
    }
  },
  mounted() {},
  methods: {
    doChangeFinish() {
      this.modelChange = false
    },
    doSearchClick() {
    },
    doCreateClick() {
    },
    doDeleteClick() {
    }
  }
}
</script>
<style lang="scss" scoped>
  .clear::after{
    content: '';
    display: block;
    clear: both;
  }
  .left{
    float: left;
  }
  .right{
    float: right;
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
          .text-line{
            line-height: 34px;
            margin-right: 5px;
          }
          .line{
            line-height: 32px;
            padding: 0 3px;
          }
          .line-left{
            margin-left: 5px;
          }
          .btn-groups{
            margin-right: 20px;
          }
        }
        .title-new-right{
          float: left;
          display: block;
          padding: 3px 20px;
          box-sizing: border-box;
          font-size: 14px;
          text-align: center;
          cursor: pointer;
          i{
            display: block;
            float: left;
            color: #fff;
            margin: 4px 5px 0 0;
          }
          span{
            display: block;
            float: left;
            color: #fff;
            line-height: 30px;
          }
        }
        .color-search{
          background: #6D6C8E;
        }
        .color-create{
          background: #8286B5;
        }
        .color-delete{
          background: #B5B0CE;
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
