export default {
  namespaced: true,
  state () {
    return {
      // 用户信息
      profile: {
        id: '', // id
        avatar: '', // 头像
        nickname: '', // 昵称
        account: '', // 账户
        mobile: '', // 手机
        token: '' // token
      },
      // 登录后回跳的数据
      redirectUrl: '/'
    }
  },
  mutations: {
    // 修改用户信息
    setUser (state, payload) {
      state.profile = payload
    },
    // 修改回调地址的方法
    setRedirectUrl (state, url) {
      state.redirectUrl = url
    }
  }
}
