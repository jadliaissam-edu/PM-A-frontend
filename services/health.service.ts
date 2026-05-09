import { api } from '../lib/api'

export const healthService = {
  getHealth: () => api.get('/health/').then((r) => r.data),
}

export default healthService
