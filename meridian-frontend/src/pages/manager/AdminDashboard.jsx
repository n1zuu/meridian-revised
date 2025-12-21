import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import api from '../../services/axiosClient';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const revenueTrendRef = useRef(null);
  const bestSellingRef = useRef(null);
  const revenueTrendChartRef = useRef(null);
  const bestSellingChartRef = useRef(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  
  // Data state
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'entrées',
    available: true,
    description: '',
    image: null, 
  });

  // --- MENU MANAGEMENT FUNCTIONS ---
  
  const fetchMenu = async () => {
    setLoadingMenu(true);
    try {
      const response = await api.get('/menu/'); // Fetches all items
      setMenuItems(response.data);
    } catch (error) {
      console.error("Failed to load menu", error);
    } finally {
      setLoadingMenu(false);
    }
  };

  // Trigger fetch when opening the availability modal
  useEffect(() => {
    if (showAvailabilityModal) {
      fetchMenu();
    }
  }, [showAvailabilityModal]);

  const handleToggleAvailability = async (id) => {
    try {
      // Optimistic update for UI speed
      setMenuItems(prev => prev.map(item => 
        item.id === id ? { ...item, available: !item.available } : item
      ));

      // Call backend
      await api.patch(`/menu/${id}/toggle_availability/`);
    } catch (error) {
      console.error("Failed to toggle", error);
      alert("Failed to update status");
      // Revert on failure
      fetchMenu();
    }
  };

  // --- ADD ITEM FUNCTIONS ---

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
        setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
        setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
        }));
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('available', formData.available);
    if (formData.image) {
        data.append('image', formData.image);
    }

    try {
        await api.post('/menu/', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Menu item added successfully!");
        setShowAddModal(false);
        setFormData({ name: '', price: '', category: 'entrées', available: true, description: '', image: null });
    } catch (error) {
        console.error("Failed to add item", error);
        alert("Failed to add item.");
    }
  };

  // --- CHARTS (Static for now) ---
  useEffect(() => {
    const revenueData = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Revenue',
        data: [2500, 3500, 5000, 7500],
        borderColor: 'rgb(59, 90, 68)',
        backgroundColor: 'rgba(59, 90, 68, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: 'rgb(59, 90, 68)'
      }]
    };

    const revenueTrendConfig = {
      type: 'line',
      data: revenueData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }
      }
    };

    const bestSellingData = {
      labels: ['Teriyaki Chicken', 'Caesar Salad', 'Fillet Mignon', 'Piña Colada'],
      datasets: [{
        label: 'Units Sold',
        data: [180, 150, 100, 80],
        backgroundColor: [
          'rgba(59, 90, 68, 0.8)',
          'rgba(94, 176, 135, 0.8)',
          'rgba(255, 215, 0, 0.8)',
          'rgba(184, 134, 11, 0.8)'
        ],
        borderRadius: 5,
      }]
    };

    const bestSellingConfig = {
      type: 'bar',
      data: bestSellingData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false } } }
      }
    };

    if (revenueTrendRef.current) revenueTrendChartRef.current = new Chart(revenueTrendRef.current, revenueTrendConfig);
    if (bestSellingRef.current) bestSellingChartRef.current = new Chart(bestSellingRef.current, bestSellingConfig);

    return () => {
      if (revenueTrendChartRef.current) revenueTrendChartRef.current.destroy();
      if (bestSellingChartRef.current) bestSellingChartRef.current.destroy();
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kapakana:wght@400;700&family=Lora:ital,wght@1,400;1,700&display=swap');
        .meridian-script {
          font-family: 'Kapakana', cursive;
          font-size: 2rem;
          background: linear-gradient(180deg, #FFD700 0%, #B8860B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }
        
        /* Toggle Switch Styles */
        .toggle-checkbox:checked {
          right: 0;
          border-color: #3b5a44;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #3b5a44;
        }
      `}</style>

      <div className="max-w-md mx-auto">
        <header className="p-4">
          <h1 className="meridian-script">Meridian</h1>
        </header>

        <main className="px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Manager Dashboard</h2>

          {/* Quick Actions */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
             <button 
                onClick={() => setShowAvailabilityModal(true)}
                className="flex-shrink-0 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 min-w-[160px]"
             >
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </div>
                <div className="text-left">
                    <p className="font-bold text-gray-800 text-sm">Availability</p>
                    <p className="text-xs text-gray-500">Manage Menu</p>
                </div>
             </button>
             
             {/* You can add more action cards here */}
          </div>

          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-xl p-6 shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-6">Revenue Trend</h3>
            <div className="h-48">
              <canvas ref={revenueTrendRef}></canvas>
            </div>
          </div>

          {/* Best-selling Items Chart */}
          <div className="bg-white rounded-xl p-6 shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-6">Best-selling Items</h3>
            <div className="h-48">
              <canvas ref={bestSellingRef}></canvas>
            </div>
          </div>
        </main>

        {/* --- BOTTOM NAVIGATION --- */}
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-100 shadow-lg h-16 grid grid-cols-5 items-center px-2 z-10">
          <button className="flex flex-col items-center justify-center text-[#3b5a44]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>

          <button 
            onClick={() => navigate('/admin/orders')}
            className="flex flex-col items-center justify-center text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
               <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
          </button>

          <div className="flex justify-center">
            <button
              onClick={() => setShowAddModal(true)} 
              className="w-14 h-14 bg-[#3b5a44] text-white rounded-full flex items-center justify-center text-2xl -translate-y-2 shadow-lg hover:scale-105 transition-transform">
              +
            </button>
          </div>

          <button 
            onClick={() => navigate('/admin/transactions')}
            className="flex flex-col items-center justify-center text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <button 
             onClick={() => navigate('/settings')}
             className="flex flex-col items-center justify-center text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </nav>

        {/* --- MODAL: Add Menu Item --- */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
            <div className="bg-white rounded-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">Add Menu Item</h3>
              <div className="space-y-3">
                <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                <input name="price" type="number" step="0.01" placeholder="Price" value={formData.price} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                  <option value="entrées">Entrées</option>
                  <option value="soup">Soup</option>
                  <option value="salad">Salad</option>
                  <option value="main">Main Course</option>
                  <option value="accompaniments">Accompaniments</option>
                  <option value="dessert">Dessert</option>
                  <option value="beverage">Beverage</option>
                </select>
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                <input type="file" name="image" onChange={handleChange} className="w-full text-sm" />
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />
                  <span>Available Immediately</span>
                </label>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg bg-gray-200">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-[#3b5a44] text-white">Add</button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL: Manage Availability --- */}
        {showAvailabilityModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowAvailabilityModal(false)}>
            <div className="bg-white rounded-xl w-full max-w-md p-6 max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Manage Menu Availability</h3>
                <button onClick={() => setShowAvailabilityModal(false)} className="text-gray-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <div className="overflow-y-auto flex-grow space-y-2 pr-2">
                {loadingMenu ? (
                    <div className="text-center py-4 text-gray-500">Loading menu...</div>
                ) : (
                    menuItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div>
                                <p className="font-semibold text-gray-800">{item.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                            </div>
                            
                            {/* Toggle Switch */}
                            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input 
                                    type="checkbox" 
                                    name={`toggle-${item.id}`} 
                                    id={`toggle-${item.id}`}
                                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out"
                                    checked={item.available}
                                    onChange={() => handleToggleAvailability(item.id)}
                                    style={{
                                        right: item.available ? '0' : 'auto',
                                        left: item.available ? 'auto' : '0',
                                        borderColor: item.available ? '#3b5a44' : '#d1d5db'
                                    }}
                                />
                                <label 
                                    htmlFor={`toggle-${item.id}`} 
                                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${item.available ? 'bg-[#3b5a44]' : 'bg-gray-300'}`}
                                ></label>
                            </div>
                        </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;