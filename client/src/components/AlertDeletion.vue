<template>
  <v-card>
    <v-card-title class="cardTitle primary white--text">
      Suppression
    </v-card-title>

    <v-card-text class="cardText mt-3">
      Êtes-vous sûr de vouloir supprimer cette alerte ?
      <div class="text-center">
        <v-progress-circular
          v-show="loading"
          indeterminate
          color="primary"
        ></v-progress-circular>
        <p v-if="error" class="subtitle-2 red--text mt-2 mb-0">
          {{ this.errorMessage }}
        </p>
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="justify-center">
      <v-btn class="closeBtn" color="#616161" text @click="closeDialog()">
        Annuler
      </v-btn>
      <v-btn class="deleteBtn" color="red" text @click="deleteTravelAlert()">
        Supprimer
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'alert-deletion',
  props: {
    alert: Object
  },
  data() {
    return {
      loading: false,
      error: false,
      errorMessage: ''
    };
  },
  methods: {
    async deleteTravelAlert() {
      try {
        this.clearState();
        this.loading = true;
        await this.$store.dispatch('deleteAlert', this.alert);
        this.loading = false;
        this.closeDialog();
      } catch (err) {
        this.loading = false;
        this.error = true;
        this.errorMessage = err.message;
      }
    },
    closeDialog() {
      this.$emit('close:dialog');
    },
    clearState() {
      this.error = false;
      this.errorMessage = '';
    }
  }
};
</script>
