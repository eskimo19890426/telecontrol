<template lang="html">
  <section class="sufan-form no-select">
    <Form ref="form" :model="formData" :rules="formRules" :label-width="70">
      <FormItem label="IP地址" prop="IpAddr">
        <Input type="text" v-model="formData.IpAddr" placeholder="IP地址"></Input>
      </FormItem>
      <FormItem label="端口" prop="Port">
        <Input type="text" v-model="formData.Port" placeholder="端口" :disabled="editStatus"></Input>
      </FormItem>
      <!-- <FormItem label="所属项目" prop="ProjectID">
        <sufan-select
          placeholder="所属项目"
          v-model="formData.ProjectID"
          url="/api/User/GetData"
          :query-data="{OperationType:8,PageIndex:0,PageSize:5000}"
          :defaultkeys="{name:'ProjectName',value:'ProjectID'}">
        </sufan-select>
      </FormItem> -->
      <FormItem label="区域" prop="RegionID">
        <sufan-select
          placeholder="区域"
          v-model="formData.RegionID"
          url="/api/User/GetData"
          :query-data="{OperationType:9,PageIndex:0,PageSize:5000}"
          :defaultkeys="{name:'RegionName',value:'RegionID'}">
        </sufan-select>
      </FormItem>
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
        IpAddr: [{
          type: 'string',
          required: true,
          pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
          message: '请输入服务器IP地址',
          trigger: 'blur'
        }],
        Port: [{
          required: true,
          pattern: /^[0-9]*$/,
          message: '请输入服务器端口',
          trigger: 'blur'
        }],
        // ProjectID: [{
        //   type: 'number',
        //   required: true,
        //   message: '请选择项目',
        //   trigger: 'blur'
        // }],
        RegionID: [{
          type: 'number',
          required: true,
          message: '请选择项目区域',
          trigger: 'blur'
        }]
      },
      formData: {}
    }
  },
  props: {
    dataObject: Object,
    editStatus: Boolean
  },
  watch: {
    dataObject: {
      deep: true,
      immediate: true,
      handler(val) {
        this.initForm()
      }
    },
    // 'formData.ProjectID': {
    //   deep: true,
    //   handler(val) {
    //     this.$refs['form'].validateField('ProjectID')
    //   }
    // },
    'formData.RegionID': {
      deep: true,
      handler(val) {
        this.$refs['form'].validateField('RegionID')
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
