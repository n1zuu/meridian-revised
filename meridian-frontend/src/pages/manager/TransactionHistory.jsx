import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axiosClient';

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH TRANSACTIONS ---
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      let query = '/transactions/';
      const params = [];
      if (fromDate) params.push(`from_date=${fromDate}`);
      if (toDate) params.push(`to_date=${toDate}`);
      if (params.length > 0) query += `?${params.join('&')}`;

      const response = await api.get(query);
      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to load transactions", error);
      alert('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleFilter = () => {
    fetchTransactions();
    setShowFilterModal(false);
  };

  const handleClearFilter = () => {
    setFromDate('');
    setToDate('');
    fetchTransactions();
    setShowFilterModal(false);
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowReceiptModal(true);
  };

  const formatMoney = (amount) => {
    const val = parseFloat(amount);
    return isNaN(val) ? '0.00' : val.toFixed(2);
  };

  // Safe getter helper
  const safeGet = (obj, path, defaultValue = 'N/A') => {
    try {
      return path.split('.').reduce((acc, part) => acc?.[part], obj) || defaultValue;
    } catch {
      return defaultValue;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kapakana:wght@400;700&family=Lora:ital,wght@1,400;1,700&display=swap');
        
        .meridian-logo {
          font-family: 'Kapakana', cursive;
          font-size: 2rem;
          background: linear-gradient(180deg, #FFD700 0%, #B8860B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .gold-gradient {
          background: linear-gradient(145deg, #d4a017, #b8860b);
        }

        .receipt-modal {
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-md mx-auto px-4 pt-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="meridian-logo">Meridian</h1>
            <h2 className="text-2xl font-bold mt-1 text-gray-800">Transaction History</h2>
            {(fromDate || toDate) && (
              <p className="text-xs text-gray-500 mt-1">
                Filtered: {fromDate || 'Start'} to {toDate || 'End'}
              </p>
            )}
          </div>

          <button
            onClick={() => setShowFilterModal(true)}
            className="border border-gray-300 bg-white rounded-lg p-3 text-gray-600 shadow-sm hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
            </svg>
          </button>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-3 px-4 py-2 bg-[#3b5a44] text-[#FFD700] text-xs font-bold uppercase">
            <div className="text-center">Order ID</div>
            <div className="text-center">Amount</div>
            <div className="text-center">Method</div>
          </div>

          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : transactions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {fromDate || toDate ? 'No transactions found for selected dates.' : 'No transactions found.'}
              </div>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  onClick={() => handleTransactionClick(transaction)}
                  className="grid grid-cols-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer text-sm"
                >
                  <div className="text-center border-r border-dashed border-gray-300">
                    #{safeGet(transaction, 'order_id_display', transaction.order)}
                  </div>
                  <div className="text-center font-semibold text-green-700 border-r border-dashed border-gray-300">
                    ${formatMoney(transaction.amount)}
                  </div>
                  <div className="text-center text-gray-600 capitalize">
                    {safeGet(transaction, 'payment_method', 'Unknown')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination (Visual Only) */}
        <div className="flex justify-center items-center gap-4 text-sm mt-6 text-gray-600 font-semibold">
          <span className="opacity-50 cursor-not-allowed">&laquo;</span>
          <span className="opacity-50 cursor-not-allowed">&lsaquo;</span>
          <span className="text-gray-900 border-b-2 border-[#3b5a44] pb-1">Page 1</span>
          <span className="cursor-pointer hover:text-gray-800">&rsaquo;</span>
          <span className="cursor-pointer hover:text-gray-800">&raquo;</span>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setShowFilterModal(false)}>
          <div className="bg-[#dcdcdc] rounded-2xl p-6 w-11/12 max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => setShowFilterModal(false)} className="text-gray-800">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="flex-grow text-center text-xl font-bold text-gray-800 pr-6">Filter by Date</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">From</label>
                <input 
                  type="date" 
                  value={fromDate} 
                  onChange={(e) => setFromDate(e.target.value)} 
                  className="w-full p-2 mt-1 rounded border border-gray-400 bg-white text-gray-700"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">To</label>
                <input 
                  type="date" 
                  value={toDate} 
                  onChange={(e) => setToDate(e.target.value)} 
                  className="w-full p-2 mt-1 rounded border border-gray-400 bg-white text-gray-700"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={handleClearFilter} 
                  className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-500"
                >
                  Clear
                </button>
                <button 
                  onClick={handleFilter} 
                  className="flex-1 bg-[#3b5a44] text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-[#2d4635]"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={() => setShowReceiptModal(false)}>
          <div className="receipt-modal relative w-full max-w-[380px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8 px-2">
              <button onClick={() => setShowReceiptModal(false)}>
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-white">Transaction Details</h1>
              <div className="w-6"></div>
            </div>

            <div className="relative bg-white rounded-[40px] shadow-xl p-8 pt-16">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <div className="gold-gradient h-20 w-20 rounded-full border-[6px] border-[rgba(0,0,0,0.5)] flex items-center justify-center shadow-lg">
                  <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="text-center mb-10">
                <p className="text-[#a0abbb] font-medium mb-1">Total Paid</p>
                <h2 className="text-[42px] font-bold text-[#1a1c21] tracking-tight">
                  ${formatMoney(selectedTransaction.amount)}
                </h2>
              </div>

              <div className="space-y-5 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-[#a0abbb] font-medium">Date</span>
                  <span className="text-[#1a1c21] font-semibold">
                    {safeGet(selectedTransaction, 'date', 'N/A')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#a0abbb] font-medium">Table</span>
                  <span className="text-[#1a1c21] font-semibold">
                    {safeGet(selectedTransaction, 'table_number', 'N/A')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#a0abbb] font-medium">Order ID</span>
                  <span className="text-[#1a1c21] font-semibold">
                    #{safeGet(selectedTransaction, 'order_id_display', selectedTransaction.order)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#a0abbb] font-medium">Cashier</span>
                  <span className="text-[#1a1c21] font-semibold">
                    {safeGet(selectedTransaction, 'cashier_name', 'N/A')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#a0abbb] font-medium">Method</span>
                  <span className="text-[#1a1c21] font-semibold capitalize">
                    {safeGet(selectedTransaction, 'payment_method', 'N/A')}
                  </span>
                </div>
              </div>

              <div className="border-t border-dashed border-[#e2e8f0] mb-8"></div>
              
              {selectedTransaction.payment_method === 'cash' && selectedTransaction.amount_received && (
                <>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#a0abbb]">Cash Received</span>
                      <span className="text-[#1a1c21] font-semibold">
                        ${formatMoney(selectedTransaction.amount_received)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#a0abbb]">Change Given</span>
                      <span className="text-green-600 font-semibold">
                        ${formatMoney(selectedTransaction.change_given)}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-dashed border-[#e2e8f0] mb-6"></div>
                </>
              )}
              
              <div className="flex justify-between items-center pb-2">
                <span className="text-lg font-bold text-black">Total</span>
                <span className="text-lg font-bold text-black">
                  ${formatMoney(selectedTransaction.amount)}
                </span>
              </div>

              <div className="mt-8 text-center">
                <p className="text-xs text-gray-400 mb-4">Thank you for dining with Meridian</p>
                <svg className="mx-auto" width="250" height="60" viewBox="0 0 250 60" xmlns="http://www.w3.org/2000/svg">
                  <rect className="fill-black" x="0" y="0" width="4" height="60"/>
                  <rect className="fill-black" x="8" y="0" width="2" height="60"/>
                  <rect className="fill-black" x="14" y="0" width="4" height="60"/>
                  <rect className="fill-black" x="22" y="0" width="2" height="60"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-100 shadow-lg h-16 grid grid-cols-5 items-center px-2">
        <button onClick={() => navigate('/admin')} className="flex flex-col items-center justify-center text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>

        <button onClick={() => navigate('/admin/orders')} className="flex flex-col items-center justify-center text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>

        <div className="flex justify-center">
          <button onClick={() => navigate('/admin')} className="w-14 h-14 bg-[#3b5a44] text-white rounded-full flex items-center justify-center text-2xl -translate-y-2 shadow-lg hover:scale-105 transition-transform">
            +
          </button>
        </div>

        <button className="flex flex-col items-center justify-center text-[#3b5a44]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        <button onClick={() => navigate('/settings')} className="flex flex-col items-center justify-center text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </nav>
    </div>
  );
};

export default TransactionHistory;