<template lang="html">
<section class="sufan-login no-select">
  <div class="login-panel" :class="{fadein:showlogin}">
    <div class="logo">
      <img src="~static/images/logo.png" alt="">
      <h3>辐射监测系统</h3>
    </div>
    <div class="form">
      <ul>
        <li>
          <div class="input-wrap">
            <input autocomplete="off" ref="accout" type="text" v-model="formData.UserAccount" placeholder="请输入登录名">
            <i class="iconfont bg">&#xe63e;</i>
          </div>
        </li>
        <li>
          <div class="input-wrap">
            <input autocomplete="off" placeholder="请输入密码" ref="password" v-model="formData.Password" type="password">
            <i class="iconfont bg">&#xe63d;</i>
            <span class="iconfont showpwd" v-show="!remember" @mousedown="togglePwdtype('text')" @mouseup="togglePwdtype('password')">
              <i>&#xe614;</i>
              <i>&#xe628;</i>
            </span>
          </div>
        </li>
        <li>
          <span @click="remember=!remember">
            <span class="checkbox-wrap">
              <i class="iconfont checkbox" v-show="!remember">&#xe680;</i>
              <i v-show="remember" class="iconfont checkbox checked">&#xe67f;</i>
            </span>
            记住密码
          </span>
          <span class="forget-world" @click="doForget">
            忘记密码?
          </span>
          <!-- <router-link to="/user/repassword">
          </router-link> -->
        </li>
        <li>
          <span class="btn" @click="validate">
            <span v-show="loading">
              登录中
            </span>
            <span v-show="!loading">
              登录
            </span>
          </span>
        </li>
        <!-- <li>
          <router-link class="btn cayn" to="/user/register">注册</router-link>
        </li> -->
      </ul>
    </div>
  </div>
</section>
</template>

<script>
import cookie from 'js-cookie'
export default {
  layout: 'fullscreen',
  data() {
    return {
      showlogin: false,
      formData: {
        UserAccount: '',
        Password: ''
      },
      formRule: {
        UserAccount: [],
        Password: []
      },
      loading: false,
      // 是否记住密码
      remember: false
    }
  },
  components: {},
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
        this.formData.UserAccount = userdata.UserAccount
        this.formData.Password = userdata.Password
        this.remember = true
      }
    },
    toggle() {
      this.showlogin = !this.showlogin
    },
    togglePwdtype(val) {
      this.$refs.password.setAttribute('type', val)
    },
    validate() {
      if (this.loading) return
      // 校验合法性
      var reg = /[^a-zA-Z0-9\\u4e00-\u9fa5]/
      if (this.formData.UserAccount === '' || reg.test(this.formData.UserAccount)) {
        this.$Message.warning('请输入正确的用户名')
        return
      }
      if (this.formData.Password.length < 6 || this.formData.Password.length > 16) {
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
      this.loading = true
      this.$axios.post('/api/User/Login', {
        UsersData: JSON.stringify([this.formData])
      }).then(rs => {
        let result = rs.data
        this.loading = false
        if (result.Success) {
          // 判断是否需要记住密码
          this.remember ? this.recordUserData() : this.clearUserData()
          this.$store.commit('app/setAccount', result.Data)
          this.$router.push('/')
        } else {
          this.$Message.error(result.Message)
        }
      })
    },
    // 记住密码
    recordUserData() {
      cookie.set('userdata', JSON.stringify(this.formData))
    },
    // 清除管理员密码
    clearUserData() {
      cookie.remove('userdata')
    },
    // 忘记密码
    doForget() {
      this.$Message.info('请联系管理员修改密码')
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
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";
.sufan-login {
    position: relative;
    height: 100vh;
    width: 100%;
    background: $primary;
    font-size: 16px;
    overflow: hidden;
    .login-panel {
        transition: all 0.6s ease 0s;
        transform: translateY(20%);
        position: absolute;
        left: 50%;
        top: 50%;
        width: 680px;
        height: 580px;
        margin-top: -200px;
        margin-left: -340px;
        background: url("~static/images/user/login/login_bg.png") no-repeat center;
        opacity: 0;

        &.fadein {
            opacity: 1;
            transform: none;
        }

        .logo {
            text-align: center;
            margin-top: -120px;

            h3 {
                font-size: 32px;
                color: #fff;
                font-weight: lighter;
                padding: 10px 0;
            }
        }

        .form {
            width: 400px;
            margin: 80px auto;

            color: #fff;

            a {
                color: #fff;
            }

            ul {
                li {
                    margin-top: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    white-space: nowrap;
                    &:first-child {
                        margin-top: 0;
                    }
                    .checkbox-wrap {
                        position: relative;
                        top: 2px;
                        z-index: 10;
                        width: 16px;
                        height: 16px;
                        overflow: hidden;
                        display: inline-block;
                        cursor: pointer;
                    }

                    .checkbox {
                        position: relative;
                        top: -11px;
                        left: -5px;
                        font-size: 26px;
                        vertical-align: middle;
                        background: #fff;
                        &.checked {
                            color: $primary;
                        }
                    }
                }
            }

            .input-wrap {
                position: relative;
                width: 100%;
                input {
                    height: 50px;
                    background: #fff;
                    border: none;
                    width: 100%;
                    border-radius: 5px;
                    box-sizing: border-box;
                    padding: 0 15px 0 65px;
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
            .forget-world {
                cursor: pointer;
            }
            .btn {
                transition: all 0.3s ease;
                height: 50px;
                line-height: 50px;
                text-align: center;
                width: 100%;
                border-radius: 50px;
                background: $primary;
                cursor: pointer;
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
}
</style>
