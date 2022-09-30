// 模拟数据
import Mock from 'mockjs'
import qs from 'qs'
// 基本配置
Mock.setup({
  timeout: '500-1000', // 随机的延迟
})

// 拦截接口
// 参数：接口地址 请求方式 返回数据
Mock.mock(/\/my\/test/, 'get', () => {
  const data = []
  for(let i = 0; i < 5; i++) {
    // .mock('@id') 方法生成一个随机的id
    data.push(Mock.mock({
      id: '@id',
      name: '@cname',
      img: '@image(200x100)'
    }))
  }
  return { msg: '数据获取成功', result: data }
})

// 模拟我的收藏
Mock.mock(/\/member\/collect/, 'get', (config) => {
  const queryString = config.url.split('?')[1]
  const queryObject = qs.parse(queryString)
  const item = []
  for (let i = 0; i < +queryObject.pageSize; i++) {
    item.push(Mock.mock({
      id: '@id',
      name: '@ctitle(10,20)',
      description: '@ctitle(10,40)',
      price: '@float(100,200,2,2)',
      picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
    }))
  }
  return {
    msg: '获取收藏商品成功',
    result: {
      counts: 35, // 生成的数据条数
      pageSize: +queryObject.pageSize,
      page: +queryObject.page,
      items: item
    }
  }
})