import {request} from "./request";

//获取分类
export function getCategory() {
  return request({
    url:'/category'
  })
}

//获取对应分类的商品数据
export function getSubcategory(maitKey) {
  return request({
    url: '/subcategory',
    params: {
      maitKey
    }
  })
}


export function getCategoryDetail(miniWallkey, type) {
  return request({
    url: '/subcategory/detail',
    params: {
      miniWallkey,
      type
    }
  })
}
