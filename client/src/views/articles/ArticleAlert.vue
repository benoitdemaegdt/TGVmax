<template>
  <v-container class="mt-5">
    <div class="text-xs-center">
      <h1 class="display-1 text-center">
        Comment recevoir une alerte quand mon trajet TGVmax est disponible ?
      </h1>
      <p class="subtitle-1 text-center grey--text text--darken-2">
        Octobre 2019
      </p>
      <v-img src="@/assets/notification.png" class="mt-5"></v-img>
      <p class="mt-5">
        Un billet TGVmax peut se libérer n'importe quand dans les 30 jours
        précédant le trajet. Les abonnés ont donc 2 possibilités : se connecter
        tous les jours sur oui.sncf pour vérifier la disponibilité, ou alors
        mettre une alerte sur maxplorateur.fr ! Suivez le guide pour apprendre à
        créer votre première alerte.
      </p>

      <h2 class="headline">Étape 1 : créer un compte maxplorateur</h2>
      <p class="mt-5">Pour cela vous aurez besoin d'exactement 3 choses :</p>
      <p>
        <span>1 - Une adresse email valide.</span> Vous recevrez vos alertes par
        email sur cette adresse.
      </p>
      <p><span>2 - Un mot de passe.</span></p>
      <p>
        <span>3 - Votre numéro d'abonné TGVmax.</span> Celui ci est nécessaire
        pour pouvoir vérifier la disponibilité des trajets en TGVmax. Attention
        : Un faux numéro ou un numéro érroné ne vous permettra pas de recevoir
        des alertes.
      </p>

      <h2 class="headline">Étape 2 : mettre une alerte TGVmax</h2>
      <p class="mt-5">
        Rendez vous sur l'onglet "Alertes". En bas à droite de la page, vous
        trouverez un bouton "+" qui vous permettra de créer une alerte pour
        votre trajet. Pour ceci vous devrez indiquer :
      </p>
      <p><span>1 - Votre gare de départ.</span></p>
      <p><span>2 - Votre gare d'arrivée.</span></p>
      <p><span>3 - Votre jour de départ.</span></p>
      <p>
        <span>4 - Votre heure de départ minimale.</span> C'est à dire l'heure à
        partir de laquelle vous serez disponible pour prendre un train le jour
        indiqué.
      </p>
      <p>
        <span>5 - Votre heure de départ maximale.</span>C'est à dire l'heure
        jusqu'à laquelle vous serez disponible pour prendre un train le jour
        indiqué.
      </p>
      <p>Cliquez ensuite sur "Enregister", et votre alerte sera en place !</p>

      <h2 class="headline">Comment ça marche ?</h2>
      <p class="mt-5">
        Une fois que vous avez mis votre alerte, un robot va aller vérifier
        environ toutes les 30 minutes la disponibilité de votre trajet en
        TGVmax. Vous pouvez voir la date à laquelle le robot a vérifié votre
        trajet pour la dernière fois en cliquant sur le bouton "INFO" sur votre
        alerte. Si le robot voit qu'une place TGVmax s'est libérée pour votre
        trajet, il vous envoie un email pour vous le dire !
      </p>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'ArticleAlert'
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
