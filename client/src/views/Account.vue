<template>
  <v-container class='mt-5'>
    <div v-if='isLoggedIn'>
      <h2 class='headline mb-2'>Mon statut</h2>
      <p>Connecté ✅</p>
      <h2 class='headline mb-2'>Mon adresse email</h2>
      <p>{{email}}</p>
      <h2 class='headline mb-2'>Mon numéro TGVmax</h2>
      <p>{{tgvmaxNumber}}</p>
      <br>
      <h2 class='headline mb-2'>Déconnexion</h2>
      <p>Pour vous déconnecter, cliquez sur le bouton ci-dessous</p>
      <v-btn color='primary' @click='logout()'>Me déconnecter</v-btn>
    </div>
    <div v-else>
      <h1 class="display-1">Vous devez être connecté pour avoir accès à votre compte</h1>
      <v-btn to='/connexion' class='primary mt-5'>Je me connecte</v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'Account',
  mounted() {
    if (this.isLoggedIn) {
      this.getUser();
    }
  },
  data() {
    return {
      email: '',
      tgvmaxNumber: '',
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/');
    },
    async getUser() {
      try {
        const response = await this.$http.get(`${process.env.VUE_APP_API_BASE_URL}/api/v1/users/${this.$store.state.userId}`);
        const body = await response.data;
        this.email = body.email;
        this.tgvmaxNumber = body.tgvmaxNumber;
      } catch (err) {
        console.log(err);
      }
    },
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
};
</script>