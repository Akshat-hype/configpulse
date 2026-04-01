import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import useConfigStore from '../store/configStore'

const SOCKET_URL = 'http://localhost:5000'

export default function useWebSocket() {
  const socketRef = useRef(null)

  const setWsConnected = useConfigStore((s) => s.setWsConnected)
  const pushNotification = useConfigStore((s) => s.pushNotification)
  const setQueryFromEvent = useConfigStore((s) => s.setQueryFromEvent)
  const fetchResolvedConfig = useConfigStore((s) => s.fetchResolvedConfig)

  const appendConfigUpdated = useConfigStore((s) => s.pushNotification)

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ['websocket'],
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setWsConnected(true)
    })

    socket.on('disconnect', () => {
      setWsConnected(false)
    })

    socket.on('configUpdated', async (payload) => {
      // Expected payload shape isn't guaranteed, so we support both:
      // { environment, location, clientId, ... } and { resolved, meta, ... }.
      const environment = payload?.environment
      const location = payload?.location
      const clientId = payload?.clientId

      if (environment || location || clientId) {
        setQueryFromEvent({ environment, location, clientId })
      }

      // Update config state by re-fetching the resolved config.
      // If the backend payload already contains resolved config, the store
      // will still refresh to ensure UI consistency.
      const result = await fetchResolvedConfig()
      if (result?.ok) {
        pushNotification({
          type: 'success',
          title: '⚡ Config Updated Successfully',
          message: nowMessage(payload),
        })
      }
    })

    socket.on('connect_error', () => {
      setWsConnected(false)
      appendConfigUpdated({
        type: 'error',
        title: 'WebSocket Connect Failed',
        message: `Unable to reach ${SOCKET_URL}.`,
      })
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('configUpdated')
      socket.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

function nowMessage(payload) {
  const env = payload?.environment
  const loc = payload?.location
  const cid = payload?.clientId
  const parts = [env ? `env=${env}` : null, loc ? `loc=${loc}` : null, cid ? `client=${cid}` : null].filter(
    Boolean,
  )
  return parts.length ? parts.join(' ') : 'A configuration change was broadcast.'
}

