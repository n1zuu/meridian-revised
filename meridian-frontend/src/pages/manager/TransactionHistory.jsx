import React, { useState } from 'react';

const TransactionHistory = () => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Sample transactions with full details
  const transactions = [
    { 
      id: '12122550', 
      amount: 95.97, 
      method: 'Credit Card',
      date: 'December 15, 2025',
      table: '121',
      orderId: 'DD082804',
      cashier: 'Cristine Branzuela',
      subtotal: 65.97,
      vat: 10.00,
      serviceFee: 20.00
    },
    { 
      id: '12122549', 
      amount: 35.65, 
      method: 'Credit Card',
      date: 'December 15, 2025',
      table: '105',
      orderId: 'DD082803',
      cashier: 'John Dela Cruz',
      subtotal: 25.65,
      vat: 5.00,
      serviceFee: 5.00
    },
    { 
      id: '12122548', 
      amount: 15.20, 
      method: 'Cash',
      date: 'December 14, 2025',
      table: '89',
      orderId: 'DD082802',
      cashier: 'Maria Santos',
      subtotal: 10.20,
      vat: 2.00,
      serviceFee: 3.00
    },
    { 
      id: '12122547', 
      amount: 5.50, 
      method: 'Maya',
      date: 'December 14, 2025',
      table: '42',
      orderId: 'DD082801',
      cashier: 'Cristine Branzuela',
      subtotal: 3.50,
      vat: 1.00,
      serviceFee: 1.00
    },
    { 
      id: '12122546', 
      amount: 42.00, 
      method: 'Cash',
      date: 'December 13, 2025',
      table: '67',
      orderId: 'DD082800',
      cashier: 'John Dela Cruz',
      subtotal: 32.00,
      vat: 5.00,
      serviceFee: 5.00
    },
    { 
      id: '12122545', 
      amount: 120.45, 
      method: 'GCash',
      date: 'December 13, 2025',
      table: '23',
      orderId: 'DD082799',
      cashier: 'Maria Santos',
      subtotal: 95.45,
      vat: 10.00,
      serviceFee: 15.00
    },
  ];

  const handleFilter = () => {
    console.log('Filter from:', fromDate, 'to:', toDate);
    setShowFilterModal(false);
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowReceiptModal(true);
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
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="max-w-md mx-auto px-4 pt-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="meridian-logo">Meridian</h1>
            <h2 className="text-2xl font-bold mt-1 text-gray-800">Transaction History</h2>
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

        {/* Transaction Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 px-4 py-2 bg-[#3b5a44] text-[#FFD700] text-xs font-bold uppercase">
            <div className="text-center">Order ID</div>
            <div className="text-center">Total Amount</div>
            <div className="text-center">Method</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => handleTransactionClick(transaction)}
                className="grid grid-cols-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer text-sm"
              >
                <div className="text-center border-r border-dashed border-gray-300">{transaction.id}</div>
                <div className="text-center font-semibold text-green-700 border-r border-dashed border-gray-300">
                  ${transaction.amount.toFixed(2)}
                </div>
                <div className="text-center text-gray-600">{transaction.method}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowFilterModal(false)}
        >
          <div
            className="bg-[#dcdcdc] rounded-2xl p-6 w-11/12 max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-800 hover:text-gray-600 transition p-1"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="flex-grow text-center text-xl font-bold text-gray-800 pr-6">Select Date</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">From</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full p-2 mt-1 rounded border border-gray-400 focus:ring-green-700 focus:border-green-700 bg-white text-gray-700"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">To</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full p-2 mt-1 rounded border border-gray-400 focus:ring-green-700 focus:border-green-700 bg-white text-gray-700"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleFilter}
                  className="bg-[#3b5a44] text-white px-6 py-2 rounded-lg text-base font-semibold shadow-md hover:opacity-90 transition"
                >
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && selectedTransaction && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          onClick={() => setShowReceiptModal(false)}
        >
          <div
            className="receipt-modal relative w-full max-w-[380px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8 px-2">
              <button onClick={() => setShowReceiptModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-white">Transaction Details</h1>
              <div className="w-6"></div>
            </div>

            <div className="relative bg-white rounded-[40px] shadow-xl p-8 pt-16">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <div className="gold-gradient h-20 w-20 rounded-full border-[6px] border-[rgba(0,0,0,0.5)] flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="text-center mb-10">
                <p className="text-[#a0abbb] font-medium mb-1">Payment Total</p>
                <h2 className="text-[42px] font-bold text-[#1a1c21] tracking-tight">${selectedTransaction.amount.toFixed(2)}</h2>
              </div>

              <div className="space-y-5 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-[#a0abbb] font-medium">Date</span>
                  <span className="text-[#1a1c21] font-semibold">{selectedTransaction.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#a0abbb] font-medium">Table</span>
                  <span className="text-[#1a1c21] font-semibold">{selectedTransaction.table}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#a0abbb] font-medium">Order ID</span>
                  <span className="text-[#1a1c21] font-semibold">{selectedTransaction.orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#a0abbb] font-medium">Cashier</span>
                  <span className="text-[#1a1c21] font-semibold">{selectedTransaction.cashier}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#a0abbb] font-medium">Payment Method</span>
                  <span className="text-[#1a1c21] font-semibold">{selectedTransaction.method}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-[#e2e8f0] mb-8"></div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-[#a0abbb] font-medium">Subtotal</span>
                  <span className="text-[#1a1c21] font-semibold">${selectedTransaction.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a0abbb] font-medium">VAT</span>
                  <span className="text-[#1a1c21] font-semibold">${selectedTransaction.vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a0abbb] font-medium">Service fee</span>
                  <span className="text-[#1a1c21] font-semibold">${selectedTransaction.serviceFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-[#e2e8f0] mb-8"></div>

              <div className="flex justify-between items-center pb-2">
                <span className="text-lg font-bold text-black">Total</span>
                <span className="text-lg font-bold text-black">${selectedTransaction.amount.toFixed(2)}</span>
              </div>

              <div className="mt-8 text-center">
                <svg className="mx-auto" width="250" height="60" viewBox="0 0 250 60" xmlns="http://www.w3.org/2000/svg">
                  <rect className="fill-black" x="0" y="0" width="4" height="60"/>
                  <rect className="fill-black" x="6" y="0" width="2" height="60"/>
                  <rect className="fill-black" x="10" y="0" width="2" height="60"/>
                  <rect className="fill-black" x="14" y="0" width="4" height="60"/>
                  <rect className="fill-black" x="20" y="0" width="2" height="60"/>
                  <rect className="fill-black" x="24" y="0" width="2" height="60"/>
                  <rect className="fill-black" x="28" y="0" width="4" height="60"/>
                  <rect className="fill-black" x="34" y="0" width="2" height="60"/>
                  <rect className="fill-black" x="40" y="0" width="4" height="60"/>
                  <rect className="fill-black" x="46" y="0" width="2" height="60"/>
                  <rect className="fill-black" x="52" y="0" width="4" height="60"/>
                  <rect className="fill-black" x="58" y="0" width="2" height="60"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-100 shadow-lg h-16 grid grid-cols-5 items-center px-2">
        <button className="flex flex-col items-center justify-center text-[#3b5a44]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </button>

        <button className="flex flex-col items-center justify-center text-gray-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
        </button>

        <div className="flex justify-center">
          <button className="w-14 h-14 bg-[#3b5a44] text-white rounded-full flex items-center justify-center text-2xl -translate-y-2 shadow-lg">
            +
          </button>
        </div>

        <button className="flex flex-col items-center justify-center text-gray-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992h-.001M19.32 19.32a15.228 15.228 0 0 1-2.932 1.336A15.215 15.215 0 0 1 12 21.75c-3.731 0-7.44-1.102-10.519-3.213" />
          </svg>
        </button>

        <button className="flex flex-col items-center justify-center text-gray-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0" />
          </svg>
        </button>
      </nav>
    </div>
  );
};

export default TransactionHistory;