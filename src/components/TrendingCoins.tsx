import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './TrendingCoins.css';

const TrendingCoins: React.FC = () => {
  const [trendingProjects, setTrendingProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('ido_pools')
          .select('project_submissions(project_name)')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching trending projects:', error);
          setTrendingProjects([]);
        } else if (data) {
          const projects = data.map((item: any) => item.project_submissions?.project_name).filter(Boolean);
          setTrendingProjects(projects);
        }
      } catch (e) {
        console.error('Failed to fetch trending projects:', e);
        setTrendingProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProjects();
  }, []);

  const trendingText = trendingProjects
    .map((name, index) => `#${String(index + 1).padStart(2, '0')} ${name}`)
    .join(' ');

  return (
    <div className="trending-coins-banner">
      <div className="trending-coins-marquee">
        {loading ? (
          <span>Loading trending coins...</span>
        ) : (
          <span>{trendingText}</span>
        )}
      </div>
    </div>
  );
};

export default TrendingCoins; 