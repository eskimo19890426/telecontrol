<template lang="html">
  <section class="sufan-form no-select">
    <Form ref="form" :model="formData" :rules="formRules" :label-width="100">
      <FormItem label="权限组名称" prop="RoleName">
        <Input type="text" v-model="formData.RoleName" placeholder="权限组名称"></Input>
      </FormItem>
      <FormItem label="拥有栏目" prop="MenuIDs">
        <div v-iscroll style="max-height:300px;">
          <sufan-tree
            url="/api/User/GetPermissions"
            v-model="menuSelectedRows"
            :defaultkeys="{name:'MenuName',value:'MenuID',children: 'Children'}"
            :selectkeys="formData.MenuIDs"
          >
          </sufan-tree>
        </div>
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
        RoleName: [{
          type: 'string',
          required: true,
          message: '请输入权限组名称',
          trigger: 'blur'
        }],
        MenuIDs: [{
          type: 'string',
          required: true,
          message: '请选择权限组拥有的栏目',
          trigger: 'change'
        }]
      },
      formData: {},
      menuSelectedRows: []
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
    menuSelectedRows: {
      deep: true,
      handler(val) {
        if (val.length === 0 && this.formData.MenuIDs === '') {
          return
        }
        let str = ''
        for (let item of val) {
          str += item.value + ','
        }
        this.formData.MenuIDs = str.substr(0, str.length - 1)
        // 验证
        this.$refs['form'].validateField('MenuIDs')
        console.log('获取到的menuid', this.formData.MenuIDs)
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
      console.log('init form', this.formData)
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
