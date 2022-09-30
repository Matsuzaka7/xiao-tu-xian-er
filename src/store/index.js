import { createStore } from 'vuex'
// 持久化插件
import persistedstate from 'vuex-persistedstate'

import user from './modules/user'
import cart from './modules/cart'
import category from './modules/category'
export default createStore({
  modules: {
    user, cart, category
  },
  // 配置插件
  plugins: [
    persistedstate({
      // 本地存储名字
      key: 'erabbit',
      // 指定需要存储的模块
      paths: ['user', 'cart']
    })
  ]
})
