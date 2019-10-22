<template>
  <v-container class='mt-5'>
    <div class="text-xs-center">
      <h1 class="display-1 text-center">TGVmax, un abonnement rentable ?</h1>
      <p class="subtitle-1 text-center grey--text text--darken-2">Octobre 2019</p>
      <v-img src="@/assets/tgvmax.png" class='mt-5'></v-img>
      <p class='mt-5'>Fin janvier 2017, la SNCF lançait en grande pompe son nouvel abonnement destiné aux 16-27 ans : TGVmax. Le principe ? Pour 79€/mois, un abonné peut voyager en illimité sur le réseau TGV et intercités. Lorsqu'on sait qu'un aller simple Paris - Lyon coûte au moins 60€, l'offre semble prometteuse ...</p>

      <h2 class="headline">TGVmax, quelles conditions ?</h2>
      <p class='mt-5'>La SNCF a mis le paquet pour promouvoir son nouvel abonnement auprès des jeunes. On trouve sur leur <a href="https://www.tgvmax.fr/VSC/fr-FR">site</a> des slogans tels que :</p>
      <p class="font-italic">VOYAGEZ EN ILLIMITÉ</p>
      <p class="font-italic">TGV illimité pour les 16-27 ans</p>
      <p class="font-italic">UN MAX DE LIBERTÉ</p>
      <p>Mais pour bien comprendre comment ça fonctionne, il faut regarder un peu plus bas. Tout se joue dans le "J’accepte de voyager hors période de forte affluence".</p>
      <p class='mt-5'>Nous y sommes ! En réalité, l'abonnement TGVmax permet de voyager en illimité <span>hors période d'affluence</span>.</p>
      <p>La notion de période d'affluence n'est pas très claire. Personne ne sait exactement ou se situe la limite entre une période de non-affluence et une période d'affluence. Personne ne sait non plus à l'avance le nombre de places disponibles dans tel ou tel train. Avec l'expérience, on sait cependant qu'il n'y a extrêmement peu (pour ne pas dire aucun) de trajets disponibles en TGVmax pour les week ends prolongés ou  les jours  de départ en vacances ...</p>

      <h2 class="headline">Comment avoir un billet ?</h2>
      <p class='mt-5'>Les billets TGVmax deviennent disponibles exactement 30 jours avant la date du départ. Pour maximiser ses chances d'avoir un billet TGVmax, il faut donc se connecter à minuit pile 30 jours avant son trajet. À partir de là plusieurs cas possibles :</p>
      <p>1 - Vous avez eu un billet : conservez le pendant 30 jours. Mais attention, vous ne pouvez en avoir que 6 simultanément !</p>
      <p>2 - Vous n'avez pas eu de billet. C'est là que ça devient intéressant. Le billet peut (mais ce n'est pas sûr) se libérer n'importe quand dans les 30 jours qui précèdent le départ. Il s'agit alors de se connecter régulièrement sur l'application de la SNCF pour vérifier si le billet TGVmax est disponible. Le tout en espérant que personne ne se connecte plus fréquemment que vous et ne réserve le billet avant vous.</p>

      <h2 class="headline">Effet d'annonce ou réelle opportunité ?</h2>
      <p class='mt-5'>On est d'accord que dis comme ça, ça semble galère. Ça n'a d'ailleurs pas échappé aux principaux médias français qui n'ont pas hésité à tacler la SNCF à ce sujet. Trois exemples :</p>
      <p><span>Nouvelobs : </span>J'ai testé l'abonnement TGVMax pendant 3 mois. Je ne suis pas près de reprendre le train</p>
      <p><span>Capital : </span>La grogne grandit contre l'offre TGVmax de la SNCF</p>
      <p><span>60millions-mag : </span>TGVmax, les limites du train illimité</p>
      <br>
      <p>Et pourtant, malgré toutes ces conditions et ces critiques, TGVmax peut être extrêmement rentable ! Voici quelques exemples pour vous aider à faire votre choix.</p>

      <h2 class="headline">Fuyez TGVmax si ...</h2>
      <p class='mt-5'>1 - Vous prenez le train moins de 2 fois par mois. Une carte jeune fera l'affaire et vous coutera moins cher.</p>
      <p>2 - Vous ne voyagez que pendant les vacances. Un abonnement TGVmax vous engage pour 3 mois. La résiliation coûte 15€ si vous le gardez moins d'un an.</p>
      <p>3 - Vous n'êtes pas flexible. Un week end de prévu du vendredi soir au dimanche soir ? Vous n'aurez peut être des billets TGVmax que le samedi et lundi matin ...</p>

      <h2 class="headline">Prenez TGVmax si ...</h2>
      <p class='mt-5'>1 - Vous pouvez voyager en semaine. Vous trouverez très souvent des billets en semaine le mardi, mercredi, jeudi ainsi que le lundi après-midi et vendredi matin.</p>
      <p>2 - Vous êtes débrouillard. Pas de Paris -> Lyon de disponible ? Un Paris -> Valence fera l'affaire, vous ferez le Valence -> Lyon en covoit' ou en TER, ça sera toujours beaucoup moins cher.</p>
      <p>3 - Vous voyagez beaucoup. Vous n'aurez peut être pas toujours un billet TGVmax, mais au global ce sera rentable.</p>

      <h2 class="headline">Conclusion</h2>
      <p class='mt-5'>TGVmax, c'est la liberté et le train en illimité oui, mais pas sans condition ! Quelqu'un de débrouillard et de flexible rentabilisera des centaines de fois sont abonnement, mais tout le monde n'y trouvera pas son compte ...</p>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'ArticleTgvmax',
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