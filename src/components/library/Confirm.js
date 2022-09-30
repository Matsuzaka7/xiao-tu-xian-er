// 调用Confirm函数显示 xtx-confirm组件
// 导入需要使用的组件
import { createVNode, render } from "vue"
import XtxConfirm from "./xtx-confirm.vue"

// 准备一个dom容器装载组件
const div = document.createElement("div")
div.setAttribute("class", "xtx-confirm-container")
document.body.appendChild(div)

// 返回一个promise对象，无论点确定还是取消，都会销毁组件
// 点击事件在vue组件中，而响应函数是在本js文件中，要怎样才能对应上呢？
// - 可以准备两个对应的函数，然后传递给 createVNode 函数，在vue组件内接收该方法，再调用即可
export default ({ title, text }) => {
  return new Promise((resolve, reject) => {
    // 点击取消的回调函数
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('点击取消'))
    }
    // 点击确认的回调函数
    const submitCallback = () => {
      render(null, div)
      resolve()
    }
    // 使用createVNode创建虚拟节点
    // 使用render渲染组件
    const vn = createVNode(XtxConfirm, { title, text, cancelCallback, submitCallback })
    render(vn, div)
  });
};
