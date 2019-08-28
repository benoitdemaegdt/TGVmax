<template>
  <div>
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
          delete
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
        {{alert.origin}}<br>{{alert.destination}}
      </v-card-title>
      <v-card-text class='primary white--text pt-3'>
        {{getFrenchDate(alert.fromTime)}} : {{getHour(alert.fromTime)}} - {{getHour(alert.toTime)}}
      </v-card-text>
      <v-card-actions>
        <div v-if='!alert.lastCheck'>Dernière recherche : prochainement</div>
        <div v-else>Dernière recherche : {{getFrenchDate(alert.lastCheck)}} à {{getHour(alert.lastCheck)}}</div>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon medium @click='deleteTravelAlert(alert)'>delete</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- add an alert on mobile -->
    <v-dialog v-model='dialog' persistent max-width='600px'>
      <template v-slot:activator='{ on }'>
        <v-btn class='hidden-md-and-up' fab dark large color='#757575' fixed right bottom @click='dialog = true'>
          <v-icon dark>add</v-icon>
        </v-btn>
      </template>
      <alert-form @close:dialog='dialog = !dialog' @add:travelAlert='addTravelAlert'/>
    </v-dialog>
    <!-- End of mobile cards -->
  </div>
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
    this.getTravelAlerts();
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
        const response = await fetch(`http://localhost:3001/api/v1/users/${this.$store.state.userId}/travels`, {
          headers: { 'accept': 'application/json; charset=UTF-8' },
        });
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const body = await response.json();
        this.alerts = body;
      } catch (err) {
        console.log(err);
      }
    },
    async deleteTravelAlert(alert) {
      try {
        const id = alert.id;
        const response = await fetch(`http://localhost:3001/api/v1/users/${this.$store.state.userId}/travels/${id}`, {
          method: 'DELETE',
          headers: { 'accept': 'application/json; charset=UTF-8' },
        });
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const index = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
      } catch (err) {
        console.log(err);
      }
    },
    async addTravelAlert(alert) {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/users/${this.$store.state.userId}/travels`, {
          method: 'POST',
          body: JSON.stringify(alert),
          headers: { 'accept': 'application/json; charset=UTF-8' },
        });
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const body = await response.json();
        alert = {...alert, id: body.id };
        this.alerts = [...this.alerts, alert];
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>

</style>