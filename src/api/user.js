// 用户相关接口
import request from "@/utils/request"

// 登录
export const userAccountLogin = ({ account, password }) => {
  return request('/login', 'post', { account, password })
}

// 手机号验证码登录
export const userMobileLoginMsg = (mobile) => {
  return request('/login/code', 'get', { mobile })
}

// 手机号登录
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'post', { mobile, code })
}

// QQ登录
export const userQQLogin = (unionId, source = 1) => {
  return request('/login/social', 'post', { unionId, source })
}

// QQ登录 - 已有账号绑定手机(发送验证码)
export const userQQBindCode = (mobile) => {
  return request('/login/social/code', 'get', { mobile })
}

// QQ登录 - 已有账号绑定手机(立即绑定)
export const userQQBindLogin = ({ unionId, mobile, code }) => {
  return request('/login/social/bind', 'post', { unionId, mobile, code })
}

// QQ登录 - 没有账号，查询用户名是否重复
export const userAccountCheck = (account) => {
  return request('/register/check', 'get', { account })
}

// QQ登录 - 没有账号，手机号发验证码
export const userQQPatchCode = (mobile) => {
  return request('/register/code', 'get', { mobile })
}

// QQ登录 - 没有账号，完善信息
export const userQQPatchLogin = ({ unionId, mobile, code, password }) => {
  return request(`/login/social/${unionId}/complement`, 'post', { unionId, mobile, code, password })
}
