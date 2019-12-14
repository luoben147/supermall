<template>
  <tab-bar>
    <ta-bar-item path="/home" >
      <img slot="item-icon" src="~assets/img/tabbar/home.svg">
      <img slot="item-icon-active" src="~assets/img/tabbar/home_active.svg">
      <div slot="item-text">首页</div>
    </ta-bar-item>
    <ta-bar-item path="/category" >
      <img slot="item-icon" src="~assets/img/tabbar/category.svg">
      <img slot="item-icon-active" src="~assets/img/tabbar/category_active.svg">
      <div slot="item-text">分类</div>
    </ta-bar-item>
    <ta-bar-item path="/cart" >
      <img slot="item-icon" src="~assets/img/tabbar/shopcart.svg">
      <img slot="item-icon-active" src="~assets/img/tabbar/shopcart_active.svg">
      <div slot="item-text">购物车</div>
    </ta-bar-item>
    <ta-bar-item path="/profile" >
      <img slot="item-icon" src="~assets/img/tabbar/profile.svg">
      <img slot="item-icon-active" src="~assets/img/tabbar/profile_active.svg">
      <div slot="item-text">我的</div>
    </ta-bar-item>
  </tab-bar>
</template>

<script>
  import TabBar from 'components/common/tabbar/TabBar'
  import TaBarItem from  'components/common//tabbar/TabBarItem'

  export default {
    name: "MainTabBar",
    components: {
      TabBar,
      TaBarItem
    }
  }
</script>

<style scoped>

</style>
