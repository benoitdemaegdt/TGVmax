import UserService from '@/services/UserService.js';

export const state = {
  alerts: []
};

export const mutations = {
  SET_ALERTS(state, alerts) {
    state.alerts = alerts;
  },
  ADD_ALERT(state, alert) {
    state.alerts = [...state.alerts, alert];
  },
  DELETE_ALERT(state, alert) {
    const index = state.alerts.indexOf(alert);
    state.alerts.splice(index, 1);
  }
};

export const actions = {
  async fetchAlerts({ commit }) {
    try {
      const response = await UserService.getTravelAlerts(
        this.state.auth.userId
      );
      commit('SET_ALERTS', response.data);
    } catch (err) {
      throw new Error(
        err.response && err.response.data
          ? err.response.data.message
          : 'Erreur réseau. Veuillez réessayer plus tard'
      );
    }
  },
  async createAlert({ commit }, alert) {
    try {
      const response = await UserService.createTravelAlert(
        this.state.auth.userId,
        alert
      );
      window.dataLayer.push({ event: 'travelAlertCreated' });
      commit('ADD_ALERT', { ...alert, _id: response.data._id });
    } catch (err) {
      throw new Error(
        err.response && err.response.data
          ? err.response.data.message
          : 'Erreur réseau. Veuillez réessayer plus tard'
      );
    }
  },
  async deleteAlert({ commit }, alert) {
    try {
      await UserService.deleteTravelAlert(this.state.auth.userId, alert._id);
      commit('DELETE_ALERT', alert);
    } catch (err) {
      throw new Error(
        err.response && err.response.data
          ? err.response.data.message
          : 'Erreur réseau. Veuillez réessayer plus tard'
      );
    }
  }
};
