import React, { useState, useRef, useEffect } from 'react';

const WaiterDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categoryBarRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Sample menu data
  const menuItems = [
    { id: 1, name: 'Easy Greek Salad', category: 'salad', price: 21.99, image: '' },
    { id: 2, name: 'Grilled Chicken Salad', category: 'salad', price: 25.50, image: '' },
    { id: 3, name: 'Caesar Salad Classic', category: 'salad', price: 19.00, image: '' },
    { id: 4, name: 'Quinoa and Arugula Salad', category: 'salad', price: 23.00, image: '' },
    { id: 5, name: 'Caprese Salad Skewers', category: 'salad', price: 18.50, image: '' },
    { id: 6, name: 'Espresso Martini', category: 'beverages', price: 14.00, image: '' },
    { id: 7, name: 'Fresh Orange Juice', category: 'beverages', price: 8.00, image: '' },
    { id: 8, name: 'Meridian Signature', category: 'beverages', price: 16.50, image: '' },
    { id: 9, name: 'Sparkling Water', category: 'beverages', price: 6.00, image: '' },
    { id: 10, name: 'Pinot Noir (Glass)', category: 'beverages', price: 18.00, image: '' },
    { id: 11, name: 'Beef Tenderloin', category: 'main-courses', price: 45.99, image: '' },
    { id: 12, name: 'Pan-Seared Scallops', category: 'main-courses', price: 39.50, image: '' },
    { id: 13, name: 'Vegetarian Lasagna', category: 'main-courses', price: 28.00, image: '' },
    { id: 14, name: 'Lobster Risotto', category: 'main-courses', price: 55.00, image: '' },
    { id: 15, name: 'Pork Chop', category: 'main-courses', price: 35.99, image: '' },
    { id: 16, name: 'Jumbo Shrimp Cocktail', category: 'entrées', price: 24.00, image: '' },
    { id: 17, name: 'Foie Gras Terrine', category: 'entrées', price: 32.00, image: '' },
    { id: 18, name: 'Oysters Rockefeller', category: 'entrées', price: 29.00, image: '' },
    { id: 19, name: 'Spicy Tuna Tartare', category: 'entrées', price: 26.50, image: '' },
    { id: 20, name: 'Prosciutto Melon', category: 'entrées', price: 19.50, image: '' },
    { id: 21, name: 'Chocolate Lava Cake', category: 'dessert', price: 14.00, image: '' },
    { id: 22, name: 'Classic Crème Brûlée', category: 'dessert', price: 12.00, image: '' },
    { id: 23, name: 'Rich Tiramisu', category: 'dessert', price: 13.50, image: '' },
  ];

  const categories = [
    { id: 'all', name: 'All', icon: '🍱' },
    { id: 'entrées', name: 'Entrées', icon: '🍜' },
    { id: 'soup', name: 'Soup', icon: '🥣' },
    { id: 'salad', name: 'Salad', icon: '🥗' },
    { id: 'main-courses', name: 'Main Courses', icon: '🍖' },
    { id: 'rotisserie', name: 'Rotisserie', icon: '🍗' },
    { id: 'accompaniments', name: 'Accompaniments', icon: '🥖' },
    { id: 'amuse-bouche', name: 'Amuse-Bouche', icon: '✨' },
    { id: 'dessert', name: 'Dessert', icon: '🍰' },
    { id: 'beverages', name: 'Beverages', icon: '🍹' },
  ];

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

  const currentCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || 'All Menu Items';

  return (
    <div className="min-h-screen bg-[#F4F4F6]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kapakana:wght@400;700&family=Lora:ital,wght@1,400;1,700&display=swap');

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
            
            <button className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
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
        <h2 className="text-xl font-semibold mb-4">{currentCategoryName} Menu Items</h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map(item => (
            <div key={item.id} className="menu-card cursor-pointer">
              <div className="w-full h-[150px] bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                No Image
              </div>
              <div>
                <p className="font-semibold text-base truncate text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{item.category}</p>
                <p className="text-[#3b5a44] font-bold text-lg mt-1">${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
export default WaiterDashboard;