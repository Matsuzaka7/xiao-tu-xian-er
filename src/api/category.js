// 定义分类相关的api
import request from '@/utils/request'

// 获取所有分类
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}

// 顶级类目信息
export const findTopCategory = (id) => {
  return request('/category', 'get', { id })
}

// 获取二级类目的筛选条件数据
export const findSubCategoryFilter = (id) => {
  return request('/category/sub/filter', 'get', { id })
}

// 获取更多分类下的商品 (带筛选条件)
export const findSubCategoryGoods = (params) => {
  return request('/category/goods/temporary', 'post', params)
}
