import './assets/main.css'

import 'element-plus/dist/index.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia';

import Index from './index.vue'
import router from './router'

const app = createApp(Index)
const pinia = createPinia();

app.use(pinia)

app.use(router)

app.mount('#app')
