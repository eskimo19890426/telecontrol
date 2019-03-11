<template lang="html">
  <div class="sufan-envmap" ref="wrap" :style="wrapStyle">
    <div ref="zrender" class="zrender"></div>
    <img :src="data.url" ref="map" alt="" style="position: absolute;visibility: hidden;z-index: -99;">
  </div>
</template>

<script>
import zrender from 'zrender'
export default {
  data() {
    return {
      // 实例
      zr: {},
      // 容器样式
      wrapStyle: {
        height: 'auto'
      },
      // 收集的点位
      points: {
        begin: [],
        end: []
      },
      // 多边形
      polygon: {},
      // 渲染节点容器
      poswrap: {}
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          // 图片地址
          url: '',
          // 坐标点
          positions: [],
          // 收集点位的数量
          pointNumber: 4,
          // 比例
          proportion: 600
        }
      }
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.checkMapLoad().then(rs => {
        // 初始化
        if (rs) {
          this.init()
        }
      })
    })
    // 上面在绑事件不执行,这里再默认执行一次
    this.checkMapLoad().then(rs => {
      // 初始化
      if (rs) {
        this.init()
      }
    })
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler() {
        // console.log('数据改变-重新渲染位置节点')
        this.checkMapLoad().then(rs => {
          // 初始化
          if (rs) {
            this.init()
          }
        })
      }
    }
  },
  methods: {
    init() {
      // 设置高度
      let mapw = this.$refs.map.width
      let maph = this.$refs.map.height
      let wrapw = this.$refs.wrap.offsetWidth
      let wraph = wrapw / (mapw / maph)
      this.wrapStyle.height = wraph + 'px'
      if (mapw <= 0) {
        return
      }
      // 初始化
      this.zr = zrender.init(this.$refs.zrender, {
        width: wrapw,
        height: wraph
      })
      // 绑定点击事件用来采集点位
      // console.log('init success zr version ', zrender.version)
      this.createmap()
    },
    // 绘制图片
    createmap() {
      // 创建图片类
      let map = new zrender.Image({
        style: {
          image: this.data.url,
          x: 0,
          y: 0,
          width: this.zr.getWidth() || 500
        }
      })
      this.zr.add(map)
      // 尝试渲染节点
      this.renderPostions()
    },
    // 渲染坐标点
    renderPostions() {
      if (!this.data.positions || this.data.positions.length === 0) {
        return
      }
      try {
        this.zr.remove(this.poswrap)
      } catch (e) {}
      this.poswrap = new zrender.Group()
      let zrw = this.zr.getWidth()
      // 按照比例渲染
      let scale = this.data.proportion / zrw
      for (let item of this.data.positions) {
        let rect = new zrender.Rect({
          style: {
            fill: 'rgba(0, 0, 0, 0.2)',
            lineWidth: 1,
            stroke: '#ff0000',
            text: item.name,
            textFill: '#fff',
            textShadowColor: '#ff0000'
          },
          shape: {
            x: item.points[0].x / scale,
            y: item.points[0].y / scale,
            width: (item.points[2].x - item.points[0].x) / scale,
            height: (item.points[2].y - item.points[0].y) / scale
          }
        })
        this.poswrap.add(rect)
        // 给位置绑定事件
        rect.on('click', () => {
          this.$emit('on-select', item)
        })
      }
      this.zr.add(this.poswrap)
      // console.log('渲染完成')
    },
    // 显示收集帮助提示
    showHelp() {
      return new Promise((resolve, reject) => {
        if (!(this.zr.getWidth instanceof Function)) {
          return
        }
        // 创建一个遮罩
        let group = new zrender.Group()
        let mask = new zrender.Rect({
          shape: {
            x: 0,
            y: 0,
            width: this.zr.getWidth(),
            height: this.zr.getHeight()
          },
          style: {
            fill: 'rgba(0, 0, 0, 0.8)',
            opacity: 0
          }
        })
        let text = new zrender.Text({
          style: {
            text: '请用鼠标在地图上采集位置区域！',
            textVerticalAlign: 'middle',
            textAlign: 'center',
            textFill: '#fff',
            fontWeight: 'lighter',
            fontSize: 16,
            y: this.zr.getHeight() / 2,
            x: this.zr.getWidth() / 2,
            opacity: 0
          }
        })
        mask.animateTo({
          style: {
            opacity: 1
          }
        }, 300)
        text.animateTo({
          style: {
            opacity: 1
          }
        }, 300)
        group.add(mask)
        group.add(text)
        this.zr.add(group)
        group.on('click', () => {
          mask.animateTo({
            style: {
              opacity: 0
            }
          }, 300)
          text.animateTo({
            style: {
              opacity: 0
            }
          }, 300, () => {
            this.zr.remove(group)
            resolve(true)
          })
        })
      })
    },
    // 检查图片的加载状态
    checkMapLoad() {
      return new Promise((resolve, reject) => {
        var imgLoad = (img) => {
          if (img.complete) {
            // resolve(true)
            setTimeout(() => {
              // 判断图片是否为空
              if (img.width >= 0) {
                resolve(true)
              } else {
                resolve(false)
              }
            }, 100)
          } else {
            imgLoad(img)
          }
        }
        // console.log(this.$refs.map)
        if (this.$refs.map && this.$refs.map) {
          imgLoad(this.$refs.map)
        }
      })
    },
    // 收集点位
    collectStart() {
      this.checkMapLoad().then(rs => {
        if (!rs) {
          return
        }
        // 显示帮助弹层
        this.showHelp().then(rs => {
          // 绑定事件
          this.zr.on('mousedown', this.doZrMouseDown, this)
          // 鼠标停止移除事件
          this.zr.on('mouseup', this.doZrMouseUp, this)
        })
      })
    },
    // 点击
    doZrMouseDown(evt) {
      // 收集起点
      this.points.begin = [evt.offsetX, evt.offsetY]
      // 监听移动事件
      this.zr.on('mousemove', this.doZrMouseMove, this)
    },
    // 鼠标弹出
    doZrMouseUp() {
      this.zr.off('mousedown', this.doZrMouseDown, this)
      this.zr.off('mouseup', this.doZrMouseUp, this)
      this.zr.off('mousemove', this.doZrMouseMove, this)
      // 确认位置
      this.confirmPosition()
    },
    // 鼠标移动
    doZrMouseMove(evt) {
      this.points.end = [evt.offsetX, evt.offsetY]
      try {
        // 移除上次绘制的
        this.zr.remove(this.polygon)
      } catch (e) {}
      // 容器实际的宽度
      this.polygon = new zrender.Rect({
        style: {
          fill: 'rgba(0,0,0,0.6)',
          lineWidth: 1,
          stroke: '#ff0000'
        },
        shape: {
          x: this.points.begin[0],
          y: this.points.begin[1],
          width: this.points.end[0] - this.points.begin[0],
          height: this.points.end[1] - this.points.begin[1]
        }
      })
      // 添加多边形
      this.zr.add(this.polygon)
    },
    // 确认位置
    confirmPosition() {
      let group = new zrender.Group()
      let position = {
        x: this.points.end[0] - 40,
        y: this.points.end[1] - 20
      }
      // 判断坐标
      let btnOk = new zrender.Text({
        style: {
          text: '确定',
          x: position.x,
          y: position.y,
          textFill: 'red',
          fontSize: 14
        }
      })
      let btnCancel = new zrender.Text({
        style: {
          text: '取消',
          x: position.x - 42,
          y: position.y,
          textFill: 'yellow',
          fontSize: 14
        }
      })
      group.add(btnOk)
      group.add(btnCancel)
      this.zr.add(group)
      // 确定
      btnOk.on('click', () => {
        this.zr.remove(group)
        this.zr.remove(this.polygon)
        this.doEmitData()
      }, this)
      // 取消
      btnCancel.on('click', () => {
        this.points.begin = []
        this.points.end = []
        this.zr.remove(group)
        this.zr.remove(this.polygon)
      }, this)
    },
    // 向外面传送数据
    doEmitData() {
      let result = {
        // 坐标
        points: [{
          x: this.points.begin[0],
          y: this.points.begin[1]
        }, {
          x: this.points.end[0],
          y: this.points.begin[1]
        }, {
          x: this.points.end[0],
          y: this.points.end[1]
        }, {
          x: this.points.begin[1],
          y: this.points.end[0]
        }],
        // 比例
        proportion: this.zr.getWidth()
      }
      this.$emit('on-collect', result)
    },
    // 点击事件
    doZrClick(evt) {}
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";

.sufan-envmap {
    position: relative;
    width: 100%;
    font-size: 14px;
    color: #fff;

    .zrender {
        width: inherit;
        height: inherit;
    }
}
</style>
