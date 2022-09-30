// 提供复用函数

import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { ref, onUnmounted } from 'vue'
import dayjs from 'dayjs'

// 懒加载的函数
export const useLazyData = (apiFn) => {
  const target = ref(null)
  const result = ref([])
  // stop 停止观察， target 监听的目标元素， isIntersecting 是否进入可视区
  const { stop } = useIntersectionObserver(target, ([{ isIntersecting }], observerElement) => {
    if (isIntersecting) {
      stop()
      // 外界传入的回调函数，获取数据
      apiFn().then(data => {
        result.value = data.result
      })
    }
  },
  // 配置选项
  {
    // 设置阈值，相交的比例大于0就触发懒加载
    threshold: 0
  }
  )
  return { result, target }
}

// countDown 倒计时秒数 
export const usePayTime = () => {
  // 倒计时逻辑, 回调函数, 执行事件, 是否立即执行
  // resume 开启，pause 停止
  const time = ref(0)
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(() => {
    time.value--
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    if (time.value < 0) {
      pause()
    }
  }, 1000, false)
  onUnmounted(() => {
    pause()
  })

  // 开启函数
  const start = (countDown) => {
    time.value = countDown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }
  return { start, timeText, time }
}