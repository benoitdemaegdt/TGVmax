<template>
  <v-container>
    <h1 class="display-1">Trouvez une destination</h1>
    <v-list-item class='mt-5'>
      <v-list-item-content>
        <v-list-item-title><v-icon>place</v-icon> Indiquez une ville de départ</v-list-item-title>
        <v-list-item-title class='mt-2'><v-icon>event</v-icon> Sélectionnez une date de départ et une date de retour</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <p>L'assistant Maxplorateur se charge de trouver tous les voyages TGVmax aller/retour disponibles !</p>
    <p class="font-italic">Fonctionnalité en cours de développement</p>
  </v-container>
</template>

<script>
export default {
  name: 'Destination',
};
</script>

<style scoped>

</style>