<template>
  <v-container class="mt-5">
    <div v-if="isLoggedIn">
      <p class="text-center" v-if="alert.alerts.length === 0">
        Aucune alerte en cours
      </p>
      <v-card
        v-for="alert of alert.alerts"
        :key="alert.id"
        class="elevation-6 mx-auto mb-5 alertCard"
      >
        <v-card-title class="primary white--text">
          <div class="cardTitle">
            {{ alert.origin.name }}
            <br />
            {{ alert.destination.name }}
          </div>
        </v-card-title>
        <v-card-subtitle class="primary white--text pt-3">
          {{ getFrenchDate(alert.fromTime) }} : {{ getHour(alert.fromTime) }} -
          {{ getHour(alert.toTime) }}
        </v-card-subtitle>
        <v-card-actions>
          <!-- info -->
          <v-dialog
            v-model="dialogInfo"
            persistent
            max-width="600px"
            :retain-focus="false"
          >
            <template v-slot:activator="{}">
              <v-btn color="#616161" text @click="displayInfo(alert)"
                >Info</v-btn
              >
            </template>
            <alert-info
              @close:dialog="dialogInfo = !dialogInfo"
              :alert="currentAlert"
            />
          </v-dialog>
          <!-- delete alert -->
          <v-dialog
            v-model="dialogDeletion"
            persistent
            max-width="600px"
            :retain-focus="false"
          >
            <template v-slot:activator="{}">
              <v-btn color="#616161" text @click="displayDelete(alert)"
                >Supprimer</v-btn
              >
            </template>
            <alert-deletion
              :alert="currentAlert"
              @close:dialog="dialogDeletion = !dialogDeletion"
            />
          </v-dialog>
        </v-card-actions>
      </v-card>
      
      <!-- add alert -->
      <template>
        <v-dialog
          v-model="dialogForm"
          :fullscreen="isMobile"
          :hide-overlay="isMobile"
          :persistent="!isMobile"
          :transition="isMobile ? 'dialog-bottom-transition' : 'dialog-transition'"
          max-width="600px"
        > 
          <template v-slot:activator="{ on }">
            <v-btn
              fab
              dark
              large
              color="primary"
              fixed
              right
              bottom
              v-on="on"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <alert-form @close:dialog="dialogForm = false" />
        </v-dialog>
      </template>
    </div>
    <div v-else>
      <h1 class="display-1">
        Pour créer une alerte TGVmax, vous devez être connecté
      </h1>
      <p>
        Avoir un compte vous permet de recevoir par email les alertes de
        disponibilité des TGVmax
      </p>
      <v-btn :to="{ name: 'Inscription' }" class="primary"
        >Je créé un compte</v-btn
      >
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import { getFrenchDate, getHour } from '@/helper/date.js';
import AlertForm from '@/components/AlertForm.vue';
import AlertInfo from '@/components/AlertInfo.vue';
import AlertDeletion from '@/components/AlertDeletion.vue';

export default {
  name: 'Alert',
  components: {
    AlertForm,
    AlertInfo,
    AlertDeletion
  },
  created() {
    this.getFrenchDate = getFrenchDate;
    this.getHour = getHour;
    if (this.isLoggedIn) {
      this.$store.dispatch('fetchAlerts');
    }
  },
  data() {
    return {
      dialogForm: false,
      dialogInfo: false,
      dialogDeletion: false,
      currentAlert: {}
    };
  },
  methods: {
    displayInfo(alert) {
      this.dialogInfo = true;
      this.currentAlert = alert;
    },
    displayDelete(alert) {
      this.dialogDeletion = true;
      this.currentAlert = alert;
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    isMobile() {
      return window.innerWidth < 420;
    },
    ...mapState(['alert'])
  }
};
</script>

<style scoped>
.cardTitle {
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* If the screen size is 601px wide or more, set the max-width to 600px */
@media screen and (min-width: 601px) {
  .alertCard {
    max-width: 600px;
  }
}

/* If the screen size is 600px wide or less, set the max-width to 95% */
@media screen and (max-width: 600px) {
  .alertCard {
    max-width: 100%;
  }
}
</style>
