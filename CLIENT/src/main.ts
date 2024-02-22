import 'bootstrap/dist/css/bootstrap.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { authentication } from './plugin/authenmtication'
const app = createApp(App)

app.use(createPinia())

authentication.install().then(() => {
  app.use(router)
  app.mount('#app')
})
