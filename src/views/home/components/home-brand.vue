<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <template v-slot:right>
      <a @click="toggle(-1)" :class="{ disabled: index === 0 }" href="javascript:;"
        class="iconfont icon-angle-left prev"></a>
      <a @click="toggle(+1)" :class="{ disabled: index === 1 }" href="javascript:;"
        class="iconfont icon-angle-right next"></a>
    </template>
    <div ref="target" class="box">
      <Transition name="fade">
        <ul v-if="brands.length" class="list" :style="{ transform: `translateX(${-index * 1240}px)` }">
          <li v-for="i in brands" :key="i.id">
            <RouterLink to="/">
              <img :src="i.picture" alt="">
            </RouterLink>
          </li>
        </ul>
        <div v-else class="skeleton">
          <XtxSkeleton class="item" v-for="i in 5" :key="i" animated bg="#e4e4e4" width="240px" height="305px" />
        </div>
      </Transition>
    </div>
  </HomePanel>
</template>

<script>
import { ref } from 'vue'
import { findBrand } from '@/api/home'
import { useLazyData } from '@/hooks'
import HomePanel from './home-panel'
export default {
  name: 'HomeBrand',
  components: { HomePanel },
  setup () {
    // const brands = ref([])
    /* findBrand(10).then(res => {
      brands.value = res.result
      console.log(brands.value)
    }) */
    const { result, target } = useLazyData(() => findBrand(10))

    // 切换图标函数
    const index = ref(0)
    const toggle = (num) => {
      const newIndex = index.value + num
      if (newIndex < 0 || newIndex > 1) return
      index.value = newIndex
    }

    return { brands: result, target, index, toggle }
  }
}
</script>

<style scoped lang='less'>
.home-panel {
  background: #f5f5f5
}

.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;

  &::before {
    font-size: 12px;
    position: relative;
    top: -2px
  }

  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}

.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;

  .list {
    width: 200%;
    display: flex;
    transition: all 1s;

    li {
      margin-right: 10px;
      width: 240px;

      &:nth-child(5n) {
        margin-right: 0;
      }

      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
</style>
