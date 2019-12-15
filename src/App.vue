<template>
  <div id="app">
    <!--keep-alive 能在组件切换过程中将状态保留在内存中，防止重复渲染DOM。
      包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们.
      exclude="Detail" 排除Detail组件 因为它每次都需要加载不同商品详情
    -->
    <keep-alive  exclude="Detail">
      <router-view/>
    </keep-alive>
    <main-tab-bar></main-tab-bar>
  </div>
</template>

<script>
  import MainTabBar from 'components/content/mainTabBar/MainTabBar'

  export default {
    name: 'app',
    components: {
      MainTabBar
    }
  }
</script>

<style>
  @import "assets/css/base.css";
</style>
