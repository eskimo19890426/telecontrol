<template lang="html">
  <section class="sufan-form no-select">
    <Form ref="form" :model="formData" :rules="formRules" :label-width="100">
      <FormItem>
        <Avatar icon="person" size="large" :src="formData.FaceUrl" />
      </FormItem>
      <FormItem label="登录账号" prop="UserAccount">
        <Input type="text" :disabled="true" v-model="formData.UserAccount" placeholder="登录账号"></Input>
      </FormItem>
      <FormItem label="姓名" prop="RealName">
        <Input type="text" :disabled="true" v-model="formData.RealName" placeholder="姓名"></Input>
      </FormItem>
      <FormItem label="请输入新密码" prop="Password">
        <Input type="password" v-model="formData.Password" placeholder="请输入新密码"></Input>
      </FormItem>
      <FormItem label="确认新密码" prop="ConfirmPassword">
        <Input type="password" v-model="formData.ConfirmPassword" placeholder="确认新密码"></Input>
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
        Password: [{
          type: 'string',
          required: true,
          message: '请输入新密码',
          trigger: 'blur'
        }],
        ConfirmPassword: [{
          type: 'string',
          required: true,
          message: '请输入确认密码',
          trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if (this.formData.Password !== this.formData.ConfirmPassword) {
              callback(new Error('两次输入的密码不一致！'))
            } else {
              callback()
            }
          },
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
      if (this.dataObject.OperationType === 5) {
        code = 'Repassword'
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
