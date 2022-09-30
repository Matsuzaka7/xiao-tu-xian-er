import { userAccountCheck } from '@/api/user'
// 给vee-validate提供校验规则的
export default {
  // 校验用户名
  account (value) {
    if(!value) return '请输入用户名'
    // 规则：字母开头，6-20字符之间
    if (!/^[a-zA-z]\w{5,19}$/.test(value)) return '字母开头，且6-20个字母'
    return true
  },
  // 用户校验且校验昵称是否重复（需要发请求）
  async accountApi (value) {
    if(!value) return '请输入用户名'
    if (!/^[a-zA-z]\w{5,19}$/.test(value)) return '字母开头，且6-20个字母'
    // 发请求
    const data = await userAccountCheck(value)
    if (data.result.valid) return '用户名已存在'
    return true
  },
  // 密码校验
  password (value) {
    if(!value) return '请输入密码'
    // 规则：6-24个字符
    if (!/^\w{6,24}$/.test(value)) return '密码6-24个字符'
    return true
  },
  // 确认密码校验
  rePassword (value, { form }) {
    if(!value) return '请输入密码'
    // 规则：6-24个字符
    if (!/^\w{6,24}$/.test(value)) return '密码6-24个字符'
    // form是表单数据对象
    if (value !== form.password) return '两次密码不一致'
    return true
  },
  // 手机号
  mobile (value) {
    if(!value) return '请输入手机号'
    if (!/^1[3-9]\d{9}$/.test(value)) return '手机号错误'
    return true
  },
  // 验证码
  code (value) {
    if(!value) return '请输入验证码'
    if (!/\d{6}$/.test(value)) return '验证码为6位'
    return true
  },
  // 校验是否同意隐私条款
  isAgree (value) {
    if(!value) return '请勾选登录协议'
    return true
  }
}