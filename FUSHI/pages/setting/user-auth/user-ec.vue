<template lang="html">
  <section class="sufan-form no-select">
    <!-- 裁减头像 -->
    <!-- <sufan-cropper ref="cropper"
      :img="croppyopt.img"
      :outputSize="croppyopt.size"
      :outputType="croppyopt.outputType"
      :aspectRatio="1/1"
      :checkCrossOrigin="true"
      :checkOrientation="false"
      :minContainerWidth="200"
      :minContainerHeight="200"
      :autoCropWidth="200"
      :autoCropHeight="200"
      :minCropBoxWidth="200"
      :minCropBoxHeight="200"
      :zoomOnWheel="true"
      :zoomable="true"
      :scalable="true"
      :autoCrop="true"
      :info="true"
      :fixed="true"></sufan-cropper> -->
    <!-- 裁减头像 -->
    <!-- 默认头像 -->
    <img src="~static/images/default_face_url.jpg" style="display:none;" ref="defaultFaceUrl" alt="">
    <Form ref="form" :model="formData" :rules="formRules" :label-width="70">
      <FormItem>
        <Upload :action="$config.res.upload"
            :show-upload-list="false"
            :on-progress="doUploadProgress"
            :on-success="doUploadSuccess"
            :data="{type:1}">
          <Avatar icon="person" size="large" :src="formData.FaceUrl" />
        </Upload>
      </FormItem>
      <FormItem label="登录账号" prop="UserAccount">
        <Input type="text" v-model="formData.UserAccount" placeholder="登录账号"></Input>
      </FormItem>
      <FormItem label="姓名" prop="RealName">
        <Input type="text" v-model="formData.RealName" placeholder="姓名"></Input>
      </FormItem>
      <FormItem label="性别">
        <Select v-model="formData.Sexy" placeholder="性别">
          <Option value="1" key="1">男</Option>
          <Option value="2" key="2">女</Option>
          <Option value="0" key="0">保密</Option>
        </Select>
      </FormItem>
      <FormItem label="权限组" prop="RoleID">
        <sufan-select
          placeholder="权限组"
          v-model="formData.RoleID"
          url="/api/User/GetData"
          :query-data="{DropType:5}"
          :defaultkeys="{name:'RoleName',value:'RoleID'}">
        </sufan-select>
      </FormItem>
      <FormItem label="部门" prop="DepartID">
        <sufan-select
          placeholder="部门"
          v-model="formData.DepartID"
          url="/api/User/GetData"
          :query-data="{DropType:3,BranchID:0}"
          :defaultkeys="{name:'DepartName', value:'DepartID'}">
        </sufan-select>
      </FormItem>
      <FormItem label="职务" prop="DutyID">
        <sufan-select
          placeholder="职务"
          v-model="formData.DutyID"
          url="/api/User/GetData"
          :query-data="{DropType:4,DepartID:this.formatDepartID()}"
          :defaultkeys="{name:'DutyName',value:'DutyID'}">
        </sufan-select>
      </FormItem>
      <FormItem label="手机号" prop="Mobile">
        <Input type="text" v-model="formData.Mobile" placeholder="手机号"></Input>
      </FormItem>
      <FormItem label="邮箱" prop="Email">
        <Input type="email" v-model="formData.Email" placeholder="邮箱"></Input>
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
        UserAccount: [{
          required: true,
          message: '请输入登录账号',
          trigger: 'blur'
        }],
        RealName: [{
          type: 'string',
          required: true,
          message: '请输入正确的姓名',
          trigger: 'blur'
        }],
        Sexy: [],
        RoleID: [{
          type: 'number',
          required: true,
          message: '请选择权限组',
          trigger: 'change'
        }],
        DepartID: [{
          type: 'number',
          required: true,
          message: '请选择部门',
          trigger: 'change'
        }],
        DutyID: [{
          type: 'number',
          required: true,
          message: '请选择职务',
          trigger: 'change'
        }],
        Mobile: [{
          required: true,
          pattern: /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/,
          message: '请填写正确的手机号',
          trigger: 'blur'
        }],
        Email: [{
          type: 'email',
          message: '请输入正确的邮箱',
          trigger: 'blur'
        }]
      },
      formData: {
        DepartID: ''
      }
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
    'formData.RoleID': {
      deep: true,
      handler(val) {
        this.$refs['form'].validateField('RoleID')
      }
    },
    'formData.DepartID': {
      deep: true,
      handler(val) {
        this.$refs['form'].validateField('DepartID')
        this.$set(this.formData, 'DutyID', '')
      }
    },
    'formData.DutyID': {
      deep: true,
      handler(val) {
        this.$refs['form'].validateField('DutyID')
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
      // 默认头像
      setTimeout(() => {
        if (this.$refs.defaultFaceUrl) {
          this.formData.FaceUrl = this.$refs.defaultFaceUrl.getAttribute('src') || ''
        }
        console.log('init form', this.formData)
      }, 0)
    },
    // 裁减头像
    doCutAvatar() {
      // 裁减头像
      // try {
      //   this.uploading = true
      //   this.$refs.cropper.getCropData(base64 => {
      //     this.$axios.post(this.$config.res.uploadBase64, {
      //       file: base64
      //     }).then(rs => {
      //       this.formData.LessonPictureGuid = rs.data.Guid
      //       this.imgUrl = `${rs.data.Guid}`
      //       this.uploading = false
      //       this.cutModal = false
      //     })
      //   })
      // } catch (e) {
      //   this.$Message.error('图片上传错误！')
      //   this.uploading = false
      //   this.cutModal = false
      // }
    },
    // 上传进度控制
    doUploadProgress() {
      // TODO: 上传进度控制
    },
    // 上传成功
    doUploadSuccess(res, file, list) {
      if (res.Success) {
        this.formData.FaceUrl = res.Data[0]
        console.log('上传文件成功-' + this.formData.FaceUrl)
      } else {
        this.$Message.warning(res.Message)
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
    },
    formatDepartID() {
      if (this.formData.DepartID === undefined) {
        this.formData.DepartID = ''
      }
      console.log(this.formData.DepartID, 'formatDepartID')

      return this.formData.DepartID
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
