<template>
  <v-container class='mt-5'>
    <div v-if='isLoggedIn'>
      <p class='text-center' v-if='alerts.length === 0'>
        Aucune alerte en cours
      </p>
      <v-card v-for='alert of alerts' :key='alert.id' class='elevation-6 mx-auto mb-5' max-width='90%'>
        <v-card-title class='primary white--text'>
          <div class='cardTitle'>{{alert.origin.name}}<br>{{alert.destination.name}}</div>
        </v-card-title>
        <v-card-subtitle class='primary white--text pt-3'>
          {{getFrenchDate(alert.fromTime)}} : {{getHour(alert.fromTime)}} - {{getHour(alert.toTime)}}
        </v-card-subtitle>
        <v-card-actions>
          <!-- info -->
          <v-dialog v-model='dialogInfo' persistent max-width='600px'>
            <template v-slot:activator='{ on }'>
              <v-btn color="#616161" text @click='displayInfo(alert)'>Info</v-btn>
            </template>
            <alert-info @close:dialog='dialogInfo = !dialogInfo' :alert='currentAlert'/>
          </v-dialog>
          <!-- delete alert -->
          <v-btn color="#616161" text @click='dialogDeletion=true'>Supprimer</v-btn>
          <alert-deletion v-model='dialogDeletion' @delete:travelAlert='deleteTravelAlert(alert)'/>
        </v-card-actions>
      </v-card>
      <!-- add  alert -->
      <v-dialog v-model='dialogForm' persistent max-width='600px'>
        <template v-slot:activator='{ on }'>
          <v-btn fab dark large color='primary' fixed right bottom @click='dialogForm = true'>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <alert-form
          @close:dialog='dialogForm = !dialogForm'
          @add:travelAlert='addTravelAlert'
          :alerts='alerts'
        />
      </v-dialog>
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
import AlertInfo from '@/components/AlertInfo.vue';
import AlertDeletion from '@/components/AlertDeletion.vue';

export default {
  name: 'Alert',
  components: {
    AlertForm,
    AlertInfo,
    AlertDeletion,
  },
  created() {
    this.getFrenchDate = getFrenchDate;
    this.getHour = getHour;
    if (this.isLoggedIn) {
      this.getTravelAlerts();
    }
  },
  data() {
    return {
      dialogForm: false,
      dialogInfo: false,
      dialogDeletion: false,
      currentAlert: {},
      alerts: [],
    };
  },
  methods: {
    displayInfo(alert) {
      this.dialogInfo = true;
      this.currentAlert = alert;
    },
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
</style>