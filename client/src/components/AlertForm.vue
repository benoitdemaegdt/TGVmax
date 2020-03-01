<template>
  <v-card>
    <v-toolbar dark class="mb-3" color="primary">
      <v-btn icon dark @click="closeDialog()">
        <v-icon v-if="isMobile">mdi-arrow-left</v-icon>
        <v-icon v-if="!isMobile">mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Nouvelle alerte</v-toolbar-title>
    </v-toolbar>
    <v-form v-model="valid" ref="alertForm">
      <v-row>
        <!-- Origin Train Station -->
        <v-col cols="12">
          <v-autocomplete
            class="form-item"
            v-model="origin"
            label="Gare de départ"
            hint="ex: Paris (toutes gares intramuros)"
            :items="trainStations"
            item-text="name"
            return-object
            :rules="[v => !!v || 'Champ obligatoire']"
            :error-messages="sameTrainStationError"
            no-data-text="Gare non disponible"
            prepend-icon="mdi-map-marker"
            required
          ></v-autocomplete>
        </v-col>

        <!-- Destination Train Station -->
        <v-col cols="12">
          <v-autocomplete
            class="form-item"
            v-model="destination"
            label="Gare d'arrivée"
            hint="ex: Lyon (toutes gares intramuros)"
            :items="trainStations"
            item-text="name"
            return-object
            :rules="[v => !!v || 'Champ obligatoire']"
            no-data-text="Gare non disponible"
            prepend-icon="mdi-map-marker"
            required
          ></v-autocomplete>
        </v-col>

        <!-- Departure Date -->
        <v-col cols="12">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                class="form-item"
                v-model="dateFormatted"
                :rules="[v => !!v || 'Champ obligatoire']"
                label="Date de départ"
                prepend-icon="mdi-calendar"
                readonly
                required
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              color="primary"
              locale="fr-fr"
              :first-day-of-week="1"
              :min="minDate"
              :max="maxDate"
              :events="getDates()"
              event-color="primary"
            >
              <v-btn text color="primary" @click="menu = false"
                >Fermer</v-btn
              >
              <v-btn text color="primary" @click="$refs.menu.save(date)"
                >OK</v-btn
              >
            </v-date-picker>
          </v-menu>
        </v-col>

        <!-- From Hour -->
        <v-col cols="12" sm="6">
          <v-select
            class="form-item"
            v-model="fromTime"
            prepend-icon="mdi-clock-outline"
            :items="hours"
            :rules="[v => !!v || 'Champ obligatoire']"
            :error-messages="minAfterMaxError"
            label="Heure min"
            required
          ></v-select>
        </v-col>

        <!-- To Hour -->
        <v-col cols="12" sm="6">
          <v-select
            class="form-item"
            v-model="toTime"
            prepend-icon="mdi-clock-outline"
            :items="hours"
            :rules="[v => !!v || 'Champ obligatoire']"
            label="Heure max"
            required
          ></v-select>
        </v-col>

        <!-- Error message if any -->
        <div class="text-center">
          <v-progress-circular
            v-show="loading"
            indeterminate
            color="primary"
          ></v-progress-circular>
          <p v-if="error" class="subtitle-2 red--text mt-2 mb-0">
            {{ this.errorMessage }}
          </p>
        </div>
        
        <!-- Submit & close buttons -->
        <v-card-actions class="form-item">
          <v-btn color="primary" text @click="closeForm()">Fermer</v-btn>
          <v-btn color="primary" text @click="handleSubmit()">Enregistrer</v-btn>
        </v-card-actions>

      </v-row>
    </v-form>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import StationService from '@/services/StationService.js';

import {
  convertToDatePickerFormat,
  getISOString,
  getFrenchDate
} from '@/helper/date.js';

export default {
  name: 'alert-form',
  created() {
    this.convertToDatePickerFormat = convertToDatePickerFormat;
    this.getFrenchDate = getFrenchDate;
    this.getISOString = getISOString;
    if (this.isLoggedIn) {
      this.getTrainStations();
    }
  },
  data() {
    return {
      loading: false,
      valid: false,
      error: false,
      errorMessage: '',
      menu: false,
      dateFormatted: getFrenchDate(this.date),
      origin: '',
      destination: '',
      date: new Date().toISOString().substr(0, 10),
      fromTime: '',
      toTime: '',
      trainStations: [],
      hours: [
        '05h00', '05h30', '06h00', '06h30', '07h00', '07h30', '08h00',
        '08h30', '09h00', '09h30', '10h00', '10h30', '11h00', '11h30',
        '12h00', '12h30', '13h00', '13h30', '14h00', '14h30', '15h00',
        '15h30', '16h00', '16h30', '17h00', '17h30', '18h00', '18h30',
        '19h00', '19h30', '20h00', '20h30', '21h00', '21h30', '22h00',
        '22h30'
      ]
    };
  },
  watch: {
    date() {
      this.dateFormatted = this.getFrenchDate(this.date);
    }
  },
  methods: {
    async getTrainStations() {
      try {
        const response = await StationService.getStations();
        this.trainStations = response.data;
      } catch (err) {
        console.log(err);
      }
    },
    getDates() {
      return this.alert.alerts.map(alert => {
        return alert.fromTime.substr(0, 10);
      });
    },
    closeForm() {
      this.$refs.alertForm.reset();
      this.$emit('close:dialog');
    },
    closeDialog() {
      this.$emit('close:dialog');
    },
    async handleSubmit() {
      if (this.$refs.alertForm.validate()) {
        try {
          this.clearState();
          this.loading = true;
          const alert = {
            origin: this.origin,
            destination: this.destination,
            fromTime: this.getISOString(this.date, this.fromTime),
            toTime: this.getISOString(this.date, this.toTime)
          };
          await this.$store.dispatch('createAlert', alert);
          this.loading = false;
          this.closeForm();
        } catch (err) {
          this.loading = false;
          this.error = true;
          this.errorMessage = err.message;
        }
      }
      return;
    },
    clearState() {
      this.error = false;
      this.errorMessage = '';
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    isMobile() {
      return window.innerWidth < 420;
    },
    minDate() {
      return convertToDatePickerFormat(new Date());
    },
    maxDate() {
      const today = new Date();
      return convertToDatePickerFormat(
        new Date(today.setDate(today.getDate() + 30))
      );
    },
    minAfterMaxError() {
      if (this.fromTime && this.toTime) {
        return this.hours.indexOf(this.fromTime) <
          this.hours.indexOf(this.toTime)
          ? ''
          : 'Heure min doit être inférieure à Heure max';
      }
      return '';
    },
    sameTrainStationError() {
      if (this.origin && this.destination) {
        return this.origin !== this.destination
          ? ''
          : "La gare de départ doit être différente de la gare d'arrivée";
      }
      return '';
    },
    ...mapState(['alert'])
  }
};
</script>

<style scoped>
.form-item {
  max-width: 90%;
  margin: auto;
}

/** form is max-width: 600px; */
/* If the screen size is 601px wide or more, set the font-size of title to 80px */
@media screen and (min-width: 601px) {
  .formTitle {
    font-size: 30px;
  }
}

/* If the screen size is 600px wide or less, set the font-size of <div> to 30px */
@media screen and (max-width: 600px) {
  .formTitle {
    font-size: 5vw;
  }
}
</style>
