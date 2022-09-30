<template>
  <div class="container">
    <!-- 首页入口 -->
    <div class="home-entry">
      <!-- 左侧分类 -->
      <homeCategory></homeCategory>
      <!-- 右侧轮播图 -->
      <homeBanner></homeBanner>
    </div>
  </div>
  <!-- 新鲜好物 -->
  <homeNew></homeNew>
  <!-- 人气推荐 -->
  <homeHot></homeHot>
  <!-- 品牌组件 -->
  <HomeBrand></HomeBrand>
  <!-- 商品列表 -->
  <HomeProduct></HomeProduct>
  <!-- 最新专题 -->
  <HomeSpecial></HomeSpecial>
</template>

<script>
import homeCategory from './components/home-category.vue'
import homeBanner from './components/home-banner.vue'
import homeNew from './components/home-new.vue'
import homeHot from './components/home-hot.vue'
import HomeBrand from './components/home-brand.vue'
import HomeProduct from './components/home-product.vue'
import HomeSpecial from './components/home-special'
export default {
  name: 'HomePage',
  components: { homeCategory, homeBanner, homeNew, homeHot, HomeBrand, HomeProduct, HomeSpecial },
  setup () {
  }
}
</script>
<style scoped lang="less">
</style>
