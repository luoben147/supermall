<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramInfo" ref="params"/>
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <goods-list :goods="recommends" ref="recommend"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <!--<toast :message="message" :show="show" />-->
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'

  import {getDetail, getRecommend, Goods, Shop, GoodsParam} from "network/detail";
  import {debounce} from "common/utils";
  import {itemListenerMixin, backTopMixin} from "common/mixin";
  import {mapActions} from 'vuex'

  // import Toast from 'components/common/toast/Toast'

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,
      // Toast
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},  //评论信息
        recommends: [],   //推荐数据
        themeTopYs: [],     //navbar中各分类的top值
        currentIndex: 0,  //导航当前选中项
        // message:'',
        // show:false
      }
    },
    created() {
      this.iid = this.$route.params.id
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
        this.detailInfo = data.detailInfo;
        //解析商品参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);
        //解析评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0];
        }
        getRecommend().then(res => {
          //console.log(res);
          this.recommends = res.data.list
        })

        //$nextTick 将回调延迟到下次 DOM 更新循环之后执行。
        // this.$nextTick(()=>{
        //   //根据最新的数据，对应的DOM是已经被渲染出来
        //   //但是图片依然没有加载完成（目前获取的offsetTop不包含其中的图片）
        //   //offsetTop值不对的时候，都是因为图片的问题
        //   this.themeTopYs=[]
        //   this.themeTopYs.push(0);//商品组件offsetTop
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);//参数组件offsetTop
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);//评论组件offsetTop
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);//推荐组件offsetTop
        //   console.log(this.themeTopYs)
        // })

      })

    },
    mounted() {

    },
    destroyed() {
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad() {   //商品图片加载完成的回调
        this.$refs.scroll.refresh();

        //商品列表的图片最多，加载最慢，所以在这里获取各组件的offsetTop
        this.themeTopYs = []
        this.themeTopYs.push(0);//商品组件offsetTop
        this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44);//参数组件offsetTop
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44);//评论组件offsetTop
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44);//推荐组件offsetTop
        this.themeTopYs.push(Number.MAX_VALUE);//最大值区间
        //console.log(this.themeTopYs)
      },
      titleClick(index) {
        //减去顶部导航栏高度
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200);
      },
      contentScroll(position) {
        const positionY = -position.y
        //positionY与themeTopYs对比 改变nav-bar 选中项
        //[0, 5472, 6149, 6502]
        //positionY 在0-5472 ,index=0
        //positionY 在5472-6149 ,index=1
        //positionY 在6149-6502 ,index=2
        //positionY 在6502-MAxValue ,index=3

        let length = this.themeTopYs.length;

        //普通判断：（没有加入最大区间）
        // for (let i = 0; i < length; i++) {
        //   if (this.currentIndex !== i && (
        //     (i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])
        //     || (i === length - 1 && positionY >= this.themeTopYs[i]))
        //   ) {
        //     this.currentIndex = i;
        //     this.$refs.nav.currentIndex = this.currentIndex;
        //   }
        // }

        //在themeTopYs末尾加入一个最大值区间
        for (let i = 0; i < length - 1; i++) {  //剔除最大值区间
          if (this.currentIndex !== i &&
            (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])) {
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex;
          }
        }

        //判断BackTop是否显示
        this.listensShowBackTop(position)
      },
      addToCart() {    //添加商品到购物车
        //获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;

        //将商品添加到购物车
        // this.$store.commit('addCart',product)

        // this.$store.dispatch('addCart',product).then(res =>{
        //   console.log(res);
        // })

        //mapActions 映射到methods
        this.addCart(product).then(res => {
          console.log(res);
          // this.show=true;
          // this.message=res;
          //
          // setTimeout(()=>{
          //   this.show=false;
          //   this.message=''
          // },1500)

          this.$toast.show(res,2000)
        })
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

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px - 49px);
  }

</style>
