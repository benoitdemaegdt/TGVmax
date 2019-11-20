import UserService from '@/services/UserService.js';

export const state = {
  status: '',
  token: localStorage.getItem('token') || '',
  userId: localStorage.getItem('userId') || ''
};

export const mutations = {
  AUTH_REQUEST(state) {
    state.status = 'loading';
  },
  AUTH_SUCCESS(state, { token, userId }) {
    state.status = 'success';
    state.token = token;
    state.userId = userId;
  },
  AUTH_ERROR(state) {
    state.status = 'error';
  },
  LOGOUT(state) {
    state.token = '';
    state.userId = '';
  }
};

export const actions = {
  async register({ commit }, user) {
    commit('AUTH_REQUEST');
    try {
      const response = await UserService.registerUser(user);
      const token = response.data.token;
      const userId = response.data._id;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      window.dataLayer.push({ event: 'accountCreated' });
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
      const response = await UserService.loginUser(user);
      const token = response.data.token;
      const userId = response.data._id;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
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
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }
};

export const getters = {
  isLoggedIn: state => !!state.token
};
