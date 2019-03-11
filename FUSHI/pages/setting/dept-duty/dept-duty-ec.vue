<template lang="html">
  <section class="sufan-form no-select">
    <Form ref="General" :model="formData" :rules="formRulesGeneral" :label-width="100" v-show="bcnavActive==='General'">
      <br><br>
      <FormItem label="总部名称" prop="GeneralName">
        <Input type="text" v-model="formData.GeneralName" placeholder="总部名称"></Input>
      </FormItem>
    </Form>
    <Form ref="Branch" :model="formData" :rules="formRulesBranch" :label-width="100" v-show="bcnavActive==='Branch'">
      <br><br>
      <FormItem label="分部名称" prop="BranchName">
        <Input type="text" v-model="formData.BranchName" placeholder="分部名称"></Input>
      </FormItem>
    </Form>
    <Form ref="Depart" :model="formData" :rules="formRulesDepart" :label-width="100" v-show="bcnavActive==='Depart'">
      <br><br>
      <FormItem label="部门名称" prop="DepartName">
        <Input type="text" v-model="formData.DepartName" placeholder="部门名称"></Input>
      </FormItem>
    </Form>
    <Form ref="Duty" :model="formData" :rules="formRulesDuty" :label-width="100" v-show="bcnavActive==='Duty'">
      <br><br>
      <FormItem label="职务名称" prop="DutyName">
        <Input type="text" v-model="formData.DutyName" placeholder="职务名称"></Input>
      </FormItem>
    </Form>
    <br><br>
    <Form>
      <FormItem style="text-align:right;">
        <Button @click="doCancel">取消</Button>&nbsp;&nbsp;
        <Button type="primary" @click="doBeforeSubmit(bcnavActive)">&nbsp;&nbsp;确定&nbsp;&nbsp;</Button>
      </FormItem>
    </Form>
  </section>
</template>

<script>
export default {
  data() {
    return {
      formRulesGeneral: {
        GeneralName: [{
          type: 'string',
          required: true,
          message: '请输入总部名称',
          trigger: 'blur'
        }]
      },
      formRulesBranch: {
        BranchName: [{
          type: 'string',
          required: true,
          message: '请输入分部名称',
          trigger: 'blur'
        }]
      },
      formRulesDepart: {
        DepartName: [{
          type: 'string',
          required: true,
          message: '请输入部门名称',
          trigger: 'blur'
        }]
      },
      formRulesDuty: {
        DutyName: [{
          type: 'string',
          required: true,
          message: '请输入职务名称',
          trigger: 'blur'
        }]
      },
      formData: {}
    }
  },
  props: {
    dataObject: Object,
    bcnavActive: {
      type: String,
      default: 'General'
    }
  },
  watch: {
    dataObject: {
      deep: true,
      immediate: true,
      handler(val) {
        this.initForm()
      }
    }
  },
  methods: {
    // 初始化菜单
    initForm() {
      this.formData = {}
      for (let key in this.dataObject) {
        this.$set(this.formData, key, this.dataObject[key])
      }
    },
    // 取消
    doCancel() {
      this.$emit('on-cancel', false)
    },
    // 提交前操作
    doBeforeSubmit(name) {
      // 表单验证
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.doSubmit()
        }
      })
    },
    // 提交
    doSubmit() {
      let code = null
      if (this.dataObject.OperationType === 1) {
        code = 'Create'
      }
      if (this.dataObject.OperationType === 2) {
        code = 'Update'
      }
      if (!code) {
        this.$Message.warning('操作类型不能为空!')
        return
      }
      // 动态监听表单一旦改变就提交
      this.$emit('on-submit', {
        code: code,
        data: this.formData
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sufan-form {
    position: relative;
    max-width: 400px;
    margin: auto;

    .ivu-avatar {
        cursor: pointer;
    }
}
</style>
