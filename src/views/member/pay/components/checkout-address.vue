<template>
  <div class="checkout-address">
    <div class="text">
      <div class="none" v-if="!showAddress">您需要先添加收货地址才可提交订单。</div>
      <ul v-if="showAddress">
        <li><span>收<i />货<i />人：</span>{{showAddress.receiver}}</li>
        <li><span>联系方式：</span>{{showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})$/,'$1****$2')}}</li>
        <li><span>收货地址：</span>{{showAddress.fullLocation}} {{showAddress.address}}</li>
      </ul>
      <a @click="openAddressEdit(showAddress)" v-if="showAddress" href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <XtxButton @click="openDialog" class="btn">切换地址</XtxButton>
      <XtxButton @click="openAddressEdit({})" class="btn">添加地址</XtxButton>
    </div>
  </div>
  <!-- 切换收货地址组件 -->
  <XtxDialog title="切换收货地址" v-model:visible="visibleDialog">
    <div @click="selectedAddress = item" :class="{active: selectedAddress && selectedAddress.id === item.id}" class="text item" v-for="item in list" :key="item.id">
        <ul>
          <li><span>收<i/>货<i/>人：</span>{{item.receiver}}</li>
          <li><span>联系方式：</span>{{item.contact.replace(/^(\d{3})\d{4}(\d{4})$/,'$1****$2')}}</li>
          <li><span>收货地址：</span>{{item.fullLocation+item.address}}</li>
        </ul>
      </div>
    <template #footer>
      <XtxButton @click="visibleDialog = false" type="gray" style="margin-right:20px">取消</XtxButton>
      <XtxButton @click="confirmAddress" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
  <!-- 添加编辑收货地址组件 -->
  <AddressEdit @on-success="successHandler" ref="addressEdit"></AddressEdit>
</template>
<script>
import { ref } from 'vue'
import XtxDialog from '@/components/library/xtx-dialog.vue'
import AddressEdit from './address-edit.vue'

export default {
  name: "CheckoutAddress",
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  // 1. 在拥有根元素的组件中，触发emit，可以不用写emits选项
  // 2. 如果没有根元素，组件是一个代码片段，需要声明emits选项，否则会警告
  // 3. 提倡：触发了自定义事件就需要在emits中声明
  emits: ['change'],
  setup(props, { emit }) {
    const showAddress = ref(null)
    // 1. 找到默认收货地址
    const defaultAddress = props.list.find(item => item.isDefault === 0)
    // 2. 没有默认收货地址，使用第一条地址
    if (defaultAddress) { showAddress.value = defaultAddress }
    // 3. 如果没有收货地址，提示添加
    else { showAddress.value = props.list?.length && props.list[0] }

    // 默认通知父组件一个默认的收货地址Id
    emit('change', showAddress.value && showAddress.value.id)

    // 显示隐藏
    const visibleDialog = ref(false)

    // 记录当前已选择的地址id
    const selectedAddress = ref(null)

    // 确定按钮回调函数
    const confirmAddress = () => {
      // 显示的地址换成选中的地址
      showAddress.value = selectedAddress.value
      // 把选中的地址id通知给结算组件
      emit('change', selectedAddress.value.id)
      visibleDialog.value = false
    } 

    // 打开dialog的回调函数
    const openDialog = () => {
      // 将之前的选中改成空
      selectedAddress.value = null
      visibleDialog.value = true
    }

    // 添加收货地址组件
    const addressEdit = ref(null)
    const openAddressEdit = (address) => {
      // 如果address有数据，则是修改，如果是空对象，则是新增
      addressEdit.value.open(address)
    }

    // 修改地址组件提交成功的回调处理函数
    const successHandler = (formData) => {
      // 根据formData中的id去当前地址列表中查找，如果有就是修改
      const address = props.list.find(item => item.id === formData.id)
      if (address) {
        // 修改
        for (const key in address) {
          address[key] = formData[key]
        }
      } else {
        // 新增
        // 当修改formData时，数组中的数据也会更新，因为引用的是同一个对象
        // 当打开对话框时，需要清空之前的输入信息
        const jsonStr = JSON.stringify(formData)
        props.list.unshift(JSON.parse(jsonStr))
      }
      
    }

    return { showAddress, visibleDialog, selectedAddress, confirmAddress, openDialog, addressEdit, openAddressEdit, successHandler }
  },
  components: { XtxDialog, AddressEdit }
}
</script>
<style scoped lang="less">
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;

  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }

    >ul {
      flex: 1;
      padding: 20px;

      li {
        line-height: 30px;

        span {
          color: #999;
          margin-right: 5px;

          >i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }

    >a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }

  .action {
    width: 420px;
    text-align: center;

    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;

      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active {
        border-color: @xtxColor !important;
        background: lighten(@xtxColor,50%) !important;
      }
      &:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor,70%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
</style>
