import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const AdminDashboard = () => {
  const revenueTrendRef = useRef(null);
  const bestSellingRef = useRef(null);
  const revenueTrendChartRef = useRef(null);
  const bestSellingChartRef = useRef(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'entrées',
    available: true,
    description: '',
    image_url: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = () => {
    // 🔗 Replace with Django API call
    console.log('New MenuItem:', formData);
    setShowAddModal(false);
  };


  useEffect(() => {
    // Revenue Trend Chart
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
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            beginAtZero: true,
            min: 2000,
            max: 8000,
            ticks: {
              stepSize: 2000,
              callback: (value) => '$' + value
            }
          }
        }
      }
    };

    // Best Selling Chart
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
        scales: {
          x: { grid: { display: false } },
          y: {
            beginAtZero: true,
            min: 50,
            max: 200,
            ticks: { stepSize: 50 }
          }
        }
      }
    };

    // Initialize charts
    if (revenueTrendRef.current) {
      revenueTrendChartRef.current = new Chart(revenueTrendRef.current, revenueTrendConfig);
    }
    if (bestSellingRef.current) {
      bestSellingChartRef.current = new Chart(bestSellingRef.current, bestSellingConfig);
    }

    // Cleanup
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
      `}</style>

      <div className="max-w-md mx-auto">
        <header className="p-4">
          <h1 className="meridian-script">Meridian</h1>
        </header>

        <main className="px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Monthly Report</h2>

          {/* Revenue by Category */}
          <div className="bg-white rounded-xl p-6 shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-6">Revenue (by Category)</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-700">
                <div className="w-3 h-3 rounded-full bg-[#5eb087]"></div>
                <span>Rotisserie</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <div className="w-3 h-3 rounded-full bg-[#3f90b9]"></div>
                <span>Soup</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>
                <span>Salad</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <div className="w-3 h-3 rounded-full bg-[#eab308]"></div>
                <span>Entrée</span>
              </div>
            </div>
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

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-100 shadow-lg h-16 grid grid-cols-5 items-center px-2">
          <button className="flex flex-col items-center justify-center text-gray-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </button>

          <button className="flex flex-col items-center justify-center text-[#3b5a44]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </button>

          <div className="flex justify-center">
            <button
              onClick={() => setShowAddModal(true)} 
              className="w-14 h-14 bg-[#3b5a44] text-white rounded-full flex items-center justify-center text-2xl -translate-y-2 shadow-lg">
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

          {/* Add Menu Modal */}
          {showAddModal && (
          <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="bg-white rounded-xl w-[90%] max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Add Menu Item</h3>

              <div className="space-y-3">
                <input
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />

                <input
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="entrées">Entrées</option>
                  <option value="soup">Soup</option>
                  <option value="salad">Salad</option>
                  <option value="main">Main Course</option>
                  <option value="accompaniments">Accompaniments</option>
                  <option value="dessert">Dessert</option>
                  <option value="beverage">Beverage</option>
                </select>

                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />

                <input
                  name="image_url"
                  placeholder="Image URL"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                  />
                  <span>Available</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-lg bg-[#3b5a44] text-white"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
        </nav>
      </div>
    </div>
  );
};

export default AdminDashboard;