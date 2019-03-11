<template lang="html">
<section class="sufan-register">
  <div class="register-title">
    <span>新用户注册</span>
  </div>
  <div class="sufan-box" v-iscroll>
    <div class="sufna-form">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="用 户 名:" prop="UserAccount">
          <Input v-model="formValidate.UserAccount" placeholder="请输入用户名"></Input>
        </FormItem>
        <FormItem label="姓  名" prop="RealName">
          <Input v-model="formValidate.RealName" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="性  别" prop="Sexy">
          <RadioGroup v-model="formValidate.Sexy">
            <Radio label="1">男</Radio>
            <Radio label="2" style="margin-left:40px;">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="权  限" prop="RoleID">
          <Select v-model="formValidate.RoleID" placeholder="请选择权限">
            <Option :value="item.RoleID" v-for="(item, index) in roleDataRows" :key="index">{{item.RoleName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="部  门" prop="DepartID">
          <Select v-model="formValidate.DepartID" placeholder="请输入部门">
            <Option :value="item.DepartID" v-for="(item, index) in departData" :key="index">{{item.DepartName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="职  务" prop="DutyID">
          <Select v-model="formValidate.DutyID" placeholder="请输入职务">
            <Option :value="item.DutyID" v-for="(item, index) in dutyData" :key="index">{{item.DutyName}}</Option>
          </Select>
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
        <FormItem label="邮  箱" prop="Email">
          <Input v-model="formValidate.Email" placeholder="请输入邮箱"></Input>
        </FormItem>
        <FormItem label="密码" prop="Password">
          <Input type="password" v-model="formValidate.Password" placeholder="请输密码"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="ConfirmPassword">
          <Input type="password" v-model="formValidate.ConfirmPassword" placeholder="请确认密码"></Input>
        </FormItem>
        <FormItem label="头像" prop="FaceUrl">
          <div class="upload-img">
            <Upload :action="$config.res.upload"
              :show-upload-list="false"
              :on-progress="uploadProgress"
              :on-success="uploadSuccess"
              :data="{type:1}">
              <div class="upload-btn">
                <Icon type="camera" size="20"></Icon>
              </div>
            </Upload>
          </div>
          <div class="img-show">
            <img :src="this.formValidate.FaceUrl" alt="">
          </div>
        </FormItem>
    </Form>
    <div class="register-bnt">
      <span @click="doRegisterClick">注册</span>
      <router-link to="/user/login"><p>返回登录页面</p></router-link>
    </div>
    </div>
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
      roleDataRows: [],
      departData: [],
      dutyData: [],
      formValidate: {
        UserAccount: '',
        RealName: '',
        Sexy: '1',
        RoleID: '',
        DepartID: '',
        DutyID: '',
        Mobile: '',
        Email: '',
        // SmsCode: '',
        Password: '',
        FaceUrl: '',
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
        Email: [{
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        }],
        Sexy: [{
          required: true,
          message: '请选择性别',
          trigger: 'blur'
        }],
        RoleID: [{
          required: true,
          message: '请选择权限'
        }],
        DepartID: [{
          required: true,
          message: '请选择部门'
        }],
        DutyID: [{
          required: true,
          message: '请选择职务'
        }],
        FaceUrl: [{
          required: true,
          message: '请上传头像',
          trigger: 'blur'
        }],
        Mobile: [{
          required: true,
          validator: mobilePhone,
          trigger: 'blur'
        }],
        // SmsCode: [{
        //   required: true,
        //   message: '请输入验证码',
        //   trigger: 'blur'
        // }],
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
    this.querytUserData()
    this.querytUserDepart()
    this.querytUserDuty()
  },
  methods: {
    querytUserData() { // 请求权限列表
      let params = [{
        OperationType: 1,
        PageIndex: 1,
        PageSize: 1000
      }]
      this.$axios.post('/api/User/GetData', {
        queryData: JSON.stringify(params)
      }).then(rs => {
        this.roleDataRows = rs.data.Data.RetrunObjectData
      })
    },
    querytUserDepart() { //  请求部门列表
      let params = [{
        OperationType: 5,
        PageIndex: 1,
        PageSize: 30
      }]
      this.$axios.post('/api/User/GetData', {
        queryData: JSON.stringify(params)
      }).then(rs => {
        this.departData = rs.data.Data.RetrunObjectData
      })
    },
    querytUserDuty() { //  请求职务列表
      let params = [{
        OperationType: 6,
        PageIndex: 1,
        PageSize: 30
      }]
      this.$axios.post('/api/User/GetData', {
        queryData: JSON.stringify(params)
      }).then(rs => {
        console.log(rs)
        this.dutyData = rs.data.Data.RetrunObjectData
      })
    },
    // 图片上传成功
    uploadSuccess(res, file, list) {
      if (res.Success) {
        this.$Message.info(res.Message)
        this.formValidate.FaceUrl = res.Data[0]
      } else {
        this.$Message.info(res.Message)
      }
      this.$emit('loading', false)
    },
    // 图片上传中
    uploadProgress(event) {
      this.$emit('loading', true)
      // console.log(event)
    },
    // 发送验证码
    sendCode() {
      this.$refs.formValidate.validateField('Mobile', (valid) => {
        if (!valid) {
          let params = {}
          params.Mobile = this.formValidate.Mobile
          params.Type = 1
          this.$axios.post('/api/User/SendSms', {
            UsersData: JSON.stringify([params])
          }).then(rs => {
            if (rs.data.Success) {
              this.$Message.info(rs.data.Message)
            } else {
              this.$Message.info(rs.data.Message)
            }
            console.log(rs)
          })
        }
      })
    },
    // 注册
    doRegisterClick() {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.$axios.post('/api/User/Register', {
            UsersData: JSON.stringify([this.formValidate])
          }).then(rs => {
            if (rs.data.Success) {
              this.$Message.info(rs.data.Message)
              this.$router.push('/user/login')
            } else {
              this.$Message.info(rs.data.Message)
            }
          })
        }
      })
    }
  },
  watch: {
    'formValidate.RoleID' (val) {
      console.log(val)
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
.sufan-box {
    position: relative;
    overflow: hidden;
    height: calc(100vh - 170px);
}
.register-bnt {
    padding: 0 10% 5% 12%;

    span {
        cursor: pointer;
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
.upload-btn {
    width: 58px;
    height: 58px;
    line-height: 58px;
    text-align: center;
    cursor: pointer;
    border: 1px dashed #dddee1;
}
.upload-img {
    display: block;
    float: left;
}
.img-show {
    display: block;
    float: left;
    width: 58px;
    height: 58px;
    overflow: hidden;
    border-radius: 4px;
    margin-top: 5px;
    margin-left: 15px;
    img {
        width: 100%;
    }
}
</style>
