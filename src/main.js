import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'

import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import toast from 'components/common/toast'

// 是阻止显示生产模式的消息
Vue.config.productionTip = false

//事件总线实例
Vue.prototype.$bus=new Vue()
//安装toast插件
//Vue.use 就会调用 toast 对象的install函数
Vue.use(toast)

//解决移动端300ms延迟
FastClick.attach(document.body)

//使用懒加载插件
Vue.use(VueLazyLoad,{
  loading: require('./assets/img/common/placeholder.png')
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
