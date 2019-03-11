<template lang="html">
  <section class="sufan-form no-select">
    <Form ref="form" :model="formData" :rules="formRules" :label-width="100">
      <FormItem label="选择区域" prop="RegionID">
       <sufan-select
         placeholder="当前区域"
         v-model="formData.RegionID"
         url="/api/User/GetData"
         :query-data="{OperationType:9,PageIndex:0,PageSize:5000}"
         :defaultkeys="{name:'RegionName',value:'RegionID'}">
       </sufan-select>
      </FormItem>
      <FormItem label="位置" prop="PositionID">
       <sufan-select
         placeholder="位置"
         v-model="formData.PositionID"
         url="/api/User/GetData"
         :query-data="{OperationType:10,PageIndex:0,PageSize:5000,RegionID:formData.RegionID}"
         :defaultkeys="{name:'PositionName',value:'PositionID'}">
       </sufan-select>
      </FormItem>
      <FormItem label="选择项目" prop="ProjectID">
       <sufan-select
         placeholder="项目名称"
         v-model="formData.ProjectID"
         url="/api/PersonalDev/GetPersonalDevDDL"
         qstype="object"
         :query-data="{OperationType:3,PageIndex:0,PageSize:5000}"
         :defaultkeys="{name:'ProjectName',value:'ProjectID'}">
       </sufan-select>
      </FormItem>
      <FormItem label="设备id" prop="DevNumber">
        <Input type="text" v-model="formData.DevNumber" placeholder="设备id"></Input>
      </FormItem>
      <FormItem label="设备类型" prop="DevType">
        <Input type="text" v-model="formData.DevType" placeholder="设备类型"></Input>
      </FormItem>
      <FormItem label="剂量率阈值" prop="CurrentThreshold">
        <Input type="text" v-model="formData.CurrentThreshold" placeholder="剂量率阈值"></Input>
      </FormItem>
      <FormItem label="累积阈值" prop="SumThreshold">
        <Input type="text" v-model="formData.SumThreshold" placeholder="累积阈值"></Input>
      </FormItem>
      <br>
      <FormItem style="text-align:right;">
        <Button @click="doCancel">取消</Button>&nbsp;&nbsp;
        <Button type="primary" @click="doBeforeSubmit('form')">&nbsp;&nbsp;确定&nbsp;&nbsp;</Button>
      </FormItem>
    </Form>
  </section>
</template>

<script>
export default {
  data() {
    return {
      formRules: {
        RegionID: [{
          required: true,
          message: '请选择区域'
        }],
        ProjectID: [{
          required: true,
          message: '请选择项目'
        }],
        DevNumber: [{
          type: 'string',
          required: true,
          message: '请输入设备id',
          trigger: 'blur'
        }],
        DevType: [{
          type: 'string',
          required: true,
          message: '请输入设备类型',
          trigger: 'blur'
        }],
        PositionID: [{
          required: true,
          message: '请选择位置'
        }],
        CurrentThreshold: [{
          required: true,
          message: '请输入剂量率阈值',
          trigger: 'blur'
        }],
        SumThreshold: [{
          required: true,
          message: '请输入累积阈值',
          trigger: 'blur'
        }]
      },
      formData: {}
    }
  },
  props: {
    dataObject: Object
  },
  watch: {
    dataObject: {
      deep: true,
      immediate: true,
      handler(val) {
        this.initForm()
      }
    },
    'formData.RegionID': {
      deep: true,
      handler() {
        this.$refs['form'].validateField('RegionID')
      }
    },
    'formData.ProjectID': {
      deep: true,
      handler() {
        this.$refs['form'].validateField('ProjectID')
      }
    },
    'formData.PositionID': {
      deep: true,
      handler() {
        this.$refs['form'].validateField('PositionID')
      }
    }
  },
  methods: {
    // 初始化菜单
    initForm() {
      this.formData = {}
      for (let key in this.dataObject) {
        let val = this.dataObject[key]
        this.$set(this.formData, key, val)
      }
      this.formData.CurrentThreshold = String(this.formData.CurrentThreshold)
      this.formData.SumThreshold = String(this.formData.SumThreshold)
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
