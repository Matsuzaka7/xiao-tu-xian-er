<template>
  <div class="xtx-pagination">
    <!-- 分成两个元素是因为，我们需要给可以点击的元素绑定事件。如果使用动态类名，那么用户可以直接修改类名进行点击，会有问题 -->
    <a @click="changePager(myCurrentPage-1)" v-if="myCurrentPage > 1" href="javascript:;">上一页</a>
    <a v-else href="javascript:;" class="disabled">上一页</a>
    <span v-if="pager.start > 1">...</span>
    <a @click="changePager(i)" href="javascript:;" :class="{active: i === myCurrentPage}" v-for="i in pager.btnArr" :key="i">{{i}}</a>
    <span v-if="pager.end < pager.pageCount">...</span>
    <a @click="changePager(myCurrentPage+1)" v-if="myCurrentPage < pager.pageCount" href="javascript:;">下一页</a>
    <a v-else href="javascript:;" class="disabled">下一页</a>
  </div>
</template>
<script>
import { ref, computed, watch } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    // 总页数
    total: {
      type: Number,
      default: 100
    },
    // pageSize
    pageSize: {
      type: Number,
      default: 10
    },
    // 起始值
    currentPage: {
      type: Number,
      default: 1
    }
  },
  setup (props, { emit }) {
    // 需要数据
    // 约定：一组按钮的个数 5 个。如果需要是动态的，需要变为响应式数据
    const count = 5
    // 当前显示的页码
    const myCurrentPage = ref(5)
    // 总页数 = 总条数 / 每一页个数（向上取整
    const myTotal = ref(100)
    const myPageSize = ref(10)
    // 其他数据（总页数，起始按钮，结束按钮，按钮数组）依赖上面的数据得到
    const pager = computed(() => {
      // 总页数
      const pageCount = Math.ceil(myTotal.value / myPageSize.value)
      // 起始按钮，结束按钮，按钮数组
      // 1. 理想情况下：
      const offset = Math.floor(count / 2)
      let start = myCurrentPage.value - offset
      let end = start + count - 1

      // 2. 处理边界（小于1）
      if (start < 1) {
        start = 1
        end = (start + count - 1) > pageCount ? pageCount : (start + count - 1)
      }
      // 3. 处理边界（大于总数）
      if (end > pageCount) {
        end = pageCount
        start = (end - count + 1) < 1 ? 1 : (end - count + 1)
      }
      
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      // 提供计算属性数据
      return { pageCount, start, end, btnArr  }
    })

    // 监听props的变化，更新组件内部数据
    watch(props, () => {
      myTotal.value = props.total
      myPageSize.value = props.pageSize
      myCurrentPage.value = props.currentPage
    }, { immediate: true })

    // 切换分页的函数
    const changePager = (page) => {
      myCurrentPage.value = page
      // 通知父组件
      emit('currentPage', page)
    }

    return { pager, myCurrentPage, changePager }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
