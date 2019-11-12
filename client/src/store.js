import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    userId: localStorage.getItem('userId') || ''
  },
  mutations: {
    AUTH_REQUEST(state) {
      state.status = 'loading';
    },
    AUTH_SUCCESS(state, payload) {
      state.status = 'success';
      state.token = payload.token;
      state.userId = payload.userId;
    },
    AUTH_ERROR(state) {
      state.status = 'error';
    },
    LOGOUT(state) {
      state.token = '';
      state.userId = '';
    }
  },
  actions: {
    async register({ commit }, user) {
      commit('AUTH_REQUEST');
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/api/v1/users?action=register`,
          {
            ...user
          }
        );
        const token = response.data.token;
        const userId = response.data._id;
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        commit('AUTH_SUCCESS', { token, userId });
      } catch (err) {
        commit('AUTH_ERROR');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        throw new Error(
          err.response && err.response.data
            ? err.response.data.message
            : 'Erreur réseau. Veuillez réessayer plus tard'
        );
      }
    },
    async login({ commit }, user) {
      commit('AUTH_REQUEST');
      try {
        /**
         * user is not the same type than above (no tgvmaxNumber here)
         */
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/api/v1/users?action=login`,
          {
            ...user
          }
        );
        const token = response.data.token;
        const userId = response.data._id;
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        commit('AUTH_SUCCESS', { token, userId });
      } catch (err) {
        commit('AUTH_ERROR');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        throw new Error(
          err.response && err.response.data
            ? err.response.data.message
            : 'Erreur réseau. Veuillez réessayer plus tard'
        );
      }
    },
    logout({ commit }) {
      commit('LOGOUT');
      delete axios.defaults.headers.common.Authorization;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  },
  getters: {
    isLoggedIn: state => !!state.token
  }
});
