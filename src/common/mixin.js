/**
 * 混入 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。混入对象可以包含任意组件选项。
 * 当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项。
 * @type {{mounted(): void}}
 */

import {debounce} from "./utils";
import BackTop from 'components/content/backTop/BackTop';
/**
 * 在Home 与Detail 组件都要监听图片加载完成
 * 这里使用混入 复用mounted
 * @type {{data(): *, mounted(): void}}
 */
export const itemListenerMixin={
  components:{

  },
  methods:{

  },
  data(){
    return {
      itemImgListener: null //推荐图片加载监听
    }
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 200);
    this.itemImgListener = () => {
      /**
       * 由于图片的异步加载，有时候在图片未加载完成时BScroll计算完成了内容区域高度，
       * 造成图片加载完成后内容撑高，导致滚动区域的计算错误，
       * 所以在图片加载完成后手动调用BScroll的刷新，重新计算高度
       */
      refresh();
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
}


export const backTopMixin={
  components:{
    BackTop
  },
  data(){
    return{
      isShowBackTop: false  //是否显示返回顶部按钮
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 300)
    },
    listensShowBackTop(position){ //判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000
    }
  }
}
