<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card>
          <v-card-title class="primary white--text">
            <span class="headline">Se connecter</span>
          </v-card-title>
          <v-card-text class="mt-5">
            <v-form ref="loginForm" @submit.prevent="login">
              <v-text-field
                label="email"
                :rules="[v => !!v || 'email obligatoire']"
                v-model="email"
                prepend-icon="mdi-account"
              />
              <v-text-field
                :type="showPassword ? 'text' : 'password'"
                label="mot de passe"
                :rules="[
                  v => !!v || 'mot de passe obligatoire',
                  v =>
                    v.length >= 8 ||
                    'Le mot de passe doit comporter au moins 8 caractères'
                ]"
                v-model="password"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
              />
            </v-form>
            <div class="text-center">
              <v-progress-circular
                v-show="loading"
                indeterminate
                color="primary"
              ></v-progress-circular>
              <p
                v-if="error"
                class="text-center subtitle-2 red--text mt-2 mb-0"
              >
                {{ this.errorMessage }}
              </p>
            </div>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="primary" @click="login()">Se connecter</v-btn>
          </v-card-actions>
          <v-divider class="mt-5"></v-divider>
          <v-card-actions class="justify-center">
            <v-btn text small :to="{ name: 'Inscription' }"
              >Je n'ai pas de compte</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      showPassword: false,
      error: false,
      errorMessage: '',
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      if (this.$refs.loginForm.validate()) {
        try {
          this.clearState();
          this.loading = true;
          await this.$store.dispatch('login', {
            email: this.email,
            password: this.password
          });
          this.loading = false;
          this.$router.push('/alertes');
        } catch (err) {
          this.loading = false;
          this.error = true;
          this.errorMessage = err.message;
        }
      }
    },
    clearState() {
      this.error = false;
      this.errorMessage = '';
    }
  }
};
</script>

<style scoped></style>
