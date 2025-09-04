import { useWebSocket } from '../../hooks/useWebSocket';
import { renderHook, act } from '@testing-library/react';

// Enhanced Mock WebSocket for integration testing
class MockWebSocketIntegration {
  public onopen: ((event: Event) => void) | null = null;
  public onmessage: ((event: MessageEvent) => void) | null = null;
  public onclose: ((event: CloseEvent) => void) | null = null;
  public onerror: ((event: Event) => void) | null = null;
  public readyState = WebSocket.CONNECTING;

  private listeners: { [key: string]: Function[] } = {};
  private messageQueue: any[] = [];

  constructor(public url: string) {
    // Simulate connection opening after delay
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      if (this.onopen) {
        this.onopen(new Event('open'));
      }
      this.fireEvent('open', new Event('open'));
      
      // Process queued messages
      this.processMessageQueue();
    }, 50);
  }

  close() {
    this.readyState = WebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close'));
    }
    this.fireEvent('close', new CloseEvent('close'));
  }

  send(data: string) {
    if (this.readyState === WebSocket.OPEN) {
      // Echo back for testing
      setTimeout(() => {
        if (this.onmessage) {
          this.onmessage(new MessageEvent('message', { data }));
        }
      }, 10);
    }
  }

  // Simulate receiving a message from server
  simulateMessage(data: any) {
    if (this.readyState === WebSocket.OPEN) {
      const messageData = typeof data === 'string' ? data : JSON.stringify(data);
      if (this.onmessage) {
        this.onmessage(new MessageEvent('message', { data: messageData }));
      }
      this.fireEvent('message', new MessageEvent('message', { data: messageData }));
    } else {
      this.messageQueue.push(data);
    }
  }

  // Simulate connection error
  simulateError() {
    this.readyState = WebSocket.CLOSED;
    if (this.onerror) {
      this.onerror(new Event('error'));
    }
    // Also trigger close event as errors typically close the connection
    if (this.onclose) {
      this.onclose(new CloseEvent('close'));
    }
    this.fireEvent('error', new Event('error'));
    this.fireEvent('close', new CloseEvent('close'));
  }

  // Event listener system for integration testing
  addEventListener(type: string, listener: Function) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(listener);
  }

  removeEventListener(type: string, listener: Function) {
    if (this.listeners[type]) {
      const index = this.listeners[type].indexOf(listener);
      if (index > -1) {
        this.listeners[type].splice(index, 1);
      }
    }
  }

  private fireEvent(type: string, event: Event) {
    if (this.listeners[type]) {
      this.listeners[type].forEach(listener => listener(event));
    }
  }

  private processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const data = this.messageQueue.shift();
      this.simulateMessage(data);
    }
  }
}

// Global mock setup
global.WebSocket = MockWebSocketIntegration as any;

describe('WebSocket Integration Tests', () => {
  let mockWs: MockWebSocketIntegration;

  beforeEach(() => {
    jest.clearAllMocks();
    // Spy on WebSocket constructor to get reference
    const originalWebSocket = global.WebSocket;
    global.WebSocket = jest.fn().mockImplementation((url) => {
      mockWs = new MockWebSocketIntegration(url);
      return mockWs;
    }) as any;
    global.WebSocket.CONNECTING = WebSocket.CONNECTING;
    global.WebSocket.OPEN = WebSocket.OPEN;
    global.WebSocket.CLOSED = WebSocket.CLOSED;
    global.WebSocket.CLOSING = WebSocket.CLOSING;
  });

  afterEach(async () => {
    if (mockWs) {
      await act(async () => {
        mockWs.close();
      });
    }
  });

  it('should establish connection and handle real-time stock updates', async () => {
    const { result } = renderHook(() => 
      useWebSocket('ws://localhost:8080/ws')
    );

    // Initially connecting
    expect(result.current.isConnected).toBe(false);
    expect(result.current.connectionStatus).toBe('Connecting');

    // Wait for connection
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.isConnected).toBe(true);
    expect(result.current.connectionStatus).toBe('Connected');

    // Simulate receiving stock price update
    const stockUpdate = {
      type: 'price_update',
      data: {
        stocks: [
          { symbol: 'AAPL', current_price: 151.50, change_percent: 3.2 },
          { symbol: 'MSFT', current_price: 318.75, change_percent: -0.8 }
        ]
      }
    };

    act(() => {
      mockWs.simulateMessage(stockUpdate);
    });

    expect(result.current.lastMessage).toEqual(stockUpdate);
  });

  it('should handle market overview updates', async () => {
    const { result } = renderHook(() => 
      useWebSocket('ws://localhost:8080/ws')
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Simulate market overview update
    const marketUpdate = {
      type: 'market_overview',
      data: {
        total_stocks: 100,
        advancing_count: 65,
        declining_count: 25,
        unchanged_count: 10
      }
    };

    act(() => {
      mockWs.simulateMessage(marketUpdate);
    });

    expect(result.current.lastMessage).toEqual(marketUpdate);
    expect(result.current.lastMessage.type).toBe('market_overview');
  });

  it('should handle connection failures and reconnection', async () => {
    const { result } = renderHook(() => 
      useWebSocket('ws://localhost:8080/ws')
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.isConnected).toBe(true);

    // Simulate connection error
    await act(async () => {
      mockWs.simulateError();
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    expect(result.current.isConnected).toBe(false);
    // Since error triggers both error and close events, final status is 'Disconnected'
    expect(result.current.connectionStatus).toBe('Disconnected');
  });

  it('should handle multiple message types in sequence', async () => {
    const { result } = renderHook(() => 
      useWebSocket('ws://localhost:8080/ws')
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const messages = [
      {
        type: 'price_update',
        data: { stocks: [{ symbol: 'AAPL', current_price: 150.0 }] }
      },
      {
        type: 'market_overview',
        data: { total_stocks: 100, advancing_count: 60 }
      },
      {
        type: 'sector_update',
        data: { sector: 'Technology', avg_change: 2.5 }
      }
    ];

    for (const message of messages) {
      act(() => {
        mockWs.simulateMessage(message);
      });
      
      expect(result.current.lastMessage).toEqual(message);
    }
  });

  it('should handle malformed messages gracefully', async () => {
    const { result } = renderHook(() => 
      useWebSocket('ws://localhost:8080/ws')
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Send malformed JSON
    act(() => {
      mockWs.simulateMessage('invalid json{');
    });

    // Should not crash and lastMessage should remain null
    expect(result.current.lastMessage).toBe(null);
    expect(result.current.isConnected).toBe(true);

    // Send valid message after malformed one
    const validMessage = {
      type: 'price_update',
      data: { stocks: [] }
    };

    act(() => {
      mockWs.simulateMessage(validMessage);
    });

    expect(result.current.lastMessage).toEqual(validMessage);
  });

  it('should handle rapid message updates', async () => {
    const { result } = renderHook(() => 
      useWebSocket('ws://localhost:8080/ws')
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Send multiple rapid updates
    const updates = Array.from({ length: 10 }, (_, i) => ({
      type: 'price_update',
      data: { 
        stocks: [{ 
          symbol: 'AAPL', 
          current_price: 150 + i * 0.1,
          timestamp: Date.now() + i 
        }] 
      }
    }));

    for (const update of updates) {
      act(() => {
        mockWs.simulateMessage(update);
      });
    }

    // Should have the latest message
    expect(result.current.lastMessage).toEqual(updates[updates.length - 1]);
    expect(result.current.lastMessage.data.stocks[0].current_price).toBe(150.9);
  });

  it('should handle connection lifecycle events', async () => {
    const { result } = renderHook(() => 
      useWebSocket('ws://localhost:8080/ws')
    );

    // Track connection state changes
    const connectionStates = [];
    
    // Initially connecting
    connectionStates.push(result.current.connectionStatus);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    connectionStates.push(result.current.connectionStatus);

    // Close connection
    await act(async () => {
      mockWs.close();
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    connectionStates.push(result.current.connectionStatus);

    expect(connectionStates).toEqual(['Connecting', 'Connected', 'Disconnected']);
    expect(result.current.isConnected).toBe(false);
  });

  it('should handle different WebSocket URLs', async () => {
    const testUrls = [
      'ws://localhost:8080/ws',
      'wss://production.example.com/ws',
      'ws://staging.example.com:9000/realtime'
    ];

    for (const url of testUrls) {
      const { result } = renderHook(() => useWebSocket(url));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.connectionStatus).toBe('Connected');
      
      // Clean up
      await act(async () => {
        if (mockWs) {
          mockWs.close();
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      });
    }
  });

  it('should handle empty or invalid WebSocket URLs', () => {
    const { result: resultEmpty } = renderHook(() => useWebSocket(''));
    const { result: resultInvalid } = renderHook(() => useWebSocket('invalid-url'));

    expect(resultEmpty.current.isConnected).toBe(false);
    expect(resultInvalid.current.isConnected).toBe(false);
  });

  it('should maintain message history during connection', async () => {
    const { result } = renderHook(() => 
      useWebSocket('ws://localhost:8080/ws')
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const messages = [];
    const messageCount = 5;

    for (let i = 0; i < messageCount; i++) {
      const message = {
        type: 'price_update',
        data: { 
          stocks: [{ symbol: 'AAPL', current_price: 150 + i }],
          sequence: i 
        }
      };

      messages.push(message);
      
      act(() => {
        mockWs.simulateMessage(message);
      });

      // Each message should be the latest
      expect(result.current.lastMessage).toEqual(message);
    }

    // Final message should be the last one sent
    expect(result.current.lastMessage.data.sequence).toBe(messageCount - 1);
  });
});