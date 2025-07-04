import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize socket connection
      const newSocket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:5000', {
        auth: {
          userId: user.id,
          role: user.role,
          branchId: user.branchId
        }
      });

      newSocket.on('connect', () => {
        setConnected(true);
        console.log('Connected to server');
        
        // Join branch room if user has a branch
        if (user.branchId) {
          newSocket.emit('join-branch', user.branchId);
        }
      });

      newSocket.on('disconnect', () => {
        setConnected(false);
        console.log('Disconnected from server');
      });

      // Real-time event handlers
      newSocket.on('appointment-created', (appointment) => {
        toast.success(`New appointment scheduled for ${appointment.customer?.name}`);
      });

      newSocket.on('appointment-updated', (appointment) => {
        toast.info(`Appointment updated for ${appointment.customer?.name}`);
      });

      newSocket.on('sale-completed', (sale) => {
        toast.success(`Sale completed: ₹${sale.totalAmount}`);
      });

      newSocket.on('customer-created', (customer) => {
        toast.success(`New customer added: ${customer.name}`);
      });

      newSocket.on('staff-update', (data) => {
        toast.info(data.message);
      });

      newSocket.on('branch-update', (data) => {
        if (user.role === 'ADMIN') {
          toast.info(data.message);
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
        setConnected(false);
      };
    }
  }, [isAuthenticated, user]);

  const emitEvent = (event, data) => {
    if (socket && connected) {
      socket.emit(event, data);
    }
  };

  const value = {
    socket,
    connected,
    emitEvent
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};