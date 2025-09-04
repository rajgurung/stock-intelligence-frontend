'use client'

import { useEffect, useState, useRef } from 'react'

interface WebSocketMessage {
  type: string
  data: any
  timestamp?: number
}

export interface WebSocketStatus {
  isConnected: boolean;
  lastUpdate: number | null;
  reconnectAttempts: number;
}

interface WebSocketClientProps {
  onStockUpdate?: (stocks: any[]) => void
  onPerformanceUpdate?: (performance: any) => void
  onOverviewUpdate?: (overview: any) => void
  onStatusChange?: (status: WebSocketStatus) => void
}

export function WebSocketClient({ onStockUpdate, onPerformanceUpdate, onOverviewUpdate, onStatusChange }: WebSocketClientProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<number | null>(null)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  
  // Use refs to store both the WebSocket and callbacks
  const wsRef = useRef<WebSocket | null>(null)
  const onStockUpdateRef = useRef(onStockUpdate)
  const onPerformanceUpdateRef = useRef(onPerformanceUpdate)
  const onOverviewUpdateRef = useRef(onOverviewUpdate)
  const onStatusChangeRef = useRef(onStatusChange)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)
  
  // Update callback refs when props change
  useEffect(() => {
    onStockUpdateRef.current = onStockUpdate
    onPerformanceUpdateRef.current = onPerformanceUpdate
    onOverviewUpdateRef.current = onOverviewUpdate
    onStatusChangeRef.current = onStatusChange
  }, [onStockUpdate, onPerformanceUpdate, onOverviewUpdate, onStatusChange])

  // Update status whenever state changes
  useEffect(() => {
    if (onStatusChangeRef.current) {
      onStatusChangeRef.current({
        isConnected,
        lastUpdate,
        reconnectAttempts
      });
    }
  }, [isConnected, lastUpdate, reconnectAttempts])

  const connectWebSocket = () => {
    // Prevent creating multiple connections
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      console.log('WebSocket connection already exists, skipping...')
      return
    }

    try {
      console.log('Creating new WebSocket connection...')
      const wsUrl = 'ws://localhost:8080/ws'
      const websocket = new WebSocket(wsUrl)
      wsRef.current = websocket

      websocket.onopen = () => {
        if (!isMountedRef.current) return
        console.log('WebSocket connected')
        setIsConnected(true)
        setReconnectAttempts(0)
      }

      websocket.onmessage = (event) => {
        if (!isMountedRef.current) return
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          setLastUpdate(Date.now())

          switch (message.type) {
            case 'initial':
              console.log('Received initial data:', message.data)
              if (onStockUpdateRef.current && message.data.stocks) {
                onStockUpdateRef.current(message.data.stocks)
              }
              if (onPerformanceUpdateRef.current && message.data.performance) {
                onPerformanceUpdateRef.current(message.data.performance)
              }
              if (onOverviewUpdateRef.current && message.data.overview) {
                onOverviewUpdateRef.current(message.data.overview)
              }
              break

            case 'price_update':
              console.log('Received price update:', message.data)
              if (onStockUpdateRef.current && message.data.stocks) {
                onStockUpdateRef.current(message.data.stocks)
              }
              break

            default:
              console.log('Unknown message type:', message.type)
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      websocket.onclose = (event) => {
        if (!isMountedRef.current) return
        console.log('WebSocket disconnected:', event.code, event.reason)
        setIsConnected(false)
        wsRef.current = null

        // Handle different close codes appropriately
        if (event.code === 1000) {
          // Normal closure - don't reconnect
          console.log('WebSocket closed normally')
          setReconnectAttempts(0)
        } else if (event.code === 1001) {
          // Going away - don't reconnect
          console.log('WebSocket going away')
          setReconnectAttempts(0)
        } else if (reconnectAttempts < 5) {
          // Unexpected disconnection - attempt to reconnect with backoff
          const delay = Math.pow(2, reconnectAttempts) * 1000 // 1s, 2s, 4s, 8s, 16s
          console.log(`WebSocket will reconnect in ${delay}ms (attempt ${reconnectAttempts + 1}/5)`)
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!isMountedRef.current) return
            setReconnectAttempts(prev => prev + 1)
            connectWebSocket()
          }, delay)
        } else {
          console.log('WebSocket max reconnection attempts reached')
          setReconnectAttempts(0)
        }
      }

      websocket.onerror = (error) => {
        if (!isMountedRef.current) return
        // WebSocket errors are often empty objects, so log minimal info
        console.warn('WebSocket connection error occurred')
        setIsConnected(false)
        
        // Don't immediately retry on error - let onclose handle reconnection
      }

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      setIsConnected(false)
    }
  }

  // Single useEffect to handle connection lifecycle
  useEffect(() => {
    isMountedRef.current = true
    connectWebSocket()

    return () => {
      isMountedRef.current = false
      
      // Clear any pending reconnection
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
      
      // Close WebSocket connection
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting')
        wsRef.current = null
      }
    }
  }, []) // Empty dependency array - run only once

  // This component now only manages WebSocket connection and doesn't render UI
  return null;
}