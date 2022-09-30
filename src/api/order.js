// 订单相关的api
import request from "@/utils/request"

// 结算页面 - 创建订单
export const createOrder = () => {
  return request('/member/order/pre', 'get')
}

// 添加收货地址
export const addAddress = (form) => {
  return request('/member/address', 'post', form)
}

// 添加收货地址
export const editAddress = (form) => {
  return request(`/member/address/${form.id}`, 'put', form)
}

// 提交订单
export const submitOrder = (params) => {
  return request('/member/order', 'post', params)
}

// 根据订单id获取订单信息
export const findOrderDetail = (id) => {
  return request(`/member/order/${id}`, 'get')
}

// 获取订单
export const findOrderList = ({ page = 1, pageSize = 10, orderState = 0}) => {
  return request(`/member/order`, 'get', { page, pageSize, orderState })
}

// 取消订单
export const cancelOrder = ({ orderId, cancelReason }) => {
  return request(`/member/order/${orderId}/cancel`, 'put', { cancelReason })
}

// 删除订单
export const deleteOrder = (orderId) => {
  return request(`/member/order`, 'delete', { ids: [orderId] })
}

// 确认收货
export const confirmOrder = (orderId) => {
  return request(`/member/order/${orderId}/receipt`, 'put')
}

// 获取订单物流
export const logisticsOrder = (orderId) => {
  return request(`/member/order/${orderId}/logistics`, 'get')
}

// 再次购买
export const findOrderRepurchase = (id) => {
  return request(`/member/order/repurchase/${id}`, 'get')
}
