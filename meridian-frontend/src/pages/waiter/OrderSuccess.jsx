import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        // Navigate back to the main waiter dashboard to start a new order
        navigate('/waiter');
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-8">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Kapakana:wght@400;700&family=Lora:ital,wght@1,400;1,700&display=swap');
            `}</style>

            <div className="max-w-md text-center">
                {/* Success Icon */}
                <div className="inline-flex items-center justify-center w-32 h-32 bg-[#5eb087] rounded-full mb-8 shadow-lg">
                    <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>

                {/* Success Message */}
                <h1 className="text-3xl font-bold text-[#3b5a44] mb-4">
                    Order Placed Successfully!
                </h1>

                <p className="text-base text-gray-600 mb-10 leading-relaxed">
                    The order has been sent directly to the kitchen display system.
                </p>

                {/* Continue Button */}
                <button
                    onClick={handleClick}
                    className="bg-[#FFD700] text-gray-900 font-semibold py-4 px-8 rounded-full w-full transition-all hover:bg-[#EAC117] shadow-md"
                >
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
};

export default OrderSuccess;