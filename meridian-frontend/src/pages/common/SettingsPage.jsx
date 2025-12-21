import React, { useState } from 'react';

const SettingsPage = ({ onClose, onLogout }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    if (onLogout) onLogout();
  };

  return (
    <div className="min-h-screen max-w-lg mx-auto bg-white">
      {/* Header */}
      <header className="p-4 flex items-center justify-between sticky top-0 bg-white z-10 border-b border-gray-100">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-center flex-grow">Settings</h1>
        <div className="w-6 h-6"></div>
      </header>

      <main className="p-4 pt-0">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative flex-grow rounded-xl bg-gray-200 p-2 flex items-center">
            <span className="text-gray-500 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none w-full text-sm placeholder-gray-500"
            />
          </div>
        </div>

        {/* Personal Information */}
        <h2 className="text-sm font-semibold mb-2 text-gray-700">Personal Information</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-100">
          <div className="p-4 flex justify-between items-center border-b border-gray-100">
            <span className="text-sm text-gray-700">Employee Name</span>
            <span className="text-sm font-medium">Vince Jevy Tapdasan</span>
          </div>
          <div className="p-4 flex justify-between items-center border-b border-gray-100">
            <span className="text-sm text-gray-700">Employee ID</span>
            <span className="text-sm font-medium text-gray-600">M-0067</span>
          </div>
          <div className="p-4 flex justify-between items-center border-b border-gray-100">
            <span className="text-sm text-gray-700">Email</span>
            <span className="text-sm font-medium text-gray-600">j*******@example.com</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="text-sm text-gray-700">Phone Number</span>
            <span className="text-sm font-medium text-gray-600">+1-2*********76</span>
          </div>
        </div>

        {/* Account Settings */}
        <h2 className="text-sm font-semibold mb-2 text-gray-700">Account Settings</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-100">
          <button className="w-full p-4 flex justify-between items-center border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <span className="text-sm">Change password</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          <button className="w-full p-4 flex justify-between items-center border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <span className="text-sm">Push notifications settings</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          <button className="w-full p-4 flex justify-between items-center border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <span className="text-sm">Email notifications preferences</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          <button className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
            <span className="text-sm">Two-factor authentication</span>
            <div className="flex items-center">
              <span className="text-sm text-gray-400 mr-2">Disabled</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </button>
        </div>

        {/* Log Out Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full bg-white rounded-xl shadow-sm p-4 flex items-center hover:bg-gray-50 transition-colors border border-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-red-600 mr-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          <span className="text-sm font-semibold text-red-600">Log Out</span>
        </button>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-11/12 max-w-xs shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-center mb-2">Log Out</h2>
            <p className="text-gray-600 text-center mb-6">Are you sure you want to logout?</p>

            <div className="flex rounded-lg overflow-hidden bg-gray-200 h-11">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-white text-gray-900 border-r border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-white text-red-600 font-semibold"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;