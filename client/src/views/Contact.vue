<template>
  <v-container class="mt-5">
    <h1 class="display-1">Vous êtes <span>maxplorateur</span> et ...</h1>
    <p class="mt-5">
      <v-icon>mdi-alert-circle-outline</v-icon> Vous avez repéré un bug
    </p>
    <p class="mt-2">
      <v-icon>mdi-train</v-icon> La gare que vous recherchez n'est pas
      disponible
    </p>
    <p class="mt-2">
      <v-icon>mdi-trending-up</v-icon> Vous avez une idée d'amélioration à
      proposer
    </p>
    <p class="mt-2">
      <v-icon>mdi-voice</v-icon> Vous avez une question à poser
    </p>
    <p class="mt-2">
      Envoyez un email à
      <a href="mailto:maxplorateur@gmail.com">maxplorateur@gmail.com</a>.
      Essayez d'être le plus précis possible (capture d'écran du bug, nom exact
      de la gare ...) !
    </p>
    <h1 class="display-1 mt-5">
      Vous êtes <span>développeur</span> ou <span>webdesigner</span> ...
    </h1>
    <p class="mt-5">
      Le projet est open source et disponible sur
      <a href="https://github.com/benoitdemaegdt/TGVmax">github</a>. N'hésitez
      pas à venir y contribuer ! 🤓
    </p>
  </v-container>
</template>

<script>
export default {
  name: 'Contact'
};
</script>

<style scoped>
span {
  text-decoration: underline #009688;
}
</style>
