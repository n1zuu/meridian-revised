import React, { useState, useEffect } from 'react';

const WaiterCart = ({ onNavigate }) => {
  const [cart, setCart] = useState({});
  const [orderNote, setOrderNote] = useState('');

  const foodData = {
    'greek-salad': { name: 'Easy Greek Salad', price: 21.99 },
    'chicken-salad': { name: 'Grilled Chicken Salad', price: 25.50 },
    'espresso-martini': { name: 'Espresso Martini', price: 14.00 },
    'beef-tenderloin': { name: 'Beef Tenderloin', price: 45.99 },
  };

  const VAT_RATE = 0.10;
  const SERVICE_FEE_RATE = 0.05;

  useEffect(() => {
    // Initialize with sample cart data
    setCart({
      'greek-salad': 2,
      'espresso-martini': 1,
    });
  }, []);

  const updateQuantity = (foodId, change) => {
    setCart(prev => {
      const newCart = { ...prev };
      const newQuantity = (newCart[foodId] || 0) + change;
      
      if (newQuantity <= 0) {
        delete newCart[foodId];
      } else {
        newCart[foodId] = newQuantity;
      }
      
      return newCart;
    });
  };

  const calculateTotals = () => {
    let subtotal = 0;
    
    Object.entries(cart).forEach(([foodId, quantity]) => {
      if (foodData[foodId]) {
        subtotal += foodData[foodId].price * quantity;
      }
    });

    const vat = subtotal * VAT_RATE;
    const serviceFee = subtotal * SERVICE_FEE_RATE;
    const total = subtotal + vat + serviceFee;

    return { subtotal, vat, serviceFee, total };
  };

  const { subtotal, vat, serviceFee, total } = calculateTotals();
  const itemCount = Object.keys(cart).length;

  const handlePlaceOrder = () => {
    if (itemCount === 0) return;
    setCart({});
    onNavigate && onNavigate('/order-success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kapakana:wght@400;700&family=Lora:ital,wght@1,400;1,700&display=swap');
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button onClick={() => onNavigate && onNavigate('/dashboard')} className="flex items-center">
            <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-center flex-grow pr-6">Orders</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-xl mx-auto w-full p-4 space-y-6">
        {/* Cart Items */}
        <div className="bg-white rounded-lg shadow-sm">
          {itemCount === 0 ? (
            <div className="p-4 text-gray-500 italic">
              <p>Your order is currently empty. Add items from the menu!</p>
            </div>
          ) : (
            Object.entries(cart).map(([foodId, quantity], index) => {
              const item = foodData[foodId];
              if (!item) return null;
              
              const itemTotal = item.price * quantity;
              
              return (
                <div key={foodId} className={`flex justify-between items-center p-4 border-b border-gray-100 ${index === 0 ? 'rounded-t-lg' : ''}`}>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)} ea.</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                      <button
                        onClick={() => updateQuantity(foodId, -1)}
                        className="w-8 h-8 bg-gray-100 flex items-center justify-center font-bold hover:bg-gray-200"
                      >
                        −
                      </button>
                      <span className="px-3 text-base">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(foodId, 1)}
                        className="w-8 h-8 bg-gray-100 flex items-center justify-center font-bold hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-lg">${itemTotal.toFixed(2)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Note Section */}
        <div>
          <p className="font-semibold text-gray-900 mb-2">Note to restaurant</p>
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <textarea
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Add your request (subject to restaurant's discretion)"
              className="w-full border-none outline-none resize-none bg-transparent text-sm"
              rows="4"
            />
          </div>
        </div>

        {/* Add More Items */}
        <div className="bg-white rounded-lg shadow-sm">
          <button
            onClick={() => onNavigate && onNavigate('/dashboard')}
            className="flex justify-between items-center w-full p-4"
          >
            <span className="text-lg text-orange-500 font-medium">Add more items</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Totals */}
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
          <div className="flex justify-between text-base">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base">
            <span>VAT (10%)</span>
            <span>${vat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base">
            <span>Service fee (5%)</span>
            <span>${serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-dashed border-gray-300 text-xl font-bold text-[#FFD700]">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-white p-4 shadow-xl">
        <div className="max-w-xl mx-auto">
          <button
            onClick={handlePlaceOrder}
            disabled={itemCount === 0}
            className={`w-full py-4 rounded-full font-semibold text-lg transition-all ${
              itemCount === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#FFD700] text-gray-900 hover:bg-[#EAC117]'
            }`}
          >
            Place Order
          </button>
        </div>
      </footer>
    </div>
  );
};

export default WaiterCart;