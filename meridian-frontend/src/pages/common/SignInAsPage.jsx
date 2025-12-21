import React from 'react';

const SignInAsView = ({ onSelectRole }) => {
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

        .button-style {
          background-color: #003323;
          border: 2px solid #FFD700;
          color: #FFD700;
          transition: all 0.2s ease-in-out;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
          cursor: pointer;
        }

        .button-style:hover {
          background-color: #0d5a44;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 0 15px rgba(255, 215, 0, 0.6);
        }
      `}</style>

      <div className="landing-bg min-h-screen flex flex-col items-center justify-center p-4">
        <div className="mb-16 md:mb-24 text-center">
          <h1 className="meridian-script">Meridian</h1>
          <p className="text-yellow-300 text-sm md:text-base italic mt-1 tracking-widest opacity-90" style={{ fontFamily: 'Lora, serif' }}>
            "Where cuisine meets class"
          </p>
        </div>

        <p className="text-yellow-300 text-xl font-semibold mb-6 tracking-wider drop-shadow-md">
          Sign-in As
        </p>

        <div className="flex flex-col space-y-4 w-full max-w-sm">
          <button 
            onClick={() => onSelectRole('manager')}
            className="button-style w-full py-3 px-6 rounded-full font-semibold text-lg tracking-wider text-center"
          >
            Manager
          </button>
          
          <button 
            onClick={() => onSelectRole('waiter')}
            className="button-style w-full py-3 px-6 rounded-full font-semibold text-lg tracking-wider text-center"
          >
            Waiter
          </button>
          
          <button 
            onClick={() => onSelectRole('cashier')}
            className="button-style w-full py-3 px-6 rounded-full font-semibold text-lg tracking-wider text-center"
          >
            Cashier
          </button>
        </div>
      </div>
    </div>
  );
};
export default SignInAsView;