<template>
  <div id='travel-form'>
    <form v-on:submit.prevent='handleSubmit'>
      <label>Numéro TGVmax</label>
      <input
        ref='first'
        v-model='travel.tgvmaxNumber'
        type='text'
        :class="{ 'has-error': submitting && invalidTgvmaxNumber }"
        class='form-control'
        placeholder='Entrez votre numéro TGVmax (ex: HC000054321)'
        @focus='clearStatus'
        @keypress='clearStatus'
      />
      <label>Gare de départ</label>
      <input
        v-model='travel.origin'
        type='text'
        :class="{ 'has-error': submitting && invalidOrigin }"
        class='form-control'
        placeholder='Entrez votre gare de départ'
        @focus='clearStatus'
        @keypress='clearStatus'
      />
      <label>Gare d'arrivée</label>
      <input
        v-model='travel.destination'
        type='text'
        :class="{ 'has-error': submitting && invalidDestination }"
        class='form-control'
        placeholder='Entrez votre gare d&#39;arrivée'
        @focus='clearStatus'
        @keypress='clearStatus'
      />
      <p v-if="error && submitting" class="error-message">
        ❗Merci de remplir tous les champs
      </p>
      <p v-if="success" class="success-message">
        ✅ Alerte ajoutée avec succès
      </p>
      <button class='btn btn-primary'>Ajouter une alerte</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'travel-form',
  data() {
    return {
      submitting: false,
      error: false,
      success: false,
      travel: {
        tgvmaxNumber: '',
        origin: '',
        destination: '',
        status: 'en cours',
      },
    };
  },
  methods: {
    handleSubmit() {
      this.submitting = true;
      this.clearStatus();

      if (this.invalidTgvmaxNumber || this.invalidOrigin || this.invalidDestination) {
        this.error = true;
        return;
      }

      this.$emit('add:travel', this.travel);
      this.$refs.first.focus();

      this.travel = {
        tgvmaxNumber: '',
        origin: '',
        destination: '',
      };
      this.error = false;
      this.success = true;
      this.submitting = false;

    },
    clearStatus() {
      this.success = false;
      this.error = false;
    },
  },
  computed: {
    invalidTgvmaxNumber() {
      return this.travel.tgvmaxNumber === '';
    },
    invalidOrigin() {
      return this.travel.origin === '';
    },
    invalidDestination() {
      return this.travel.destination === '';
    },
  },
};
</script>

<style scoped>
  #travel-form {
    max-width: 680px;
    margin-bottom: 20px;
  }

  [class*='-message'] {
    font-weight: 500;
  }

  .error-message {
    color: #d33c40;
  }

  .success-message {
    color: #32a95d;
  }
</style>
