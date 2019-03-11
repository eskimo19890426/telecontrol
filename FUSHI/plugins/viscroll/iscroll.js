/**
 * @file vue iscroll指令，用指令封装iscroll进行dom操作
 * @author Ivorzk
 * @date 2018/1/1
 */
var IScroll = require('suwis-iscroll/build/iscroll-probe.js')
var _ = require('lodash')

var VIScroll = {
  install: function(Vue, options = {
    // 启动鼠标
    mouseWheel: true,
    // 启用click
    click: true,
    // 阻止默认行为
    preventDefault: false,
    // 当滚动区域被点击或者触摸但并没有滚动时，可以让iScroll抛出一个自定义的tap事件
    tap: true,
    // 反弹
    bounce: true,
    // 阻止touch
    disableTouch: true,
    // 滚动条渐变
    fadeScrollbars: false,
    // 允许拖动滚动条
    interactiveScrollbars: true,
    // 响应灵敏度（1，2，3）
    probeType: 3,
    // 横向滚动
    scrollX: true,
    // 自定义滚动条
    scrollbars: 'custom'
  }) {
    Vue.directive('iscroll', {
      inserted: function(el, binding, vnode, oldVnode) {
        let customerOptions = binding.value
        // 使用用户配置
        if (customerOptions) {
          for (let key in customerOptions) {
            options[key] = customerOptions[key]
          }
        }
        var iscrollOptions = options
        // 使用vnode绑定iscroll是为了让iscroll对象能够夸状态传递，避免iscroll重复建立
        var refresh = _.debounce(() => {
          if (vnode.scroll && vnode.scroll.refresh) {
            try {
              vnode.scroll.refresh()
            } catch (e) {}
          }
        }, 10)
        if (el) {
          el.classList.add('viscroll-wrapper')
          el.style.overflow = 'hidden'
          el.style.position = 'relative'
          vnode.scroll = new IScroll(el, iscrollOptions)
          vnode.scroll.on('beforeScrollStart', function() {
            refresh()
          })
          // 开启一个监视器
          var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
          vnode.observer = new MutationObserver(_.debounce((mutations) => {
            if (vnode.scroll) {
              try {
                vnode.scroll.refresh()
                vnode.observer.takeRecords()
              } catch (e) {
                console.log(e.message)
              }
            }
          }, 200))
          vnode.observer.observe(el, {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true,
            attributeOldValue: false,
            characterDataOldValue: false
          })
          // console.log(binding, 'binding')
          // 把示例传到外面去给用户使用
          vnode.context[binding.arg] = vnode.scroll
        }
      },
      componentUpdated: function(el, binding, vnode, oldVnode) {
        // console.log('组件刷新')
        // 将scroll绑定到新的vnode上
        vnode.scroll = oldVnode.scroll
        // 使用settimeout让refresh跳到事件流结尾，保证refresh时数据已经更新完毕
        if (vnode.scroll && vnode.scroll.refresh) {
          setTimeout(() => {
            try {
              vnode.scroll.refresh()
            } catch (e) {}
          }, 200)
        }
      },
      unbind: function(el, binding, vnode, oldVnode) {
        /**
         * 解除绑定时要把iscroll销毁
         */
        vnode.scroll = oldVnode.scroll
        if (vnode.scroll) {
          vnode.scroll.destroy()
          vnode.scroll = null
        }
        // 停止观察
        if (vnode.observer) {
          vnode.observer.takeRecords()
          vnode.observer.disconnect()
        }
      }
    })
  }
}

export default VIScroll
