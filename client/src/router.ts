import Vue from 'vue';
import Router from 'vue-router';

import Home from './views/Home.vue';
import Alert from './views/Alert.vue';
import Destination from './views/Destination.vue';
import Contact from './views/Contact.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Accueil',
      component: Home,
    },
    {
      path: '/alert',
      name: 'Alertes',
      component: Alert,
    },
    {
      path: '/destination',
      name: 'Destinations',
      component: Destination,
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact,
    },
  ],
});
