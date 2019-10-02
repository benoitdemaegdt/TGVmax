<template>
  <v-container class='mt-5'>
    <div v-if='isLoggedIn'>
      <!-- Start of app data table -->
      <v-data-table
      :headers='headers'
      :items='alerts'
      hide-default-footer
      disable-sort
      disable-pagination
      class='elevation-1 hidden-sm-and-down'
      >
        <!-- add toolbar for the datatable -->
        <template v-slot:top>
          <v-toolbar flat color='#E0E0E0'>
            <v-toolbar-title>Alertes en cours</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-dialog v-model='dialog' persistent max-width='600px'>
              <template v-slot:activator='{ on }'>
                <v-btn color='primary' dark v-on='on'>Nouvelle Alerte</v-btn>
              </template>
              <alert-form @close:dialog='dialog = !dialog' @add:travelAlert='addTravelAlert'/>
            </v-dialog>
          </v-toolbar>
        </template>

        <!-- display train station name -->
        <template v-slot:item.origin='{ item }'>
          {{item.origin.name}}
        </template>

        <template v-slot:item.destination='{ item }'>
          {{item.destination.name}}
        </template>

        <!-- human readable dates -->
        <template v-slot:item.date='{ item }'>
          {{getFrenchDate(item.fromTime)}}
        </template>

        <template v-slot:item.fromTime='{ item }'>
          {{getHour(item.fromTime)}}
        </template>

        <template v-slot:item.toTime='{ item }'>
          {{getHour(item.toTime)}}
        </template>

        <template v-slot:item.lastCheck='{ item }'>
          <div v-if='!item.lastCheck'>Prochainement</div>
          <div v-else>{{getFrenchDate(item.lastCheck)}} à {{getHour(item.lastCheck)}}</div>
        </template>

        <!-- add a column for deleting an alert -->
        <template v-slot:item.action='{ item }'>
          <v-icon medium @click='deleteTravelAlert(item)'>
            mdi-delete
          </v-icon>
        </template>

        <!-- message to display when there is no alert -->
        <template slot='no-data'>
          Aucune alerte en cours
        </template>
      </v-data-table>
      <!-- End of app data table -->

      <!-- Start of mobile cards -->
      <p class='hidden-md-and-up text-center' v-if='alerts.length === 0'>
        Aucune alerte en cours
      </p>
      <v-card v-for='alert of alerts' :key='alert.id' class='hidden-md-and-up elevation-6 mx-auto mb-5' max-width='90%'>
        <v-card-title class='primary white--text'>
          {{alert.origin.name}}<br>{{alert.destination.name}}
        </v-card-title>
        <v-card-text class='primary white--text pt-3'>
          {{getFrenchDate(alert.fromTime)}} : {{getHour(alert.fromTime)}} - {{getHour(alert.toTime)}}
        </v-card-text>
        <v-card-actions>
          <div v-if='!alert.lastCheck'>Dernière recherche : prochainement</div>
          <div v-else>Dernière recherche : {{getFrenchDate(alert.lastCheck)}} à {{getHour(alert.lastCheck)}}</div>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon medium @click='deleteTravelAlert(alert)'>mdi-delete</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- add an alert on mobile -->
      <v-dialog v-model='dialog' persistent max-width='600px'>
        <template v-slot:activator='{ on }'>
          <v-btn class='hidden-md-and-up' fab dark large color='#757575' fixed right bottom @click='dialog = true'>
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </template>
        <alert-form @close:dialog='dialog = !dialog' @add:travelAlert='addTravelAlert'/>
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
    async addTravelAlert(alert) {
      try {
        const response =
          await this.$http.post(`${process.env.VUE_APP_API_BASE_URL}/api/v1/users/${this.$store.state.userId}/travels`, {
          ...alert,
        });
        const body = await response.data;
        alert = {...alert, _id: body._id };
        this.alerts = [...this.alerts, alert];
      } catch (err) {
        console.log(err);
      }
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

</style>