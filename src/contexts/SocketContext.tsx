import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { ENV } from '@/config/env';
import { Lead } from '@/mocks/data';

interface SocketContextType {
  connected: boolean;
  lastUpdate: Date | null;
  subscribe: (event: string, callback: (data: any) => void) => () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Polling interval for fallback (8-12 seconds as specified)
const POLL_INTERVAL = 10000;

export function SocketProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [listeners, setListeners] = useState<Map<string, Set<(data: any) => void>>>(new Map());

  // In mock mode, we simulate socket connection with polling
  useEffect(() => {
    if (ENV.MOCK_MODE) {
      // Simulate connected state
      setConnected(true);
      
      // Set up polling interval for real-time simulation
      const interval = setInterval(() => {
        setLastUpdate(new Date());
        // Emit a heartbeat event
        const heartbeatListeners = listeners.get('heartbeat');
        heartbeatListeners?.forEach(cb => cb({ timestamp: new Date() }));
      }, POLL_INTERVAL);

      return () => clearInterval(interval);
    }

    // Real Socket.IO implementation would go here
    // For now, we'll just set connected to false
    // const socket = io(ENV.API_URL);
    // socket.on('connect', () => setConnected(true));
    // socket.on('disconnect', () => setConnected(false));
    // return () => socket.disconnect();

    setConnected(false);
  }, [listeners]);

  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    setListeners(prev => {
      const newListeners = new Map(prev);
      const eventListeners = newListeners.get(event) || new Set();
      eventListeners.add(callback);
      newListeners.set(event, eventListeners);
      return newListeners;
    });

    // Return unsubscribe function
    return () => {
      setListeners(prev => {
        const newListeners = new Map(prev);
        const eventListeners = newListeners.get(event);
        if (eventListeners) {
          eventListeners.delete(callback);
          if (eventListeners.size === 0) {
            newListeners.delete(event);
          }
        }
        return newListeners;
      });
    };
  }, []);

  // Function to emit events (for internal use)
  const emit = useCallback((event: string, data: any) => {
    const eventListeners = listeners.get(event);
    eventListeners?.forEach(cb => cb(data));
    setLastUpdate(new Date());
  }, [listeners]);

  // Expose emit globally for mock API to use
  useEffect(() => {
    (window as any).__socketEmit = emit;
    return () => {
      delete (window as any).__socketEmit;
    };
  }, [emit]);

  return (
    <SocketContext.Provider value={{ connected, lastUpdate, subscribe }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

// Helper hook for subscribing to specific events
export function useSocketEvent<T = any>(event: string, callback: (data: T) => void) {
  const { subscribe } = useSocket();

  useEffect(() => {
    const unsubscribe = subscribe(event, callback);
    return unsubscribe;
  }, [event, callback, subscribe]);
}
