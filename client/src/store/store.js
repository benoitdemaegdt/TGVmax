import Vue from 'vue';
import Vuex from 'vuex';

import * as auth from '@/store/modules/auth.js';
import * as alert from '@/store/modules/alert.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { auth, alert }
});
