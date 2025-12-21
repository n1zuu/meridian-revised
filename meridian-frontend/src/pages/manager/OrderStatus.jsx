import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axiosClient';

const OrderStatus = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- HELPER: Calculate order total safely ---
  const calculateOrderTotal = (order) => {
    // 1. Try using calculated_total from backend first (if using Fix 1)
    if (order.calculated_total && parseFloat(order.calculated_total) > 0) {
      return parseFloat(order.calculated_total);
    }
    
    // 2. Try using regular total from backend
    if (order.total && parseFloat(order.total) > 0) {
      return parseFloat(order.total);
    }
    
    // 3. Fallback: Calculate from items
    if (order.items && order.items.length > 0) {
      const itemsTotal = order.items.reduce((sum, item) => {
        const subtotal = parseFloat(item.subtotal) || 0;
        return sum + subtotal;
      }, 0);
      
      // Add VAT (12%) and Service Fee (10%)
      const vat = itemsTotal * 0.12;
      const serviceFee = itemsTotal * 0.10;
      return itemsTotal + vat + serviceFee;
    }
    
    return 0;
  };

  // --- FETCH ORDERS ---
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const query = activeTab === 'all' ? '/orders/' : `/orders/?status=${activeTab}`;
      const response = await api.get(query);
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatMoney = (value) => {
    return parseFloat(value || 0).toFixed(2);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kapakana:wght@400;700&family=Lora:ital,wght@1,400;1,700&display=swap');
        
        .meridian-script {
          font-family: 'Kapakana', cursive;
          font-size: 2rem;
          background: linear-gradient(180deg, #FFD700 0%, #B8860B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .tab-btn {
          transition: all 0.2s;
        }
        .tab-btn.active {
          background-color: #3b5a44;
          color: white;
          font-weight: 600;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="max-w-md mx-auto">
        <header className="p-4 flex justify-between items-center">
          <h1 className="meridian-script">Meridian</h1>
          <button onClick={() => fetchOrders()} className="text-gray-500 hover:text-[#3b5a44]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992h-.001M19.32 19.32a15.228 15.228 0 0 1-2.932 1.336A15.215 15.215 0 0 1 12 21.75c-3.731 0-7.44-1.102-10.519-3.213" />
            </svg>
          </button>
        </header>

        <main className="px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Status</h2>

          {/* Status Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-4 no-scrollbar">
            {['all', 'pending', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`tab-btn px-4 py-2 rounded-full border border-gray-200 text-sm capitalize whitespace-nowrap ${activeTab === status ? 'active' : 'bg-white text-gray-600'}`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-10 text-gray-400">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 text-gray-400">No orders found.</div>
            ) : (
              orders.map((order) => {
                const orderTotal = calculateOrderTotal(order);
                
                return (
                  <div key={order.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Table {order.table_number}</h3>
                        <p className="text-xs text-gray-500">#{order.id} • {order.time_ago} ago</p>
                        <p className="text-xs text-gray-500 mt-1">Waiter: {order.waiter_name || 'N/A'}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)} capitalize`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Order Items Preview */}
                    <div className="border-t border-dashed border-gray-200 my-3 pt-3">
                      <div className="space-y-1">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-gray-700">{item.quantity}x {item.menu_item_name}</span>
                              <span className="text-gray-500">${formatMoney(item.subtotal)}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-400 italic">No items in this order</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-medium text-gray-500">Total Amount</span>
                      <span className="text-xl font-bold text-[#3b5a44]">${formatMoney(orderTotal)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-100 shadow-lg h-16 grid grid-cols-5 items-center px-2">
          <button 
            onClick={() => navigate('/admin')}
            className="flex flex-col items-center justify-center text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>

          <button className="flex flex-col items-center justify-center text-[#3b5a44]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>

          <div className="flex justify-center">
            <button
              onClick={() => navigate('/admin')} 
              className="w-14 h-14 bg-[#3b5a44] text-white rounded-full flex items-center justify-center text-2xl -translate-y-2 shadow-lg hover:scale-105 transition-transform"
            >
              +
            </button>
          </div>

          <button 
            onClick={() => navigate('/admin/transactions')}
            className="flex flex-col items-center justify-center text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <button 
            onClick={() => navigate('/settings')}
            className="flex flex-col items-center justify-center text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default OrderStatus;