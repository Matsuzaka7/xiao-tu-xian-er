<template>
  <div class="xtx-numbox">
    <div class="label" v-if="label">{{label}}</div>
    <div class="numbox">
      <a href="javascript:;" @click="changeNum(-1)">-</a>
      <input type="text" readonly :value="modelValue">
      <a href="javascript:;" @click="changeNum(1)">+</a>
    </div>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core';
export default {
  name: 'XtxNumbox',
  props: {
    // 父组件传递的默认v-model，在这里接收
    modelValue: {
      type: Number,
      default: 1
    },
    // 商品数量最小值
    min: {
      type: Number,
      default: 1
    },
    // 商品数量最大值
    max: {
      type: Number,
      default: 10
    },
    label: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 监听按钮点击事件, 将新值通知给父组件，使用vueUse中的useVModel
    // 此时const就是一个响应式数据，修改const就会自动通知父组件
    const count = useVModel(props, 'modelValue', emit)
    const changeNum = (num) => {
      // 得到要改变的值，判断是否合法
      const newVal = count.value + num
      if (newVal < props.min || newVal > props.max) return
      // 合法的值
      count.value = newVal
      // 提供change事件
      emit('change', newVal)
    }

    return { changeNum }
  }
}
</script>
<style scoped lang="less">
.xtx-numbox {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right:1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left:1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
