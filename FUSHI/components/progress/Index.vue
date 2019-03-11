<template lang="html">
  <section class="sufan-progress" :style="{width:width+'px'}">
    <div class="progress">
      <div class="slider" :style="{width:percent*100+'%'}"></div>
      <div class="text">{{Math.round(percent*100)}}%</div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0.1
    },
    width: {
      type: Number,
      default: 100
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";
.sufan-progress {
    position: relative;
    display: inline-block;
    height: 6px;
    .progress {
        position: relative;
        width: 100%;
        height: 6px;
        background: $gray;
        border-radius: 6px;
        .slider {
            display: block;
            background: $yellow;
            height: 100%;
            max-width: 100%;
        }
        .text {
            position: absolute;
            right: -40px;
            font-size: 14px;
            margin-top: -25.5px;
        }
    }
}
</style>
