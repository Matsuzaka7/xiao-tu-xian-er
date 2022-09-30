<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle" :class="{ active: visible }">
      <span v-if="!fullLocation" class="placeholder">{{placeholder}}</span>
      <span v-else class="value">{{fullLocation}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <div class="loading" v-if="loading"></div>
      <template v-else>
        <span class="ellipsis" v-for="item in currList" :key="item.code" @click="changeItem(item)">{{ item.name }}</span>
      </template>
      
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { onClickOutside } from '@vueuse/core';
import { ref, computed, reactive } from 'vue';
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择配送地址'
    }
  },
  setup (props, { emit }) {
    // 显示隐藏
    const visible = ref(false)
    // 所有省市区数据
    const allCityData = ref([])
    // 加载效果
    const loading = ref(false)
    const open = () => {
      visible.value = true
      loading.value = true
      getCityData().then(data => {
        // 接收数据
        allCityData.value = data
        loading.value = false
      }) 
      // 清空之前选择的省市区数据
      for (const key in changeResult) {
        changeResult[key] = ''
      }
    }
    const close = () => {
      visible.value = false
    }
    const toggle = () => {
      visible.value ? close() : open()
    }
    const target = ref(null)
    // vueuse中监听是否点击元素外的行为(点击外部时触发)
    // 参数1：元素，参数2：回调函数
    onClickOutside(target, () => {
      close()
    })

    // 实现计算属性：获取当前显示的地区数组
    const currList = computed(() => {
      // 默认省一级
      let list = allCityData.value
      // 市一级
      if (changeResult.provinceCode && changeResult.provinceName) {
        list = list.find(p => p.code === changeResult.provinceCode).areaList
      }
      // 区一级
      if (changeResult.cityCode && changeResult.cityName) {
        list = list.find(c => c.code === changeResult.cityCode).areaList
      }
      return list
    })
    // 定义选择的省市区数据
    const changeResult = reactive({
      // 省
      provinceCode: '',
      provinceName: '',
      // 市
      cityCode: '',
      cityName: '',
      // 区
      countyCode: '',
      countyName: '',
      // 完整路径
      fullLocation: ''
    })

    // 当点击地区按钮时触发的函数
    const changeItem = (item) => {
      if (item.level === 0) {
        // 点的是省
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      if (item.level === 1) {
        // 点的是市
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }
      if (item.level === 2) {
        // 点的是区
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        // 拼接完整路径
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        // 这是最后一级，关闭对话框，把数据通知给父组件
        close()
        emit('change', changeResult)
      }
    }
    return { target, visible, loading, toggle, currList, changeItem }
  }
}
// 获取省市区数据函数
const getCityData = () => {
  // 本地没缓存，发请求获取数据
  // 本地有缓存，使用本地数据
  return new Promise((res, rej) => {
    if (window.CityData) {
      res(window.CityData)
    } else {
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(({ data }) => {
        // 数据获取成功返回数据
        // 缓存数据
        window.cityData = data
        res(data)
      })
    }
  })
}
</script>
<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;

  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;

    &.active {
      background: #fff;
    }

    .placeholder {
      color: #999;
    }

    .value {
      color: #666;
      font-size: 12px;
    }

    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }

  .option {
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;

    >span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;

      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>