import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const DailyReport = () => {
  const hourlySalesRef = useRef(null);
  const hourlySalesChartRef = useRef(null);

  useEffect(() => {
    const hourlySalesData = {
      labels: ['10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM'],
      datasets: [{
        label: 'Sales ($)',
        data: [150, 250, 700, 650, 400, 300, 200],
        borderColor: 'rgb(59, 90, 68)',
        backgroundColor: 'rgba(59, 90, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: 'rgb(59, 90, 68)'
      }]
    };

    const hourlySalesConfig = {
      type: 'line',
      data: hourlySalesData,
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
            min: 0,
            max: 800,
            ticks: {
              stepSize: 200,
              callback: (value) => '$' + value
            }
          }
        }
      }
    };

    if (hourlySalesRef.current) {
      hourlySalesChartRef.current = new Chart(hourlySalesRef.current, hourlySalesConfig);
    }

    return () => {
      if (hourlySalesChartRef.current) hourlySalesChartRef.current.destroy();
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex justify-between items-center">
            Daily Report
            <span className="text-base font-normal text-gray-500">Dec 17, 2025</span>
          </h2>

          {/* Summary Boxes */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#3b5a44] text-white p-4 rounded-xl text-center">
              <div className="text-3xl font-bold text-[#FFD700]">$4,500</div>
              <div className="text-sm opacity-90">Total Revenue</div>
            </div>
            <div className="bg-[#3b5a44] text-white p-4 rounded-xl text-center">
              <div className="text-3xl font-bold text-[#FFD700]">120</div>
              <div className="text-sm opacity-90">Total Orders</div>
            </div>
          </div>

          {/* Hourly Sales Trend */}
          <div className="bg-white rounded-xl p-6 shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-6">Hourly Sales Trend</h3>
            <div className="h-48">
              <canvas ref={hourlySalesRef}></canvas>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl p-6 shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-6">Payment Methods</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Credit Card</span>
                <span className="font-semibold">$2,100</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Cash</span>
                <span className="font-semibold">$1,500</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Mobile Pay</span>
                <span className="font-semibold">$900</span>
              </div>
            </div>
          </div>

          {/* Top Employee */}
          <div className="bg-white rounded-xl p-6 shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4">Top Employee</h3>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold text-gray-700">
                A
              </div>
              <div>
                <p className="font-semibold">Alice Johnson</p>
                <p className="text-sm text-gray-500">35 Orders processed</p>
              </div>
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
            <button className="w-14 h-14 bg-[#3b5a44] text-white rounded-full flex items-center justify-center text-2xl -translate-y-2 shadow-lg">
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
        </nav>
      </div>
    </div>
  );
};

export default DailyReport;