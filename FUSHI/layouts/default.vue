<template>
<div>
  <div>
    <sufan-header></sufan-header>
  </div>
  <div class="sufan-layout-default">
    <div class="asidemenu">
      <sufan-asidemenu></sufan-asidemenu>
    </div>
    <div class="content">
      <nuxt/>
    </div>
  </div>
</div>
</template>
<script type="text/javascript">
</script>
<style lang="scss">
.sufan-layout-default {
    height: calc(100vh - 100px);
    .asidemenu {
        float: left;
        width: 300px;
        height: 100%;
        background: #f5f5f5;
    }
    .content {
        float: left;
        width: calc(100% - 300px);
    }
}
.sufan-layout-default::after {
    content: '';
    display: block;
    clear: both;
}

@media screen and (max-width:1440px) {
    .sufan-layout-default {
        .asidemenu {
            width: 260px;
        }
        .content {
            float: left;
            width: calc(100% - 260px);
        }
    }
}
</style>
