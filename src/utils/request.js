// axios封装
import axios from 'axios'
import store from '@/store'
import router from '@/router'

export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
// export const baseURL = 'https://www.apifox.cn/apidoc/shared-fa9274ac-362e-4905-806b-6135df6aa90e/doc-842135/'
const instance = axios.create({
  // axios 的一些配置，baseUrl 以及 timeout
  baseURL,
  timeout: 5000
})

// 请求拦截器：携带token
instance.interceptors.request.use((config) => {
  config.headers.Connection = `keep-alive`
  // config.headers['sec-ch-ua'] = ".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"
  // 拦截业务
  // 1. 获取用户信息对象
  const { profile } = store.state.user
  // 2. 判断是否有token，没有就设置
  if (profile.token) {
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截器：1. 去除无效数据  2. 处理token失效
// res => res.data，直接取出数据，拿到的数据就是服务器传递回的数据
instance.interceptors.response.use((res) => res.data, err => {
  // 401 状态码，进入该函数（退出登录时进入）
  if (err.response && err.response.status === 401) {
    // 1. 清空本地无用数据
    store.commit('user/setUser', {})

    // 2. 跳转到登录页，需要传参 (当前路由地址) 给登录页
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    router.push(`/login?redirectUrl=${fullPath}`)
  }
  return Promise.reject(err)
})

// 导出函数发送请求、返回promise
export default (url, method, submitData) => {
  // 负责发请求：请求地址，请求方式，提交的数据
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
