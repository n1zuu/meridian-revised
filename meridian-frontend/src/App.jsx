import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Common Page Imports
import LandingPage from './pages/common/LandingPage';
import SignInAsView from './pages/common/SignInAsPage';
import LoginView from './pages/common/LoginPage';
import SettingsPage from './pages/common/SettingsPage';

// Admin Page Imports
import AdminDashboard from './pages/manager/AdminDashboard';
import DailyReport from './pages/manager/DailyReport';
import TransactionHistory from './pages/manager/TransactionHistory';

// Cashier Page Imports
import CashierDashboard from './pages/cashier/CashierDashboard';
import OrderDetail from './pages/cashier/OrderDetail';
import PaymentMethod from './pages/cashier/PaymentMethod';
import PaymentSuccess from './pages/cashier/PaymentSuccess';
import Receipt from './pages/cashier/Receipt';

// Waiter Page Imports
import WaiterDashboard from './pages/waiter/WaiterDashboard';
import OrderSuccess from './pages/waiter/OrderSuccess';
import WaiterCart from './pages/waiter/WaiterCart';

// Customer Page Imports
import CustomerDashboard from './pages/customer/CustomerDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin-as" element={<SignInAsView />} />
        <Route path="/login" element={<LoginView />} />

        {/* Manager Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/daily-report" element={<DailyReport />} />
        <Route path="/admin/transactions" element={<TransactionHistory />} />

        {/* Cashier Routes */}
        <Route path="/cashier" element={<CashierDashboard />} />
        <Route path="/cashier/order-detail" element={<OrderDetail />} />
        <Route path="/cashier/pay" element={<PaymentMethod />} />
        <Route path="/cashier/pay/success" element={<PaymentSuccess />} />
        <Route path="/cashier/receipt" element={<Receipt />} />

        {/* Waiter Routes */}
        <Route path="/waiter" element={<WaiterDashboard />} />
        <Route path="/waiter/cart" element={<WaiterCart />} />
        <Route path="/waiter/cart/success" element={<OrderSuccess />} />

        {/* Guest Route */}
        <Route path="/menu" element={<CustomerDashboard />} />

        {/* Settings */}
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;