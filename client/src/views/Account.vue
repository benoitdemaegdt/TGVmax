<template>
  <v-container class="mt-5">
    <div v-if="isLoggedIn">
      <h2 class="headline mb-2">Mon statut</h2>
      <p>Connecté ✅</p>
      <h2 class="headline mb-2">Mon adresse email</h2>
      <v-progress-circular
        v-show="loading"
        indeterminate
        color="primary"
      ></v-progress-circular>
      <p>{{ email }}</p>
      <h2 class="headline mb-2">Mon numéro TGVmax</h2>
      <v-progress-circular
        v-show="loading"
        indeterminate
        color="primary"
      ></v-progress-circular>
      <p>{{ tgvmaxNumber }}</p>
      <br />
      <h2 class="headline mb-2">Déconnexion</h2>
      <p>Pour vous déconnecter, cliquez sur le bouton ci-dessous</p>
      <v-btn color="primary" @click="logout()">Me déconnecter</v-btn>
    </div>
    <div v-else>
      <h1 class="display-1">
        Vous devez être connecté pour avoir accès à votre compte
      </h1>
      <v-btn :to="{ name: 'Connexion' }" class="primary mt-5"
        >Je me connecte</v-btn
      >
    </div>
  </v-container>
</template>

<script>
import UserService from '@/services/UserService.js';

export default {
  name: 'Account',
  mounted() {
    if (this.isLoggedIn) {
      this.getUser();
    }
  },
  data() {
    return {
      loading: false,
      email: '',
      tgvmaxNumber: ''
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/');
    },
    async getUser() {
      try {
        this.loading = true;
        const response = await UserService.getUser(
          this.$store.state.auth.userId
        );
        this.email = response.data.email;
        this.tgvmaxNumber = response.data.tgvmaxNumber;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    }
  }
};
</script>
