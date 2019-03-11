import Vue from 'vue'

// 导入组件
import header from './header'
import asidemenu from './asidemenu'
import footer from './footer'
import steps from './steps'
import bcnav from './bcnav'
import progress from './progress'
import cropper from './cropper'
import tree from './tree'
import envmap from './envmap'
// import list from './list'
import dateSelect from './dateSelect'
import searchInput from './search-input'
import cascader from './cascader'
import select from './select'
import list from './list'
// 注册全局组件
Vue.component('sufan-header', header)
Vue.component('sufan-asidemenu', asidemenu)
Vue.component('sufan-footer', footer)
Vue.component('sufan-steps', steps)
Vue.component('sufan-bcnav', bcnav)
Vue.component('sufan-progress', progress)
Vue.component('sufan-cropper', cropper)
Vue.component('sufan-tree', tree)
Vue.component('sufan-envmap', envmap)
// Vue.component('sufan-list', list)
Vue.component('date-select', dateSelect)
Vue.component('sufan-search-input', searchInput)
Vue.component('sufan-cascader', cascader)
Vue.component('sufan-select', select)
Vue.component('sufan-list', list)
