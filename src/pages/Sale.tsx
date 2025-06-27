import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

interface PresaleProject {
  id: string;
  name: string;
  symbol: string;
  description: string;
  price: string;
  softCap: string;
  hardCap: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'live' | 'ended';
  progress: number;
  raised: string;
  participants: number;
  image: string;
  website: string;
  twitter: string;
  telegram: string;
}

const Sale: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'live' | 'upcoming' | 'ended'>('all');

  // Demo presale projects
  const presaleProjects: PresaleProject[] = [
    {
      id: '1',
      name: 'WhalesPad Token',
      symbol: 'WPT',
      description: 'The native token of WhalesPad ecosystem. Join the future of decentralized fundraising.',
      price: '$0.05',
      softCap: '100,000',
      hardCap: '500,000',
      startDate: '2024-02-01',
      endDate: '2024-02-15',
      status: 'live',
      progress: 65,
      raised: '325,000',
      participants: 1250,
      image: '/images/logo/logo.png',
      website: 'https://whalespad.com',
      twitter: 'https://twitter.com/whalespad',
      telegram: 'https://t.me/whalespad'
    },
    {
      id: '2',
      name: 'CryptoGaming Hub',
      symbol: 'CGH',
      description: 'Revolutionary gaming platform combining NFTs, DeFi, and immersive gameplay.',
      price: '$0.008',
      softCap: '200,000',
      hardCap: '800,000',
      status: 'upcoming',
      startDate: '2024-02-20',
      endDate: '2024-03-05',
      progress: 0,
      raised: '0',
      participants: 0,
      image: '/images/logo/logo.png',
      website: 'https://cryptogaminghub.com',
      twitter: 'https://twitter.com/cryptogaminghub',
      telegram: 'https://t.me/cryptogaminghub'
    },
    {
      id: '3',
      name: 'DeFi Yield Farm',
      symbol: 'DYF',
      description: 'High-yield farming protocol with innovative tokenomics and sustainable rewards.',
      price: '$0.12',
      softCap: '150,000',
      hardCap: '600,000',
      status: 'ended',
      startDate: '2024-01-10',
      endDate: '2024-01-25',
      progress: 100,
      raised: '600,000',
      participants: 2100,
      image: '/images/logo/logo.png',
      website: 'https://defiyieldfarm.com',
      twitter: 'https://twitter.com/defiyieldfarm',
      telegram: 'https://t.me/defiyieldfarm'
    }
  ];

  const filteredProjects = presaleProjects.filter(project => 
    selectedFilter === 'all' || project.status === selectedFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'upcoming': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'ended': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
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
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Presale Projects
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover and participate in the latest presale opportunities. Get early access to innovative blockchain projects.
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {['all', 'live', 'upcoming', 'ended'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter as any)}
                className={`px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${
                  selectedFilter === filter
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700'
                }`}
              >
                {filter === 'all' ? 'All Projects' : filter}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 group"
              >
                {/* Project Image/Banner */}
                <div className="relative h-48 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 p-6 flex items-center justify-center">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-20 h-20 object-contain"
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                    {project.status.toUpperCase()}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-white">{project.name}</h3>
                    <span className="text-cyan-400 font-semibold">{project.symbol}</span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-500 text-xs">Price</p>
                      <p className="text-white font-semibold">{project.price}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Hard Cap</p>
                      <p className="text-white font-semibold">${project.hardCap}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Raised</p>
                      <p className="text-green-400 font-semibold">${project.raised}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Participants</p>
                      <p className="text-white font-semibold">{project.participants}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {project.status !== 'upcoming' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-cyan-400">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 group-hover:scale-105">
                    {project.status === 'live' ? 'Join Presale' : 
                     project.status === 'upcoming' ? 'Notify Me' : 'View Details'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-400 text-lg">No projects found for the selected filter.</p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sale; 