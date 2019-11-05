<template>
  <v-container class="mt-5">
    <v-row>
      <!-- Installation -->
      <v-col lg="4" md="6" sm="12">
        <v-card class="mx-auto" max-width="344" raised>
          <v-img src="@/assets/app.png" height="200px"> </v-img>
          <v-card-title>
            L'application Maxplorateur est disponible sur Android et iOS !
          </v-card-title>

          <v-card-subtitle>
            Suivez le guide pour installer l'application Maxplorateur sur votre
            smartphone !
          </v-card-subtitle>

          <v-card-actions>
            <v-btn color="primary" text to="/articles/application-maxplorateur"
              >Lire</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Alertes TGVmax -->
      <v-col lg="4" md="6" sm="12">
        <v-card class="mx-auto" max-width="344" raised>
          <v-img src="@/assets/notification.png" height="200px"> </v-img>
          <v-card-title>
            Comment recevoir une alerte quand mon trajet TGVmax est disponible ?
          </v-card-title>

          <v-card-subtitle>
            Un billet TGVmax peut se libérer n'importe quand dans les 30 jours
            précédant le trajet. Apprenez à créer une alerte de disponibilité !
          </v-card-subtitle>

          <v-card-actions>
            <v-btn color="primary" text to="/articles/tgvmax-alerte"
              >Lire</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Rentable -->
      <v-col lg="4" md="6" sm="12">
        <v-card class="mx-auto" max-width="344" raised>
          <v-img src="@/assets/tgvmax.png" height="200px"> </v-img>
          <v-card-title>
            TGVmax, un abonnement rentable ?
          </v-card-title>

          <v-card-subtitle>
            La promesse TGVmax est alléchante : voyager en illimité pour
            79€/mois ! Offre trompeuse ou réelle opportunité pour les
            maxplorateurs ?
          </v-card-subtitle>

          <v-card-actions>
            <v-btn color="primary" text to="/articles/tgvmax-rentable"
              >Lire</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Article',
  data() {
    return {};
  }
};
</script>

<style scoped>
.v-card__title {
  word-break: normal;
}
</style>
