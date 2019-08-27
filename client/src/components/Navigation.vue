<template>
  <nav class='mb-5'>
    <!-- Start of app navbar (large screen) -->
    <v-app-bar app>
      <!-- hamburger menu -->
      <v-app-bar-nav-icon @click='drawer = !drawer' class='hidden-md-and-up'></v-app-bar-nav-icon>
      <v-toolbar-title>
        <div class="hidden-md-and-up">{{getRouteName()}}</div>
        <router-link to="/" class="toolbar-title hidden-sm-and-down">{{title}}</router-link>
      </v-toolbar-title>
      <v-spacer class='hidden-sm-and-down'></v-spacer>
      <v-toolbar-items class='hidden-sm-and-down'>
        <v-btn v-for='item in navigation.slice(1)' :key='item.title' :to='item.path' text>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <!-- End of app navbar -->

    <!-- Start of mobile navbar (small screen) -->
    <v-navigation-drawer v-model= 'drawer' app>
      <!-- Mobile menu title -->
      <v-toolbar class='primary white--text' flat>
        <v-toolbar-title>Maxplorateur</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <!-- Start of mobile menu -->
      <v-list nav>
        <v-list-item v-for="item in navigation" :key="item.title" :to='item.path' link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- End of mobile menu -->
  </nav>
</template>

<script>
export default {
  name: 'Navigation',
  data() {
    return {
      title: 'Maxplorateur',
      drawer: false,
      navigation: [
          { icon: 'home', title: 'Accueil', path: '/' },
          { icon: 'notifications', title: 'Alertes', path: '/alert' },
          { icon: 'near_me', title: 'Destinations', path: '/destination' },
          { icon: 'email', title: 'Contact', path: '/contact' },
      ],
    };
  },
  methods: {
    getRouteName() {
      return this.$route.name;
    },
  },
};
</script>

<style scoped>
.toolbar-title {
  color: black;
  text-decoration: none;
}
</style>
