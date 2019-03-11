<template lang="html">
  <section class="sufan-form no-select">
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
      <FormItem label="设备类型" prop="DevName">
        <Input type="text" v-model="formData.DevName" placeholder="设备类型"></Input>
      </FormItem>
      <FormItem label="设备ID" prop="DevNumber">
        <Input type="text" v-model="formData.DevNumber" placeholder="设备ID"></Input>
      </FormItem>
      <FormItem label="所属项目" prop="ProjectID">
        <sufan-select placeholder="所属项目"
          v-model="formData.ProjectID"
          url="/api/User/GetData"
          :query-data="{OperationType:8,PageIndex:0,PageSize:5000}"
          :defaultkeys="{name:'ProjectName',value:'ProjectID'}">
        </sufan-select>
      </FormItem>
      <FormItem label="部门" prop="DepartID">
        <sufan-select placeholder="部门"
          v-model="formData.DepartID"
          url="/api/User/GetData"
          :query-data="{DropType:3,BranchID:0}"
          :defaultkeys="{name:'DepartName',value:'DepartID'}">
        </sufan-select>
      </FormItem>
      <FormItem label="职务" prop="DutyID">
        <sufan-select placeholder="职务"
          v-model="formData.DutyID"
          url="/api/User/GetData"
          :query-data="{DropType:4,DepartID:formData.DepartID||0}"
          :defaultkeys="{name:'DutyName',value:'DutyID'}">
        </sufan-select>
      </FormItem>
      <FormItem label="拥有者" prop="UserID">
        <sufan-select :placeholder="formData.Owner"
          remoteUrl="/api/User/GetData"
          :remote-query-data="{OperationType:2,PageIndex:0,PageSize:5000}"
          :defaultkeys="{name:'RealName',value:'UserID',searchkey:'StrWhere',OperationType:2,PageSize:5000,PageIndex:0}"
          :remote="true"
          @on-change="doOwnerChange">
        </sufan-select>
      </FormItem>
      <FormItem label="当前阈值" prop="SumThreshold">
        <Input type="text" v-model="formData.SumThreshold" placeholder="当前阈值"></Input>
      </FormItem>
      <FormItem label="累计阈值" prop="CurrentThreshold">
        <Input type="text" v-model="formData.CurrentThreshold" placeholder="实际阈值"></Input>
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
        DevName: [{
          type: 'string',
          required: true,
          message: '请输入设备类型',
          trigger: 'blur'
        }],
        DevNumber: [{
          type: 'string',
          required: true,
          message: '请输入设备ID',
          trigger: 'blur'
        }],
        ProjectID: [{
          type: 'number',
          required: true,
          message: '请选择项目',
          trigger: 'blur'
        }],
        DepartID: [{
          type: 'number',
          required: true,
          message: '请选择部门',
          trigger: 'blur'
        }],
        DutyID: [{
          type: 'number',
          required: true,
          message: '请选择职务',
          trigger: 'blur'
        }],
        UserID: [{
          type: 'number',
          required: true,
          message: '请选择设备的拥有者',
          trigger: 'blur'
        }],
        SumThreshold: [{
          pattern: /^\d+(\.\d+)?$/,
          required: true,
          message: '请输入当前阈值',
          trigger: 'blur'
        }],
        CurrentThreshold: [{
          pattern: /^\d+(\.\d+)?$/,
          required: true,
          message: '请输入剂量实时率',
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
    'formData.ProjectID': {
      deep: true,
      handler(val) {
        console.log(val)
        // this.$refs['form'].validateField('ProjectID')
      }
    },
    'formData.RegionID': {
      deep: true,
      handler(val) {
        // this.$refs['form'].validateField('RegionID')
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
      if (!this.formData.FaceUrl) {
        this.$set(this.formData, 'FaceUrl', '')
        // 默认头像
        setTimeout(() => {
          this.formData.DevNumber = Date.now()
          if (this.$refs.defaultFaceUrl) {
            this.formData.FaceUrl = this.$refs.defaultFaceUrl.getAttribute('src') || ''
          }
        }, 0)
      }
    },
    // 选中用户改变
    doOwnerChange(item) {
      this.formData.Owner = item.label
      this.formData.UserID = item.value
      this.$refs['form'].validateField('UserID')
      console.log(this.formData)
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
        } else {
          this.$Message.error('请填写完整！')
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
    // 上传成功
    doUploadSuccess(res, file, list) {
      if (res.Success) {
        this.formData.FaceUrl = res.Data[0]
        console.log('上传文件成功-' + this.formData.FaceUrl)
      } else {
        this.$Message.warning(res.Message)
      }
    },
    // 上传进度控制
    doUploadProgress() {}
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
