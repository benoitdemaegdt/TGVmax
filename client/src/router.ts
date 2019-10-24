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
      meta: {
        title: 'Maxplorateur | Création d\'alertes TGVmax',
        description: 'Maxplorateurs, optimisez l\'expérience TGVmax ! Recevez une notification lorsque votre trajet TGVmax est disponible !',
      },
    },
    {
      path: '/alertes',
      name: 'Alertes',
      component: Alert,
      meta: {
        title: 'Maxplorateur | Création d\'alertes TGVmax',
        description: 'Créez une alerte et recevez une notification lorsque votre trajet TGVmax est disponible !',
      },
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact,
      meta: {
        title: 'Maxplorateur | Création d\'alertes TGVmax',
        description: 'Une question ? Une remarque ? Contactez moi !',
      },
    },
    {
      path: '/articles',
      name: 'Articles',
      component: Article,
      meta: {
        title: 'Maxplorateur | Création d\'alertes TGVmax',
        description: 'Apprenez en plus sur l\'abonnement TGVmax : est-ce rentable ? Comment mettre une alerte de disponibilité ?',
      },
    },
    {
      path: '/articles/tgvmax-rentable',
      name: 'Tgvmax',
      component: ArticleTgvmax,
      meta: {
        title: 'Maxplorateur | Création d\'alertes TGVmax',
        description: 'Est-ce qu\'un abonnement TGVmax sera rentable pour vous ? Lisez l\'article pour le savoir !',
      },
    },
    {
      path: '/articles/tgvmax-alerte',
      name: 'Alerte TGVmax',
      component: ArticleAlert,
      meta: {
        title: 'Maxplorateur | Création d\'alertes TGVmax',
        description: 'Apprenez tout de suite à créer une alerte TGVmax et optimisez enfin votre abonnement !',
      },
    },
    {
      path: '/articles/application-maxplorateur',
      name: 'Application',
      component: ArticleApplication,
      meta: {
        title: 'Maxplorateur | Création d\'alertes TGVmax',
        description: 'L\'application Maxplorateur est désormais disponible sur Android et iOS. Suivez le guide pour l\'installer !',
      },
    },
    {
      path: '/inscription',
      name: 'Création d\'un compte',
      component: Register,
      meta: {
        title: 'Maxplorateur | Création d\'alertes TGVmax',
        description: 'Créez votre compte maxplorateur pour pouvoir mettre des alertes TGVmax',
      },
    },
    {
      path: '/connexion',
      name: 'Connexion',
      component: Login,
      meta: {
        title: 'Maxplorateur | Création d\'alertes TGVmax',
        description: 'Connectez-vous à votre compte maxplorateur pour pouvoir mettre des alertes TGVmax',
      },
    },
    {
      path: '/compte',
      name: 'Compte',
      component: Account,
      meta: {
        title: 'Maxplorateur | Création d\'alertes TGVmax',
        description: 'Votre compte maxplorateur !',
      },
    },
    {
      path: '*',
      component: NotFound,
      meta: {
        title: 'Maxplorateur | Création d\'alertes TGVmax',
        description: '',
      },
    },
  ],
});

/**
 * change description for SERP
 */
router.beforeEach((to, from, next) => {
  const googleDescription: HTMLMetaElement = document.head.querySelector('[name=description]') as HTMLMetaElement;
  googleDescription!.content = to.meta.description;
  next();
});

export default router;
