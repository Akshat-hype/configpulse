import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

// GET /api/config?clientId=...&environment=...&location=...
export async function fetchResolvedConfig(environment, location, clientId) {
  const res = await apiClient.get('/api/config', {
    params: { environment, location, clientId },
  })
  return res.data
}

// Best-effort: backend may or may not expose these routes yet.
export async function fetchClients() {
  const res = await apiClient.get('/api/clients')
  return res.data
}

// Best-effort: backend may or may not expose these routes yet.
export async function fetchLogs() {
  const res = await apiClient.get('/api/logs')
  return res.data
}

export async function getHealth() {
  const res = await apiClient.get('/api/health')
  return res.data
}

export async function validateConfig({ environment, location, clientId, config }) {
  const res = await apiClient.post('/api/config/validate', {
    environment,
    location,
    clientId,
    config,
  })
  return res.data
}

export async function updateConfig(payload) {
  const res = await apiClient.post('/api/admin/config', payload)
  return res.data
}

