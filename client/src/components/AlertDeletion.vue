<template>
  <v-dialog v-model='show' persistent max-width='600px' overlay-opacity=0.1>
    <v-card>
      <v-card-title class='primary white--text'>
        Suppression
      </v-card-title>

      <v-card-text class='mt-3'>
        Êtes-vous sûr de vouloir supprimer cette alerte ?
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn color="#616161" text @click="show=false">
          Annuler
        </v-btn>
        <v-btn color="red" text @click="deleteTravelAlert();">
          Supprimer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'alert-deletion',
  props: {
    value: Boolean,
  },
  methods: {
    deleteTravelAlert() {
      this.$emit('delete:travelAlert');
      this.show = false;
    },
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>