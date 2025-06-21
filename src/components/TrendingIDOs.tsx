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
        return;
      }

      // Map to trending items with predefined colors
      const colors = ['#FF1493', '#FF69B4', '#FF1493', '#FFA500', '#FF69B4', '#00CED1', 
                      '#FF1493', '#FF6347', '#FF69B4', '#87CEEB', '#FF1493', '#FFD700'];
      
      const items = data?.map((project, index) => ({
        rank: index + 1,
        symbol: project.token_symbol || 'TOKEN',
        name: project.project_name || 'Unknown',
        color: colors[index % colors.length],
        projectId: project.id
      })) || [];

      setTrendingItems(items);
    } catch (error) {
      console.error('Error fetching trending projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

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
        <span className="trending-label">Trending</span>
        <div className="trending-items">
                     {trendingItems.map((item) => (
             <motion.span 
               key={item.rank}
               className="trending-item"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3, delay: item.rank * 0.05 }}
               onClick={() => handleItemClick(item.projectId)}
             >
               <span className="trending-rank">#{item.rank}</span>
               <span className="trending-symbol" style={{ color: item.color }}>
                 {item.symbol}
               </span>
             </motion.span>
           ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingIDOs; 