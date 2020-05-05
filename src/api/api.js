import axios from 'axios';

export const baseRequest = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000
});

baseRequest.interceptors.request.use(config => {
    let token = localStorage.getItem('access_token');
    if (token) {
        config.headers['Authorization'] = token;
    }

    return config;
}, (error => {
    return Promise.reject(error);
}));