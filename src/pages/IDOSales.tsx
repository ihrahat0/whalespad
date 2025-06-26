import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

// Types
interface IDOProject {
  id: string;
  name: string;
  symbol: string;
  description: string;
  status: 'live' | 'upcoming' | 'ended';
  price: string;
  hardCap: string;
  raised: string;
  progress: number;
  participants: number;
  startDate: string;
  endDate: string;
  chain: string;
  category: string;
  logo: string;
  rating: number;
}

const IDOSales: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'live' | 'upcoming' | 'ended'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Demo IDO projects data
  const idoProjects: IDOProject[] = [
    {
      id: '1',
      name: 'WhalesPad Token',
      symbol: 'WPT',
      description: 'Native token of WhalesPad ecosystem for decentralized fundraising',
      status: 'live',
      price: '$0.05',
      hardCap: '$500,000',
      raised: '$325,000',
      progress: 65,
      participants: 1250,
      startDate: '2024-02-01',
      endDate: '2024-02-15',
      chain: 'Ethereum',
      category: 'DeFi',
      logo: '/images/logo/logo.png',
      rating: 9.5
    },
    {
      id: '2',
      name: 'CryptoGaming Hub',
      symbol: 'CGH',
      description: 'Revolutionary gaming platform with NFTs and DeFi integration',
      status: 'upcoming',
      price: '$0.08',
      hardCap: '$800,000',
      raised: '$0',
      progress: 0,
      participants: 0,
      startDate: '2024-02-20',
      endDate: '2024-03-05',
      chain: 'BSC',
      category: 'GameFi',
      logo: '/images/logo/logo.png',
      rating: 9.2
    },
    {
      id: '3',
      name: 'DeFi Yield Farm',
      symbol: 'DYF',
      description: 'High-yield farming protocol with sustainable rewards',
      status: 'ended',
      price: '$0.12',
      hardCap: '$600,000',
      raised: '$600,000',
      progress: 100,
      participants: 2100,
      startDate: '2024-01-10',
      endDate: '2024-01-25',
      chain: 'Polygon',
      category: 'DeFi',
      logo: '/images/logo/logo.png',
      rating: 8.8
    },
    {
      id: '4',
      name: 'NFT Marketplace Pro',
      symbol: 'NFTP',
      description: 'Next-generation NFT marketplace with advanced features',
      status: 'live',
      price: '$0.06',
      hardCap: '$400,000',
      raised: '$180,000',
      progress: 45,
      participants: 890,
      startDate: '2024-02-05',
      endDate: '2024-02-20',
      chain: 'Arbitrum',
      category: 'NFT',
      logo: '/images/logo/logo.png',
      rating: 9.0
    },
    {
      id: '5',
      name: 'AI Trading Bot',
      symbol: 'AIB',
      description: 'Automated AI-powered trading solutions for crypto markets',
      status: 'upcoming',
      price: '$0.15',
      hardCap: '$1,000,000',
      raised: '$0',
      progress: 0,
      participants: 0,
      startDate: '2024-03-01',
      endDate: '2024-03-15',
      chain: 'Ethereum',
      category: 'AI',
      logo: '/images/logo/logo.png',
      rating: 9.7
    }
  ];

  const filteredProjects = idoProjects.filter(project => {
    const matchesFilter = selectedFilter === 'all' || project.status === selectedFilter;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-500 text-white';
      case 'upcoming': return 'bg-yellow-500 text-black';
      case 'ended': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-cyan-500';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navigation />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Join IDO
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover and participate in Initial DEX Offerings. Find live, upcoming, and completed IDO projects.
            </p>
          </motion.div>
            
          {/* Filter and Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search IDO projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Status Filters */}
              <div className="flex gap-2">
                {['all', 'live', 'upcoming', 'ended'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter as any)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${
                      selectedFilter === filter
                        ? 'bg-cyan-500 text-black'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700'
                    }`}
                  >
                    {filter === 'all' ? 'All' : filter}
                  </button>
                  ))}
              </div>
              </div>
          </motion.div>

          {/* IDO Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden"
          >
            {/* Table Header */}
            <div className="bg-gray-800/50 px-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-7 gap-4 text-sm font-semibold text-gray-400 uppercase tracking-wide">
                <div className="col-span-2">Project</div>
                <div className="hidden md:block">Status</div>
                <div className="hidden md:block">Price</div>
                <div className="hidden md:block">Progress</div>
                <div className="hidden md:block">Participants</div>
                <div className="text-right">Action</div>
              </div>
              </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-800">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="px-6 py-4 hover:bg-gray-800/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <div className="grid grid-cols-2 md:grid-cols-7 gap-4 items-center">
                    {/* Project Info */}
                    <div className="col-span-2 flex items-center gap-4">
                      <img
                        src={project.logo}
                        alt={project.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-white text-lg">{project.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400 font-semibold">{project.symbol}</span>
                          <span className="text-xs text-gray-500">{project.chain}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{project.category}</span>
            </div>
          </div>
        </div>

                    {/* Status */}
                    <div className="hidden md:block">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                        {project.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="hidden md:block">
                      <span className="text-white font-semibold">{project.price}</span>
                    </div>

                    {/* Progress */}
                    <div className="hidden md:block">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {project.raised} / {project.hardCap}
                        </div>
                      </div>
                        </div>

                    {/* Participants */}
                    <div className="hidden md:block text-center">
                      <div className="text-white font-semibold">{project.participants.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">participants</div>
                      </div>

                    {/* Action */}
                    <div className="text-right">
                      <button
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                          project.status === 'live'
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : project.status === 'upcoming'
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                            : 'bg-gray-600 hover:bg-gray-700 text-white'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/project/${project.id}`);
                        }}
                      >
                        {project.status === 'live' ? 'Join' : 
                         project.status === 'upcoming' ? 'Notify' : 'View'}
                      </button>
                          </div>
                        </div>

                  {/* Mobile Progress Bar */}
                  <div className="md:hidden mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Progress: {project.progress}%</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(project.status)}`}>
                        {project.status.toUpperCase()}
                      </span>
                          </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                        style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{project.raised} / {project.hardCap}</span>
                      <span>{project.participants.toLocaleString()} participants</span>
                        </div>
                      </div>
                </motion.div>
              ))}
                      </div>
                    </motion.div>

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-300 mb-2">No IDO projects found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
            </motion.div>
          )}

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {idoProjects.filter(p => p.status === 'live').length}
              </div>
              <div className="text-gray-400">Live IDOs</div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {idoProjects.filter(p => p.status === 'upcoming').length}
              </div>
              <div className="text-gray-400">Upcoming IDOs</div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">
                {idoProjects.reduce((acc, p) => acc + p.participants, 0).toLocaleString()}
              </div>
              <div className="text-gray-400">Total Participants</div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                ${idoProjects.reduce((acc, p) => acc + parseInt(p.raised.replace(/[^0-9]/g, '')), 0).toLocaleString()}
              </div>
              <div className="text-gray-400">Total Raised</div>
          </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default IDOSales; 