import Vue from 'vue';
import Router from 'vue-router';

import Home from './views/Home.vue';
import Alert from './views/Alert.vue';
import Contact from './views/Contact.vue';
import Login from './views/Login.vue';
import Account from './views/Account.vue';
import Register from './views/Register.vue';
import Article from './views/Article.vue';
import ArticleTgvmax from './views/articles/ArticleTgvmax.vue';
import ArticleAlert from './views/articles/ArticleAlert.vue';
import ArticleApplication from './views/articles/ArticleApplication.vue';
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
      path: '/contact',
      name: 'Contact',
      component: Contact,
    },
    {
      path: '/articles',
      name: 'Articles',
      component: Article,
    },
    {
      path: '/articles/tgvmax-rentable',
      name: 'Tgvmax',
      component: ArticleTgvmax,
    },
    {
      path: '/articles/tgvmax-alerte',
      name: 'Alerte TGVmax',
      component: ArticleAlert,
    },
    {
      path: '/articles/application-maxplorateur',
      name: 'Application',
      component: ArticleApplication,
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
      path: '/compte',
      name: 'Compte',
      component: Account,
    },
    {
      path: '*',
      component: NotFound,
    },
  ],
});

export default router;
