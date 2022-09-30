<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread></SubBread>
      <!-- 筛选区 -->
      <SubFilter @filter-change="filterChange"></SubFilter>
      <!-- 排序 -->
      <div class="goods-list">
        <SubSort @sort-change="sortChange"></SubSort>
        <!-- 列表 -->
        <ul>
          <li v-for="i in goodsList" :key="i.id">
            <GoodsItem :goods="i" />
          </li>
        </ul>
        <XtxInfiniteLoading :finished="finished" :loading="loading" @infinite="getGoods"></XtxInfiniteLoading>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/goods-item.vue'
import XtxInfiniteLoading from '@/components/library/xtx-infinite-loading.vue'
import { useRoute } from 'vue-router'
import { findSubCategoryGoods } from '@/api/category'
export default {
  name: 'TopCategory',
  setup () {
    const route = useRoute()
    // 加载中
    const loading = ref(false)
    // 是否加载完毕
    const finished = ref(false)
    // 商品列表数据
    const goodsList = ref([])

    // 请求参数
    let reqParams = {
      page: 1,
      pageSize: 20
    }

    // 无限加载的回调函数，当滚到底部或没有数据时自动发送请求
    const getGoods = () => {
      loading.value = true
      // 设置二级分类的id
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(({ result }) => {
        // 如果有数据就合并数据
        if (result.items.length) {
          goodsList.value.push(...result.items)
          reqParams.page++
        } else {
          // 没有数据了就打开 finished
          finished.value = true
        }
        // 关闭加载动画
        loading.value = false
      })
    }

    // 更改二级分类时需要重新加载数据
    watch(() => route.params.id, (newVal) => {
      if (newVal && `/category/sub/${newVal}` === route.path) {
        // 重置状态
        finished.value = false
        goodsList.value = []
        reqParams = {
          page: 1,
          pageSize: 20
        }
      }
    })

    // 更改排序组件的筛选数据，重新请求
    const sortChange = (sortParams) => {
      // 重置状态
      finished.value = false
      // 合并请求参数
      reqParams = { ...reqParams, ...sortParams }
      // 每次更改参数后应该显示第一页，重新发请求
      reqParams.page = 1
      goodsList.value = []
    }
    // 更改赛选组件的筛选数据，重新请求
    const filterChange = (filterParams) => {
      finished.value = false
      // 合并请求参数，保留之前的参数
      reqParams = { ...reqParams, ...filterParams }
      reqParams.page = 1
      goodsList.value = []
    }
    return { loading, finished, getGoods, goodsList, sortChange, filterChange }
  },
  components: { SubBread, SubFilter, SubSort, GoodsItem, XtxInfiniteLoading }
}
</script>

<style lang="less" scoped>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;

  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;

    li {
      margin-right: 20px;
      margin-bottom: 20px;

      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
