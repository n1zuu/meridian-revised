import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axiosClient';

const SettingsPage = ({ onClose }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Safe fallback if user isn't loaded yet
  const safeUser = user || { 
      first_name: 'Guest', 
      last_name: 'User', 
      username: 'N/A', 
      email: 'N/A', 
      phone_number: 'N/A',
      role: 'customer'
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    // Navigate based on role
    switch(safeUser.role) {
      case 'manager': navigate('/admin'); break;
      case 'waiter': navigate('/waiter'); break;
      case 'cashier': navigate('/cashier'); break;
      default: navigate('/menu');
    }
  };

  // --- UPDATED LOGOUT HANDLER ---
  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    navigate('/'); // Redirect to landing page immediately
  };

  return (
    <div className="min-h-screen max-w-lg mx-auto bg-white">
      {/* Header */}
      <header className="p-4 flex items-center justify-between sticky top-0 bg-white z-10 border-b border-gray-100">
        <button onClick={handleClose} className="text-gray-500 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-center flex-grow">Settings</h1>
        <div className="w-6 h-6"></div>
      </header>

      <main className="p-4 pt-0">
        {/* Personal Information */}
        <h2 className="text-sm font-semibold mt-6 mb-2 text-gray-700">Personal Information</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-100">
          <div className="p-4 flex justify-between items-center border-b border-gray-100">
            <span className="text-sm text-gray-700">Employee Name</span>
            <span className="text-sm font-medium">{safeUser.first_name} {safeUser.last_name}</span>
          </div>
          <div className="p-4 flex justify-between items-center border-b border-gray-100">
            <span className="text-sm text-gray-700">Username</span>
            <span className="text-sm font-medium text-gray-600">{safeUser.username}</span>
          </div>
          <div className="p-4 flex justify-between items-center border-b border-gray-100">
            <span className="text-sm text-gray-700">Role</span>
            <span className="text-sm font-medium text-gray-600 capitalize">{safeUser.role}</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="text-sm text-gray-700">Phone Number</span>
            <span className="text-sm font-medium text-gray-600">{safeUser.phone_number || 'Not set'}</span>
          </div>
        </div>

        {/* --- ADMIN SECTION (Visible only to Managers) --- */}
        {safeUser.role === 'manager' && (
          <>
            <h2 className="text-sm font-semibold mt-6 mb-2 text-[#3b5a44]">Administration</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-100">
              <button 
                onClick={() => setShowEmployeeModal(true)}
                className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3b5a44]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Manage Staff</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </>
        )}

        {/* Log Out Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full bg-white rounded-xl shadow-sm p-4 flex items-center hover:bg-gray-50 transition-colors border border-gray-100 mt-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-red-600 mr-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          <span className="text-sm font-semibold text-red-600">Log Out</span>
        </button>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50" onClick={() => setShowLogoutModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-11/12 max-w-xs shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold text-center mb-2">Log Out</h2>
            <p className="text-gray-600 text-center mb-6">Are you sure you want to logout?</p>
            <div className="flex rounded-lg overflow-hidden bg-gray-200 h-11">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 bg-white text-gray-900 border-r border-gray-300">Cancel</button>
              <button onClick={handleLogout} className="flex-1 bg-white text-red-600 font-semibold">Log Out</button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Management Modal */}
      {showEmployeeModal && (
        <EmployeeManagementModal 
            onClose={() => setShowEmployeeModal(false)} 
            currentUser={safeUser} 
        />
      )}
    </div>
  );
};

// --- SUB-COMPONENT: Employee Management Modal ---
const EmployeeManagementModal = ({ onClose, currentUser }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list'); 
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); 

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'waiter',
    phone_number: ''
  });

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/'); 
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/', formData);
      alert('Employee added successfully');
      setFormData({ username: '', password: '', first_name: '', last_name: '', role: 'waiter', phone_number: '' });
      setActiveTab('list');
      fetchEmployees();
    } catch (error) {
      alert('Failed to add employee: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/users/${userId}/`, { role: newRole });
      setEmployees(prev => prev.map(emp => 
        emp.id === userId ? { ...emp, role: newRole } : emp
      ));
    } catch (error) {
      alert('Failed to update role');
    }
  };

  const initiateDelete = (userId, username) => {
    if (userId === currentUser.id) {
        alert("You cannot delete your own account!");
        return;
    }
    setDeleteConfirmation({ id: userId, username });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;

    try {
        await api.delete(`/users/${deleteConfirmation.id}/`);
        setEmployees(prev => prev.filter(emp => emp.id !== deleteConfirmation.id));
        setDeleteConfirmation(null); 
    } catch (error) {
        alert("Failed to delete user: " + (error.response?.data?.error || "Unknown error"));
        setDeleteConfirmation(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative" onClick={e => e.stopPropagation()}>
        
        {/* Main Modal Content */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Manage Staff</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-4 text-center font-semibold ${activeTab === 'list' ? 'text-[#3b5a44] border-b-2 border-[#3b5a44]' : 'text-gray-500'}`}
          >
            Employee List
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-4 text-center font-semibold ${activeTab === 'add' ? 'text-[#3b5a44] border-b-2 border-[#3b5a44]' : 'text-gray-500'}`}
          >
            Add New Employee
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          {/* LIST VIEW */}
          {activeTab === 'list' && (
            <div className="space-y-3">
              {loading ? (
                <p className="text-center text-gray-500">Loading staff...</p>
              ) : (
                employees.map(emp => (
                  <div key={emp.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors">
                    <div>
                      <p className="font-bold text-gray-800">{emp.first_name} {emp.last_name} {currentUser.id === emp.id && '(You)'}</p>
                      <p className="text-xs text-gray-500">@{emp.username}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <select 
                        value={emp.role}
                        onChange={(e) => handleRoleChange(emp.id, e.target.value)}
                        disabled={currentUser.id === emp.id}
                        className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg p-2 focus:ring-[#3b5a44] focus:border-[#3b5a44]"
                        >
                        <option value="manager">Manager</option>
                        <option value="waiter">Waiter</option>
                        <option value="cashier">Cashier</option>
                        <option value="customer">Customer</option>
                        </select>

                        <button 
                            onClick={() => initiateDelete(emp.id, emp.username)}
                            disabled={currentUser.id === emp.id}
                            className={`p-2 rounded-lg transition-colors ${currentUser.id === emp.id ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}
                            title="Remove Employee"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ADD VIEW */}
          {activeTab === 'add' && (
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    required 
                    className="w-full p-3 border rounded-lg bg-gray-50"
                    value={formData.first_name}
                    onChange={e => setFormData({...formData, first_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    required 
                    className="w-full p-3 border rounded-lg bg-gray-50"
                    value={formData.last_name}
                    onChange={e => setFormData({...formData, last_name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Username</label>
                <input 
                  required 
                  className="w-full p-3 border rounded-lg bg-gray-50"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password"
                  required 
                  className="w-full p-3 border rounded-lg bg-gray-50"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                <select 
                  className="w-full p-3 border rounded-lg bg-gray-50"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="waiter">Waiter</option>
                  <option value="cashier">Cashier</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone (Optional)</label>
                <input 
                  className="w-full p-3 border rounded-lg bg-gray-50"
                  value={formData.phone_number}
                  onChange={e => setFormData({...formData, phone_number: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#3b5a44] text-white py-3 rounded-xl font-bold mt-4 hover:bg-[#2e4736]"
              >
                Create Account
              </button>
            </form>
          )}
        </div>

        {/* --- CUSTOM CONFIRMATION MODAL OVERLAY --- */}
        {deleteConfirmation && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center p-6 z-10 animate-fade-in">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Account?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to remove <strong>{deleteConfirmation.username}</strong>? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteConfirmation(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;