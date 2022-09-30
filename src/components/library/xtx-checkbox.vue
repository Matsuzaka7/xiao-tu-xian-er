<template>
  <div class="xtx-checkbox" @click="changeChecked">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <!-- 通过$slots.default判断是否传入了slot -->
    <span v-if="$slots.default"><slot /></span>
  </div>
</template>
<script>
import { ref, watch } from 'vue'
// import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxCheckbox',
  props: {
    // v-model ==> :modelValue + @update:modelValue
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    // 方式一、自己书写监听 与 emit
    const checked = ref(false)
    const changeChecked = () => {
      checked.value = !checked.value
      // 修改后 通过emit通知父组件的v-model数据改变
      emit('change', checked.value)
    }

    // 使用watch，得到父组件传递过来的数据，给checked赋值
    watch(() => props.modelValue, () => {
      checked.value = props.modelValue
    }, { immediate: true })
    return { checked, changeChecked }
   

    // 方式二、使用vueUse中useVModel函数
    // 使用方式：必须通过props接收到数据，将该数据放入函数中
    // 第一个参数：props对象  第二个参数：v-model的名称  第三个参数：emit方法
    // 触发 emit('update:modelValue') 事件
    /* const checked = useVModel(props, 'modelValue', emit)
    const changeChecked = () => {
      const newVal = !checked.value
      // 通知父组件改值
      checked.value = newVal
      console.log(newVal);
      emit('change', newVal)
    }
    return { checked, changeChecked } */
  }
}
</script>
<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
