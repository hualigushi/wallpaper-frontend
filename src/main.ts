import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import router from '@/router/index';
import './style.css'
import App from './App.vue'

const app = createApp(App);
app.use(router).use(ElementPlus, {
    locale: zhCn,
}).mount('#app')
