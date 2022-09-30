<script>
import { useVModel } from '@vueuse/core'
import { provide } from 'vue'
export default {
  name: 'XtxTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup (props, { emit }) {
    // 接收v-model的值，修改时并通知父组件
    const activeName = useVModel(props, 'modelValue', emit)
    // 点击选项卡的回调函数
    const tabClick = (name, index) => {
      activeName.value = name
      // 提供一个tab-click自定义事件，返回被点击的名字与索引
      emit('tab-click', { name, index })
    }
    provide('activeName', activeName)
    return { activeName, tabClick }
  },
  render () {
    // 返回的内容会进行渲染 在babel的帮助下，可以在vue中写jsx语法
    // 获取插槽结构
    const panel = this.$slots.default()
    // 动态渲染的集合
    const dynamicPanel = []
    // 遍历插槽
    panel.forEach(item => {
      // 如果有props代表有静态数据
      if (item.props) {
        dynamicPanel.push(item)
      }
      // 如果有children，代表动态数据(v-for)，再进行遍历即可
      if (item.children?.length) {
        item.children.forEach(children => {
          dynamicPanel.push(children)
        })
      }
    })

    const nav = <nav>{ 
      dynamicPanel.map((item, i) => {
        return <a onClick={() => this.tabClick(item.props.name, i)} class={{ active: item.props.name === this.activeName }} href="javascript:;">{item.props.label}</a>
      }) 
    }
    </nav>

    return <div class="xtx-tabs">{[nav, dynamicPanel]}</div>
  }
}
</script>

<style scoped lang='less'>
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>