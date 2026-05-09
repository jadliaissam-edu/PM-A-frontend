import { api } from '../lib/api'

export const schemaService = {
  getSchema: () => api.get('/schema/').then((r) => r.data),
}

export default schemaService
