import React, { useState } from 'react';

const PaymentMethod = ({ total, onBack, onSelectPayment }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // Form states for different payment methods
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [cashDetails, setCashDetails] = useState({
    amountReceived: ''
  });
  
  const [eWalletDetails, setEWalletDetails] = useState({
    phoneNumber: '',
    accountName: ''
  });

  const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: '💵', color: 'text-green-600' },
    { id: 'paypal', name: 'Paypal', icon: 'P', color: 'text-blue-600' },
    { id: 'gcash', name: 'GCash', icon: 'G', color: 'text-cyan-600' },
    { id: 'card', name: 'Credit/Debit Cards', icon: '💳', color: 'text-red-500' },
  ];

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setShowForm(true);
  };

  const handleSubmitPayment = () => {
    let paymentData = {
      method: selectedMethod,
      total: total
    };

    // Add method-specific data
    if (selectedMethod === 'card') {
      paymentData = { ...paymentData, ...cardDetails };
    } else if (selectedMethod === 'cash') {
      paymentData = { ...paymentData, ...cashDetails };
    } else if (selectedMethod === 'gcash' || selectedMethod === 'paypal') {
      paymentData = { ...paymentData, ...eWalletDetails };
    }

    onSelectPayment?.(paymentData);
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const calculateChange = () => {
    const received = parseFloat(cashDetails.amountReceived) || 0;
    const change = received - total;
    return change >= 0 ? change.toFixed(2) : '0.00';
  };

  const isFormValid = () => {
    if (selectedMethod === 'cash') {
      return cashDetails.amountReceived && parseFloat(cashDetails.amountReceived) >= total;
    } else if (selectedMethod === 'card') {
      return cardDetails.cardNumber && cardDetails.cardHolder && cardDetails.expiryDate && cardDetails.cvv;
    } else if (selectedMethod === 'gcash' || selectedMethod === 'paypal') {
      return eWalletDetails.phoneNumber && eWalletDetails.accountName;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] pb-24">
      <style>{`
        :root {
          --color-primary-green: #003323;
          --color-secondary-green: #0d5a44;
          --color-active-bg: #EBB62D;
        }

        .payment-card {
          background-color: white;
          border-radius: 12px;
          padding: 1rem 1.25rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          transition: all 0.1s;
          cursor: pointer;
        }

        .payment-card:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.15);
        }

        .payment-card.selected {
          border: 2px solid var(--color-active-bg);
        }

        .form-slide-in {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        input:focus {
          outline: none;
          border-color: var(--color-active-bg);
          box-shadow: 0 0 0 3px rgba(235, 182, 45, 0.1);
        }
      `}</style>

      <div className="max-w-lg mx-auto p-4">
        <header className="flex items-center justify-between py-4 mb-6">
          <button onClick={showForm ? () => setShowForm(false) : onBack} className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-[#003323]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          
          <h1 className="text-xl font-semibold text-center flex-grow text-[#003323]">
            {showForm ? 'Payment Details' : 'Payment Methods'}
          </h1>
          <div className="w-6 h-6"></div>
        </header>

        <div className="bg-gradient-to-r from-green-500 to-green-400 rounded-xl p-6 flex justify-between items-center mb-8 shadow-md">
          <span className="text-2xl font-bold text-white">Order Total</span>
          <span className="text-3xl font-bold text-white">${total.toFixed(2)}</span>
        </div>

        {!showForm ? (
          <>
            <h2 className="text-lg font-semibold text-[#003323] mb-4">Select Payment Mode</h2>
            
            <div className="space-y-3">
              {paymentMethods.map(method => (
                <div 
                  key={method.id}
                  onClick={() => handleMethodSelect(method.id)}
                  className={`payment-card flex items-center justify-between ${selectedMethod === method.id ? 'selected' : ''}`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">{method.icon}</span>
                    <span className="text-base font-medium text-gray-800">{method.name}</span>
                  </div>
                  
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="form-slide-in space-y-6">
            {/* Cash Payment Form */}
            {selectedMethod === 'cash' && (
              <div className="bg-white rounded-xl p-6 shadow-md space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Cash Payment</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Received *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500 text-lg">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={cashDetails.amountReceived}
                      onChange={(e) => setCashDetails({ ...cashDetails, amountReceived: e.target.value })}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg text-lg"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {cashDetails.amountReceived && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Amount Received:</span>
                      <span className="font-semibold">${parseFloat(cashDetails.amountReceived).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Order Total:</span>
                      <span className="font-semibold">${total.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">Change:</span>
                        <span className="text-2xl font-bold text-green-600">${calculateChange()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Card Payment Form */}
            {selectedMethod === 'card' && (
              <div className="bg-white rounded-xl p-6 shadow-md space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Card Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    maxLength="19"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: formatCardNumber(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cardHolder}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardHolder: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      maxLength="5"
                      value={cardDetails.expiryDate}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: formatExpiryDate(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="MM/YY"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      maxLength="3"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* E-Wallet Payment Form (GCash, PayPal) */}
            {(selectedMethod === 'gcash' || selectedMethod === 'paypal') && (
              <div className="bg-white rounded-xl p-6 shadow-md space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {selectedMethod === 'gcash' ? 'GCash' : 'PayPal'} Details
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {selectedMethod === 'gcash' ? 'Mobile Number' : 'Email Address'} *
                  </label>
                  <input
                    type={selectedMethod === 'gcash' ? 'tel' : 'email'}
                    value={eWalletDetails.phoneNumber}
                    onChange={(e) => setEWalletDetails({ ...eWalletDetails, phoneNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder={selectedMethod === 'gcash' ? '09XX XXX XXXX' : 'email@example.com'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Name *
                  </label>
                  <input
                    type="text"
                    value={eWalletDetails.accountName}
                    onChange={(e) => setEWalletDetails({ ...eWalletDetails, accountName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="Full Name"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-blue-800">
                      A payment request will be sent to your {selectedMethod === 'gcash' ? 'GCash' : 'PayPal'} account. 
                      Please confirm the payment on your mobile device.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto p-4 bg-white border-t">
              <button 
                onClick={handleSubmitPayment}
                disabled={!isFormValid()}
                className="w-full bg-[#EBB62D] text-white py-4 rounded-full text-xl font-semibold hover:bg-[#DDAA1F] transition-colors shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Process Payment - ${total.toFixed(2)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;