import React, { useEffect } from 'react';

const LoadingScreen = ({ onComplete, duration = 2000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete, duration]);

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

        .meridian-gold-text {
          background: linear-gradient(180deg, #FFD700 0%, #B8860B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent; 
        }

        .logo-title {
          font-family: 'Kapakana', serif;
          font-weight: 700; 
          font-size: 10rem; 
          line-height: 0.9;
        }

        .logo-script {
          font-family: 'Lora', cursive;
          font-size: 2.5rem;
          margin-top: -20px;
          font-style: italic;
          color: #FFD700;
        }

        .logo-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background-color: #FFD700;
          top: 50%; 
          transform: translateY(-50%);
        }

        @keyframes loading-progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        
        .loading-bar {
          width: 150px;
          height: 4px;
          background-color: white;
          opacity: 0.7;
          border-radius: 9999px;
          transform-origin: left;
          animation: loading-progress 2s linear forwards;
        }
      `}</style>

      <div className="landing-bg h-screen flex flex-col items-center justify-center p-4">
        <div className="mb-10 relative w-[250px] flex flex-col items-center">
          <span className="logo-title meridian-gold-text">M</span>
          
          <div className="logo-line"></div>

          <span className="absolute top-[15%] left-0 text-3xl text-yellow-300 rotate-[10deg]">🌿</span>
          <span className="absolute top-[15%] right-0 text-3xl text-yellow-300 rotate-[-10deg]">🌿</span>
          
          <span className="logo-script absolute bottom-[-50px]">Meridian</span>
          
          <div className="mt-8 relative w-full flex justify-center pt-10">
            <div className="w-2/3 h-px bg-yellow-300"></div>
            <div className="absolute bottom-[35px] -left-1 w-2 h-2 rounded-full bg-yellow-300"></div>
            <div className="absolute bottom-[35px] -right-1 w-2 h-2 rounded-full bg-yellow-300"></div>
          </div>
        </div>
        
        <div className="mt-12">
          <div className="loading-bar"></div>
        </div>
      </div>
    </div>
  );
};