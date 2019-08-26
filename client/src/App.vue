<template>
  <v-app>
    <navigation></navigation>

    <v-content>
      <!-- Display view pages here based on route -->
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Navigation from '@/components/Navigation.vue';

export default Vue.extend({
  name: 'App',
  components: {
    Navigation,
  },
});
</script>
