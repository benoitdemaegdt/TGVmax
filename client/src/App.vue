<template>
  <v-app>
    <navigation></navigation>

    <v-content>
      <!-- Display view pages here based on route -->
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Vue from 'vue';
import Navigation from '@/components/Navigation.vue';

export default Vue.extend({
  name: 'App',
  components: {
    Navigation
  },
  created() {
    /**
     * if jwt is expired : logout
     */
    this.$http.interceptors.response.use(undefined, err => {
      const errorResponse = err.response;
      if (
        errorResponse.status === 401 &&
        errorResponse.config &&
        !errorResponse.config.__isRetryRequest &&
        errorResponse.data &&
        errorResponse.data.message === 'jwt expired'
      ) {
        this.$store.dispatch('logout');
        this.$router.push('/');
      }
      throw err;
    });
  }
});
</script>
