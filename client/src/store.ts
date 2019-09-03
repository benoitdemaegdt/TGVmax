import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

interface IState {
  status: string;
  token: string;
  userId: string;
}

interface IPayload {
  token: string;
  userId: string;
}

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    userId: localStorage.getItem('userId') || '',
  },
  // @ts-ignore
  mutations: {
    auth_request(state: IState) {
      state.status = 'loading';
    },
    auth_success(state: IState, payload: IPayload) {
      state.status = 'success';
      state.token = payload.token;
      state.userId = payload.userId;
    },
    auth_error(state: IState) {
      state.status = 'error';
    },
  },
  actions: {
    async register({commit}, user) {
      commit('auth_request');
      try {
        const response = await axios.post(`http://localhost:3001/api/v1/users?action=register`, {
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
        throw new Error(err.response.data.message);
      }
    },
    async login({commit}, user) {
      commit('auth_request');
      try {
        /**
         * user is not the same type than above (no tgvmaxNumber here)
         */
        const response = await axios.post(`http://localhost:3001/api/v1/users?action=login`, {
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
        throw new Error(err.response.data.message);
      }
    },
  },
  getters : {
    isLoggedIn: (state: IState) => !!state.token,
  },
});
