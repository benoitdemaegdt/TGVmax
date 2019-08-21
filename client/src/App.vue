<template>
  <div id='app'>
    <h1>TGVmax</h1>
    <travel-form @add:travel='addTravel'/>
    <travel-table
      v-bind:travels='travels'
      @delete:travel='deleteTravel'
    />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import TravelTable from './components/TravelTable.vue';
import TravelForm from './components/TravelForm.vue';

export default Vue.extend({
  name: 'app',
  components: {
    TravelForm,
    TravelTable,
  },
  data() {
    return {
      travels: [
        {
          id: 1,
          tgvmaxNumber: 'HC000054321',
          origin: 'Paris',
          destination: 'Lyon',
          fromTime: '8 aout 2018 8AM',
          toTime: '8 aout 2018 8PM',
          status: 'en cours',
        },
        {
          id: 2,
          tgvmaxNumber: 'HC000054321',
          origin: 'Paris',
          destination: 'Niort',
          fromTime: '8 aout 2018 8AM',
          toTime: '8 aout 2018 8PM',
          status: 'en cours',
        },
        {
          id: 3,
          tgvmaxNumber: 'HC000054321',
          origin: 'Paris',
          destination: 'Marseilles',
          fromTime: '8 aout 2018 8AM',
          toTime: '8 aout 2018 8PM',
          status: 'en cours',
        },
      ],
    };
  },
  methods: {
    addTravel(travel: any) {
      const lastId =
        this.travels.length > 0
          ? this.travels[this.travels.length - 1].id
          : 0;
      const id = lastId + 1;
      const newTravel = { ...travel, id };
      this.travels = [...this.travels, newTravel];
    },
    deleteTravel(travelId: number) {
      this.travels = this.travels.filter((travel: any) => {
        return travel.id !== travelId;
      });
    },
  },
});
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
