// 购物车相关api
import request from '@/utils/request'

// 更新商品（获取商品最新信息）
export const getNewCartGoods = (skuId) => {
  return request(`/goods/stock/${skuId}`, 'get')
}

// 获取商品sku信息
export const getSpecsAndSku = (skuId) => {
  return request(`/goods/sku/${skuId}`, 'get')
}

// 合并购物车（服务器）
export const mergeCart = (cartList) => {
  return request('/member/cart/merge', 'post', cartList)
}

// 获取用户的购物车列表
export const findCart = () => {
  return request('/member/cart', 'get')
}

// 加入购物车
export const insertCart = ({ skuId, count }) => {
  return request('/member/cart', 'post', { skuId, count })
}

// 删除购物车（可批量删除）
export const deleteCart = (ids) => {
  return request('/member/cart', 'delete', { ids })
}

// 修改购物车商品
export const updateCart = ({ skuId, selected, count }) => {
  return request(`/member/cart/${skuId}`, 'put', { selected, count })
}

// 全选与反选
export const checkAllCart = ({ selected, ids }) => {
  return request('/member/cart/selected', 'put', { selected, ids })
}
