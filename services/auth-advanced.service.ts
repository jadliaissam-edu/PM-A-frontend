import { api } from '../lib/api'

export const authAdvancedService = {
  enableMfa: (payload: any) => api.post('/auth/mfa/enable/', payload).then((r) => r.data),
  setupMfa: (payload: any) => api.post('/auth/mfa/setup/', payload).then((r) => r.data),
  verifyMfa: (payload: any) => api.post('/auth/mfa/verify/', payload).then((r) => r.data),

  oauthLogin: (payload: any) => api.post('/auth/oauth/login/', payload).then((r) => r.data),

  resetPassword: (email: string) => api.post('/auth/reset-password/', { email }).then((r) => r.data),
  resetPasswordConfirm: (payload: any) => api.post('/auth/reset-password/confirm/', payload).then((r) => r.data),
  verifyResetOtp: (payload: any) => api.post('/auth/reset-password/verify-otp/', payload).then((r) => r.data),

  // Token endpoints: try both auth names and generic token endpoints
  tokenRefreshAuth: (refreshToken: string) => api.post('/auth/token/refresh/', { refresh: refreshToken }).then((r) => r.data),
  tokenRefresh: (refreshToken: string) => api.post('/token/refresh/', { refresh: refreshToken }).then((r) => r.data),
  tokenVerify: (token: string) => api.post('/token/verify/', { token }).then((r) => r.data),
}

export default authAdvancedService
