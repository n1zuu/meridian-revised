import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axiosClient';

const CashierDashboard = ({ onOrderClick }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. Fetch Orders ---
  const fetchOrders = async () => {
    try {
      const response = await api.get(`/orders/?status=${activeTab}`);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [activeTab]);

  // --- 2. Navigation Handlers ---
  const handleSettings = () => {
    navigate('/settings');
  };

  // --- 3. Filter Logic ---
  const filteredOrders = orders.filter(order => {
    const tableStr = order.table_number ? order.table_number.toString() : '';
    const idStr = order.id ? order.id.toString() : '';
    return tableStr.includes(searchQuery) || idStr.includes(searchQuery);
  });

  // --- 4. Total Calculation Helper ---
  const calculateDisplayTotal = (order) => {
    if (order.total && parseFloat(order.total) > 0) {
        return parseFloat(order.total).toFixed(2);
    }
    if (order.items && order.items.length > 0) {
        const sum = order.items.reduce((acc, item) => {
            const price = parseFloat(item.subtotal) || (parseFloat(item.price_at_time || 0) * (item.quantity || 1));
            return acc + price;
        }, 0);
        
        // Apply Tax/Service multiplier (1.22 = 12% VAT + 10% Service)
        return (sum * 1.22).toFixed(2);
    }
    return '0.00';
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kapakana:wght@400;700&family=Lora:ital,wght@1,400;1,700&display=swap');

        :root {
          --color-gold: #FFD700;
          --color-dark-gold: #B8860B;
          --color-active-bg: #EBB62D;
        }

        .meridian-logo {
          font-family: 'Kapakana', cursive; 
          font-size: 1.5rem; 
          line-height: 1;
          color: var(--color-dark-gold); 
        }

        .tab-active {
          background-color: var(--color-active-bg);
          color: white;
        }

        .order-card {
          background-color: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.1s;
        }

        .order-card:hover {
          transform: translateY(-2px);
        }
      `}</style>

      <div className="p-4 pt-8 max-w-lg mx-auto">
        <header className="mb-6">
          <h1 className="meridian-logo">Meridian</h1>
        </header>
        
        {/* Search Bar & Settings Button Row */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center flex-grow h-14 bg-white rounded-xl shadow-sm px-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0d5a44] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search Table or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow outline-none text-gray-800"
            />
          </div>

          {/* SETTINGS BUTTON */}
          <button 
            onClick={handleSettings}
            className="flex items-center justify-center w-14 h-14 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-gray-700"> 
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /> 
            </svg>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-4 font-semibold text-center transition-all ${activeTab === 'pending' ? 'tab-active' : 'text-gray-800'}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-4 font-semibold text-center transition-all ${activeTab === 'completed' ? 'tab-active' : 'text-gray-800'}`}
          >
            Completed
          </button>
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-500 py-10">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center text-gray-500 py-10">No orders found.</div>
          ) : (
            filteredOrders.map(order => (
              <div 
                key={order.id}
                onClick={() => onOrderClick(order)}
                className="order-card"
              >
                <div className="mb-2">
                  <h2 className="text-xl font-bold text-[#003323]">Table {order.table_number}</h2>
                  <div className="flex space-x-2 text-sm text-gray-500">
                    <span>{order.time_ago} ago</span>
                    <span>•</span>
                    <span>#{order.id}</span>
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  {order.items && order.items.slice(0, 3).map((item, idx) => (
                    <p key={idx} className="text-gray-800 text-sm">
                      {item.quantity}x {item.menu_item_name}
                    </p>
                  ))}
                  {order.items?.length > 3 && (
                      <p className="text-xs text-gray-400">+{order.items.length - 3} more...</p>
                  )}
                </div>

                <div className="flex justify-end pt-2 border-t border-gray-100 mt-2">
                  <span className="text-xl font-bold text-gray-800">
                    Total: ${calculateDisplayTotal(order)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CashierDashboard;