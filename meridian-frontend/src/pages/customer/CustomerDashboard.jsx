import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axiosClient';
import getImageUrl from '../../utils/getImage';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedFood, setSelectedFood] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All', emoji: '🍱' },
    { id: 'entrées', name: 'Entrées', emoji: '🍜' },
    { id: 'soup', name: 'Soup', emoji: '🥣' },
    { id: 'salad', name: 'Salad', emoji: '🥗' },
    { id: 'main-courses', name: 'Main Courses', emoji: '🍖' },
    { id: 'rotisserie', name: 'Rotisserie', emoji: '🍗' },
    { id: 'accompaniments', name: 'Accompaniments', emoji: '🥖' },
    { id: 'dessert', name: 'Dessert', emoji: '🰀' },
    { id: 'beverages', name: 'Beverages', emoji: '🍹' },
  ];

  // --- 1. FETCH MENU ---
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Authenticated as guest or public access allowed
        const response = await api.get('/menu/');
        setMenuItems(response.data.map(item => ({
            ...item,
            image: item.image || 'https://via.placeholder.com/150?text=No+Image',
            category: item.category === 'main-courses' ? 'main-courses' : item.category // Ensure match
        })));
        setLoading(false);
      } catch (error) {
        console.error("Failed to load menu", error);
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredItems = menuItems.filter(item => {
    // Normalizing category check
    const itemCat = item.category === 'main' ? 'main-courses' : item.category;
    const matchesCategory = activeCategory === 'all' || itemCat === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCardClick = (item) => {
    setSelectedFood(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFood(null);
  };

  const getCategoryTitle = () => {
    if (activeCategory === 'all') return 'All Menu Items';
    const category = categories.find(c => c.id === activeCategory);
    return category ? category.name : 'Menu Items';
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Menu...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kapakana:wght@400;700&family=Lora:ital,wght@1,400;1,700&display=swap');
        .meridian-script-small {
          font-family: 'Kapakana', cursive;
          font-size: 1.5rem;
          background: linear-gradient(180deg, #FFD700 0%, #B8860B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .category-scroll { overflow-x: scroll; scrollbar-width: none; }
        .category-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-50 shadow-md">
        <div className="max-w-4xl mx-auto p-4">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h1 className="meridian-script-small">Meridian</h1>
              <p className="text-sm text-gray-600">Good morning. It is our pleasure to welcome you.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 mb-6">
            <div className="relative flex-grow shadow rounded-xl">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-white"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#3b5a44]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow"
              title="Exit Guest Mode"
            >
               <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H9" />
              </svg>
            </button>
          </div>

          <div className="category-scroll flex pb-3 overflow-x-auto">
            <div className="flex space-x-3 category-container">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex-shrink-0 px-5 py-2 rounded-full text-sm transition-all whitespace-nowrap ${
                    activeCategory === category.id
                      ? 'bg-[#3b5a44] text-white font-semibold'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <span className="mr-2">{category.emoji}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 pt-6">
        <h2 className="text-xl font-semibold mb-4">{getCategoryTitle()}</h2>

        {filteredItems.length === 0 ? (
             <p className="text-gray-500 text-center py-10">No items found.</p>
        ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredItems.map(item => (
                <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="bg-white rounded-xl p-3 shadow hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
                >
                <div className="w-full h-36 rounded-lg overflow-hidden mb-3">
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                      // Optional: Add an error handler if the image is truly missing
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                    />
                </div>
                <p className="font-semibold text-base truncate">{item.name}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{item.category}</p>
                <p className="text-lg font-bold text-[#3b5a44] mt-1">${parseFloat(item.price).toFixed(2)}</p>
                </div>
            ))}
            </div>
        )}
      </main>

      {/* Food Detail Modal */}
      {showModal && selectedFood && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-11/12 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center shadow z-10"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="#333">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img src={selectedFood.image} alt={selectedFood.name} className="w-full h-64 object-cover rounded-t-2xl" />
            </div>

            <div className="p-5">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">{selectedFood.name}</h2>
              <div className="mb-4">
                <p className="text-gray-500 text-lg">Price</p>
                <p className="text-3xl font-bold text-red-600">${parseFloat(selectedFood.price).toFixed(2)}</p>
              </div>
              <h3 className="text-xl font-bold text-[#3b5a44] mb-2 border-b-2 border-gray-200 pb-1">Description</h3>
              <p className="text-gray-700 text-base leading-relaxed">{selectedFood.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;