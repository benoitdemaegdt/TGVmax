<template>
  <v-container>
    <v-row>
      <v-col md="6" sm="12" class="pa-10" style="background: white">
        <h1 class="display-1">Optimisez l'expérience <span>TGVmax</span></h1>
        <br />
        <h2 class="headline mb-2">C'est quoi le problème ? 🤔</h2>
        <p>
          Les billets TGVmax sont libérés aléatoirement dans les 30 jours
          précédant le trajet. Les braves maxplorateurs sont donc obligés de
          vérifier plusieurs fois par jour si leur trajet TGVmax est disponible.
        </p>
        <h2 class="headline mb-2">La solution ? 💡</h2>
        <p>
          Simplifiez vous la vie : recevez une notification dès que votre trajet
          est disponible !
        </p>
        <h2 class="headline mb-2">Le prix ? 💸</h2>
        <p>
          C'est gratos ! Le créateur de ce site est lui même maxplorateur. Un
          vrai maxplorateur fait toujours tourner les bons plans.
        </p>
        <br />
        <div style="text-align:center;">
          <v-btn color="primary" to="/alertes">Créer une alerte</v-btn>
        </div>
      </v-col>
      <v-col md="6" class="hidden-sm-and-down" style="background: #f5f5f5">
        <v-img src="@/../public/maxplorateur.png" aspect-ratio="1"></v-img>
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
  max-width: 100vw;
  padding: 0px;
}
span {
  text-decoration: underline #009688;
}
</style>
