import axios from 'axios';

const instance = axios.create();

instance.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response &&
      error.response.status === 401 &&
      (
        error.response.data?.msg?.toLowerCase().includes('token has expired') ||
        error.response.data?.msg?.toLowerCase().includes('token is invalid') ||
        error.response.data?.msg?.toLowerCase().includes('missing authorization')
      )
    ) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default instance; 