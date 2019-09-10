<template>
  <v-container>
    <h1 class="display-1">Déconnexion</h1>
    <p>Pour vous déconnecter, cliquez sur le bouton ci-dessous</p>
    <v-btn color='primary' @click='logout()'>Me déconnecter</v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'Logout',
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/');
    },
  },
};
</script>