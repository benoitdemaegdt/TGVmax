import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    userId: localStorage.getItem('userId') || '',
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading';
    },
    auth_success(state, payload) {
      state.status = 'success';
      state.token = payload.token;
      state.userId = payload.userId;
    },
    auth_error(state) {
      state.status = 'error';
    },
    logout(state) {
      state.token = '';
      state.userId = '';
    },
  },
  actions: {
    async register({commit}, user) {
      commit('auth_request');
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/v1/users?action=register`, {
          ...user,
        });
        const token = response.data.token;
        const userId = response.data._id;
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        commit('auth_success', {token, userId});
      } catch (err) {
        commit('auth_error');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        throw new Error(err.response && err.response.data
          ? err.response.data.message
          : 'Erreur réseau. Veuillez réessayer plus tard');
      }
    },
    async login({commit}, user) {
      commit('auth_request');
      try {
        /**
         * user is not the same type than above (no tgvmaxNumber here)
         */
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/v1/users?action=login`, {
          ...user,
        });
        const token = response.data.token;
        const userId = response.data._id;
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        commit('auth_success', {token, userId});
      } catch (err) {
        commit('auth_error');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        throw new Error(err.response && err.response.data
          ? err.response.data.message
          : 'Erreur réseau. Veuillez réessayer plus tard');
      }
    },
    logout({commit}) {
      commit('logout');
      delete axios.defaults.headers.common.Authorization;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    },
  },
  getters : {
    isLoggedIn: (state) => !!state.token,
  },
});
