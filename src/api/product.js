// 商品详情的api
import request from '@/utils/request'

// 获取商品详情
export const findGoods = (id) => {
  return request('/goods', 'get', { id })
}

// 获取同类推荐 | 猜你喜欢
export const findRelevantGoods = ({id, limit = 16}) => {
  return request('/goods/relevant', 'get', { id, limit })
}

// 获取热销榜
export const findGoodsHot = ({id, limit = 3, type = 1}) => {
  return request('/goods/hot', 'get', { id, limit, type })
}

// 获取商品评价
export const findGoodsCommentInfo = (id) => {
  return request(`/goods/${id}/evaluate`, 'get')
  // 由于真实地址中没有数据，因此使用mock地址。axios遇见http/https开头的地址 不会再加上基准地址
  // return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get')
}

// 获取评价列表
export const findGoodsCommentList = (id, params) => {
  return request(`/goods/${id}/evaluate/page`, 'get', params)
  // 由于真实地址中没有数据，因此使用mock地址。axios遇见http/https开头的地址 不会再加上基准地址
  // return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get')
}
