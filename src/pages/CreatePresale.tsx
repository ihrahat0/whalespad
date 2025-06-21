import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import TrendingIDOs from '../components/TrendingIDOs';

const CreatePresalePage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const totalSteps = 4;

  const handleNext = () => {
    if (activeStep < totalSteps) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-blue-900/10">
      <Navigation />
      <TrendingIDOs />
      
      <div className="relative z-10 container mx-auto px-6 py-16" style={{ paddingTop: '40px' }}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-xl p-6 shadow-2xl border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Create Your Presale</h2>
            
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium
                      ${activeStep > index + 1 ? 'bg-green-500 text-white' : 
                        activeStep === index + 1 ? 'bg-blue-500 text-white' : 
                        'bg-gray-700 text-gray-400'}`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(activeStep / totalSteps) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-gray-400 text-sm">
                <span>Token Info</span>
                <span>Sale Details</span>
                <span>Distribution</span>
                <span>Finalize</span>
              </div>
            </div>

            {/* Step 1: Token Information */}
            {activeStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Token Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Token Name*</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. WhalesPad Token"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Token Symbol*</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. WPT"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Token Address*</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0x..."
                  />
                  <p className="text-gray-400 text-sm mt-1">Enter the contract address of your token</p>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Token Decimals*</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="18"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Total Supply*</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1000000"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Sale Details */}
            {activeStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Sale Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Presale Rate*</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="How many tokens per ETH/BNB"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Listing Rate*</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tokens per ETH/BNB after listing"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Soft Cap (ETH/BNB)*</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Minimum raise amount"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Hard Cap (ETH/BNB)*</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Maximum raise amount"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Minimum Buy (ETH/BNB)</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Maximum Buy (ETH/BNB)</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="5"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Start Time (UTC)*</label>
                    <input 
                      type="datetime-local" 
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">End Time (UTC)*</label>
                    <input 
                      type="datetime-local" 
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Liquidity Percentage*</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="70"
                  />
                  <p className="text-gray-400 text-sm mt-1">Percentage of raised funds that will be added to liquidity (min 60%)</p>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Liquidity Lockup Time (days)*</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="180"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Distribution & Vesting */}
            {activeStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Distribution & Vesting</h3>
                
                <div>
                  <label className="block text-gray-300 mb-2">Vesting Period (days)</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="30"
                  />
                  <p className="text-gray-400 text-sm mt-1">Set to 0 for no vesting</p>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">First Release Percentage</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="40"
                  />
                  <p className="text-gray-400 text-sm mt-1">Percentage of tokens released immediately after presale</p>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h4 className="text-white font-medium mb-3">Team Tokens</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Team Wallet Address</label>
                      <input 
                        type="text" 
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0x..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Team Token Percentage</label>
                      <input 
                        type="number" 
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="10"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Team Token Lock (days)</label>
                      <input 
                        type="number" 
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="180"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Team Token Vesting</label>
                      <select className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="none">No Vesting</option>
                        <option value="linear">Linear Vesting</option>
                        <option value="monthly">Monthly Release</option>
                        <option value="quarterly">Quarterly Release</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition duration-200 flex items-center justify-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Add Another Allocation</span>
                </button>
              </motion.div>
            )}

            {/* Step 4: Finalize */}
            {activeStep === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Finalize Presale</h3>
                
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h4 className="text-white font-medium mb-3">Project Information</h4>
                  
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Project Name*</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="WhalesPad Project"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Project Description*</label>
                    <textarea 
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                      placeholder="Tell potential investors about your project..."
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Logo URL</label>
                      <input 
                        type="text" 
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Website</label>
                      <input 
                        type="text" 
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h4 className="text-white font-medium mb-3">Social Links</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Twitter</label>
                      <input 
                        type="text" 
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Telegram</label>
                      <input 
                        type="text" 
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://t.me/..."
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Discord</label>
                      <input 
                        type="text" 
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://discord.gg/..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">GitHub</label>
                      <input 
                        type="text" 
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h5 className="text-orange-500 font-medium">Important Notice</h5>
                      <p className="text-orange-200 text-sm mt-1">
                        Creating a presale requires a fee of 2 BNB/ETH. Additionally, 2% of all tokens raised will go to the platform.
                        Make sure you have sufficient funds in your wallet before proceeding.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <input type="checkbox" id="terms" className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500" />
                  <label htmlFor="terms" className="text-gray-300">I agree to the <a href="#" className="text-blue-400 hover:underline">Terms & Conditions</a></label>
                </div>
              </motion.div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrev}
                disabled={activeStep === 1}
                className={`px-6 py-2 rounded-lg font-medium ${
                  activeStep === 1
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Back
              </button>
              
              <button
                onClick={handleNext}
                className={`px-6 py-2 rounded-lg font-medium ${
                  activeStep === totalSteps
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {activeStep === totalSteps ? 'Create Presale' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePresalePage;