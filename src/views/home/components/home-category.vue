<template>
  <div class='home-category' @mouseleave='categoryId = null'>
    <ul class='menu'>
      <li :class='{ active: categoryId === item.id }' v-for='item in menuList' :key='item.id'
        @mouseenter='categoryId = item.id'>
        <RouterLink :to='`/category/${item.id}`'>{{ item.name }}</RouterLink>
        <template v-if='item.children'>
          <RouterLink v-for='sub in item.children' :key='sub.id' :to='`/category/sub/${sub.id}`'>{{ sub.name }}
          </RouterLink>
        </template>

        <template v-else>
          <!-- 骨架屏 -->
          <XtxSkeleton  bg="rgba(255,255,255,.2)" width='60px' height='18px' style='margin-right: 5px;'></XtxSkeleton>
          <XtxSkeleton  bg="rgba(255,255,255,.2)" width='50px' height='18px'></XtxSkeleton>
        </template>
      </li>
    </ul>
    <!-- 弹出层 -->
    <div v-if='currCategory && currCategory.goods' :class='{"layer" : categoryId !== null}'>
      <h4>{{ currCategory && currCategory.id === 'brand' ? '品牌' : '分类' }}推荐 <small>根据您的购买或浏览记录推荐</small></h4>
      <ul>
        <li v-for='goods in currCategory.goods' :key='goods.id'>
          <RouterLink to='/'>
            <img :src='goods.picture' alt=''>
            <div class='info'>
              <p class='name ellipsis-2'>{{ goods.name }}</p>
              <p class='desc ellipsis'>{{ goods.desc }}</p>
              <p class='price'><i>¥</i>{{ goods.price }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
      <!-- 品牌结构 -->
      <ul v-if='currCategory && currCategory.brands'>
        <li class='brand' v-for='brand in currCategory.brands' :key='brand.id'>
          <RouterLink to='/'>
            <img :src='brand.picture' alt=''>
            <div class='info'>
              <p class='place'><i class='iconfont icon-dingwei'></i>{{ brand.place }}</p>
              <p class='name ellipsis'>{{ brand.name }}</p>
              <p class='desc ellipsis-2'>{{ brand.desc }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { findBrand } from '@/api/home'
import XtxSkeleton from '@/components/library/xtx-skeleton.vue'

export default {
  name: 'HomeCategory',
  setup () {
    const store = useStore()
    // 最终使用的数据
    const brand = reactive({
      id: 'brand',
      name: '品牌',
      children: [{ id: 'brand-children', name: '品牌推荐' }],
      // 品牌列表
      brands: []
    })
    const menuList = computed(() => {
      // 得到9个分类，且每个分类下只有两个子分类
      const list = store.state.category.list.map(item => {
        return {
          id: item.id,
          name: item.name,
          children: item.children && item.children.slice(0, 2),
          goods: item.goods
        }
      })
      list.push(brand)
      return list
    })
    // 得到弹出层的数据
    const categoryId = ref(null)
    const currCategory = computed(() => {
      return menuList.value.find(item => item.id === categoryId.value)
    })
    // 获取品牌
    findBrand().then(data => {
      brand.brands = data.result
    })
    return { menuList, categoryId, currCategory }
  },
  components: { XtxSkeleton }
}
</script>

<style scoped lang='less'>
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;

  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;

      &:hover,
      &.active {
        background: @xtxColor;
      }

      a {
        margin-right: 4px;
        color: #fff;

        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
}

// 弹出层
.layer {
  width: 990px;
  height: 500px;
  background: rgba(255, 255, 255, 0.8);
  position: absolute;
  left: 250px;
  top: 0;
  display: none;
  padding: 0 15px;

  h4 {
    font-size: 20px;
    font-weight: normal;
    line-height: 80px;

    small {
      font-size: 16px;
      color: #666;
    }
  }

  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      width: 310px;
      height: 120px;
      margin-right: 15px;
      margin-bottom: 15px;
      border: 1px solid #eee;
      border-radius: 4px;
      background: #fff;

      &:nth-child(3n) {
        margin-right: 0;
      }

      a {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        padding: 10px;

        &:hover {
          background: #e3f9f4;
        }

        img {
          width: 95px;
          height: 95px;
        }

        .info {
          padding-left: 10px;
          line-height: 24px;
          width: 190px;

          .name {
            font-size: 16px;
            color: #666;
          }

          .desc {
            color: #999;
          }

          .price {
            font-size: 22px;
            color: @priceColor;

            i {
              font-size: 16px;
            }
          }
        }
      }
    }

    // 品牌的样式
    li.brand {
      height: 180px;

      a {
        align-items: flex-start;

        img {
          width: 120px;
          height: 160px;
        }

        .info {
          p {
            margin-top: 8px;
          }

          .place {
            color: #999;
          }
        }
      }
    }

  }
}

&:hover {
  .layer {
    display: block;
  }
}

// 骨架动画
.xtx-skeleton {
  animation: fade 1s linear infinite alternate;
}
@keyframes fade {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
}
</style>
