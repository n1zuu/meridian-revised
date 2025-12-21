import React from 'react';

const OrderDetail = ({ order, onBack, onProceedToPayment, onCancelOrder }) => {
  if (!order || !order.items) return <div>Loading...</div>;

  const isCompleted = order.status === 'completed';

  // Use calculated fields from serializer (always fresh)
  const subtotal = order.calculated_subtotal || order.subtotal || 0;
  const vat = order.calculated_vat || order.vat || 0;
  const serviceFee = order.calculated_service_fee || order.service_fee || 0;
  const total = order.calculated_total || order.total || 0;

  const formatMoney = (val) => {
    const num = parseFloat(val) || 0;
    return num.toFixed(2);
  };

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
          
          <h1 className="text-lg font-semibold text-gray-800 flex-grow text-center">Order #{order.id}</h1>
          <div className="w-6 h-6"></div>
        </header>
        
        <div className="flex justify-between items-center py-6 border-b border-gray-200 mb-6">
          <div>
            {/* Backend field is 'table_number', not 'table' */}
            <h2 className="text-2xl font-bold text-gray-800">Table {order.table_number}</h2>
            <div className="flex space-x-2 text-sm text-gray-500">
              {/* Backend provides 'time_ago' */}
              <span>Placed {order.time_ago} ago</span>
              <span>•</span>
              <span>{order.items.length} Items</span>
            </div>
            {/* Display Waiter Name from serializer */}
            <p className="text-xs text-gray-400 mt-1">Waiter: {order.waiter_name || 'N/A'}</p>
          </div>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-xs font-medium text-gray-600 shadow-sm">
            {order.notes || "No Notes"}
          </button>
        </div>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 bg-white rounded-xl p-4 shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                 {/* Item Index or Placeholder */}
                 #{item.id}
              </div>
              
              <div className="flex-grow">
                {/* Nested fields from OrderItemSerializer */}
                <p className="font-semibold text-lg text-gray-800">{item.menu_item_name}</p>
                <p className="text-sm text-gray-500 capitalize">{item.menu_item_category}</p>
                {item.special_instructions && (
                   <p className="text-xs text-orange-600 italic">"{item.special_instructions}"</p>
                )}
              </div>

              <div className="text-right">
                {/* Use 'price_at_time' or 'subtotal' from backend */}
                <p className="text-lg font-semibold text-gray-800">${formatMoney(item.subtotal)}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity} x ${formatMoney(item.price_at_time)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="summary-container">
        <div className="space-y-1 mb-4">
          <div className="flex justify-between opacity-80">
            <span>Subtotal</span>
            <span>${formatMoney(subtotal)}</span>
          </div>
          <div className="flex justify-between opacity-80">
            <span>VAT (12%)</span>
            <span>${formatMoney(vat)}</span>
          </div>
          <div className="flex justify-between opacity-80">
            <span>Service Fee (10%)</span>
            <span>${formatMoney(serviceFee)}</span>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-white/20 text-2xl font-bold mb-6">
          <span>Total</span>
          <span>${formatMoney(total)}</span>
        </div>
        
        {!isCompleted ? (
          <div className="flex gap-3">
            {/* CANCEL BUTTON */}
            <button 
              onClick={() => onCancelOrder(order.id)}
              className="flex-1 bg-white text-red-600 border border-red-200 py-4 rounded-full text-lg font-bold hover:bg-red-50 transition-colors"
            >
              Cancel
            </button>

            {/* PAY BUTTON */}
            <button 
              onClick={() => onProceedToPayment(order)}
              className="flex-[2] bg-[#EBB62D] text-white py-4 rounded-full text-xl font-bold hover:bg-[#DDAA1F] transition-colors"
            >
              Pay Now
            </button>
          </div>
        ) : (
          /* View Only Message */
          <div className="w-full bg-[#0b4635] py-4 rounded-xl text-center">
            <span className="text-white/70 font-medium">
              This order has been completed.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;