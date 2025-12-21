import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CashierDashboard = ({ orders = [], onOrderClick }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  const handleSettings = () => {
    navigate('/settings');
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.table.toString().includes(searchQuery) || 
                         order.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'pending' ? order.status === 'pending' : order.status === 'completed';
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kapakana:wght@400;700&family=Lora:ital,wght@1,400;1,700&display=swap');

        :root {
          --color-gold: #FFD700;
          --color-dark-gold: #B8860B;
          --color-primary-green: #003323;
          --color-secondary-green: #0d5a44;
          --color-active-bg: #EBB62D;
          --color-text-dark: #333333;
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
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
          cursor: pointer;
          transition: transform 0.1s ease-in-out;
        }

        .order-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 10px -1px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="p-4 pt-8 max-w-lg mx-auto">
        <header className="mb-6">
          <h1 className="meridian-logo">Meridian</h1>
        </header>
        
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center flex-grow h-14 bg-white rounded-xl shadow-sm px-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0d5a44] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow outline-none text-gray-800"
            />
          </div>

          <button 
            onClick={handleSettings}
            className="flex items-center justify-center w-14 h-14 bg-white rounded-xl shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-gray-700"> 
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /> 
            </svg>
          </button>
        </div>

        <div className="flex bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-4 font-semibold text-center transition-all ${activeTab === 'pending' ? 'tab-active' : 'text-gray-800'}`}
          >
            Pending Order
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-4 font-semibold text-center transition-all ${activeTab === 'completed' ? 'tab-active' : 'text-gray-800'}`}
          >
            Completed
          </button>
        </div>

        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div 
              key={order.id}
              onClick={() => onOrderClick?.(order)}
              className="order-card"
            >
              <div className="mb-2">
                <h2 className="text-xl font-bold text-[#003323]">Table {order.table}</h2>
                <div className="flex space-x-2 text-sm text-gray-500">
                  <span>Order {order.timeAgo} ago</span>
                  <span>•</span>
                  <span>Order #{order.orderId}</span>
                </div>
              </div>

              <div className="space-y-1 mb-3">
                {order.items.map((item, idx) => (
                  <p key={idx} className="text-gray-800">{item.quantity}x {item.name}</p>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <span className="text-xl font-bold text-gray-800">Total: ${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CashierDashboard;