import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

import AboutComponent from './components/AboutComponent';
import HomeComponent from './components/HomeComponent'

Vue.config.productionTip = false

Vue.use(VueRouter);
Vue.use(Buefy);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeComponent
  },
  {
    path: '/about',
    name: 'About',
    component: AboutComponent
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
