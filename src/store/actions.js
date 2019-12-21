import {ADD_COUNTER,ADD_TO_CART} from './mutation-types'
import {promised} from "q";


export default {
  /**
   * Action 通常是异步的，返回Promise可以让上层知道 action 什么时候结束
   * @param context
   * @param payload
   * @returns {Promise<any>}
   */
  addCart(context,payload){

    return new Promise((resolve, reject) =>{

      //payload 新添加的商品
      //1.查看是否添加过该商品,如果cartList中有元素的iid和负载的iid相等，则购物车中已经有该产品
      const oldProduct =  context.state.cartList.find(item=> item.iid === payload.iid)
      //2. 如果购物车中存在该产品，给其数量加1
      if(oldProduct){
        //oldProduct.count += 1
        context.commit(ADD_COUNTER,oldProduct)

        resolve('当前商品数量+1')
      }
      else{ //3.如果购物车中不存在该产品，给其数量加1，并推入到cartList数组中
        payload.count =1
        //context.state.cartList.push(payload)
        context.commit(ADD_TO_CART,payload)
        resolve('添加新的商品')
      }
    })
  }
}
