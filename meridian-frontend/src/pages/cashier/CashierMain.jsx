import React, { useState } from 'react';
import CashierDashboard from './CashierDashboard';
import OrderDetail from './OrderDetail';
import PaymentMethod from './PaymentMethod';
import PaymentSuccess from './PaymentSuccess';
import Receipt from './Receipt';
import api from '../../services/axiosClient';

const CashierMain = () => {
  // States to manage navigation and data
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, detail, payment, success, receipt
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [transactionData, setTransactionData] = useState(null);

  // --- NAVIGATION HANDLERS ---

  // 1. Dashboard -> Detail
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setCurrentView('detail');
  };

  // 2. Detail -> Payment
  const handleProceedToPayment = (order) => {
    setSelectedOrder(order);
    setCurrentView('payment');
  };

  // 3. Payment -> Success
  // This callback receives the response from the backend transaction creation
  const handlePaymentSuccess = (data) => {
    setTransactionData(data);
    setCurrentView('success');
  };

  // 4. Success -> Receipt
  const handleViewReceipt = () => {
    setCurrentView('receipt');
  };

  // 5. Back / Reset to Dashboard
  const handleReset = () => {
    setSelectedOrder(null);
    setTransactionData(null);
    setCurrentView('dashboard');
  };

  const handleBackToDetail = () => {
    setCurrentView('detail');
  };

  // --- CANCEL ORDER ---
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order? This cannot be undone.")) {
      return;
    }

    try {
      await api.patch(`/orders/${orderId}/`, { status: 'cancelled' });

      alert("Order cancelled successfully.");
      handleReset(); // Refresh the dashboard
    } catch (error) {
      console.error("Failed to cancel order", error);
      alert("Failed to cancel: " + (error.response?.data?.detail || "Unknown error"));
    }
  };

  return (
    <div className="relative">
      {currentView === 'dashboard' && (
        <CashierDashboard 
          onOrderClick={handleOrderClick} 
        />
      )}

      {currentView === 'detail' && selectedOrder && (
        <OrderDetail 
          order={selectedOrder} 
          onBack={handleReset}
          onProceedToPayment={handleProceedToPayment}
          onCancelOrder={handleCancelOrder}
        />
      )}

      {currentView === 'payment' && selectedOrder && (
        <PaymentMethod 
          currentOrder={selectedOrder} 
          onBack={handleBackToDetail}
          onSelectPayment={handlePaymentSuccess} 
        />
      )}

      {currentView === 'success' && (
        <PaymentSuccess 
          onDownloadReceipt={handleViewReceipt} 
          onClose={handleReset}
        />
      )}

      {currentView === 'receipt' && transactionData && (
        <Receipt 
          receiptData={transactionData} 
          onBack={handleReset}
        />
      )}
    </div>
  );
};

export default CashierMain;