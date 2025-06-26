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
          .from('project_submissions')
          .select(`
            project_name,
            ido_pools!inner(
              created_at
            )
          `)
          .eq('status', 'approved')
          .order('created_at', { foreignTable: 'ido_pools', ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching trending projects:', error);
          setTrendingProjects([]);
        } else if (data) {
          const projects = data
            .map((item: any) => item.project_name)
            .filter(Boolean);
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

  const extendedTrendingText = [...trendingProjects, ...trendingProjects]
    .map((name, index) => `#${String(index % trendingProjects.length + 1).padStart(2, '0')} ${name}`)
    .join(' \u00A0\u00A0•\u00A0\u00A0 ');

  return (
    <div className="trending-coins-banner">
      <div className="trending-coins-marquee">
        {loading ? (
          <span>Loading trending coins...</span>
        ) : trendingProjects.length > 0 ? (
          <span>{extendedTrendingText}</span>
        ) : (
          <span>No trending projects at the moment.</span>
        )}
      </div>
    </div>
  );
};

export default TrendingCoins; 