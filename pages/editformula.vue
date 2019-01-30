<template>
  <div class="container">
    <div class="box">
      <Form ref="form" :model="formData" :rules="formRules">
        <div class="info">
            <div class="title"><span class="span1">配方名称</span><div style="clear:both;"></div></div>
                
            <FormItem prop="FormulaName">
              <Input 
                v-model="formData.FormulaName" 
                type="text" 
                placeholder="输入配方名称"></Input>
            </FormItem>
            <div class="clearfloat"></div>
        </div>

        <div class="info">
            <div class="title"><span class="span1">位置</span><div style="clear:both;"></div></div>
                
            <FormItem prop="FormulaContent">
              <CheckboxGroup v-model="formData.FormulaContent">
                <template v-for="item in this.modellist">
                  <span :key="item.code" style="width:100%;display: block;">
                    <Checkbox v-if="item.name" :label="item.code" :key="item.code">{{item.name}}</Checkbox>
                    <Checkbox v-else :label="item.code" :key="item.code">{{item.code}}</Checkbox>
                  </span>
                </template>
              </CheckboxGroup>
            </FormItem>
            <div class="clearfloat"></div>
        </div>
        
        <FormItem style="text-align:center;">
          <Button class="yes" @click="doBeforeSubmit('form')">&nbsp;&nbsp;保存配方&nbsp;&nbsp;</Button>
          <Button v-if="id" class="no" @click="doCancelled()">&nbsp;&nbsp;删除配方&nbsp;&nbsp;</Button>
        </FormItem>
      </Form>
    </div>
    

  </div>
</template>


<script>
import {
  mapState
} from 'vuex'
import config from '~/app.config.js'
export default {
  data() {
    return {
      id:"",
      formRules: {
        FormulaName: [{
          type: 'string',
          required: true,
          message: '请输入配方名称',
          trigger: 'blur'
        }],
        FormulaContent: [{
          type: 'array',
          required: true,
          message: '请选择位置',
          trigger: 'blur'
        }],
      },
      formData: {
        FormulaName: "",
        FormulaContent: [],
      },
      namelist:[
          "一号机柜|位置一",
          "一号机柜|位置二",
          "二号机柜|位置一",
          "二号机柜|位置二",
          "三号机柜|位置一",
          "三号机柜|位置二",
          "三号机柜|位置三",
          "四号机柜|位置一",
          "四号机柜|位置二",
          "五号机柜|位置一",
          "五号机柜|位置二",
          "五号机柜|位置三",
          "五号机柜|位置四",
        ]
    }
  },
  computed: {
    ...mapState('app', {
      account: 'account'
    }),
    modellist: function(){
      let result = []
      let positionlist = config.position
      let templist = this.namelist
      for(let i =0;i<13;i++){
        result.push({
          "name":positionlist[i],
          "code":templist[i]
        })
      }
      return result
    },
    mapist: function(){
      let result = {}
      let positionlist = config.position
      let templist = this.namelist
      for(let i =0;i<13;i++){
        result[templist[i]]=positionlist[i]
      }
      return result
    }
  },
  mounted() {
    this.id= this.$route.query.id
    this.queryData()
    
  },
  created() {
    
  },
  methods: {
    queryData() {
      if(this.id){
        this.$Loading.start()
        this.$axios.post('/api/Formula/GetFormulaInfo', {
            FormulaID:this.id
        }).then(rs => {
            this.formData.FormulaName = rs.data.data[0].FormulaName
            this.formData.FormulaContent = rs.data.data[0].FormulaContent
            this.formData.ID = rs.data.data[0].ID
            console.log(this.formData)
            if(this.formData.FormulaContent) {
                this.formData.FormulaContent = this.formData.FormulaContent.split(';').slice(0,-1)
                // let templist=[]
                // for(let i=0;i<this.formData.FormulaContent.length;i++){
                //   templist.push(this.mapped(this.formData.FormulaContent[i]))
                // }
                // this.formData.FormulaContent=templist
            }
            this.$Loading.finish()
            if (rs.data.success) {
              this.$Message.success(rs.data.message)
            } else {
              this.$Message.error(rs.data.message)
            }
        })
      }
    },
    changeControlOver(status) {
        this.formData.ControlOver= status
    },
    // 提交前操作
    doBeforeSubmit(name) {
      console.log(this.formData)
      // 表单验证
      this.$refs[name].validate((valid) => {
        if (valid) {
          console.log(this.formData)
          this.doSubmit()
        }
      })
    },
    // 提交
    doSubmit() {
      if(this.id) {
        this.$Loading.start()
        this.$axios.post('/api/Formula/UpDateFormula', {
          'FormulaName': this.formData.FormulaName,
          'FormulaContent': this.formData.FormulaContent.join(';')+";",
          'ID': this.id
        }).then(rs => {
            this.$Loading.finish()
            if (rs.data.success) {
              this.$Message.success(rs.data.message)
              setTimeout(()=>{this.$router.push('/formulalist')}, 1000);
            } else {
              this.$Message.error(rs.data.message)
            }
        })
      }else {
        this.$Loading.start()
        this.$axios.post('/api/Formula/AddFormulaInfo', {
          'FormulaName': this.formData.FormulaName,
          'FormulaContent': this.formData.FormulaContent.join(';')+";",
          'ID': this.id
        }).then(rs => {
            this.$Loading.finish()
            if (rs.data.success) {
              this.$Message.success(rs.data.message)
              setTimeout(()=>{this.$router.push('/formulalist')}, 1000);
            } else {
              this.$Message.error(rs.data.message)
            }
        })
      } 
    },
    doCancelled() {
      this.$Modal.confirm({
          title: '是否确认删除?',
          onOk: () => {
            this.$Loading.start()
            this.$axios.post('/api/Formula/DaleteFormulaInfo', {
              'FormulaID':this.id
            }).then(rs => {
              let result = rs.data
              this.$Loading.finish()
              if (result.success) {
                this.$Message.success(result.message)
                setTimeout(()=>{this.$router.push('/formulalist')}, 1000);
              } else {
                this.$Message.error(result.message)
              }
            })

          },
          onCancel: () => {}
      });

    },
    mapped(name) {
      let result = this.mapist
      console.log(result)
      return result[name]
    },

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
                border-radius: 0.5rem;
            }
            .yes{
                background: #05449b;
            }
            .no{
                background: #a4554d;
            }
            .info{
                display: block;
                width: 100%;
                margin: auto auto;
                height: auto;

                .title{
                    padding-left:1.5rem;
                    background: url("~static/images/5.png") no-repeat left ;
                    background-position:0.5rem 0.4rem;
                    background-size:auto 1.5rem;
                    //height: 2.5rem;
                    line-height: 2.5rem;
                    font-size: 1.2rem;
                    position: relative;
                    //border-bottom: 1px solid #ddd;
                    margin-bottom:0.5rem;
                    .span1{
                      width:50%;
                      display: block;
                      float: left;
                      word-wrap: break-word;
                    }
                    .span2{
                        width:50%;
                        text-align: right;
                        display: block;
                        float: left;
                    }
                }
                .text{
                    //border-bottom: 1px solid #ddd;
                    height: 2rem;
                    line-height: 2rem;
                    font-size: 1rem;
                    width: 50%;
                    float:left;
                    position: relative;
                }


              }

        }



   
}


</style>
