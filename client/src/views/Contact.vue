<template>
  <v-container>
    <h1 class="display-1">Vous êtes un utilisateur de maxplorateur.fr et ...</h1>
    <v-list-item class='mt-5'>
      <v-list-item-content>
        <v-list-item-title><v-icon>error_outline</v-icon> Vous avez repéré un bug</v-list-item-title>
        <v-list-item-title class='mt-2'><v-icon>train</v-icon> La gare que vous recherchez n'est pas disponible</v-list-item-title>
        <v-list-item-title class='mt-2'><v-icon>trending_up</v-icon> Vous avez une idée d'amélioration à proposer</v-list-item-title>
        <v-list-item-title class='mt-2'><v-icon>record_voice_over</v-icon> Vous avez une question à poser</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <p class='mt-2'>Envoyez un email à <a href="mailto:maxplorateur@gmail.com">maxplorateur@gmail.com</a>. Essayez d'être le plus précis possible (capture d'écran du bug, nom exact de la gare ...) !</p>
    <h1 class="display-1">Vous êtes développeur ou webdesigner ...</h1>
    <p class='mt-5'>Le projet est open source et disponible sur <a href='https://github.com/benoitdemaegdt/TGVmax'>github</a>. N'hésitez pas à venir y contribuer ! 🤓</p>
  </v-container>
</template>

<script>
export default {
  name: 'Contact',
};
</script>

<style scoped>

</style>