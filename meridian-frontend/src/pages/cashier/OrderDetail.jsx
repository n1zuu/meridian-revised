import React from 'react';

const OrderDetail = ({
  order = { items: [] },
  onBack,
  onProceedToPayment,
}) => {

  const subtotal = order.items.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0), 0);
  const vat = subtotal * 0.1;
  const serviceFee = subtotal * 0.15;
  const total = subtotal + vat + serviceFee;

  if (!order || !order.items) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading order...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <style>{`
        :root {
          --color-primary-green: #003323;
          --color-secondary-green: #0d5a44;
          --color-active-bg: #EBB62D;
          --color-text-dark: #333333;
        }

        .summary-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: var(--color-secondary-green); 
          color: white;
          padding: 1.5rem 1rem;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
          box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
          max-width: 512px;
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>

      <div className="max-w-lg mx-auto p-4 pb-[250px]">
        <header className="flex items-center justify-between py-4 border-b border-gray-200">
          <button onClick={onBack} className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-[#003323]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          
          <h1 className="text-lg font-semibold text-gray-800 flex-grow text-center">Orders</h1>
          <div className="w-6 h-6"></div>
        </header>
        
        <div className="flex justify-between items-center py-6 border-b border-gray-200 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Table {order.table}</h2>
            <div className="flex space-x-2 text-sm text-gray-500">
              <span>Order {order.timeAgo} ago</span>
              <span>•</span>
              <span>Order #{order.orderId}</span>
            </div>
          </div>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-xs font-medium text-gray-600 shadow-sm">
            Note
          </button>
        </div>

        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-4 bg-white rounded-xl p-4 shadow-sm">
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
              
              <div className="flex-grow">
                <p className="font-semibold text-lg text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>

              <div className="text-right">
                <p className="text-lg font-semibold text-gray-800">${item.price.toFixed(2)}</p>
                <p className="text-xs text-gray-400">Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="summary-container">
        <div className="space-y-1 mb-4">
          <div className="flex justify-between opacity-80">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between opacity-80">
            <span>VAT</span>
            <span>${vat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between opacity-80">
            <span>Service fee</span>
            <span>${serviceFee.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-white/20 text-2xl font-bold mb-6">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <button 
          onClick={() => onProceedToPayment?.(total)}
          className="w-full bg-[#EBB62D] text-white py-4 rounded-full text-xl font-semibold hover:bg-[#DDAA1F] transition-colors"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;