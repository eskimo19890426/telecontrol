<template>
  <div class="container">
    <div class="box">
      <Form 
        ref="form" 
        :model="formData" 
        :rules="formRules" 
        :label-width="100">
        <FormItem 
          label="原密码" 
          prop="OldPassword">
          <Input 
            v-model="formData.OldPassword" 
            type="password" maxlength="50"
            placeholder=""></Input>
        </FormItem>
        <FormItem 
          label="新密码" 
          prop="Password">
          <Input 
            v-model="formData.Password" 
            type="password" maxlength="50"
            placeholder=""></Input>
        </FormItem>
        <FormItem 
          label="确认新密码" 
          prop="ConfirmPassword">
          <Input 
            v-model="formData.ConfirmPassword" 
            type="password" maxlength="50"
            placeholder=""></Input>
        </FormItem>
        <FormItem style="text-align:center;">
          <Button @click="doBeforeSubmit('form')">&nbsp;&nbsp;确定&nbsp;&nbsp;</Button>
        </FormItem>
      </Form>
    </div>
    

  </div>
</template>


<script>
import {
  mapState
} from 'vuex'
export default {
  data() {
    return {
        formRules: {
        OldPassword: [{
          type: 'string',
          required: true,
          message: '请输入原密码',
          trigger: 'blur'
        }],
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
  computed: {
    ...mapState('app', {
      account: 'account'
    })
  },
  mounted() {
      
  },
  methods: {
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
      
      this.$Loading.start()
      this.$axios.post('/api/Login/UpDatePassword', {
        UserID:this.account.ID,
        OldPassword:this.formData.OldPassword,
        NewPassword:this.formData.Password
      }).then(rs => {
        this.$Loading.finish()
        console.log(rs, 'rs')
        if (rs.data.success) {
          this.$Message.success(rs.data.message)
          setTimeout(()=>{this.$router.push('/')}, 1000);
        } else {
          this.$Message.error(rs.data.message)
        }
      })
    }


  }
}
</script>


<style lang="scss" scoped>
.container{
    padding-top:8vh;
    width:100%;
    height: 92vh;

        .box{
            width:90%;
            margin: 2rem auto;
            text-align: left;

            button{
                width:100%;
                background: #05449b;
                color:white;
                border-radius: 0.4rem;
            }

        }



   
}


</style>
