import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ConnectWalletButton } from '../components/ConnectWalletButton';
import Navigation from '../components/Navigation';

import { 
  FiSend, 
  FiInfo, 
  FiGlobe, 
  FiLink, 
  FiShield, 
  FiFileText, 
  FiMail, 
  FiCheck,
  FiAlertCircle,
  FiArrowLeft,
  FiExternalLink
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

type FormData = {
  projectName: string;
  tokenSymbol: string;
  tokenAddress: string;
  chainId: string;
  website: string;
  whitepaper: string;
  telegram: string;
  twitter: string;
  discord: string;
  github: string;
  description: string;
  email: string;
  hasKyc: boolean;
  kycLink: string;
  hasAudit: boolean;
  auditLink: string;
  logoUrl: string;
  bannerUrl: string;
};

const SubmitProject: React.FC = () => {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [hasKyc, setHasKyc] = useState(false);
  const [hasAudit, setHasAudit] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<FormData>();

  const watchHasKyc = watch('hasKyc');
  const watchHasAudit = watch('hasAudit');
  
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!isConnected || !address) {
      setSubmitError('Please connect your wallet before submitting');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Ensure required fields have values
      const safeProjectName = data.projectName?.trim() || 'Untitled Project';
      const safeTokenSymbol = data.tokenSymbol?.trim() || 'TKN';
      const safeEmail = data.email?.trim() || 'no-email@example.com';
      const safeDescription = data.description?.trim() || 'No description provided';
      
      const projectData = {
        project_name: safeProjectName,
        token_symbol: safeTokenSymbol,
        token_address: data.tokenAddress?.trim() || null,
        chain_id: data.chainId ? parseInt(data.chainId) : 1,
        website: data.website?.trim() || null,
        whitepaper: data.whitepaper?.trim() || null,
        telegram: data.telegram?.trim() || null,
        twitter: data.twitter?.trim() || null,
        discord: data.discord?.trim() || null,
        github: data.github?.trim() || null,
        description: safeDescription,
        email: safeEmail,
        wallet_address: address || 'No wallet connected',
        has_kyc: data.hasKyc || false,
        kyc_link: data.hasKyc && data.kycLink ? data.kycLink.trim() : null,
        has_audit: data.hasAudit || false,
        audit_link: data.hasAudit && data.auditLink ? data.auditLink.trim() : null,
        logo_url: data.logoUrl?.trim() || null,
        banner_url: data.bannerUrl?.trim() || null,
        slug: safeProjectName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        status: 'pending',
        submitted_at: new Date().toISOString()
      };

      console.log('Submitting project data:', projectData);

      const { data: result, error } = await supabase
        .from('project_submissions')
        .insert([projectData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      console.log('Project submitted successfully:', result);

      setSubmitSuccess(true);
      reset();
      
      // Redirect to homepage after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitError(`Failed to submit project: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-blue-900/10 relative overflow-hidden">
      <Navigation />

      
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '30s' }} />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16" style={{ paddingTop: '100px' }}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
              Submit Your Project
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Join the future of decentralized finance. Submit your project for review and launch your IDO with us.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-4 text-sm text-gray-400 px-4">
              <div className="flex items-center space-x-2">
                <FiCheck className="w-4 h-4 text-green-400" />
                <span>24-48h Review</span>
                </div>
              <div className="flex items-center space-x-2">
                <FiCheck className="w-4 h-4 text-green-400" />
                <span>97% Success Rate</span>
                </div>
              <div className="flex items-center space-x-2">
                <FiCheck className="w-4 h-4 text-green-400" />
                <span>Expert Support</span>
              </div>
            </div>
          </motion.div>

          {/* Wallet Connection Requirement */}
          {!isConnected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800/50 border border-cyan-500/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 text-center backdrop-blur-sm mx-2 sm:mx-0"
            >
              <FiAlertCircle className="w-10 sm:w-12 h-10 sm:h-12 text-cyan-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Wallet Connection Required</h3>
              <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base px-2">
                Please connect your wallet to submit your project for review.
              </p>
              <ConnectWalletButton />
            </motion.div>
          )}

          {/* Success Message */}
          {submitSuccess && (
              <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/20 border border-green-500/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 text-center backdrop-blur-sm mx-2 sm:mx-0"
            >
              <FiCheck className="w-10 sm:w-12 h-10 sm:h-12 text-green-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Project Submitted Successfully!</h3>
              <p className="text-gray-300 mb-4 text-sm sm:text-base px-2">
                Thank you for submitting your project. Our team will review it within 24-48 hours and contact you via email.
              </p>
              <p className="text-sm text-gray-400">
                Redirecting to homepage in 3 seconds...
              </p>
              </motion.div>
          )}

          {/* Error Message */}
          {submitError && (
              <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/20 border border-red-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 backdrop-blur-sm mx-2 sm:mx-0"
            >
              <div className="flex items-center space-x-3">
                <FiAlertCircle className="w-5 sm:w-6 h-5 sm:h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-400 text-sm sm:text-base">Submission Error</h4>
                  <p className="text-red-300 text-xs sm:text-sm">{submitError}</p>
                </div>
                </div>
            </motion.div>
          )}

          {/* Submission Form */}
          {isConnected && !submitSuccess && (
            <motion.form 
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 sm:space-y-8 mx-2 sm:mx-0"
            >
              {/* Basic Project Information */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                className="bg-slate-800/30 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm space-y-4 sm:space-y-6"
                >
                  <div className="flex items-center space-x-3 pb-3 sm:pb-4 border-b border-white/10">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <FiInfo className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Basic Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">
                      Project Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                      className="w-full bg-slate-700/50 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      placeholder="e.g. QuantumChain Protocol"
                        {...register('projectName', { required: 'Project name is required' })}
                      />
                      {errors.projectName && (
                      <p className="text-red-400 text-xs sm:text-sm">{errors.projectName.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">
                      Token Symbol <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                      className="w-full bg-slate-700/50 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      placeholder="e.g. QCP"
                        {...register('tokenSymbol', { required: 'Token symbol is required' })}
                      />
                      {errors.tokenSymbol && (
                      <p className="text-red-400 text-xs sm:text-sm">{errors.tokenSymbol.message}</p>
                      )}
                    </div>
                  </div>
                  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">
                      Token Contract Address
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-700/50 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      placeholder="0x..."
                      {...register('tokenAddress')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">
                      Chain ID
                    </label>
                    <select
                      className="w-full bg-slate-700/50 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      {...register('chainId')}
                    >
                      <option value="1">Ethereum (1)</option>
                      <option value="56">BSC (56)</option>
                      <option value="137">Polygon (137)</option>
                      <option value="42161">Arbitrum (42161)</option>
                      <option value="10">Optimism (10)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">
                    Project Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-slate-700/50 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200 text-sm sm:text-base resize-none"
                    placeholder="Describe your project, its goals, and what makes it unique..."
                    {...register('description', { required: 'Project description is required' })}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-xs sm:text-sm">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">
                    Contact Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full bg-slate-700/50 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    placeholder="contact@yourproject.com"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/,
                        message: 'Please enter a valid email'
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs sm:text-sm">{errors.email.message}</p>
                    )}
                  </div>
                </motion.div>

              {/* Links & Resources */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                className="bg-slate-800/30 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm space-y-4 sm:space-y-6"
                >
                  <div className="flex items-center space-x-3 pb-3 sm:pb-4 border-b border-white/10">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <FiGlobe className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                    </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Links & Resources</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">
                      Website URL
                      </label>
                      <input
                        type="url"
                        className="w-full bg-slate-700/50 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                        placeholder="https://yourproject.com"
                        {...register('website')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">
                      Whitepaper URL
                      </label>
                      <input
                        type="url"
                        className="w-full bg-slate-700/50 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      placeholder="https://yourproject.com/whitepaper.pdf"
                        {...register('whitepaper')}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">
                      Telegram
                    </label>
                      <input
                      type="url"
                        className="w-full bg-slate-700/50 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      placeholder="https://t.me/yourproject"
                        {...register('telegram')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">
                      Twitter
                    </label>
                      <input
                      type="url"
                        className="w-full bg-slate-700/50 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      placeholder="https://twitter.com/yourproject"
                        {...register('twitter')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">
                      Discord
                    </label>
                      <input
                      type="url"
                        className="w-full bg-slate-700/50 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      placeholder="https://discord.gg/yourproject"
                        {...register('discord')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">
                      GitHub
                    </label>
                      <input
                      type="url"
                        className="w-full bg-slate-700/50 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      placeholder="https://github.com/yourproject"
                        {...register('github')}
                      />
                    </div>
                  </div>
                </motion.div>

              {/* Visual Assets */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-slate-800/30 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm space-y-4 sm:space-y-6"
              >
                <div className="flex items-center space-x-3 pb-3 sm:pb-4 border-b border-white/10">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <FiFileText className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Visual Assets</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      className="w-full bg-slate-700/50 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      placeholder="https://yourproject.com/logo.png"
                      {...register('logoUrl')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">
                      Banner URL
                    </label>
                    <input
                      type="url"
                      className="w-full bg-slate-700/50 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      placeholder="https://yourproject.com/banner.jpg"
                      {...register('bannerUrl')}
                    />
                  </div>
                </div>
              </motion.div>

                {/* Compliance & Security Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                className="bg-slate-800/30 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm space-y-4 sm:space-y-6"
                >
                  <div className="flex items-center space-x-3 pb-3 sm:pb-4 border-b border-white/10">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <FiShield className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Compliance & Security</h3>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-slate-700/30 border border-white/10 rounded-lg sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <input
                          type="checkbox"
                          id="hasKyc"
                          className="w-4 sm:w-5 h-4 sm:h-5 bg-slate-700 border-2 border-white/20 rounded focus:ring-2 focus:ring-cyan-500/50 text-cyan-500"
                          {...register('hasKyc')}
                          onChange={(e) => setHasKyc(e.target.checked)}
                        />
                      <label htmlFor="hasKyc" className="text-white font-medium text-sm sm:text-base">
                        KYC Completed
                        </label>
                      </div>
                      
                      {(watchHasKyc || hasKyc) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2"
                        >
                        <label className="text-sm font-semibold text-gray-300">
                          KYC Report URL
                        </label>
                          <input
                            type="url"
                            className="w-full bg-slate-700/50 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                          placeholder="https://kycreport.com/yourproject"
                            {...register('kycLink')}
                          />
                        </motion.div>
                      )}
                    </div>

                    <div className="bg-slate-700/30 border border-white/10 rounded-lg sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <input
                          type="checkbox"
                          id="hasAudit"
                          className="w-4 sm:w-5 h-4 sm:h-5 bg-slate-700 border-2 border-white/20 rounded focus:ring-2 focus:ring-cyan-500/50 text-cyan-500"
                          {...register('hasAudit')}
                          onChange={(e) => setHasAudit(e.target.checked)}
                        />
                      <label htmlFor="hasAudit" className="text-white font-medium text-sm sm:text-base">
                        Smart Contract Audit Completed
                        </label>
                      </div>
                      
                      {(watchHasAudit || hasAudit) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2"
                        >
                        <label className="text-sm font-semibold text-gray-300">
                          Audit Report URL
                        </label>
                          <input
                            type="url"
                            className="w-full bg-slate-700/50 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                          placeholder="https://auditreport.com/yourproject"
                            {...register('auditLink')}
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>

              {/* Submit Button */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                className="text-center"
                >
                  <button
                    type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 sm:space-x-3 mx-auto text-sm sm:text-base"
                  >
                      {isSubmitting ? (
                        <>
                      <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                      <FiSend className="w-4 sm:w-5 h-4 sm:h-5" />
                      <span>Submit Project</span>
                        </>
                      )}
                </button>
                
                <p className="text-gray-400 text-xs sm:text-sm mt-3 sm:mt-4 max-w-md mx-auto px-4">
                  By submitting your project, you agree to our terms of service and confirm that all provided information is accurate.
                </p>
                </motion.div>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitProject; 