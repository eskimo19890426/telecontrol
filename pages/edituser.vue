<template>
  <div class="container">
    <div class="box">
      <Form 
        ref="form" 
        :model="formData" 
        :rules="formRules" 
        :label-width="100">
        <FormItem 
          label="头像" 
          prop="Picture">
          <Upload
            :before-upload="handleUpload"
            action="">
            <p v-show="!picShow" class="add"><img src="~static/images/add.png"></p>
            <p v-show="picShow" class="pic"><img :src="pictureSrc?pictureSrc:picUrl+formData.Picture"></p>
          </Upload>
        </FormItem>
        <FormItem 
          label="账号" 
          prop="Accounts">
          <Input 
            v-model="formData.Accounts" 
            type="text" maxlength="50"
            placeholder=""></Input>
        </FormItem>
        <FormItem 
          label="昵称" 
          prop="UserName">
          <Input 
            v-model="formData.UserName" 
            type="text" maxlength="50"
            placeholder=""></Input>
        </FormItem>
        <FormItem 
          label="角色" 
          prop="RoleName">
          <Input 
            v-model="formData.RoleName" 
            type="text" maxlength="50"
            placeholder=""></Input>
        </FormItem>
        <FormItem 
          label="控制权" 
          prop="ControlOver">
          <i-switch 
            v-model="formData.ControlOver" 
            :true-value="1"
            :false-value="2"
            @on-change="changeControlOver" />
        </FormItem>
        <FormItem style="text-align:center;">
          <Button class="no" @click="doCancelled()">&nbsp;&nbsp;取消&nbsp;&nbsp;</Button>
          <Button class="yes" @click="doBeforeSubmit('form')">&nbsp;&nbsp;确认&nbsp;&nbsp;</Button>
        </FormItem>
      </Form>
    </div>
    

  </div>
</template>


<script>
import config from '~/app.config.js'
import {
  mapState
} from 'vuex'
export default {
  data() {
    return {
      picShow:false,
      pictureSrc:null,
      userID:'',
      file:null,
      picUrl:null,
      formRules: {
        Accounts: [{
          type: 'string',
          required: true,
          message: '请输入账号',
          trigger: 'blur',
        }, {
          validator: (rule, value, callback) => {
            console.log(this.UserID)
            this.$axios.post('/api/Login/VerificationUserName', {
              Accounts:value,
              UserID:this.userID?this.userID:''
            }).then(rs => {
                if(rs.data.success){
                  callback()
                }else{
                  callback(new Error(rs.data.message))
                }
            })
          },
          trigger: 'blur'
        }],
        ControlOver: [{
          type: 'number',
          required: true,
          message: '请选择控制权',
          trigger: 'blur'
        }],
        RoleName: [{
          type: 'string',
          required: true,
          message: '请输入角色',
          trigger: 'blur'
        }],
        UserName: [{
          type: 'string',
          required: true,
          message: '请输入昵称',
          trigger: 'blur'
        }],
      },
      formData: {
        Accounts: "",
        ControlOver: 2,
        Picture: "",
        RoleName: "",
        UserName: "",
      }
    }
  },
  computed: {
    ...mapState('app', {
      account: 'account'
    })
  },
  mounted() {
    this.picUrl = config.urlhost+'/'
    this.userID= this.$route.query.userID
    this.queryData()
  },
  methods: {
    queryData() {
      if(this.userID){
        this.$Loading.start()
        this.$axios.post('/api/Login/SelectUserInfo', {
            userID:this.userID
        }).then(rs => {
            this.formData = rs.data.data
            if(this.formData.Picture) {
                this.picShow=true
            }
            this.$Loading.finish()
            if (rs.data.success) {
            // this.$Message.success(result.message)
            } else {
            this.$Message.error(rs.data.message)
            }
        })
      }
    },
    handleUpload (file) {
        this.pictureSrc = window.URL.createObjectURL(file)
        this.picShow=true
        this.file = file
        return false
    },
    changeControlOver(status) {
        this.formData.ControlOver= status
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
      if(this.userID) {
        let data = new FormData()
        data.append('file', this.file)
        data.append('UserName', this.formData.UserName)
        data.append('Accounts', this.formData.Accounts)
        data.append('RoleName', this.formData.RoleName)
        data.append('ControlOver', this.formData.ControlOver)
        data.append('Picture', this.formData.Picture)
        data.append('ID', this.userID)
        this.$Loading.start()
        this.$axios2.post('/api/Login/UpdateUser', data).then(rs => {
            this.$Loading.finish()
            if (rs.data.success) {
              this.$Message.success(rs.data.message)
              setTimeout(()=>{this.$router.push('/')}, 1000);
            } else {
              this.$Message.error(rs.data.message)
            }
        })
      }else {
        let data = new FormData()
        data.append('file', this.file)
        data.append('UserName', this.formData.UserName)
        data.append('Accounts', this.formData.Accounts)
        data.append('RoleName', this.formData.RoleName)
        data.append('ControlOver', this.formData.ControlOver)
        this.$Loading.start()
        this.$axios2.post('/api/Login/AddUserInfo', data).then(rs => {
            this.$Loading.finish()
            if (rs.data.success) {
              this.$Message.success(rs.data.message)
              setTimeout(()=>{this.$router.push('/')}, 1000);
            } else {
              this.$Message.error(rs.data.message)
            }
        })
      } 
    },
    doCancelled() {
        this.$router.go(-1)

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
            .add{
                width:3rem;
                height:3rem;
                background-color: #bbb;
                display:flex;
                justify-content: center;
                align-items: center;
                img{
                    width:40%;
                    height:40%;
                }
            }
            .pic{
                width:3rem;
                height:3rem;
                background-color: #f5f5f5;
                display:flex;
                justify-content: center;
                align-items: center;
                img{
                    width:100%;
                    height:100%;
                }

            }

            button{
                width:45%;
                
                color:white;
                border-radius: 1rem;
            }
            .yes{
                background: #05449b;
            }
            .no{
                background: #bbb;
            }

        }



   
}


</style>
