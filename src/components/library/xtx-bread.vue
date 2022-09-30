<!-- <template>
  <div class='xtx-bread'>
    <div class="xtx-bread-item" v-if="parentName">
      <RouterLink v-if="parentPath" :to="parentPath">{{parentName}}</RouterLink>
      <span v-else>{{parentName}}</span>
    </div>
    <i v-if="parentName" class="iconfont icon-angle-right"></i>
    <div class="xtx-bread-item">
      <span><slot></slot></span>
    </div>
  </div>
</template> -->

<script>
import { h } from 'vue'
export default {
  name: 'XtxBread',
  render () {
    // vue2.0 的h函数传参进来的，vue3.0的h要导入进来
    // 返回值就是组件内容
    // h 第一个参数是标签名，第二个参数标签属性，第三个参数是子节点

    // 需求
    // 1. 创建容器
    // 2. 获取默认插槽内容
    // 3. 去除xtx-bread-item组件的i标签，应该由render函数来组织
    // 4. 遍历插槽中的item，得到一个动态创建的节点，最后一个item不加i标签
    // 5. 把动态创建的子节点渲染到xtx-bread标签中

    const items = this.$slots.default()
    const dymanicItems = []
    // 动态生成标签
    items.forEach((item, index) => {
      dymanicItems.push(item)
      // 最后一个不加i标签
      if (index < (item.length) - 1) {
        dymanicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
      }
    })
    return h('div', { class: 'xtx-bread' }, dymanicItems)
  },
  props: {
    // 父级类目路径
    parentPath: {
      type: [String, Object],
      default: '/'
    },
    // 父级类目名称
    parentName: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang='less'>
.xtx-bread-item span {
  display: flex;
}
.xtx-bread{
  display: flex;
  padding: 25px 10px;
  &-item {
    a {
      color: #666;
      transition: all .4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
    &:last-child {
      display: none;
    }
  }
}
</style>
