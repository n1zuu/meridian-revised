import React from 'react';

const Receipt = ({ receiptData, onBack }) => {
  const { total, date, table, orderId, cashier, subtotal, vat, serviceFee } = receiptData;

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-6">
      <style>{`
        .gold-gradient {
          background: linear-gradient(145deg, #d4a017, #b8860b);
        }
      `}</style>

      <div className="relative w-full max-w-[380px]">
        <div className="flex items-center justify-between mb-8 px-2">
          <button onClick={onBack}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Payment Details</h1>
          <div className="w-6"></div>
        </div>

        <div className="relative bg-white rounded-[40px] shadow-sm p-8 pt-16">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2">
            <div className="gold-gradient h-20 w-20 rounded-full border-[6px] border-[#F8F8F8] flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-10">
            <p className="text-[#a0abbb] font-medium mb-1">Payment Total</p>
            <h2 className="text-[42px] font-bold text-[#1a1c21] tracking-tight">${total.toFixed(2)}</h2>
          </div>

          <div className="space-y-5 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-[#a0abbb] font-medium">Date</span>
              <span className="text-[#1a1c21] font-semibold">{date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#a0abbb] font-medium">Table</span>
              <span className="text-[#1a1c21] font-semibold">{table}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#a0abbb] font-medium">Order ID</span>
              <span className="text-[#1a1c21] font-semibold">{orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#a0abbb] font-medium">Cashier</span>
              <span className="text-[#1a1c21] font-semibold">{cashier}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-[#e2e8f0] mb-8"></div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between">
              <span className="text-[#a0abbb] font-medium">Subtotal</span>
              <span className="text-[#1a1c21] font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a0abbb] font-medium">VAT</span>
              <span className="text-[#1a1c21] font-semibold">${vat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a0abbb] font-medium">Service fee</span>
              <span className="text-[#1a1c21] font-semibold">${serviceFee.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-[#e2e8f0] mb-8"></div>

          <div className="flex justify-between items-center pb-2">
            <span className="text-lg font-bold text-black">Total</span>
            <span className="text-lg font-bold text-black">${total.toFixed(2)}</span>
          </div>

          <div className="mt-8 text-center">
            <svg className="mx-auto" width="300" height="80" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
              <rect className="fill-black" x="0" y="0" width="4" height="80"/>
              <rect className="fill-black" x="6" y="0" width="2" height="80"/>
              <rect className="fill-black" x="10" y="0" width="2" height="80"/>
              <rect className="fill-black" x="14" y="0" width="4" height="80"/>
              <rect className="fill-black" x="20" y="0" width="2" height="80"/>
              <rect className="fill-black" x="24" y="0" width="2" height="80"/>
              <rect className="fill-black" x="28" y="0" width="4" height="80"/>
              <rect className="fill-black" x="34" y="0" width="2" height="80"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Receipt;
