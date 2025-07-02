import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamMember {
  name: string;
  bio: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Founder : D. Islam',
    bio: 'Founder : D. Islam',
    image: '/images/team1.png'
  },
  {
    name: 'Co-founder : Mr. Nassir',
    bio: 'Co-founder : Mr. Nassir',
    image: '/images/team2.png'
  },
  {
    name: 'CEO & Dev : Lokman Hosen',
    bio: 'CEO & Dev : Lokman Hosen',
    image: '/images/team4.png'
  },
  {
    name: 'CTO & BD : Mr. ABK',
    bio: 'CTO & BD : Mr. ABK',
    image: '/images/team5.png'
  },
  {
    name: 'CMO : Noah Alfred',
    bio: 'CMO : Noah Alfred',
    image: '/images/team1.png'
  },
  {
    name: 'Launchpad Director : M. Rahman',
    bio: 'Launchpad Director : M. Rahman',
    image: '/images/team3.png'
  },
  {
    name: 'MARKETING : STELLA',
    bio: 'Launchpad Director with comprehensive experience in project evaluation, due diligence, and launch strategies. Stella has overseen the successful launch of over 50 projects on various launchpad platforms.',
    image: '/images/team7.png'
  },
  {
    name: 'launchpad director: Mr : Samiul',
    bio: 'Launchpad Director with comprehensive experience in project evaluation, due diligence, and launch strategies. Stella has overseen the successful launch of over 50 projects on various launchpad platforms.',
    image: '/images/team8.png'
  }
];

// Individual team member card component
const TeamCard = ({ member, isExpanded, onToggleExpand }: { 
  member: TeamMember; 
  isExpanded: boolean; 
  onToggleExpand: () => void; 
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex-shrink-0 w-full max-w-sm mx-auto">
      {/* Image container */}
      <div className="relative mb-4">
        <div className="relative w-full h-64 overflow-hidden bg-gray-800" style={{ borderRadius: '13px' }}>
          {!imageError ? (
            <img 
              src={member.image} 
              alt={member.name} 
              className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
              onError={(e) => {
                console.log(`Failed to load image: ${member.image}`);
                setImageError(true);
              }}
              onLoad={() => {
                console.log(`Successfully loaded image: ${member.image}`);
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-300">
                {member.name.split(' ').map(part => part[0]).join('')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Name and Bio container */}
      <div
        className="bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 cursor-pointer hover:border-gray-600/70 transition-all duration-300"
        onClick={onToggleExpand}
      >
        {/* Name */}
        <h3 className="text-white text-lg font-semibold mb-3 text-center tracking-wide">
          {member.name}
        </h3>

        {/* Bio */}
        <AnimatePresence>
          {isExpanded ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                {member.bio}
              </p>
              <div className="flex justify-center">
                <button className="text-blue-400 text-xs font-medium hover:text-blue-300 transition-colors">
                  -
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="text-center">
              <button className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
                +
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const TeamProfiles: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  
  const cardsPerView = 4;
  const totalSlides = Math.ceil(teamMembers.length / cardsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setExpandedCards(new Set());
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setExpandedCards(new Set());
  };

  const toggleExpand = (memberIndex: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memberIndex)) {
        newSet.delete(memberIndex);
      } else {
        newSet.add(memberIndex);
      }
      return newSet;
    });
  };

  const getCurrentMembers = () => {
    const startIndex = currentIndex * cardsPerView;
    return teamMembers.slice(startIndex, startIndex + cardsPerView);
  };

  return (
    <div className="relative bg-black text-white py-16 md:py-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Meet the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              WhalesPad
            </span>
            {' '}Team
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            The visionary minds building the future of decentralized fundraising
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-full p-3 hover:bg-gray-700/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex === totalSlides - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-full p-3 hover:bg-gray-700/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel content */}
          <div className="overflow-hidden mx-8">
            <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {getCurrentMembers().map((member, index) => {
                const globalIndex = currentIndex * cardsPerView + index;
                return (
                    <motion.div
                      key={`${currentIndex}-${index}`}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.1,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      whileHover={{ 
                        y: -10, 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                    >
                  <TeamCard
                    member={member}
                    isExpanded={expandedCards.has(globalIndex)}
                    onToggleExpand={() => toggleExpand(globalIndex)}
                  />
                    </motion.div>
                );
              })}
            </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Indicators */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mt-12 space-x-3"
        >
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setExpandedCards(new Set());
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-blue-400 scale-125' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </motion.div>

        {/* Counter */}
        <div className="text-center mt-4 text-gray-400 text-sm">
          {currentIndex + 1} / {totalSlides}
        </div>
      </div>
    </div>
  );
};

export default TeamProfiles; 