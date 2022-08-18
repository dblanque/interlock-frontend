import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import router from './router'

Vue.config.productionTip = false

const notificationBus = new Vue()

new Vue({
  vuetify,
  i18n,
  router,
  render: h => h(App)
}).$mount('#app')

export { notificationBus }