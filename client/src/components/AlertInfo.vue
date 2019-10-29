<template>
  <v-card>
    <v-card-title class='primary white--text'>
      Information
    </v-card-title>

    <v-card-text class='mt-3'>
      Dernière vérification de la disponibilité en TGVmax de ce trajet :<br>
      <div v-if='!alert.lastCheck' class='lastCheck'>Prochainement</div>
      <div v-else class='lastCheck'>{{getFrenchDate(alert.lastCheck)}} à {{getHour(alert.lastCheck)}}</div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn color="primary" text @click="closeDialog()">
        Fermer
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { getFrenchDate, getHour } from '../helper/date.ts';

export default {
  name: 'alert-info',
  props: {
    alert: Object,
  },
  created() {
    this.getFrenchDate = getFrenchDate;
    this.getHour = getHour;
  },
  methods: {
    closeDialog() {
      this.$emit('close:dialog');
    },
  },
}
</script>