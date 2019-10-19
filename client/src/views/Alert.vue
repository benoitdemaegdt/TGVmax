<template>
  <v-container class='mt-5'>
    <div v-if='isLoggedIn'>
      <!-- Start of mobile cards -->
      <p class='text-center' v-if='alerts.length === 0'>
        Aucune alerte en cours
      </p>
      <v-card v-for='alert of alerts' :key='alert.id' class='elevation-6 mx-auto mb-5' max-width='75%'>
        <v-card-title class='primary white--text'>
          <div class='cardTitle'>{{alert.origin.name}}<br>{{alert.destination.name}}</div>
        </v-card-title>
        <v-card-text class='primary white--text pt-3'>
          {{getFrenchDate(alert.fromTime)}} : {{getHour(alert.fromTime)}} - {{getHour(alert.toTime)}}
        </v-card-text>
        <v-card-actions>
          <div class="checkDate" v-if='!alert.lastCheck'>Dernière vérification de disponibilité : prochainement</div>
          <div class="checkDate" v-else>Dernière vérification de disponibilité : {{getFrenchDate(alert.lastCheck)}} à {{getHour(alert.lastCheck)}}</div>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon medium @click='deleteTravelAlert(alert)'>mdi-delete</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- add an alert on mobile -->
      <v-dialog v-model='dialog' persistent max-width='600px'>
        <template v-slot:activator='{ on }'>
          <v-btn fab dark large color='primary' fixed right bottom @click='dialog = true'>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <alert-form
          @close:dialog='dialog = !dialog'
          @add:travelAlert='addTravelAlert'
          :alerts='alerts'
        />
      </v-dialog>
      <!-- End of mobile cards -->
    </div>
    <div v-else>
      <h1 class="display-1">Pour créer une alerte TGVmax, vous devez être connecté</h1>
      <p>Avoir un compte vous permet de recevoir par email les alertes de disponibilité des TGVmax</p>
      <v-btn to='/inscription' class='primary'>Je créé un compte</v-btn>
    </div>
  </v-container>
</template>

<script>
import { getFrenchDate, getHour } from '@/helper/date.ts';
import AlertForm from '@/components/AlertForm.vue';

export default {
  name: 'Alert',
  components: {
    AlertForm,
  },
  created() {
    this.getFrenchDate = getFrenchDate;
    this.getHour = getHour;
  },
  mounted() {
    if (this.isLoggedIn) {
      this.getTravelAlerts();
    }
  },
  data() {
    return {
      dialog: false,
      headers: [
        { text: 'Départ', value: 'origin' },
        { text: 'Arrivée', value: 'destination' },
        { text: 'Date', value: 'date' },
        { text: 'Heure min', value: 'fromTime' },
        { text: 'Heure max', value: 'toTime' },
        { text: 'Dernière recherche', value: 'lastCheck' },
        { text: 'Action', value: 'action' },
      ],
      alerts: [],
    };
  },
  methods: {
    async getTravelAlerts() {
      try {
        const response = await this.$http.get(`${process.env.VUE_APP_API_BASE_URL}/api/v1/users/${this.$store.state.userId}/travels`);
        const body = await response.data;
        this.alerts = body;
      } catch (err) {
        console.log(err);
      }
    },
    async deleteTravelAlert(alert) {
      try {
        const _id = alert._id;
        const response =
          await this.$http.delete(`${process.env.VUE_APP_API_BASE_URL}/api/v1/users/${this.$store.state.userId}/travels/${_id}`);
        const index = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
      } catch (err) {
        console.log(err);
      }
    },
    addTravelAlert(alert) {
      this.alerts = [...this.alerts, alert];
    },
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
};
</script>

<style scoped>
.cardTitle {
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.checkDate {
  font-size: 10px;
}
</style>