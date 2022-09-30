<template>
  <div class="member-detail-detail" v-if="order">
    <!-- 头部 -->
    <DetailActive :order="order"></DetailActive>
    <!-- 进度 -->
    <DetailStep :order="order"></DetailStep>
    <!-- 物流 -->
    <Suspense>
      <template #default>
        <!-- 把要渲染的组件放在里面 -->
        <DetailLogistics v-if="[3,4,5].includes(order.orderState)" :order="order"></DetailLogistics>
      </template>

      <template #fallback>
        <!-- 在组件setup执行完毕之前代替组件 -->
        <div class="loading">加载中...</div>
      </template>
    </Suspense>
    <!-- 信息 -->
    <Detail-info :order="order"></Detail-info>

  </div>
</template>

<script>
import { ref } from 'vue'
import { findOrderDetail } from '@/api/order'
import { useRoute } from 'vue-router'
import DetailActive from './components/detail-active'
import DetailStep from './components/detail-step'
import DetailLogistics from './components/detail-logistics'
import DetailInfo from './components/detail-info.vue'
export default {
  name: 'MemberDetail',
  components: { DetailActive, DetailStep, DetailLogistics, DetailInfo },
  setup () {
    const route = useRoute()
    const order = ref(null)
    findOrderDetail(route.params.id).then(data => {
      order.value = data.result
    })

    return { order }
  }
}
</script>

<style scoped lang='less'>
.member-detail-detail {
  background-color: #fff;
  height: 100%;
}
.loading {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  color: #999;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
}
</style>