import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

import Home from './views/Home.vue';
import Alert from './views/Alert.vue';
import Destination from './views/Destination.vue';
import Contact from './views/Contact.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';

Vue.use(Router);

const router: Router = new Router({
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
      meta: {
        private: true,
      },
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
    {
      path: '/register',
      name: 'Création d\'un compte',
      component: Register,
    },
    {
      path: '/login',
      name: 'Connexion',
      component: Login,
    },
  ],
});

export default router;
