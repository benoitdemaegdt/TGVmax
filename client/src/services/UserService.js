import axios from 'axios';
import store from '../store/store.js';
import router from '../router.js';

/**
 * instantiate axios
 */
const apiClient = axios.create({
  baseURL: `${process.env.VUE_APP_API_BASE_URL}/api/v1/users`,
  withCredentials: false
});

/**
 * add Authorization header if user is authenticated
 */
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

/**
 * logout user if jwt is outdated
 */
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const errorResponse = error.response;
    if (
      errorResponse.status === 401 &&
      errorResponse.config &&
      !errorResponse.config.__isRetryRequest &&
      errorResponse.data &&
      errorResponse.data.message === 'jwt expired'
    ) {
      store.dispatch('logout');
      router.push('/');
    }
    throw error;
  }
);

/**
 * api calls to backend
 */
export default {
  getUser(userId) {
    return apiClient.get(`/${userId}`);
  },
  registerUser(user) {
    return apiClient.post('/', { ...user }, { params: { action: 'register' } });
  },
  loginUser(user) {
    return apiClient.post('/', { ...user }, { params: { action: 'login' } });
  },
  getTravelAlerts(userId) {
    return apiClient.get(`/${userId}/travels`);
  },
  createTravelAlert(userId, travelAlert) {
    return apiClient.post(`/${userId}/travels`, { ...travelAlert });
  },
  deleteTravelAlert(userId, travelAlertId) {
    return apiClient.delete(`/${userId}/travels/${travelAlertId}`);
  }
};
