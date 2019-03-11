<template lang="html">
  <section class="sufan-form no-select" :class="{fill:bcnavActive==='Position'}">
    <Form ref="Region" :model="formData" :rules="formRulesRegion" :label-width="100" v-show="bcnavActive==='Region'">
      <br><br>
      <FormItem label="区域名称" prop="RegionName">
        <Input type="text" v-model="formData.RegionName" placeholder="区域名称"></Input>
      </FormItem>
      <FormItem label="区域地图" prop="MapPath">
        <div class="map-wrap" v-show="formData.MapPath">
          <img :src="formData.MapPath" alt="">
          <span>点击更换图片</span>
        </div>
        <Upload
          type="drag"
          :action="$config.res.upload"
          accept=".jpg,.png,.jpeg"
          :data="{type:2}"
          :on-success="doUploadSuccess"
          :show-upload-list="false">
          <div style="padding: 50px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或者拖拽上传图片</p>
          </div>
        </Upload>
      </FormItem>
    </Form>
    <Form ref="Position" :model="formData" :rules="formRulesPosition" :label-width="100" v-show="bcnavActive==='Position'">
      <FormItem label="位置名称" prop="PositionName">
        <Input type="text" v-model="formData.PositionName" placeholder="位置名称"></Input>
      </FormItem>
      <FormItem label="位置编号" prop="PositionNumber">
        <Input type="text" v-model="formData.PositionNumber" placeholder="位置编号"></Input>
      </FormItem>
      <FormItem label="区域位置" prop="Proportion">
        <div class="envmap-wrap">
          <sufan-envmap ref="envmap" :data="mapData" @on-collect="doMapCollect"></sufan-envmap>
          <span v-show="!isCollect" class="btn" @click="collect">重新采集位置坐标</span>
        </div>
      </FormItem>
    </Form>
    <Form>
      <FormItem style="text-align:right;">
        <Button @click="doCancel">取消</Button>&nbsp;&nbsp;
        <Button type="primary" @click="doBeforeSubmit(bcnavActive)">&nbsp;&nbsp;确定&nbsp;&nbsp;</Button>
      </FormItem>
    </Form>
  </section>
</template>

<script>
export default {
  data() {
    return {
      formRulesRegion: {
        RegionName: [{
          type: 'string',
          required: true,
          message: '请输入区域名称',
          trigger: 'blur'
        }],
        MapPath: [{
          type: 'string',
          required: true,
          message: '请上传区域位置图',
          trigger: 'blur'
        }]
      },
      formRulesPosition: {
        PositionName: [{
          type: 'string',
          required: true,
          message: '请输入位置名称',
          trigger: 'blur'
        }],
        PositionNumber: [{
          type: 'string',
          required: true,
          message: '请输入位置编号',
          trigger: 'blur'
        }],
        Proportion: [{
          type: 'number',
          required: true,
          message: '请选择位置',
          trigger: 'change'
        }]
      },
      formData: {},
      mapData: {},
      isCollect: false
    }
  },
  props: {
    dataObject: Object,
    bcnavActive: {
      type: String,
      default: 'General'
    }
  },
  watch: {
    dataObject: {
      deep: true,
      immediate: true,
      handler(val) {
        this.initForm()
      }
    },
    'formData.Proportion': {
      deep: true,
      handler() {
        this.$refs['Position'].validateField('Proportion')
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
      this.reloadMap()
      // 判断位置是更新还是新增
      if (this.bcnavActive === 'Position') {
        if (this.formData.PositionName === '' && this.formData.PositionNumber === '') {
          setTimeout(() => {
            this.$refs.envmap.collectStart()
            this.isCollect = true
          }, 500)
        }
      }
    },
    reloadMap() {
      // 初始化地图数据
      this.mapData = {
        // 区域地图
        url: this.formData.MapPath,
        // 位置坐标
        positions: [{
          name: this.formData.PositionName,
          value: this.formData.PositionNumber,
          points: [{
            x: this.formData.LeftTopX,
            y: this.formData.LeftTopY
          }, {
            x: this.formData.RightTopX,
            y: this.formData.RightTopY
          }, {
            x: this.formData.RightBottomX,
            y: this.formData.RightBottomY
          }, {
            x: this.formData.LeftBottomX,
            y: this.formData.LeftBottomY
          }]
        }],
        // 比例
        proportion: this.formData.Proportion,
        // 采集4个点（矩形）
        pointNumber: 4
      }
    },
    // 上传成功
    doUploadSuccess(res, file, files) {
      let result = res
      if (result.Success) {
        this.formData.MapPath = result.Data[0]
      }
    },
    // 地图选中
    doMapCollect(evt) {
      // console.log('设置数据')
      // 设置比例
      this.formData.Proportion = evt.proportion
      // 设置坐标点
      this.formData.LeftTopX = evt.points[0].x
      this.formData.LeftTopY = evt.points[0].y
      this.formData.RightTopX = evt.points[1].x
      this.formData.RightTopY = evt.points[1].y
      this.formData.RightBottomX = evt.points[2].x
      this.formData.RightBottomY = evt.points[2].y
      this.formData.LeftBottomX = evt.points[3].x
      this.formData.LeftBottomY = evt.points[3].y
      // 重载地图
      this.reloadMap()
      this.isCollect = false
      this.$Message.success('采集成功')
    },
    // 收藏
    collect() {
      this.$refs.envmap.collectStart()
      this.isCollect = true
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

    &.fill {
        max-width: 100%;
    }

    .ivu-avatar {
        cursor: pointer;
    }

    .map-wrap {
        height: 191px;
        overflow: hidden;
        position: absolute;
        z-index: 999;
        background: #fff;
        pointer-events: none;

        span {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            background: rgba(47, 47, 47, 0.8);
            padding: 0 8px;
            color: #fff;
            border-radius: 3px;
            font-size: 12px;
        }
    }
    .envmap-wrap {
        overflow: hidden;
        position: relative;
        z-index: 999;
        span.btn {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            background: rgba(47, 47, 47, 0.8);
            padding: 0 8px;
            color: #fff;
            border-radius: 3px;
            font-size: 12px;
            cursor: pointer;
        }
    }
}
</style>
