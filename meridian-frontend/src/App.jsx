import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Common Page Imports
import LandingPage from './pages/common/LandingPage';
import SignInAsView from './pages/common/SignInAsPage';
import LoginView from './pages/common/LoginPage';
import SettingsPage from './pages/common/SettingsPage';

// Admin Page Imports
import AdminDashboard from './pages/manager/AdminDashboard';
import OrderStatus from './pages/manager/OrderStatus';
import TransactionHistory from './pages/manager/TransactionHistory';

// Cashier Page Imports
import CashierMain from './pages/cashier/CashierMain';
import OrderDetail from './pages/cashier/OrderDetail';
import PaymentMethod from './pages/cashier/PaymentMethod';
import PaymentSuccess from './pages/cashier/PaymentSuccess';
import Receipt from './pages/cashier/Receipt';

// Waiter Page Imports
import WaiterDashboard from './pages/waiter/WaiterDashboard';
import OrderSuccess from './pages/waiter/OrderSuccess';

// Customer Page Imports
import CustomerDashboard from './pages/customer/CustomerDashboard'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          {/* Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin-as" element={<SignInAsView />} />
          <Route path="/login/:role" element={<LoginView />} />

          {/* Manager Routes */}
          <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['manager']}><OrderStatus /></ProtectedRoute>} />
          <Route path="/admin/transactions" element={<ProtectedRoute allowedRoles={['manager']}><TransactionHistory /></ProtectedRoute>} />

          {/* Cashier Routes */}
          <Route path="/cashier/order-detail" element={<ProtectedRoute allowedRoles={['cashier']}><OrderDetail /></ProtectedRoute>} />
          <Route path="/cashier/pay" element={<ProtectedRoute allowedRoles={['cashier']}><PaymentMethod /></ProtectedRoute>} />
          <Route path="/cashier/pay/success" element={<ProtectedRoute allowedRoles={['cashier']}><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/cashier/receipt" element={<ProtectedRoute allowedRoles={['cashier']}><Receipt /></ProtectedRoute>} />

          {/* Waiter Routes */}
          <Route path="/waiter/cart/success" element={<ProtectedRoute allowedRoles={['waiter']}><OrderSuccess /></ProtectedRoute>} />

          {/* Guest Route */}
          <Route path="/menu" element={<CustomerDashboard />} />

          {/* Settings (any authenticated user) */}
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          {/* Protected Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  { <AdminDashboard /> }
                  <div>Manager Dashboard</div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/waiter" 
              element={
                <ProtectedRoute allowedRoles={['waiter']}>
                  { <WaiterDashboard /> }
                  <div>Waiter Dashboard</div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/cashier" 
              element={
                <ProtectedRoute allowedRoles={['cashier']}>
                  { <CashierMain /> }
                  <div>Cashier Dashboard</div>
                </ProtectedRoute>
              } 
            />

          {/* 404 */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;