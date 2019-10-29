<template>
  <div v-if='alerts.length >= 6'>
    <v-card>
      <v-card-title class='primary white--text'>
        <span class='headline'>Oups, limite atteinte ... 😢</span>
        <v-spacer></v-spacer>
        <v-icon color='white' @click='closeDialog();'>mdi-close</v-icon>
      </v-card-title>
      <v-card-text class='mt-3'>
        <p>Afin que tout le monde puisse utiliser ce service, vous ne pouvez créer que 6 alertes en simultané.</p>
      </v-card-text>
      <v-card-actions class='justify-center'>
        <v-btn color='primary' text @click='closeDialog();'>Fermer</v-btn>
      </v-card-actions>
    </v-card>
  </div>
  <div v-else>
    <v-form v-model='valid' ref='alertForm'>
      <v-card>
        <v-card-title class='primary white--text'>
          <div class='formTitle'>Ajouter une nouvelle alerte</div>
          <v-spacer></v-spacer>
          <v-icon color='white' @click='closeDialog();'>mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <!-- Origin Train Station -->
              <v-col cols='12'>
                <v-autocomplete
                  v-model='origin'
                  label='Gare de départ'
                  hint='ex: Paris (toutes gares intramuros)'
                  :items='trainStations'
                  item-text='name'
                  return-object
                  :rules="[v => !!v || 'Champ obligatoire']"
                  :error-messages='sameTrainStationError'
                  no-data-text='Gare non disponible'
                  prepend-icon='mdi-map-marker'
                  required
                >
                </v-autocomplete>
              </v-col>

              <!-- Destination Train Station -->
              <v-col cols='12'>
                <v-autocomplete
                  v-model='destination'
                  label="Gare d'arrivée"
                  hint='ex: Lyon (toutes gares intramuros)'
                  :items='trainStations'
                  item-text='name'
                  return-object
                  :rules="[v => !!v || 'Champ obligatoire']"
                  no-data-text='Gare non disponible'
                  prepend-icon='mdi-map-marker'
                  required
                >
                </v-autocomplete>
              </v-col>

              <!-- Departure Date -->
              <v-col cols='12'>
                <v-menu
                  ref='menu'
                  v-model='menu'
                  :close-on-content-click='false'
                  :return-value.sync='date'
                  transition='scale-transition'
                  offset-y
                  min-width='290px'
                >
                  <template v-slot:activator='{ on }'>
                    <v-text-field
                      v-model='dateFormatted'
                      :rules="[v => !!v || 'Champ obligatoire']"
                      label='Date de départ'
                      prepend-icon='mdi-calendar'
                      readonly
                      required
                      v-on='on'
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model='date'
                    color='primary'
                    locale='fr-fr'
                    :first-day-of-week='1'
                    :min='minDate'
                    :max='maxDate'
                  >
                    <v-btn text color='primary' @click='menu = false'>Fermer</v-btn>
                    <v-btn text color='primary' @click='$refs.menu.save(date)'>OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>

              <!-- From Hour -->
              <v-col cols='12' sm='6'>
                <v-select
                  v-model='fromTime'
                  prepend-icon='mdi-clock-outline'
                  :items='hours'
                  :rules="[(v) => !!v || 'Champ obligatoire']"
                  :error-messages='minAfterMaxError'
                  label='Heure min'
                  required
                ></v-select>
              </v-col>

              <!-- To Hour -->
              <v-col cols='12' sm='6'>
                <v-select
                  v-model='toTime'
                  prepend-icon='mdi-clock-outline'
                  :items='hours'
                  :rules="[(v) => !!v || 'Champ obligatoire']"
                  label='Heure max'
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <p v-if='error' class="text-center subtitle-2 red--text mt-2 mb-0">
            {{this.errorMessage}}
          </p>
        </v-card-text>
        <v-card-actions class='justify-center'>
          <v-btn color='primary' text @click='closeForm();'>Fermer</v-btn>
          <v-btn color='primary' text @click='handleSubmit();'>Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import { convertToDatePickerFormat, getISOString, getFrenchDate } from '@/helper/date.ts';

export default {
  name: 'alert-form',
  props: {
    alerts: Array,
  },
  created() {
    this.convertToDatePickerFormat = convertToDatePickerFormat;
    this.getFrenchDate = getFrenchDate;
    this.getISOString = getISOString;
  },
  mounted() {
    if (this.isLoggedIn) {
      this.getTrainStations();
    }
  },
  data() {
    return {
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
        '05h00', '05h30', '06h00', '06h30', '07h00', '07h30',
        '08h00', '08h30', '09h00', '09h30', '10h00', '10h30',
        '11h00', '11h30', '12h00', '12h30', '13h00', '13h30',
        '14h00', '14h30', '15h00', '15h30', '16h00', '16h30',
        '17h00', '17h30', '18h00', '18h30', '19h00', '19h30',
        '20h00', '20h30', '21h00', '21h30', '22h00', '22h30',
      ],
    };
  },
  watch: {
    date(val) {
      this.dateFormatted = this.getFrenchDate(this.date);
    },
  },
  methods: {
    async getTrainStations() {
      try {
        const response = await this.$http.get(`${process.env.VUE_APP_API_BASE_URL}/api/v1/stations`);
        const body = await response.data;
        this.trainStations = body;
      } catch (err) {
        console.log(err);
      }
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
          const alert = {
            origin: this.origin,
            destination: this.destination,
            fromTime: this.getISOString(this.date, this.fromTime),
            toTime: this.getISOString(this.date, this.toTime),
          };
          const response = await this.$http.post(
            `${process.env.VUE_APP_API_BASE_URL}/api/v1/users/${this.$store.state.userId}/travels`,
            alert,
          );
          const body = await response.data;
          window.dataLayer.push({event: 'travelAlertCreated'});
          this.$emit('add:travelAlert', { ...alert, _id: body._id });
          this.clearState();
          this.closeForm();
        } catch (err) {
          this.error = true;
          this.errorMessage = err.response && err.response.data
          ? `⚠️ ${err.response.data.message}`
          : '⚠️ Erreur réseau. Veuillez réessayer plus tard'
        }
      }
      return;
    },
    clearState() {
      this.error = false;
      this.errorMessage = '';
    },
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    minDate() {
      return convertToDatePickerFormat(new Date());
    },
    maxDate() {
      const today = new Date();
      return convertToDatePickerFormat(new Date(today.setDate(today.getDate() + 30)));
    },
    minAfterMaxError() {
      if (this.fromTime && this.toTime) {
        return (this.hours.indexOf(this.fromTime) < this.hours.indexOf(this.toTime))
          ? ''
          : 'Heure min doit être inférieure à Heure max';
      }
      return '';
    },
    sameTrainStationError() {
    if (this.origin && this.destination) {
      return (this.origin !== this.destination)
        ? ''
        : 'La gare de départ doit être différente de la gare d\'arrivée';
    }
    return '';
  },
  },
};
</script>

<style scoped>
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
