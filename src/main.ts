import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Index from './index.vue'
import router from './router'

const app = createApp(Index)

app.use(createPinia())
app.use(router)

app.mount('#app')
