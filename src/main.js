import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import '@/assets/styles/common.less'

// 引入自定义插件
import UI from '@/components/library/index'

// mockJs
import '@/mock'

createApp(App).use(store).use(router).use(UI).mount('#app')
