<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a @click="changeBrand(i.id)" :class="{active: i.id === filterData.selectedBrand}" href="javascript:;" v-for="i in filterData.brands" :key="i.id">{{ i.name }}</a>
      </div>
    </div>
    <div class="item" v-for="i in filterData.saleProperties" :key="i.id">
      <div class="head">{{ i.name }}</div>
      <div class="body">
        <a @click="changeProp(i, prop.id)" :class="{active: prop.id === i.selectedProp}" href="javascript:;" v-for="prop in i.properties" :key="prop.id">{{ prop.name }}</a>
      </div>
    </div>
  </div>
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryFilter } from '@/api/category'
export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    const route = useRoute()
    const filterData = ref([])
    const filterLoading = ref(false) // 加载动画

    // 监听二级类目id的变化，筛选出数据
    watch(() => route.params.id, (newValue) => {
      // 变化后的id有值，且处于二级类名目录下
      if (newValue && `/category/sub/${newValue}` === route.path) {
        filterLoading.value = true
        // 发请求
        findSubCategoryFilter(route.params.id).then(res => {
          // 给每组数据加上选中的id
          res.result.selectedBrand = null
          // 添加每组可选筛选条件
          res.result.brands.unshift({ id: null, name: '全部' })
          // 属性
          res.result.saleProperties.forEach(item => {
            item.selectedProp = null
            item.properties.unshift({ id: null, name: '全部' })
          })
          // 设置修改的数据
          filterData.value = res.result
          filterLoading.value = false
        })
      }
    }, { immediate: true })

    // 获取筛选参数函数
    const getFilterParams = () => {
      const obj = {
        brandId: null,
        attrs: []
      }
      // 品牌
      obj.brandId = filterData.value.selectedBrand
      // 销售属性
      filterData.value.saleProperties.forEach(item => {
        // 如果选择了东西，就寻找这一项
        if (item.selectedProp) {
          const prop = item.properties.find(prop => prop.id === item.selectedProp)
          obj.attrs.push({ groupName: item.name, propertyName: prop.name })
        }
      })
      // 参考数据 { brandId: '', attrs: [{ groupName: '', propertyName: ''}]}
      // 这个判断的意义是，如果没有数据就设置为null，为null的字段发请求时不会被携带
      if (obj.attrs.length === 0) obj.attrs = null
      return obj
    }

    // 记录当前选择的品牌
    const changeBrand = (id) => {
      // 去除多余请求
      if (filterData.value.selectedBrand === id) return
      filterData.value.selectedBrand = id
      emit('filter-change', getFilterParams())
    }
    // 记录选择的销售属性
    const changeProp = (i, propId) => {
      // 去除多余请求
      if (i.selectedProp === propId) return
      i.selectedProp = propId
      emit('filter-change', getFilterParams())
    }

    return { filterData, filterLoading, changeBrand, changeProp }
  }
}
</script>
<style scoped lang='less'>
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;

  .item {
    display: flex;
    line-height: 40px;

    .head {
      width: 80px;
      color: #999;
    }

    .body {
      flex: 1;

      a {
        margin-right: 36px;
        transition: all .3s;
        display: inline-block;

        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}

.xtx-skeleton {
  padding: 10px 0;
}
</style>
