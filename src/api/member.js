// 个人中心
import request from "@/utils/request"

export const findCollectGoods = ({ page = 1, pageSize = 10, collectType = 1 }) => {
  return request('/member/collect', 'get', { page, pageSize, collectType })
}