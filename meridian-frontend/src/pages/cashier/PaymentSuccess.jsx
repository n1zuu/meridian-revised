import React from 'react';

const PaymentSuccess = ({ onDownloadReceipt, onClose }) => {
  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      <style>{`
        :root {
          --color-primary-green: #003323;
          --color-active-bg: #EBB62D;
        }
      `}</style>

      <div className="max-w-lg mx-auto w-full flex-grow flex flex-col">
        <header className="flex items-center justify-center py-4 px-4 bg-white border-b border-gray-100 sticky top-0 z-10">
          <button onClick={onClose} className="absolute left-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="#333333" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h1 className="text-xl font-semibold text-center" style={{ color: 'var(--color-primary-green)' }}>Payment Confirmation</h1>
        </header>

        <main className="flex-grow flex flex-col items-center justify-start p-6 pt-12 bg-white rounded-t-[30px] mt-[-20px] relative z-0">
          <div className="w-full flex justify-center items-center py-8 mb-8">
            <svg width="220" height="240" viewBox="0 0 220 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="110" cy="120" r="100" fill="#E8F5E9" opacity="0.4"/>
              <circle cx="105" cy="115" r="85" fill="#F1F8E9" opacity="0.6"/>
              
              <rect x="50" y="40" width="120" height="150" rx="15" fill="#FAFAFA" stroke="#0d5a44" strokeWidth="2" />
              
              <rect x="60" y="50" width="100" height="40" rx="5" fill="#FFD700" />
              <path d="M70 60h80" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
              <path d="M70 70h60" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
              
              <rect x="60" y="100" width="100" height="70" rx="5" fill="#A5D6A7" />
              
              <circle cx="170" cy="180" r="25" fill="#EBB62D"/>
              <path d="M160 180 L168 188 L185 170" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary-green)' }}>Payment Confirmed!</h2>
          <p className="text-sm text-gray-600 text-center max-w-xs mb-8">
            Thank you kindly! We are preparing your order right away.
          </p>
        </main>
        
        <div className="p-6 bg-white shadow-lg">
          <button 
            onClick={onDownloadReceipt}
            className="w-full py-4 rounded-full text-lg font-semibold text-white flex items-center justify-center shadow-md transition-colors"
            style={{ backgroundColor: 'var(--color-active-bg)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
export default PaymentSuccess;