import { create } from 'zustand'
import {
  fetchClients as apiFetchClients,
  getHealth,
  fetchLogs as apiFetchLogs,
  fetchResolvedConfig as apiFetchResolvedConfig,
  updateConfig,
  validateConfig,
} from '../services/api'

const nowIso = () => new Date().toISOString()

const toSafeArray = (v) => {
  if (!v) return []
  return Array.isArray(v) ? v : [v]
}

const useConfigStore = create((set, get) => ({
  environment: 'production',
  location: 'india',
  clientId: 'enterprise-client-1',

  wsConnected: false,
  apiHealthy: null,

  systemStatus: 'Connecting…',

  resolvedConfig: null,
  resolvedMeta: null,
  configLoading: false,
  configError: null,

  clients: [],
  logs: [],

  lastConfigUpdate: null,

  validation: {
    status: 'idle', // idle | success | error | warning
    title: '',
    message: '',
    errors: [],
    validating: false,
  },

  notifications: [],

  setEnvironment: (environment) => set({ environment }),
  setLocation: (location) => set({ location }),
  setClientId: (clientId) => set({ clientId }),

  dismissNotification: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    })),

  pushNotification: ({ type = 'success', title = 'Update', message = '' }) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    set((s) => ({
      notifications: [{ id, type, title, message }, ...s.notifications].slice(0, 5),
    }))
    // Auto-dismiss after a short delay.
    setTimeout(() => {
      set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) }))
    }, 4200)
  },

  setWsConnected: (wsConnected) => {
    set({
      wsConnected,
      systemStatus: wsConnected ? 'WebSocket Connected' : 'WebSocket Disconnected',
    })
  },

  fetchHealth: async () => {
    try {
      const data = await getHealth()
      set({
        apiHealthy: !!data?.db && data.db === 'connected',
      })
    } catch {
      set({ apiHealthy: false })
    }
  },

  fetchClients: async () => {
    try {
      const data = await apiFetchClients()
      // Expected shapes (best-effort):
      // { success:true, data:[...] } or { clients:[...] }
      const list = data?.data ?? data?.clients ?? data?.result ?? []
      set({ clients: toSafeArray(list) })
    } catch {
      // Degrade gracefully if endpoint doesn't exist yet.
      set({ clients: [] })
    }
  },

  fetchLogs: async () => {
    try {
      const data = await apiFetchLogs()
      const list = data?.data ?? data?.logs ?? data?.result ?? []
      set({ logs: toSafeArray(list) })
    } catch {
      set({ logs: [] })
    }
  },

  setQueryFromEvent: ({ environment, location, clientId }) =>
    set((s) => ({
      environment: environment ?? s.environment,
      location: location ?? s.location,
      clientId: clientId ?? s.clientId,
    })),

  fetchResolvedConfig: async () => {
    const { environment, location, clientId } = get()
    set({ configLoading: true, configError: null })
    try {
      const result = await apiFetchResolvedConfig(environment, location, clientId)
      // Backend returns: { success:true, data: resolved, meta }
      const resolved = result?.data ?? null
      const meta = result?.meta ?? null

      set({
        resolvedConfig: resolved,
        resolvedMeta: meta,
        lastConfigUpdate: nowIso(),
        configLoading: false,
        configError: null,
      })
      return { ok: true }
    } catch (e) {
      const message = e?.response?.data?.message || e?.message || 'Failed to resolve configuration'
      set({
        configLoading: false,
        configError: message,
      })
      get().pushNotification({
        type: 'error',
        title: 'Config Load Failed',
        message,
      })
      return { ok: false, error: message }
    }
  },

  validateConfig: async ({ config }) => {
    const { environment, location, clientId } = get()
    set((s) => ({
      validation: { ...s.validation, validating: true, status: 'idle', title: '', message: '', errors: [] },
    }))

    try {
      // Best-effort: if route doesn't exist, we still return JSON-parsing validation at the UI layer.
      const data = await validateConfig({ environment, location, clientId, config })
      const errors =
        data?.errors ?? data?.validationErrors ?? data?.details?.errors ?? data?.result?.errors ?? []

      if (errors && toSafeArray(errors).length) {
        set((s) => ({
          validation: {
            ...s.validation,
            status: 'error',
            validating: false,
            title: data?.title || 'Validation Failed',
            message: data?.message || 'Invalid configuration',
            errors: toSafeArray(errors),
          },
        }))
        return
      }

      set((s) => ({
        validation: {
          ...s.validation,
          status: 'success',
          validating: false,
          title: data?.title || 'Config Valid',
          message: data?.message || 'Validation passed successfully',
          errors: [],
        },
      }))
    } catch (e) {
      set((s) => ({
        validation: {
          ...s.validation,
          status: 'warning',
          validating: false,
          title: 'Validation Endpoint Unavailable',
          message: e?.response?.data?.message || e?.message || 'Could not validate on backend',
          errors: [],
        },
      }))
    }
  },

  deployConfig: async ({ config }) => {
    const { environment, location, clientId } = get()
    set((s) => ({
      validation: { ...s.validation, validating: true, status: 'idle', title: '', message: '', errors: [] },
    }))

    try {
      const data = await updateConfig({ environment, location, clientId, config })
      const message = data?.message || 'Config deployed successfully'
      set((s) => ({
        validation: {
          ...s.validation,
          status: 'success',
          validating: false,
          title: 'Deploy Successful',
          message,
          errors: [],
        },
      }))
      get().pushNotification({
        type: 'success',
        title: '⚡ Config deployed successfully',
        message,
      })
      // Refresh config so UI stays in sync.
      get().fetchResolvedConfig()
    } catch (e) {
      set((s) => ({
        validation: {
          ...s.validation,
          status: 'error',
          validating: false,
          title: 'Deploy Failed',
          message: e?.response?.data?.message || e?.message || 'Could not deploy',
          errors: [],
        },
      }))
      get().pushNotification({
        type: 'error',
        title: 'Deploy Failed',
        message: e?.response?.data?.message || e?.message || 'Could not deploy',
      })
    }
  },
}))

export default useConfigStore

