import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../TrendingIDOs.css';

interface TrendingItem {
  rank: number;
  symbol: string;
  name: string;
  color: string;
  projectId: string;
}

const TrendingIDOs: React.FC = () => {
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrendingProjects();
  }, []);

  const fetchTrendingProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('project_details_view')
        .select('*')
        .in('status', ['approved', 'live'])
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) {
        console.error('Error fetching trending projects:', error);
        // Use fallback trending items
        setTrendingItems(getDefaultTrendingItems());
        setLoading(false);
        return;
      }

      // Map to trending items with predefined colors
      const colors = ['#FF1493', '#00ff88', '#FF6B47', '#FFA500', '#FF69B4', '#00CED1', 
                      '#8B5CF6', '#FF6347', '#00D4FF', '#87CEEB', '#FFD700', '#32CD32'];
      
      const items = data?.map((project, index) => ({
        rank: index + 1,
        symbol: project.token_symbol || `TKN${index + 1}`,
        name: project.project_name || 'Unknown',
        color: colors[index % colors.length],
        projectId: project.id
      })) || getDefaultTrendingItems();

      setTrendingItems(items);
    } catch (error) {
      console.error('Error fetching trending projects:', error);
      setTrendingItems(getDefaultTrendingItems());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultTrendingItems = (): TrendingItem[] => [
    { rank: 1, symbol: 'SOZA', name: 'Soza Protocol', color: '#FF1493', projectId: '1' },
    { rank: 2, symbol: 'QUACK', name: 'QuackChain', color: '#00ff88', projectId: '2' },
    { rank: 3, symbol: 'BUTT', name: 'Butterfly Token', color: '#FF6B47', projectId: '3' },
    { rank: 4, symbol: 'SASDAQ', name: 'Sasdaq Finance', color: '#FFA500', projectId: '4' },
    { rank: 5, symbol: 'ZEXX', name: 'Zexx Protocol', color: '#00CED1', projectId: '5' },
    { rank: 6, symbol: 'POPDROP', name: 'PopDrop Network', color: '#8B5CF6', projectId: '6' },
    { rank: 7, symbol: 'CAP', name: 'Capital Chain', color: '#00D4FF', projectId: '7' },
    { rank: 8, symbol: 'OZA', name: 'Oza Finance', color: '#FFD700', projectId: '8' },
    { rank: 9, symbol: 'WHALE', name: 'Whale Protocol', color: '#FF69B4', projectId: '9' },
    { rank: 10, symbol: 'MOON', name: 'Moon Shot', color: '#32CD32', projectId: '10' }
  ];

  const handleItemClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  // Duplicate items for infinite scrolling effect
  const duplicatedItems = [...trendingItems, ...trendingItems];

  if (loading) {
    return (
      <div className="trending-bar">
        <div className="trending-container">
          <span className="trending-label">Trending</span>
          <div className="trending-items">
            <span style={{ color: '#666' }}>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="trending-bar">
      <div className="trending-container">
        <span className="trending-label">TRENDING</span>
        <div className="trending-items-wrapper">
          <motion.div
            className="trending-items-scroll"
            animate={{ 
              x: [0, -1000] 
            }}
            transition={{ 
              duration: 20, // Faster animation
              ease: "linear",
              repeat: Infinity
            }}
          >
            {duplicatedItems.map((item, index) => (
              <motion.div 
                key={`${item.rank}-${index}`}
               className="trending-item"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: (index % trendingItems.length) * 0.1 }}
               onClick={() => handleItemClick(item.projectId)}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.1)"
                }}
             >
               <span className="trending-rank">#{item.rank}</span>
               <span className="trending-symbol" style={{ color: item.color }}>
                 {item.symbol}
               </span>
              </motion.div>
           ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrendingIDOs; 