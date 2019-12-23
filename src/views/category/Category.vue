<template>
  <div class="category">
    <nav-bar class="nav-bar">
      <div slot="center">商品分类</div>
    </nav-bar>
    <div class="content">
      <tab-menu :categories="categories" @selectItem="selectItem"/>

      <scroll class="tab-content" ref="scroll">
        <div>
          <tab-content-category :subcategories="showSubcategory"/>
          <tab-control :titles="['综合', '新品', '销量']"
                       @tabClick="tabClick"/>
          <!--<tab-content-detail :category-detail="showCategoryDetail"></tab-content-detail>-->
          <goods-list :goods="showCategoryDetail"/>
        </div>
      </scroll>

    </div>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import Scroll from 'components/common/scroll/Scroll'

  import TabMenu from './childComps/TabMenu'
  import TabContentCategory from './childComps/TabContentCategory'
  import TabControl from 'components/content/tabControl/TabControl'
  import TabContentDetail from './childComps/TabContentDetail'
  import GoodsList from 'components/content/goods/GoodsList'

  import {getCategory, getSubcategory,getCategoryDetail} from "network/category";
  import {debounce} from "common/utils";
  import {itemListenerMixin} from "common/mixin";


  export default {
    name: "Category",
    components: {
      NavBar,
      Scroll,
      TabMenu,
      TabContentCategory,
      TabControl,
      TabContentDetail,
      GoodsList
    },
    mixins:[itemListenerMixin],
    data() {
      return {
        itemImgListener:null,
        categories: [],
        categoryData: {},
        currentIndex: -1, //当前分类
        currentType: 'pop'
      }
    },
    created() {
      //请求分类数据
      this._getCategory();
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
    },
    activated(){
      this.$refs.scroll.refresh()
    },
    deactivated(){
      //取消全局事件的监听
      this.$bus.$off('itemImageLoad',this.itemImgListener)
    },
    computed: {
      showSubcategory() {
        if (this.currentIndex === -1) return {}
        return this.categoryData[this.currentIndex].subcategories
      },
      showCategoryDetail(){
        if (this.currentIndex === -1) return []
        return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
      }
    },
    methods: {
      _getCategory() {
        getCategory().then(res => {
          console.log(res);
          // 1.获取分类数据
          this.categories = res.data.category.list
          // 2.初始化每个类别的子数据
          for (let i = 0; i < this.categories.length; i++) {
            this.categoryData[i] = {
              subcategories: {},
              categoryDetail: {
                'pop': [],
                'new': [],
                'sell': []
              }
            }
          }
          // 3.请求第一个分类的数据
          this._getSubcategories(0)
        })
      },
      _getSubcategories(index) { //获取分类对应的商品数据
        this.currentIndex = index;
        const mailKey = this.categories[index].maitKey;
        getSubcategory(mailKey).then(res => {
          this.categoryData[index].subcategories = res.data
          //刷新Vue 中this.categoryData 数据，否则在computed中拿不到最新赋值的subcategories属性值
          this.categoryData = {...this.categoryData}
          //console.log(this.categoryData)
          this._getCategoryDetail('pop')
          this._getCategoryDetail('sell')
          this._getCategoryDetail('new')
        })
      },
      _getCategoryDetail(type) {
        // 1.获取请求的miniWallkey
        const miniWallkey = this.categories[this.currentIndex].miniWallkey;
        // 2.发送请求,传入miniWallkey和type
        getCategoryDetail(miniWallkey, type).then(res => {
          // 3.将获取的数据保存下来
          this.categoryData[this.currentIndex].categoryDetail[type] = res
          this.categoryData = {...this.categoryData}
        })
      },
      selectItem(index) {
        //获取对应分类的数据
        this._getSubcategories(index);
      },
      tabClick(index){
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        console.log(this.currentType);
      }
    }
  }
</script>

<style scoped>
  .category {
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
  }

  .content {
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 49px;

    display: flex;
    overflow: hidden;
  }

  .tab-content {
    height: 100%;
    flex: 1;
  }

</style>
