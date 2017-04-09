import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import VueCookie from 'vue-cookie'

Vue.use(VueCookie);
Vue.use(VueResource);

export const EventBus = new Vue();

new Vue({
  el: '#app',
  render: h => h(App)
})
