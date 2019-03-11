<template>
<section>
  <div class="sufan-setting">
    <sufan-steps :list="lists"></sufan-steps>
    <div class="sufan-title">
      <div class="title-left">
        项目设置
      </div>
      <div class="title-new clear">
        <div class="clear right">
          <span class="title-new-right color-create"
              style="margin-right: 10px"
              @click="doCreateClick">
            <i class="iconfont">&#xe638;</i>
            <span>新增</span>
          </span>
        </div>
      </div>
    </div>
    <div class="sufuan-list">
      <sufan-list :columns="columns"
          :data="dataRows"
          @doBtnClick="doBtnClick"></sufan-list>
    </div>
    <div class="sufan-footer">
      <Page :total="80"
          show-elevator></Page>
    </div>
  </div>
  <Modal v-model="modelChange"
      title="修改职位"
      :loading="loading"
      @on-ok="doChangeFinish">
    <div>
      <Form :label-width="80">
        <FormItem label="姓名">
          <Input v-model="input"
              placeholder="护士"
              style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="项目">
          <Select v-model="select"
              style="width: 400px;">
               <Option value="beijing">单位一</Option>
               <Option value="shanghai">省立医院</Option>
               <Option value="beijing1">单位二</Option>
               <Option value="shanghai2">省立医院</Option>
               <Option value="beijing3">单位三</Option>
               <Option value="shanghai4">省立医院</Option>
             </Select>
        </FormItem>
        <FormItem label="部门">
          <Select v-model="select"
              style="width: 400px;">
                <Option value="shanghai">护理部</Option>
                <Option value="beijing">住院部</Option>
                <Option value="shanghai4">清洁部</Option>
                <Option value="shanghai5">门诊</Option>
             </Select>
        </FormItem>
        <FormItem label="职务">
          <Select v-model="select"
              style="width: 400px;">
                <Option value="shanghai">护理部</Option>
                <Option value="beijing">住院部</Option>
                <Option value="shanghai4">清洁部</Option>
                <Option value="shanghai5">门诊</Option>
             </Select>
        </FormItem>
        <FormItem label="设备类型">
          <Select v-model="select"
              style="width: 400px;">
                <Option value="shanghai">护理部</Option>
                <Option value="beijing">住院部</Option>
                <Option value="shanghai4">清洁部</Option>
                <Option value="shanghai5">门诊</Option>
             </Select>
        </FormItem>
        <FormItem label="设备类型">
          <Select v-model="select"
              style="width:400px;">
                <Option value="shanghai">护理部</Option>
                <Option value="beijing">住院部</Option>
                <Option value="shanghai4">清洁部</Option>
                <Option value="shanghai5">门诊</Option>
             </Select>
        </FormItem>
        <FormItem label="设备ID">
          <Input v-model="input"
              placeholder="护士"
              style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="剂量率阈值">
          <Select v-model="select"
              style="width: 190px;"
              class="select-right">
                <Option value="shanghai">2018</Option>
                <Option value="beijing">2017</Option>
                <Option value="shanghai4">2016</Option>
                <Option value="shanghai5">2015</Option>
             </Select>
          <Input v-model="input"
              placeholder="输入计量率阈值"
              style="width: 190px;"></Input>
        </FormItem>
        <FormItem label="累积阈值">
          <Select v-model="select"
              style="width: 190px;"
              class="select-right">
                <Option value="shanghai">2018</Option>
                <Option value="beijing">2017</Option>
                <Option value="shanghai4">2016</Option>
                <Option value="shanghai5">2015</Option>
             </Select>
          <Input v-model="input"
              placeholder="输入计量阙值"
              style="width: 190px;"></Input>
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
      lists: [{
        name: '设置',
        path: ''
      }, {
        name: '系统设置',
        path: ''
      }, {
        name: '项目设置',
        path: ''
      }],
      columns: [{
        title: '项目',
        span: 11,
        key: 'project'
      }, {
        title: '操作',
        span: 0,
        buton: [{
          name: '修改',
          color: ''
        }, {
          name: '删除',
          color: 1
        }]
      }],
      dataRows: [{
        project: '项目名称项目名称项目名称'
      }, {
        project: '项目名称项目名称项目名称'
      }, {
        project: '项目名称项目名称项目名称'
      }, {
        project: '项目名称项目名称项目名称'
      }, {
        project: '项目名称项目名称项目名称'
      }, {
        project: '项目名称项目名称项目名称'
      }, {
        project: '项目名称项目名称项目名称'
      }, {
        project: '项目名称项目名称项目名称'
      }]
    }
  },
  mounted() {},
  methods: {
    doChangeFinish() {
      this.modelChange = false
    },
    doSearchClick() {},
    doCreateClick() {
      this.modelChange = true
    },
    doDeleteClick() {
      this.$Modal.confirm({
        title: '删除职位',
        content: '<p>确定要删除所选中的职位吗？删除后将无法恢复</p>',
        onOk: () => {
          this.$Message.info('已删除')
        }
      })
    },
    doBtnClick(value) {
      switch (value.item.name) {
        case '修改':
          this.doChangeClick(value.val)
          break
        default:
      }
    },
    doChangeClick() {
      this.modelChange = true
    }
  }
}
</script>
<style lang="scss" scoped>
.clear::after {
    content: '';
    display: block;
    clear: both;
}
.left {
    float: left;
}
.right {
    float: right;
}
.select-right {
    margin-right: 20px;
}
.sufan-setting {
    padding: 10px 30px 50px 50px;
    box-sizing: border-box;
    .sufuan-list {
        border: 1px solid #EEEEEE;
    }
    .sufan-title {
        padding: 10px 0 15px;
        box-sizing: border-box;
        .title-left {
            height: 30px;
            font-size: 15px;
            color: #6E6A8D;
            padding-left: 10px;
            line-height: 30px;
            border-left: 2px solid #6E6A8D;
        }
        .title-new {
            margin-top: 15px;
            .title-new-left {
                float: left;
                .text-line {
                    line-height: 34px;
                    margin-right: 5px;
                }
                .line {
                    line-height: 32px;
                    padding: 0 3px;
                }
                .line-left {
                    margin-left: 5px;
                }
                .btn-groups {
                    margin-right: 20px;
                }
            }
            .title-new-right {
                float: left;
                display: block;
                padding: 2px 20px 0;
                box-sizing: border-box;
                font-size: 14px;
                text-align: center;
                cursor: pointer;
                i {
                    display: block;
                    float: left;
                    color: #fff;
                    margin: 4px 5px 0 0;
                }
                span {
                    display: block;
                    float: left;
                    color: #fff;
                    line-height: 30px;
                }
            }
            .color-search {
                background: #6D6C8E;
            }
            .color-create {
                background: #B5B0CE;
            }
            .color-delete {
                background: #B5B0CE;
            }
            span:after {
                content: '';
                display: block;
                clear: both;
            }
        }
    }
    .sufan-footer {
        text-align: center;
        margin-top: 40px;
    }
}
</style>
