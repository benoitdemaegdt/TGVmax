<template>
  <v-card>
    <v-card-title class="cardTitle primary white--text">
      Suppression
    </v-card-title>

    <v-card-text class="cardText mt-3">
      Êtes-vous sûr de vouloir supprimer cette alerte ?
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
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
  methods: {
    deleteTravelAlert() {
      this.$emit('delete:travelAlert');
      this.closeDialog();
    },
    closeDialog() {
      this.$emit('close:dialog');
    }
  }
};
</script>
