<template>
  <div id='travel-table'>
    <table class="table">
      <thead>
        <tr>
          <th>Numéro TGVmax</th>
          <th>Départ</th>
          <th>Destination</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="travel in travels" :key="travel.id">
          <td>{{ travel.tgvmaxNumber }}</td>
          <td>{{ travel.origin }}</td>
          <td>{{ travel.destination }}</td>
          <td>{{ travel.status }}</td>
          <td>
            <button class='btn btn-danger' v-on:click="handleDelete(travel)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>  
</template>

<script>
export default {
  name: 'travel-table',
  props: {
    travels: Array,
  },
  methods: {
    handleDelete(travel) {
      this.$emit('delete:travel', travel.id);
    },
  },
};
</script>

<style scoped>

</style>


