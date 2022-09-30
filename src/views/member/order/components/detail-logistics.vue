<template>
  <div class="detail-logistics">
    <p>
      <span>{{list[0].text}}</span>
      <span>{{list[0].time}}</span>
    </p>
    <a href="javascript:;" @click="handlerLogistics(order)">查看物流</a>
    <Teleport to="body">
      <OrderLogistics ref="orderLogisticsCom"></OrderLogistics>
    </Teleport>
  </div>
</template>
<script>
import { ref, toRef } from 'vue'
import { logisticsOrder } from '@/api/order'
import { useLogistics } from '../index.vue'
import OrderLogistics from './order-logistics'
export default {
  name: 'DetailLogistics',
  components: { OrderLogistics },
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  // 不推荐给setup加async的原因是因为组件实例化需要初始化setup，而添加async后就变为了异步函数，会被放在事件循环后面执行
  // 如果要使用，需要在父组件配合suspense组件一起使用，suspense做了一件事情，等待setup执行完毕再进行渲染
  async setup (props) {
    const data = await logisticsOrder(props.order.id)
    return { list: toRef(data.result, 'list'), ...useLogistics() }
  }
}
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;

  >p {
    flex: 1;

    span {
      color: #999;

      &:first-child {
        margin-right: 30px;
      }
    }
  }

  >a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
