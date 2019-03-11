<template lang="html">
  <section class="sufan-repassword">
    <div class="register-title">
      <span>忘记密码</span>
    </div>
    <div class="sufna-form">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="用 户 名:" prop="UserAccount">
            <Input v-model="formValidate.UserAccount" placeholder="请输入用户名"></Input>
        </FormItem>
        <FormItem label="姓  名" prop="RealName">
            <Input v-model="formValidate.RealName" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="手机号码:" prop="Mobile">
            <Input v-model="formValidate.Mobile" placeholder="请输入注册时填写的手机号"></Input>
        </FormItem>
        <!-- <FormItem label="验 证 码:" prop="SmsCode">
            <Row>
                <Col span="18">
                    <Input v-model="formValidate.SmsCode" placeholder="输入手机收到的验证码"></Input>
                </Col>
                <Col span="6">
                    <Button type="primary" @click="sendCode()" style="margin-left: 8px;width:94%;" >
                        <span>发送验证码</span>
                    </Button>
                </Col>
            </Row>
        </FormItem> -->
        <FormItem label="密码" prop="Password">
            <Input type="password" v-model="formValidate.Password" placeholder="请输密码"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="ConfirmPassword">
            <Input type="password" v-model="formValidate.ConfirmPassword" placeholder="请确认密码"></Input>
        </FormItem>
    </Form>
    </div>
    <div class="register-bnt">
      <span @click="doRegisterClick">确定</span>
      <p>返回登录页面</p>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'onlyheader',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.formValidate.ConfirmPassword !== '') {
          // 对第二个密码框单独验证
          this.$refs.formValidate.validateField('ConfirmPassword')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('两次密码不一致'))
      } else if (value !== this.formValidate.Password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    const mobilePhone = (rule, value, callback) => {
      let rep = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!rep.test(value)) {
        callback(new Error('请输入正确的手机号密码'))
      } else {
        callback()
      }
    }
    return {
      formValidate: {
        OperationType: 4,
        UserAccount: '',
        RealName: '',
        Mobile: '',
        // SmsCode: '',
        Password: '',
        ConfirmPassword: ''
      },
      ruleValidate: {
        UserAccount: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        RealName: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        // SmsCode: [{
        //   required: true,
        //   message: '请输入验证码',
        //   trigger: 'blur'
        // }],
        Mobile: [{
          required: true,
          validator: mobilePhone,
          trigger: 'blur'
        }],
        Password: [{
          required: true,
          validator: validatePass,
          trigger: 'blur'
        }],
        ConfirmPassword: [{
          required: true,
          validator: validatePassCheck,
          trigger: 'blur'
        }]
      }
    }
  },
  mounted() {
  },
  methods: {
    doRegisterClick() {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.$axios.post('/api/User/OperationUser', {
            UsersData: JSON.stringify([this.formValidate])
          }).then(rs => {
            console.log(rs)
            if (rs.data.Success) {
              this.$Message.info(rs.data.Message)
            } else {
              this.$Message.info(rs.data.Message)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.register-title {
    font-size: 24px;
    font-weight: 500;
    padding: 15px;
    text-align: center;
    color: #666666;
}
.sufna-form {
    padding: 15px 28%;
}
.register-bnt {
    padding: 0 30% 5% 32%;

    span {
        border: 1px solid #6d6b8d;
        font-size: 16px;
        text-align: center;
        padding: 8px;
        border-radius: 25px;
        width: 100%;
        background: #6d6b8d;
        color: #fff;
        // margin-bottom: 10px;
        display: block;
    }
    p {
        margin-top: 20px;
        border: 1px solid #e7e7e7;
        font-size: 16px;
        text-align: center;
        padding: 8px;
        border-radius: 25px;
        width: 100%;
        background: #e7e7e7;
        color: #fff;
    }
}
</style>
