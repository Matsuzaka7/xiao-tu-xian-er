<template>
  <!-- 一级路由 -->
  <router-view></router-view>
</template>

<script>
import request from '@/utils/request'
import XtxConfirm from './components/library/xtx-confirm.vue'
export default {
    name: "App",
    setup() {
        const fn = () => {
            request("/member/profile", "post", { a: 10 });
        };
        return {
            fn
        };
    },
    components: { XtxConfirm }
}
</script>
<style lang="less">
</style>
