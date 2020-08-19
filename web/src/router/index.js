import Vue from 'vue';
import VueRouter from 'vue-router';

import Chamado from '../views/Chamado.vue';

Vue.use(VueRouter);

  const routes = [
  {
    path: '/abrir-chamado',
    name: 'Abrir Chamado',
    component: Chamado
  },
  {
    path: '/*',
    redirect: "/abrir-chamado"
  }
];

const router = new VueRouter({
  routes
});

export default router;
