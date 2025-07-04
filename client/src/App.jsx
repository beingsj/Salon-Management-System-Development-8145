import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

// Layout Components
import Layout from './components/Layout/Layout';
import AuthLayout from './components/Layout/AuthLayout';

// Auth Components
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Dashboard Components
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import BranchDashboard from './pages/Dashboard/BranchDashboard';

// Main Pages
import Branches from './pages/Branches/Branches';
import BranchDetails from './pages/Branches/BranchDetails';
import Customers from './pages/Customers/Customers';
import CustomerDetails from './pages/Customers/CustomerDetails';
import Services from './pages/Services/Services';
import Appointments from './pages/Appointments/Appointments';
import AppointmentForm from './pages/Appointments/AppointmentForm';
import Sales from './pages/Sales/Sales';
import SaleForm from './pages/Sales/SaleForm';
import Staff from './pages/Staff/Staff';
import Reports from './pages/Reports/Reports';

// Protected Route Component
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={
                <AuthLayout>
                  <Login />
                </AuthLayout>
              } />
              <Route path="/register" element={
                <AuthLayout>
                  <Register />
                </AuthLayout>
              } />

              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                {/* Dashboard Routes */}
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="branch-dashboard/:branchId" element={<BranchDashboard />} />

                {/* Branch Management */}
                <Route path="branches" element={
                  <ProtectedRoute requiredRoles={['ADMIN']}>
                    <Branches />
                  </ProtectedRoute>
                } />
                <Route path="branches/:id" element={<BranchDetails />} />

                {/* Customer Management */}
                <Route path="customers" element={<Customers />} />
                <Route path="customers/:id" element={<CustomerDetails />} />

                {/* Service Management */}
                <Route path="services" element={
                  <ProtectedRoute requiredRoles={['ADMIN', 'BRANCH_MANAGER']}>
                    <Services />
                  </ProtectedRoute>
                } />

                {/* Appointment Management */}
                <Route path="appointments" element={<Appointments />} />
                <Route path="appointments/new" element={<AppointmentForm />} />
                <Route path="appointments/:id/edit" element={<AppointmentForm />} />

                {/* Sales Management */}
                <Route path="sales" element={<Sales />} />
                <Route path="sales/new" element={<SaleForm />} />
                <Route path="sales/:id/edit" element={<SaleForm />} />

                {/* Staff Management */}
                <Route path="staff" element={
                  <ProtectedRoute requiredRoles={['ADMIN', 'BRANCH_MANAGER']}>
                    <Staff />
                  </ProtectedRoute>
                } />

                {/* Reports */}
                <Route path="reports" element={<Reports />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>

            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;