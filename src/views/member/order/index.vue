<template>
  <div class="member-order">
    <!-- tab组件 -->
    <XtxTabs v-model="activeName" @tab-click="changeTab">
      <XtxTabsPanel v-for="item in orderStatus" :key="item.name" :label="item.label" :name="item.name"></XtxTabsPanel>
    </XtxTabs>
    <!-- 列表订单 -->
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrderItem 
       @on-delete="handlerDelete" 
       @on-cancel="handlerCancel"
       @on-confirm="handlerConfirm"
       @on-logistics="handlerLogistics"
       v-for="item in orderList" 
       :key="item.id"
       :order="item">
      </OrderItem>
    </div>
    <!-- 分页组件 -->
    <XtxPagination @currentPage="reqParams.page = $event" v-if="total > 0" :current-page="reqParams.page" :page-size="reqParams.pageSize" :total="total"></XtxPagination>
    <!-- 取消原因组件 -->
    <OrderCancel ref="orderCancelCom"></OrderCancel>
    <!-- 查看物流 -->
    <OrderLogistics ref="orderLogisticsCom"></OrderLogistics>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import { findOrderList, deleteOrder, confirmOrder } from '@/api/order'
import Confirm from '@/components/library/Confirm.js'
import Message from '@/components/library/Message.js'
import XtxTabs from '@/components/library/xtx-tabs.vue'
import XtxTabsPanel from '@/components/library/xtx-tabs-panel'
import OrderItem from './components/order-item'
import OrderCancel from './components/order-cancel'
import OrderLogistics from './components/order-logistics'
export default {
  name: "MemberBorder",
  components: { XtxTabs, XtxTabsPanel, OrderItem, OrderCancel, OrderLogistics },
  setup () {
    const activeName = ref('all')
    
    // 查询的参数
    const reqParams = reactive({
      page: 1,
      pageSize: 8,
      orderState: 0
    })
    // 获取数据
    const loading = ref(false)
    const orderList = ref(null)
    const total = ref(0)
    const getOrderList = () => {
      findOrderList(reqParams).then(data => {
        orderList.value = data.result.items
        total.value = data.result.counts
        loading.value = false
      })
    }
    watch(reqParams, () => {
      loading.value = true
      getOrderList()
    }, { immediate: true })

    // 切换tab
    const changeTab = ({ index }) => {
      // 切换tab后，需要让页面回到1
      reqParams.page = 1
      // 将订单的状态数据进行更新
      reqParams.orderState = index
    }

    // 删除订单回调函数
    const handlerDelete = (order) => {
      Confirm({ text: '亲，确认删除该订单吗' }).then(data => {
        deleteOrder(order.id).then(data => {
          Message({ type: 'success', text: '删除成功'})
          getOrderList()
        })
      }).catch(e => {})
    }
    
    return { 
      activeName, 
      orderStatus, 
      changeTab, 
      orderList, 
      loading, 
      reqParams, 
      total, 
      handlerDelete, 
      ...useCancel(), 
      ...useConfirm(), 
      ...useLogistics() 
    }
  }
}

// 点击取消订单(order-item中emit出来的)时的回调函数
export const useCancel = () => {
  const orderCancelCom = ref(null)
  const handlerCancel = (order) => {
    // 使用组件内的函数，打开对话框
    orderCancelCom.value.open(order)
  }
  return { handlerCancel, orderCancelCom }
}

// 点击确认收货
export const useConfirm = () => {
  const handlerConfirm = (order) => {
    Confirm({ text: '亲，确认收货吗' })
    .then(() => {
      // 发送请求
      confirmOrder(order.id).then(() => {
        Message({ type: 'success', text: '收货成功' })
        // 修改订单状态：待收货 -> 待评价
        order.orderState = 4
      })
    })
    .catch(e => {})
  }
  return { handlerConfirm }
}

// 查看物流
export const useLogistics = () => {
  const orderLogisticsCom = ref(null)
  const handlerLogistics = (order) => {
    orderLogisticsCom.value.open(order)
  }
  return { handlerLogistics, orderLogisticsCom }
}
</script>

<style scoped lang='less'>
.member-order {
  height: 100%;
  background-color: #fff;
}

.order-list {
  background: #fff;
  padding: 20px;
  position: relative;
  min-height: 400px; 
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255,255,255,.9) url(../../../assets/images/loading.gif) no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>