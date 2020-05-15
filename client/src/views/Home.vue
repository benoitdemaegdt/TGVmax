<template>
  <v-container>
    <v-row class="mt-5">
      <v-col cols="12">
        <h1 class="font-weight-bold text-center">
          Recevez une alerte quand votre <span class="underline">TGVmax</span> est disponible
        </h1>
        <p class="text-center mt-3">
          Maxplorateur analyse <span>sans interruption</span> la disponibilité des TGVmax et vous alerte dès que le votre se libère.
        </p>
        <div class="mt-8" style="text-align:center;">
          <v-btn class="text-center" color="primary" :to="{ name: 'Alertes' }">Créer une alerte</v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="mt-5">
        <h2 class="font-weight-bold text-center">
          Comment ça marche ?
        </h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="4" class="mt-5">
        <p class="text-center display-1">👌</p>
        <p class="text-center">Vous créez une alerte pour votre trajet. Simple. Gratuit.</p>
      </v-col>
      <v-col cols="12" sm="4" class="mt-5">
        <p class="text-center display-1">🤖</p>
        <p class="text-center">Un robot vérifie <span>toutes les 30 minutes</span> si un billet TGVmax est disponible pour votre trajet.</p>
      </v-col>
      <v-col cols="12" sm="4" class="mt-5">
        <p class="text-center display-1">🚀</p>
        <p class="text-center">Une place disponible a été détectée ? Vous recevez une alerte et pouvez aller réserver votre place !</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Home'
};
</script>

<style scoped>
.container {
  width: 85%;
  max-width: 1200px;
  padding: 0px;
}

.underline {
  text-decoration: underline #009688;
}

span {
  font-weight: bold;
}
</style>
