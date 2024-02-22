import axios from 'axios'

export const axiosPrivateInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3500',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})
