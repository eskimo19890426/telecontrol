import Vue from 'vue'
import axios from 'axios'
// 格式化参数
import qs from 'qs'
import config from './../../app.config.js'

// 注入配置
axios.defaults.timeout = config.timeout
// axios.defaults.headers.common['token'] = config.token
// 前端主动跨域
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
axios.defaults.baseURL = config.apihost

let instance = axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// 请求拦截器
instance.interceptors.request.use((request) => {
  console.log(request, '请求拦截器')
  request.data = qs.stringify(request.data)
  return request
}, (error) => {
  return error
})

// 响应拦截器
instance.interceptors.response.use(function(response) {
  return response
}, function(error) {
  return Promise.reject(error)
})

Vue.prototype.$axios = instance

console.log('  mix axios success')
