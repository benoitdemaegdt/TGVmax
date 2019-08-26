<template>
  <div>
    <!-- Start of app data table -->
    <v-data-table
    :headers='headers'
    :items='alerts'
    hide-default-footer
    disable-sort
    class='elevation-1 hidden-sm-and-down'
    >
      <!-- add toolbar for the datatable -->
      <template v-slot:top>
        <v-toolbar flat color='#E0E0E0'>
          <v-toolbar-title>Alertes en cours</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color='primary' dark>Nouvelle alerte</v-btn>
        </v-toolbar>
      </template>

      <!-- human readable dates -->
      <template v-slot:item.date="{ item }">
        {{getDate(item.fromTime)}}
      </template>

      <template v-slot:item.fromTime="{ item }">
        {{getHour(item.fromTime)}}
      </template>

      <template v-slot:item.toTime="{ item }">
        {{getHour(item.toTime)}}
      </template>

      <template v-slot:item.lastCheck="{ item }">
        {{getDate(item.lastCheck)}} à {{getHour(item.lastCheck)}}
      </template>

      <!-- add a column for deleting an alert -->
      <template v-slot:item.action='{ item }'>
        <v-icon medium @click='deleteAlert(item)'>
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
        {{getDate(alert.fromTime)}} : {{getHour(alert.fromTime)}} - {{getHour(alert.toTime)}}
      </v-card-text>
      <v-card-actions>
        Dernière recherche : {{getDate(alert.lastCheck)}} à {{getHour(alert.lastCheck)}}
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon medium @click='deleteAlert(alert)'>delete</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-btn class='hidden-md-and-up' fab dark large color='#757575' fixed right bottom>
      <v-icon dark>add</v-icon>
    </v-btn>
    <!-- End of mobile cards -->
  </div>
</template>

<script>
export default {
  name: 'Alert',
  data() {
    return {
      headers: [
        { text: 'Départ', value: 'origin' },
        { text: 'Arrivée', value: 'destination' },
        { text: 'Date', value: 'date' },
        { text: 'Heure min', value: 'fromTime' },
        { text: 'Heure max', value: 'toTime' },
        { text: 'Dernière vérification', value: 'lastCheck' },
        { text: 'Action', value: 'action' },
      ],
      alerts: [
          {
            id: 1,
            origin: 'Paris (toutes gares intramuros)',
            destination: 'Lyon (toutes gares intramuros)',
            fromTime: '2019-09-20T06:00:00Z',
            toTime: '2019-09-20T15:00:00Z',
            lastCheck: '2019-09-10T06:55:00Z',
          },
          {
            id: 2,
            origin: 'Paris (toutes gares intramuros)',
            destination: 'Marseille Saint-Charles',
            fromTime: '2019-09-20T06:00:00Z',
            toTime: '2019-09-20T15:00:00Z',
            lastCheck: '2019-09-10T06:55:00Z',
          },
          {
            id: 3,
            origin: 'Lyon Part-Dieu',
            destination: 'Montpellier Saint-Roch',
            fromTime: '2019-09-20T06:00:00Z',
            toTime: '2019-09-20T15:00:00Z',
            lastCheck: '2019-09-10T06:55:00Z',
          },
      ],
    };
  },
  methods: {
    deleteAlert(alert) {
      const index = this.alerts.indexOf(alert);
      this.alerts.splice(index, 1);
    },
    getDate(isodate) {
      const date = new Date(isodate);
      const dayNumber = date.getDay();
      const monthNumber = date.getMonth();
      let day = '';
      switch (dayNumber) {
        case 1:
          day = 'lundi';
          break;
        case 2:
          day = 'mardi';
          break;
        case 3:
          day = 'mercredi';
          break;
        case 4:
          day = 'jeudi';
          break;
        case 5:
          day = 'vendredi';
          break;
        case 6:
          day = 'samedi';
          break;
        case 7:
          day = 'dimanche';
          break;
      }
      let month = '';
      switch (monthNumber) {
        case 0:
          month = 'janvier';
          break;
        case 1:
          month = 'février';
          break;
        case 2:
          month = 'mars';
          break;
        case 3:
          month = 'avril';
          break;
        case 4:
          month = 'mai';
          break;
        case 5:
          month = 'juin';
          break;
        case 6:
          month = 'juillet';
          break;
        case 7:
          month = 'août';
          break;
        case 8:
          month = 'septembre';
          break;
        case 9:
          month = 'octobre';
          break;
        case 10:
          month = 'novembre';
          break;
        case 11:
          month = 'décembre';
          break;
      }
      return `${day} ${date.getDate()} ${month}`;
    },
    getHour(isodate) {
      return isodate.slice(11, 16);
    },
  },
};
</script>

<style scoped>

</style>