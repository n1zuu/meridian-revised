import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginView = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const { role } = useParams(); // Get role from URL
  const navigate = useNavigate();
  const { login, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setIsLoading(true);

    try {
      const response = await login(username, password);
      
      // Check if user's role matches the selected role
      if (response.user.role.toLowerCase() !== role.toLowerCase()) {
        setLocalError(`This account is not authorized as ${role}. Please use a ${response.user.role} account.`);
        setIsLoading(false);
        return;
      }

      // Redirect based on role
      switch (response.user.role) {
        case 'manager':
          navigate('/admin');
          break;
        case 'waiter':
          navigate('/waiter');
          break;
        case 'cashier':
          navigate('/cashier');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kapakana:wght@400;700&family=Lora:ital,wght@1,400;1,700&display=swap');

        .landing-bg {
          background-color: #0d5a44; 
          background-image: radial-gradient(
            circle at 80% 20%, 
            rgba(255, 223, 100, 0.2) 0%, 
            transparent 40%
          ),
          linear-gradient(
            135deg, 
            #003323 0%, 
            #0d5a44 100%
          ); 
          background-size: cover;
          background-position: center;
        }

        .meridian-script {
          font-family: 'Kapakana', cursive; 
          font-size: 4rem; 
          line-height: 1;
          background: linear-gradient(180deg, #FFD700 0%, #B8860B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent; 
          text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); 
        }

        .input-field {
          background-color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.1);
          color: #003323;
          padding: 0.75rem 1.5rem;
          border-radius: 9999px; 
          width: 100%;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
          font-size: 1.125rem;
          outline: none;
          transition: all 0.2s;
        }

        .input-field::placeholder {
          color: rgba(0, 0, 0, 0.4);
          font-style: italic;
        }
        
        .input-field:focus {
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.5);
        }

        .btn-login {
          background-color: #003323;
          border: 2px solid #FFD700;
          color: #FFD700;
          padding: 0.75rem 3rem; 
          border-radius: 9999px; 
          transition: all 0.2s ease-in-out;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); 
          font-size: 1.25rem;
          font-weight: 600; 
          letter-spacing: 0.05em;
          cursor: pointer;
        }
        
        .btn-login:hover:not(:disabled) {
          background-color: #0d5a44; 
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 0 15px rgba(255, 215, 0, 0.6);
        }

        .btn-login:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <div className="landing-bg min-h-screen flex flex-col items-center justify-center p-4">
        <div className="mb-16 md:mb-24 text-center">
          <h1 className="meridian-script">Meridian</h1>
          <p className="text-yellow-300 text-sm md:text-base italic mt-1 tracking-widest opacity-90" style={{ fontFamily: 'Lora, serif' }}>
            "Where cuisine meets class"
          </p>
          <p className="text-yellow-300 text-lg font-semibold mt-4 capitalize">
            {role} Login
          </p>
        </div>

        <div className="w-full max-w-sm">
          {(localError || error) && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {localError || error}
            </div>
          )}

          <div className="flex flex-col space-y-5">
            <input 
              type="text" 
              className="input-field" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
            
            <input 
              type="password" 
              className="input-field" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            
            <button 
              onClick={handleSubmit}
              disabled={isLoading || !username || !password}
              className="btn-login mt-6 self-center w-48"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;