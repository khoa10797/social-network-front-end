import axios from 'axios';

export const baseRequest = axios.create({
  baseURL: 'http://localhost:8080',
  auth: {
    username: "admin",
    password: "admin"
  }
});
