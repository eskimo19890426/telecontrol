import Vue from 'vue'
import config from './../../app.config.js'
// 注入全局的配置文件
Vue.prototype.$config = config
console.log('  mix config success')
