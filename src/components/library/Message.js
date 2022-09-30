// 提供一个显示xtx-message组件的函数
// 这个函数将来可以导入直接使用，也可以挂载在vue实例上

// 1. 导入组件
import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'

// 3. 准备一个容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)

// 定时器（用于清除标签）
let timer = null

export default ({ type, text }) => {
  // 渲染组件
  // 2. 将导入的消息提示组件，编译层虚拟dom节点
  // createVNode(组件, 属性对象) 方法可以将节点编译为dom
  const vnode = createVNode(XtxMessage, { type, text })

  // 4. 将虚拟节点渲染在容器中
  // render(虚拟节点, dom容器)
  render(vnode, div)

  // 5. 3s后销毁组件
  clearTimeout(timer)
  setTimeout(() => {
    render(null, div)
  }, 3000);
}