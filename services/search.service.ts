import { api } from '../lib/api'

export type SearchResult = any

export const searchService = {
  global: (query: string, params?: any) =>
    api.get('/search/', { params: { q: query, ...params } }).then((r) => r.data),

  projects: (query: string, params?: any) =>
    api.get('/projects/', { params: { search: query, ...params } }).then((r) => r.data),

  tickets: (query: string, params?: any) =>
    api.get('/tickets/', { params: { search: query, ...params } }).then((r) => r.data),

  users: (query: string, params?: any) =>
    api.get('/users/', { params: { search: query, ...params } }).then((r) => r.data),
}

export default searchService
