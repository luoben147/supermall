import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'

import toast from 'components/common/toast'

Vue.config.productionTip = false

//事件总线实例
Vue.prototype.$bus=new Vue()
//安装toast插件
//Vue.use 就会调用 toast 对象的install函数
Vue.use(toast)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
