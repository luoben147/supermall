<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <!--吸顶效果  滑动到tab-control2时 此组件显示-->
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"/>

    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners"
                   @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <!--在需要监听组件的原生事件时，必须给对应的事件加.native修饰符才能监听
    @click.native-->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'

  import {getHomeMultidata, getHomeGoods} from "network/home"
  import {debounce} from "common/utils";
  import {itemListenerMixin,backTopMixin} from "common/mixin";

  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll
    },
    mixins:[itemListenerMixin,backTopMixin], //混入 （生命周期/对象..等的 复用）
    data() {
      return {
        banners: [],    //轮播图数据
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',   //当前tab页的类型
        tabOffsetTop: 0,        //tabControll距离顶部位置
        isTabFixed: false ,     //tab是否吸顶
        saveY:0 //保存离开Home时的滚动位置
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list;
      }
    },
    destroyed(){
      console.log('home destroyed');
    },
    activated(){  //组件处于活跃时的回调
      console.log('activated Y = '+this.saveY)
      this.$refs.scroll.scrollTo(0,this.saveY);
      this.$refs.scroll.refresh()
    },
    deactivated(){  //组件处于不活跃时的回调
      console.log("Home Y = "+this.$refs.scroll.getScrollY())
      //保存y值
      this.saveY=this.$refs.scroll.getScrollY()
      //console.log('deactivated:' +this.saveY)
      //取消全局事件的监听
      this.$bus.$off('itemImageLoad',this.itemImgListener)
    },
    created() {
      //请求首页数据
      this.getHomeMultidata();

      //请求商品数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');

    },
    methods: {
      /**
       * 网络请求
       */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1;
          //调用上拉加载更多完成 才能进行下一次的上拉加载
          this.$refs.scroll.finishPullUp();
        })
      },

      /**
       * 事件监听
       */
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop';
            break;
          case 1:
            this.currentType = 'new';
            break;
          case 2:
            this.currentType = 'sell';
            break
        }
        this.$refs.tabControl1.currentIndex=index;
        this.$refs.tabControl2.currentIndex=index;
      },
      contentScroll(position) {
        //判断BackTop是否显示
       this.listensShowBackTop(position)

        //tabControl是否吸顶(position : fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        this.getHomeGoods(this.currentType);
      },
      swiperImageLoad() {
        //获取tabControl的offsetTop
        //所有组件都有$el属性：用于获取组件里的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      }

    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    /*vh: 视口的高度  视口被均分为100单位的vh */
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: white;
     /*在使用浏览器原生滚动时为了使顶部导航不跟随一起滚动*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control{
    position: relative;
    z-index: 9;
  }

  /*.content{*/
  /*height: calc(100% - 93px);*/
  /*overflow: hidden;*/
  /*margin-top: 44px;*/
  /*}*/


</style>
