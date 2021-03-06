import {ADD_COUNTER,ADD_TO_CART} from './mutation-types'

export default {
  //mutations 唯一的目的就是修改state中的状态
  //mutations 中的每个方法尽可能完成的事件比较单一
  //这里addCart 里面做了两件事 所以把它放到actions里面

  //数量加1
  [ADD_COUNTER](state,payload){
    payload.count++
  },
  [ADD_TO_CART](state,payload){
    payload.checked=true;
    state.cartList.push(payload)
  }
}
