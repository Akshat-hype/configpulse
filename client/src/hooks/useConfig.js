import useConfigStore from '../store/configStore'

// Convenience hook to keep components small; everything is sourced from Zustand.
export default function useConfig() {
  return useConfigStore((s) => ({
    environment: s.environment,
    location: s.location,
    clientId: s.clientId,

    wsConnected: s.wsConnected,
    apiHealthy: s.apiHealthy,
    systemStatus: s.systemStatus,

    resolvedConfig: s.resolvedConfig,
    resolvedMeta: s.resolvedMeta,
    configLoading: s.configLoading,
    configError: s.configError,

    clients: s.clients,
    logs: s.logs,
    lastConfigUpdate: s.lastConfigUpdate,

    validation: s.validation,
    notifications: s.notifications,

    setEnvironment: s.setEnvironment,
    setLocation: s.setLocation,
    setClientId: s.setClientId,

    fetchResolvedConfig: s.fetchResolvedConfig,
    fetchClients: s.fetchClients,
    fetchLogs: s.fetchLogs,
    fetchHealth: s.fetchHealth,

    validateConfig: s.validateConfig,
    deployConfig: s.deployConfig,
  }))
}

