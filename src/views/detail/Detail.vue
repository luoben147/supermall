<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" />
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo"  @imageLoad="imageLoad"/>
    </scroll>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'

  import Scroll from 'components/common/scroll/Scroll'

  import {getDetail, Goods, Shop} from "network/detail";

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      Scroll
    },
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo:{}
      }
    },
    created() {
      this.iid = this.$route.params.id
      console.log(this.iid)
      getDetail(this.iid).then(res => {
        console.log(res);
        const data = res.result;
        //解析轮播数据
        this.topImages = data.itemInfo.topImages;
        //解析商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);
        //解析店铺信息
        this.shop = new Shop(data.shopInfo);
        //解析商品详情数据
        this.detailInfo=data.detailInfo;
      })
    },
   methods:{
     imageLoad(){
       this.$refs.scroll.refresh();
     }
   }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content{
    height: calc(100% - 44px);
  }

</style>
