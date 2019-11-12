<template>
  <v-container class="mt-5">
    <div class="text-xs-center">
      <h1 class="display-1 text-center">
        L'application Maxplorateur est disponible sur Android et iOS !
      </h1>
      <p class="subtitle-1 text-center grey--text text--darken-2">
        Octobre 2019
      </p>
      <v-img src="@/assets/app.png" class="mt-5"></v-img>
      <p class="mt-5">
        Il faut reconnaitre qu'il est plus simple d'utiliser une application
        plutôt qu'un site internet. Pour cette raison, Maxplorateur est
        désormais disponible en tant qu'application sur Android et iOS !
        Attention cependant, elle ne se télécharge pas sur l'App Store ou le
        Play Store, mais directement depuis votre navigateur web mobile (Chrome,
        Safari). Suivez le guide !
      </p>

      <h2 class="headline">Vous avez un smartphone Android</h2>
      <v-img src="@/assets/android.png" class="mt-5"></v-img>
      <p class="mt-5">
        Lorsque vous allez sur le site internet maxplorateur.fr avec votre
        smartphone, vous devriez voir apparaitre une bannière en bas de page :
        "Ajouter Maxplorateur à l'écran d'accueil". Il suffit de cliquer dessus,
        puis sur "Ajouter", et c'est bon !
      </p>

      <h2 class="headline">Vous avez un iphone avec iOS11 ou plus</h2>
      <v-img src="@/assets/iphone.png" class="mt-5"></v-img>
      <p class="mt-5">
        Vous devez vous rendre sur le site maxplorateur.fr en utilisant le
        navigateur <span>Safari</span>. De là, cliquez sur l'icône "partager" en
        bas de page, descendez puis cliquez sur "Sur l'écran d'accueil". C'est
        installé !
      </p>

      <h2 class="headline">Conclusion</h2>
      <p class="mt-5">
        Vous devriez désormais voir l'application Maxplorateur sur l'écran
        d'accueil de votre smartphone. Notez que l'application se mettra à jour
        automatiquement si besoin 😊
      </p>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'ArticleApplication'
};
</script>

<style scoped>
div {
  max-width: 750px;
}
p {
  font-size: 18px;
  line-height: 1.58;
}
span {
  font-weight: bold;
}
</style>
