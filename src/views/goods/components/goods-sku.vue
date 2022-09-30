<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{item.name}}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img :class="{selected: val.selected, disabled: val.disabled}" @click="changeSku(val, item.values)" v-if="val.picture" :src="val.picture" :title="val.name">
          <span :class="{selected: val.selected, disabled: val.disabled}" @click="changeSku(val, item.values)" v-else>{{val.name}}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import powerSet from '@/vender/power-set'
const spliter = '☆'
// 得到一个路径字典对象
const getPathMap = (skus) => {
  // 1. 得到所有的sku集合 props.goods.skus
  // 2. 筛选出有效的路径
  // 3. 根据有效的sku使用power-get算法得到子集
  // 4. 根据子集往路径字典中存储key-value

  const pathMap = {}
  skus.forEach(sku => {
    // 判断是否有库存（有效数据）
    if(sku.inventory > 0) {
      // 计算有效数据的子集
      // 例如 [1, 2, 3] 得到 [[1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]
      const valueArr = sku.specs.map(value => value.valueName)
      // 可选值数组子集
      const valueArrPower = powerSet(valueArr)
      // 遍历子集，往pathMap中插入子集，约定key是以 ☆ 进行拼接的，例如：['蓝色', '50cm'] ==> '蓝色☆50cm'
      valueArrPower.forEach(arr => {
        const key = arr.join(spliter)
        // 往字典里添加路径 (如果有这个数据就往现有的数据中添加商品, 没有这个数据就添加商品的数组)
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}

const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach(item => {
        // 选择的按钮对象
        const selectedVal = item.values.find(val => val.selected)
        arr.push(selectedVal ? selectedVal.name : undefined)
  })
  return arr
}

// 更新按钮禁言状态
const updateDisabledStatus = (specs, pathMap) => {
  specs.forEach((item, index) => {
    const selectedValues = getSelectedValues(specs)
    item.values.forEach(val => {
      // 判断当前是否选中，已选中的不用判断（防止多次判断）
      if (val.selected) return 
      // 拿当前值按照顺序套入选中的值数组
      selectedValues[index] = val.name
      // 剔除undefined数据，按照分隔符拼接字符串
      const key = selectedValues.filter(value => value).join(spliter)
      // 拿着kay去字典查找对应的数据，如果没找到则禁用(true)
      val.disabled = !pathMap[key]
    })
  })
}

// 默认选中
const initDefaultSelected = (goods, skuId) => {
  // 找出sku的信息
  const sku = goods.skus.find(sku => sku.id === skuId)
  // 遍历每一个按钮，找出符合id（这个id中有该商品的所有规格）的就选中
  goods.specs.forEach((item, index) => {
    const val = item.values.find(val => val.name === sku.specs[index].valueName)
    val.selected = true
  })

}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)
    // 根据id来初始化选中状态
    if (props.skuId) {
      initDefaultSelected(props.goods, props.skuId)
    }
    // 组件初始化时需要初始化一次按钮状态
    updateDisabledStatus(props.goods.specs, pathMap)

    // 选中与取消，约定每一个按钮都有自己的选中数据：selected
    const changeSku = (val, item) => {
      // 如果当前商品无货，则不能点击
      if (val.disabled) return
      // 取消其他的选择，选中当前的选择
      if (val.selected) {
        val.selected = false
      } else {
        item.forEach(ValItem => ValItem.selected = false)
        val.selected = true
      }
      // 点击按钮更新禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)
      // 将选择的sku信息通知父组件 { skuId, price, oldPrice, inventory, specsText }
      // 1. 选择完整的sku组合按钮，才提交给父组件
      // 2. 不是完整的sku组合按钮，提交空对象给父组件
      const validSelectedValues = getSelectedValues(props.goods.specs)
      // 判断 如果数组中没有undefined，则选中了完整路径
      if (!validSelectedValues.includes(undefined)) {
        // 寻找对应的id
        const skuIds = pathMap[validSelectedValues.join(spliter)]
        // 从当前所有组合中 按照id寻找对应的组合
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id, // id
          price: sku.price, // 新价格
          oldPrice: sku.oldPrice, // 旧价格
          inventory: sku.inventory, // 库存
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}：${c.valueName}`, '').trim(), // 商品文本 = 属性值 + 属性名1... + 属性值 + 属性名2...
        })
      } else {
        // 给父组件空对象是因为，父组件需要判断规格是否完整，不完整不能加入购物车
        emit('change', {})
      }
    }

    return { changeSku }
  }
}
</script>

<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
