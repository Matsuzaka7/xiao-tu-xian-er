import { getNewCartGoods, mergeCart, findCart, insertCart, deleteCart, updateCart, checkAllCart } from "@/api/cart"

// 购物车
export default {
  namespaced: true,
  state () {
    return {
      list: [] // 购物车列表
    }
  },
  getters: {
    // 有效商品列表
    validList (state) {
      // 有效商品：库存大于0
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
    },
    // 有效商品总件数
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      // math.round 处理 0.1+0.2丢失精度问题
      return getters.validList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 无效商品列表
    inValidList (state) {
      return state.list.filter(goods => goods.stock <= 0 || !goods.isEffective)
    },
    // 已选商品列表
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 已选商品件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 已选商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 是否全选
    isCheckAll (state, getters) {
      return getters.selectedList.length !== 0 && getters.selectedList.length === getters.validList.length
    }
  },
  mutations: {
    // 加入购物车
    insertCart (state, payload) {
      // 字段要和服务器需要的字段一致，因为登录时需要将购物车的数据发给服务器
      // id, skuId, name, attrsText, picture, price, nowPrice, selected, stock, count, isEffective
      // 插入商品规则： 先查找是否有相同的商品，如果有则添加数量，如果没有则添加商品
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      if (sameIndex > -1) {
        const count = state.list[sameIndex].count
        payload.count += count
        // 删除原来
        state.list.splice(sameIndex, 1)
      }
      // 追加新的
      state.list.unshift(payload)
    },
    // 修改购物车商品
    updateCart (state, goods) {
      // goods商品信息(字段不固定): nowPrice, stock, isEffective
      // 判断字段值合法才可改(必须有skuId)
      const updateGoofs = state.list.find(item => item.skuId === goods.skuId)
      // 遍历数据修改
      for (const key in goods) {
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoofs[key] = goods[key]
        }
      }
    },
    // 删除购物车商品
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    // 设置购物车
    setCart (state, payload) {
      // payload 为空数组则清空，为有值数组即设置
      state.list = payload
    }
  },
  actions: {
    // 合并购物车
    async mergeCart (ctx) {
      // 准备需要的数据
      const cartList = ctx.state.list.map(goods => {
        return { skuId: goods.skuId, selected: goods.selected, count: goods.count}
      })
      await mergeCart(cartList)
      // 合并成功了 需要清空本地购物车
      ctx.commit('setCart', [])
    },
    // 修改规格
    updateCartSku (ctx, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录，没有现成借口，因此和未登录逻辑一致
          // 找出旧的商品信息
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          // 删除旧的商品
          deleteCart([oldGoods.skuId]).then(() => {
          // 原先商品数量+新skuId
            return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
          }).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })

        } else {
          // 未登录
          // 找出旧的商品信息
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          // 删除旧的商品
          ctx.commit('deleteCart', oldSkuId)
          // 根据新sku和旧商品合并成一条新的购物车商品数据
          const { skuId, price: nowPrice, specsText: attrsText, inventory: stock } = newSku
          const newGoods = {...oldGoods, skuId, nowPrice, attrsText, stock }
          // 添加新商品
          ctx.commit('insertCart', newGoods)
          resolve()
        }
      })
    },
    // 批量删除
    batchDeleteCart (ctx, isClear) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          const ids = ctx.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          deleteCart(ids).then(() => {
            // 返回了一个promise，因此可以继续then，拿这个数据
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录, 找出选择的商品，遍历调用删除方法
          // 如果isClear为真，就寻找invalidList，否则selectedList
          ctx.getters[isClear ? 'invalidList' : 'selectedList']?.forEach(goods => {
            ctx.commit('deleteCart', goods.skuId)
          })
          resolve()
        }
      })
    },
    // 删除购物车
    deleteCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 1. 已登录 (修改本地存储的数据，同时发请求给服务器)
          deleteCart([payload]).then(() => {
            // 返回了一个promise，因此可以继续then，拿这个数据
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 2. 未登录 (修改本地存储的数据)
          // 单条删除 payload 就是 skuId
          ctx.commit('deleteCart', payload)
          resolve()
        }
      })
    },
    // 全选与取消全选
    checkAllCart (ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          const ids = ctx.getters.validList.map(item => item.skuId)
          checkAllCart({ selected, ids }).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.getters.validList.forEach(goods => {
            ctx.commit('updateCart', { skuId: goods.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 修改购物车(选中状态，数量)
    updateCart (ctx, payload) {
      // payload 必须：skuId, 可选：selected, count
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 1. 已登录 (修改本地存储的数据，同时发请求给服务器)
          updateCart(payload).then(data => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 2. 未登录 (修改本地存储的数据)
          // 单条删除 payload 就是 skuId
          ctx.commit('updateCart', payload)
          resolve()
        }
      })
    },
    // 加入购物车（需要发请求给服务器的）
    insertCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 1. 已登录 (修改本地存储的数据，同时发请求给服务器)
          insertCart({ skuId: payload.skuId, count: payload.count }).then(() => {
            // 返回了一个promise，因此可以继续then，拿这个数据
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
         // 2. 未登录 (修改本地存储的数据)
          ctx.commit('insertCart', payload)
          resolve()
        }
      })
    },
    // 查找购物车中最新数据（需要发请求给服务器获取最新数据）
    findCart (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 1. 已登录 (修改本地存储的数据，同时发请求给服务器)
          findCart().then(data => {
            ctx.commit('setCart', data.result)
          })
        } else {
          // 2. 未登录 (发请求，有几个商品发几次请求，等所有请求完成再去 修改本地存储的数据)
          const PromiseAll = ctx.state.list.map(goods => {
            return getNewCartGoods(goods.skuId) 
          })
          // 获取所有商品的最新数据
          Promise.all(PromiseAll).then(res => {
            // 更新购物车
            res.forEach((data, i) => {
              ctx.commit('updateCart', { skuId: ctx.state.list[i].skuId, ...data.result })
            })
            resolve()
          })
        }
      })
    },
  }
}
