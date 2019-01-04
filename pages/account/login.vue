<template lang="html">
  <div 
    :class="{fadein:showlogin}"
    class="box">
    <div class="title">
      <div class="title1">远程控制系统</div>
      <div class="title2">WELCOM TO REMOTE CONTROL SYSTEM</div>
    </div>
    <div class="form">
      <ul>
        <li>
          <div class="input-wrap account">
            <input
              ref="accout"
              v-model="formData.Accounts"
              type="text"
              maxlength="30"
              autocomplete="off"
              placeholder="账号">
          </div>
        </li>
        <li>
          <div class="input-wrap password">
            <input 
              ref="Passwords"
              v-model="formData.Passwords"
              maxlength="30"
              autocomplete="off"
              placeholder="密码"
              type="Password">
          </div>
        </li>
        <li>
          <span 
            class="btn" 
            @click="validate">
            <span v-show="loading">
              登录中
            </span>
            <span v-show="!loading">
              登&nbsp;&nbsp;&nbsp;&nbsp;录
            </span>
          </span>
        </li>

        <!-- <li>
          <router-link class="btn cayn" to="/user/register">注册</router-link>
        </li> -->
      </ul>
    </div>
  </div>
  
</template>

<script>
import cookie from 'js-cookie'
export default {
  layout: 'fullscreen',
  components: {},
  data() {
    return {
      showlogin: false,
      formData: {
        Accounts: '',
        Passwords: ''
      },
      formRule: {
        Accounts: [],
        Passwords: []
      },
      loading: false,
      // 是否记住密码
      remember: false
    }
  },
  watch: {
    loading(val) {
      if (val) {
        this.$Loading.start()
      } else {
        this.$Loading.finish()
      }
    }
  },
  mounted() {
    this.getUserData()
    // 监听回车
    document.addEventListener('keyup', this.doKeyUp, this)
    setTimeout(() => {
      this.toggle()
    }, 300)
  },
  // 销毁前去除监听函数
  beforeDestroy() {
    document.removeEventListener('keyup', this.doKeyUp, this)
  },
  methods: {
    getUserData() {
      let userdata = cookie.get('userdata')
      if (userdata) {
        userdata = JSON.parse(userdata)
        this.formData.Accounts = userdata.Accounts
        this.formData.Passwords = userdata.Passwords
        this.remember = true
      }
    },
    toggle() {
      this.showlogin = !this.showlogin
    },
    validate() {
      if (this.loading) return
      // 校验合法性
      var reg = /[^a-zA-Z0-9\\u4e00-\u9fa5]/
      if (this.formData.Accounts === '' || reg.test(this.formData.Accounts)) {
        this.$Message.warning('请输入正确的用户名')
        return
      }
      if (this.formData.Passwords.length < 6 || this.formData.Passwords.length > 16) {
        this.$Message.warning('密码长度需大于6位数,并小于16位数')
        return
      }
      // 登录
      this.login()
    },
    // 判断回车函数
    doKeyUp(evt) {
      if (evt.keyCode === 13) {
        this.validate()
      }
    },
    // 登录
    login() {
      console.log(1);
      this.loading = true
      this.$axios.post('/api/Login/Login', {
        Accounts:this.formData.Accounts,
        Passwords:this.formData.Passwords
      }).then(rs => {
        let result = rs.data
        this.loading = false
        if (result.success) {
          this.$store.commit('app/setAccount', result.data)
          this.$router.push('/')
        } else {
          this.$Message.error(result.message)
        }
      })
    },

    // 忘记密码
    doForget() {
      this.$Message.info('请联系管理员修改密码')
    }
  },
  
}
</script>

<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";
.box {
    position: relative;
    height: 100vh;
    width: 100%;
    // background: $primary;
    font-size: 1rem;
    overflow: hidden;
    background: url("~static/images/1.jpg") no-repeat center ;
    background-size: 100%;
        .title {
            display:block;
            margin-top: 40%;
            margin-bottom:15%; 
            text-align: center;
            .title1 {
                font-size:2rem;
                letter-spacing: 0.5rem;
                color:white;
            }
            .title2 {
                font-size:0.75rem;
                color:white;
            }
        }

        .form {
            width: 100%;
            margin: 1rem auto;

            color: #fff;
            

            a {
                color: #fff;
            }

            ul {
                li {
                    margin-top: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    white-space: nowrap;
                    &:first-child {
                        margin-top: 1rem;
                    }
                }
            }

            .input-wrap {
                position: relative;
                width: 80%;
                margin: auto auto;
                border-bottom: 1px solid white;
                input {
                    background-color: transparent;
                    height: 50px;
                    border: none;
                    width: 100%;
                    border-radius: 5px;
                    box-sizing: border-box;
                    padding: 0 1rem 0 3rem;
                    color:white;
                }
                .iconfont {
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 50px;
                    line-height: 52px;
                    font-size: 20px;

                    &.bg {
                        background: $primary;
                        text-align: center;
                        border-radius: 5px;
                    }
                    &.showpwd {
                        right: 0;
                        left: auto;
                        text-align: center;
                        color: $primary;
                        cursor: pointer;
                        i {
                            font-style: normal;
                            &:last-child {
                                display: none;
                            }
                            &:active:first-child {
                                opacity: 0;
                            }
                            &:active:last-child {
                                display: block;
                            }
                        }
                        &:active {
                            i {
                                &:first-child {
                                    display: none;
                                }
                                &:last-child {
                                    display: block;
                                }
                            }
                        }
                    }
                }
            }
            .forget{
              width:80%;
              margin:auto auto;
              text-align:  right;
              .forget-world {
                  font-size:1rem;
                  cursor: pointer;

              }
            }
            
            .btn {
                transition: all 0.3s ease;
                height: 2.5rem;
                line-height: 2.5rem;
                text-align: center;
                width: 80%;
                border-radius: 2.5rem;
                background: #fff;
                cursor: pointer;
                margin:auto auto;
                padding: 0;
                color:#34416e;
                font-weight: bold;
                margin-top:10%;
                &:active {
                    background: $primary * 0.9;
                }
                &.cayn {
                    background: $cayn;
                    &:active {
                        background: $cayn * 0.9;
                    }
                }
            }
        }
}


input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {

    color:    #fff;
}
input:-moz-placeholder, textarea:-moz-placeholder {
    color:    #fff;
}
input::-moz-placeholder, textarea::-moz-placeholder {
    color:    #fff;
}
input:-ms-input-placeholder, textarea:-ms-input-placeholder {
    color:    #fff;
}

.account{
  background: url("~static/images/2.png") no-repeat left ;
  background-size: 7.5%;
}
.password{
  background: url("~static/images/3.png") no-repeat left ;
  background-size: 7.5%;
}
</style>
