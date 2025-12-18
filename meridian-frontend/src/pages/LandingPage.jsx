import React from 'react';

const MeridianLanding = ({ onSignIn, onGuestAccess }) => {
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

        .font-meridian-tagline {
          font-family: 'Lora', serif; 
          color: #FFD700; 
        }

        .btn-meridian {
          background-color: #003323;
          border: 2px solid #FFD700;
          color: #FFD700;
          padding: 0.75rem 3rem; 
          border-radius: 9999px; 
          transition: all 0.2s ease-in-out;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
          font-size: 1.125rem; 
          font-weight: 600; 
          letter-spacing: 0.05em; 
          cursor: pointer;
        }
        
        .btn-meridian:hover {
          background-color: #0d5a44; 
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 0 15px rgba(255, 215, 0, 0.6);
        }
      `}</style>

      <div className="landing-bg h-screen flex flex-col justify-start items-center p-8">
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          
          <h1 className="meridian-script text-6xl md:text-8xl mb-2 tracking-wider drop-shadow-lg">
            Meridian
          </h1>
          
          <p className="font-meridian-tagline text-sm md:text-base mb-20 tracking-widest drop-shadow-md italic opacity-90">
            "Where cuisine meets class"
          </p>

          <button 
            onClick={onSignIn || (() => alert('Sign In clicked'))}
            className="btn-meridian w-64 mb-6"
          >
            Sign In
          </button>
          
          <button 
            onClick={onGuestAccess || (() => alert('Guest Access clicked'))}
            className="btn-meridian w-64"
          >
            Use As Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeridianLanding;