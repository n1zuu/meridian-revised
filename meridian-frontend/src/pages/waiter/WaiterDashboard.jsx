import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axiosClient'; // Ensure this points to your axios instance

const WaiterDashboard = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFood, setSelectedFood] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [cart, setCart] = useState({});
  const [showCartModal, setShowCartModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  
  // Menu state fetched from backend
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryBarRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const navigate = useNavigate();

  // Categories map for UI
  const categories = [
    { id: 'all', name: 'All', icon: '🍱' },
    { id: 'entrées', name: 'Entrées', icon: '🦐' },
    { id: 'soup', name: 'Soup', icon: '🥣' },
    { id: 'salad', name: 'Salad', icon: '🥗' },
    { id: 'main-course', name: 'Main Course', icon: '🍖' }, // Matches mapped backend data
    { id: 'accompaniments', name: 'Accompaniments', icon: '🥖' },
    { id: 'dessert', name: 'Dessert', icon: '🍦' },
    { id: 'beverages', name: 'Beverages', icon: '🍹' },
  ];

  // --- 1. FETCH MENU FROM BACKEND ---
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await api.get('/menu/');
        // Map backend data to match frontend expectations
        const mappedData = response.data.map(item => ({
          ...item,
          // Handle category mismatch: Django 'main-courses' -> React 'main-course'
          category: item.category === 'main-courses' ? 'main-course' : item.category,
          // Ensure image is a valid URL if it exists
          image: item.image || 'https://via.placeholder.com/300x300?text=No+Image'
        }));
        setMenuItems(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch menu:", error);
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleMouseDown = (e) => {
    if (!categoryBarRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - categoryBarRef.current.offsetLeft);
    setScrollLeft(categoryBarRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !categoryBarRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoryBarRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    categoryBarRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCardClick = (item) => {
    setSelectedFood(item);
    setQuantity(0);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFood(null);
    setQuantity(0);
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (quantity > 0) {
      setCart(prev => ({
        ...prev,
        [selectedFood.id]: {
          ...selectedFood,
          quantity: (prev[selectedFood.id]?.quantity || 0) + quantity
        }
      }));
      setQuantity(0);
      closeModal();
    }
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[itemId];
      return newCart;
    });
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(prev => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          quantity: newQuantity
        }
      }));
    }
  };

  const handleSettings = () => {
    navigate('/settings');
  }

  const cartCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = Object.values(cart).reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

  const handlePlaceOrder = () => {
    if (cartCount === 0) return;
    setShowCartModal(false);
    setShowTableModal(true);
  };

  // --- 2. SEND ORDER TO BACKEND ---
  const confirmOrder = async () => {
    if (!selectedTable) return;

    // Transform cart to match CreateOrderSerializer
    const orderItems = Object.values(cart).map(item => ({
      menu_item_id: item.id,       // Backend expects 'menu_item_id'
      quantity: item.quantity,
      special_instructions: ""     // Optional
    }));

    const payload = {
      table_number: selectedTable,
      items: orderItems,
      notes: "Standard Order"
    };

    try {
      await api.post('/orders/', payload);
      
      // Success handling
      setCart({});
      setSelectedTable(null);
      setShowTableModal(false);
      
      if (onNavigate) {
        onNavigate('/order-success');
      } else {
        alert("Order placed successfully!");
      }
    } catch (error) {
      console.error("Order failed:", error);
      alert("Failed to place order. " + (error.response?.data?.message || "Please check connection."));
    }
  };

  const currentCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || 'All Menu Items';

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Menu...</div>;

  return (
    <div className="min-h-screen bg-[#F4F4F6]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kapakana:wght@400;700&family=Lora:ital,wght@1,400;1,700&display=swap');
        
        /* ... keeping your existing styles ... */
        .meridian-script-small {
          font-family: 'Kapakana', cursive; 
          font-size: 1.5rem; 
          background: linear-gradient(180deg, #FFD700 0%, #B8860B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent; 
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
          margin-bottom: 0.25rem;
        }

        .category-pill {
          background-color: #e5e5e5; 
          color: #1a1a1a;
          padding: 0.5rem 1.25rem;
          border-radius: 9999px;
          font-size: 0.9rem;
          border: none;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          white-space: nowrap;
        }

        .category-pill.active {
          background-color: #3b5a44; 
          color: #f7f7f7;
          font-weight: 600;
        }

        .menu-card {
          background-color: #FFFFFF; 
          border-radius: 12px;
          overflow: hidden;
          padding: 0.75rem;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
          transition: transform 0.2s;
        }
        
        .menu-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }

        .category-scroll-wrapper {
          overflow-x: scroll;
          -ms-overflow-style: none;
          scrollbar-width: none;
          cursor: grab;
        }
        
        .category-scroll-wrapper::-webkit-scrollbar {
          display: none;
        }
        
        .category-scroll-wrapper.dragging {
          cursor: grabbing;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#F4F4F6] shadow-md">
        <div className="max-w-4xl mx-auto p-4">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h1 className="meridian-script-small">Meridian</h1>
              <p className="text-sm text-gray-600">Good morning. It is our pleasure to welcome you.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 mb-6">
            <div className="relative flex-grow shadow-md rounded-xl">
              <input 
                type="text" 
                placeholder="Search.." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border-none rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3b5a44]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </span>
            </div>
            
            <button 
              onClick={() => setShowCartModal(true)}
              className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md relative"
            >
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button 
              onClick={handleSettings}
              className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="bg-[#F4F4F6] pb-3">
          <div className="max-w-4xl mx-auto px-4">
            <div 
              ref={categoryBarRef}
              className={`category-scroll-wrapper flex space-x-3 ${isDragging ? 'dragging' : ''}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                >
                  <span className="mr-2">{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pt-6">
        <h2 className="text-xl font-semibold mb-4">{currentCategoryName}</h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="menu-card cursor-pointer"
              onClick={() => handleCardClick(item)}
            >
              <div className="w-full h-[150px] rounded-lg mb-3 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-base truncate text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{item.category}</p>
                <p className="text-[#3b5a44] font-bold text-lg mt-1">${parseFloat(item.price).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Food Detail Modal */}
      {showModal && selectedFood && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg z-10 hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="#333">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <img 
                src={selectedFood.image} 
                alt={selectedFood.name} 
                className="w-full h-64 object-cover rounded-t-2xl"
              />
            </div>

            <div className="bg-[#2eae96] px-6 pt-8 pb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold text-white">{selectedFood.name}</h2>
              </div>

              <p className="text-white text-sm leading-relaxed mb-6 opacity-95">
                {selectedFood.description}
              </p>

              <div className="text-white text-3xl font-bold mb-6">
                ${parseFloat(selectedFood.price).toFixed(2)}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-[#f5a623] rounded-full px-6 py-3 gap-8">
                  <button onClick={handleDecrement} className="text-white text-2xl font-bold"> − </button>
                  <span className="text-white text-xl font-semibold min-w-[20px] text-center">{quantity}</span>
                  <button onClick={handleIncrement} className="text-white text-2xl font-bold"> + </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="bg-white rounded-full px-6 py-3 flex items-center gap-2 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity === 0}
                >
                  <span className="text-gray-700 font-semibold text-lg">Add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={() => setShowCartModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
              <button onClick={() => setShowCartModal(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="#333">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6">
              {cartCount === 0 ? (
                <div className="text-center py-12"><p className="text-gray-500">Your cart is empty</p></div>
              ) : (
                <div className="space-y-4">
                  {Object.values(cart).map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">${parseFloat(item.price).toFixed(2)} ea.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="w-8 h-8 bg-white border border-gray-300 rounded-full"> − </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="w-8 h-8 bg-white border border-gray-300 rounded-full"> + </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartCount > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-[#3b5a44]">${cartTotal.toFixed(2)}</span>
                </div>
                <button onClick={handlePlaceOrder} className="w-full bg-[#FFD700] text-gray-900 font-semibold py-4 rounded-full">
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table Selection Modal */}
      {showTableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={() => setShowTableModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Table Number</h2>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[...Array(16)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setSelectedTable(i + 1)}
                    className={`aspect-square rounded-xl font-semibold text-lg transition-all ${selectedTable === i + 1 ? 'bg-[#3b5a44] text-white shadow-lg' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowTableModal(false)} className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-full">Cancel</button>
                <button onClick={confirmOrder} disabled={!selectedTable} className={`flex-1 font-semibold py-3 rounded-full ${selectedTable ? 'bg-[#FFD700] text-gray-900' : 'bg-gray-300 text-gray-500'}`}>
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaiterDashboard;