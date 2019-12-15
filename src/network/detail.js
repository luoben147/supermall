
import {request} from "./request";

/**
 * 根据id发送网络请求查询商品信息
 * @param iid
 */
export function getDetail(iid) {
  return request({
    url:'/detail',
    params:{
      iid
    }
  })
}

/**
 * 封装商品详情的基础信息
 */
export class Goods{
  constructor(itemInfo,columns,services){
    this.title=itemInfo.title;
    this.desc=itemInfo.desc;
    this.newPrice=itemInfo.price;
    this.oldPrice=itemInfo.oldPrice;
    this.discount=itemInfo.discountDesc;
    this.columns=columns;
    this.services=services;
    this.realPrice=itemInfo.lowNowPrice;
  }
}

/**
 * 封装店铺信息
 */
export class Shop {
  constructor(shopInfo) {
    this.logo = shopInfo.shopLogo;
    this.name = shopInfo.name;
    this.fans = shopInfo.cFans;
    this.sells = shopInfo.cSells;
    this.score = shopInfo.score;
    this.goodsCount = shopInfo.cGoods
  }
}
