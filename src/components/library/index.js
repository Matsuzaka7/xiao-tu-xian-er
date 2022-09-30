// 扩展vue原有的功能的插件
// vue2中插件写法：导出一个对象，有install函数，传入vue构造函数
// vue2中插件写法：导出一个对象，有install函数，传入App实例

// import XtxSkeleton from './xtx-skeleton.vue'
import defaultImg from '@/assets/images/200.png'
import Message from './Message'
import Confirm from './Confirm'

// 导入目录下的所有vue组件
// 参数：1. 目录  2. 是否加载子目录  3. 加载的正则匹配
const importFn = require.context('./', false, /\.vue$/)

export default {
  install (app) {
    // 在app之上进行扩展
    // 如果要挂载到原型，需要使用：app.config.globalProperties.xxx = xxx
    // app.component(XtxSkeleton.name, XtxSkeleton)

    // 批量注册全局组件
    importFn.keys().forEach((key) => {
      // 导入组件
      const component = importFn(key).default
      // 注册组件
      app.component(component.name, component)
    })

    // 定义指令
    defineDirective(app)

    // 定义原型函数
    app.config.globalProperties.$message = Message
    app.config.globalProperties.$confirm = Confirm
  }
}

// 定义自定义指令
const defineDirective = (app) => {
  // 1. 图片懒加载指令 v-lazy
  // 原理：先存储图片地址，当图片进入可视区再赋值给src
  app.directive('lazy', {
    // vue2.0 监听使用指令的dom是否创建好，钩子函数：inserted
    // vue3.0 监听使用指令的dom是否创建好，钩子函数：mounted

    // el是监听的元素， binding指令是绑定的值
    mounted (el, binding) {
      // 2. 创建一个观察对象，来对观察对象进行操作
      const observe = new IntersectionObserver(
        ([{ isIntersecting }]) => {
          if (isIntersecting) {
            // 停止观察
            observe.unobserve(el)
            // 3. 把lazy指令的值设置给el的src
            // 4. 加载失败就把错误的地址赋值上
            el.onerror = () => {
              el.src = defaultImg
            }
            el.src = binding.value
          }
        },
        {
          // 相交距离为0时就触发
          threshold: 0
        }
      )
      // 开启观察
      observe.observe(el)
    }
  })
}
