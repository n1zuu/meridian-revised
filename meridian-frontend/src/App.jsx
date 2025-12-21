import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    navigate('/');
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    navigate('/');
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
          <Route path="/admin/orders" element={<OrderStatus />} />
          <Route path="/admin/transactions" element={<TransactionHistory />} />

          {/* Cashier Routes */}
          <Route path="/cashier/order-detail" element={<OrderDetail />} />
          <Route path="/cashier/pay" element={<PaymentMethod />} />
          <Route path="/cashier/pay/success" element={<PaymentSuccess />} />
          <Route path="/cashier/receipt" element={<Receipt />} />

          {/* Waiter Routes */}
          <Route path="/waiter/cart/success" element={<OrderSuccess />} />

          {/* Guest Route */}
          <Route path="/menu" element={<CustomerDashboard />} />

          {/* Settings */}
          <Route path="/settings" element={<SettingsPage />} />

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