import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error('API error', error)
    return Promise.reject(error)
  }
)

export default api
