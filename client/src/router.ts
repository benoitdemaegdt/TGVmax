import Vue from 'vue';
import Router from 'vue-router';

import Home from './views/Home.vue';
import Alert from './views/Alert.vue';
import Destination from './views/Destination.vue';
import Contact from './views/Contact.vue';
import Login from './views/Login.vue';
import Logout from './views/Logout.vue';
import Register from './views/Register.vue';
import NotFound from './components/NotFound.vue';

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
      path: '/alertes',
      name: 'Alertes',
      component: Alert,
      meta: {
        private: true,
      },
    },
    {
      path: '/destinations',
      name: 'Destinations',
      component: Destination,
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact,
    },
    {
      path: '/inscription',
      name: 'Création d\'un compte',
      component: Register,
    },
    {
      path: '/connexion',
      name: 'Connexion',
      component: Login,
    },
    {
      path: '/deconnexion',
      name: 'Déconnexion',
      component: Logout,
    },
    {
      path: '*',
      component: NotFound,
    },
  ],
});

export default router;
