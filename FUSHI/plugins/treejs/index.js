import Vue from 'vue'
import Treejs from './treejs'
Vue.use({
  install: function(Vue, options) {
    Vue.prototype.$Treejs = Treejs
  }
})
