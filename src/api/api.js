import axios from 'axios';

export const baseRequest = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000
});

baseRequest.interceptors.request.use(request => {
    let token = localStorage.getItem('access_token');
    if (token) {
        request.headers['Authorization'] = token;
    }

    return request;
}, error => {
    return Promise.reject(error);
});

/*
baseRequest.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.reject(error.response);
});*/
