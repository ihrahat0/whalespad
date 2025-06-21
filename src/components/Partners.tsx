import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import '../Partners.css';

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

const Partners: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Number of partners to show at once (responsive)
  const getPartnersPerView = () => {
    if (typeof window === 'undefined') return 5;
    if (window.innerWidth < 480) return 2;
    if (window.innerWidth < 768) return 3;
    if (window.innerWidth < 1024) return 4;
    return 5;
  };

  const [partnersPerView, setPartnersPerView] = useState(getPartnersPerView());

  useEffect(() => {
    fetchPartners();
    
    const handleResize = () => {
      setPartnersPerView(getPartnersPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (partners.length > partnersPerView && !isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          return nextIndex >= partners.length ? 0 : nextIndex;
        });
      }, 3000); // Change every 3 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [partners.length, partnersPerView, isHovered]);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching partners:', error);
        return;
      }

      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVisiblePartners = () => {
    if (partners.length <= partnersPerView) {
      return partners;
    }

    const visible = [];
    for (let i = 0; i < partnersPerView; i++) {
      const index = (currentIndex + i) % partners.length;
      visible.push(partners[index]);
    }
    return visible;
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      return newIndex < 0 ? partners.length - 1 : newIndex;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= partners.length ? 0 : nextIndex;
    });
  };

  if (loading) {
    return (
      <section className="partners-section-modern">
        <div className="container">
          <div className="partners-loading-modern">
            <div className="loading-spinner-partners"></div>
            <span>Loading partners...</span>
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return null;
  }

  const visiblePartners = getVisiblePartners();

  return (
    <section className="partners-section-modern">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="partners-content-modern"
        >
          <div className="partners-header-modern">
            <motion.h3 
              className="partners-title-modern"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Trusted Partners
            </motion.h3>
            <motion.p 
              className="partners-subtitle-modern"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Working with industry leaders to secure the ecosystem
            </motion.p>
          </div>
          
          <div className="partners-carousel-container">
            {/* Navigation Arrows */}
            {partners.length > partnersPerView && (
              <>
                <button 
                  className="carousel-nav carousel-nav-left"
                  onClick={goToPrevious}
                  aria-label="Previous partners"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <button 
                  className="carousel-nav carousel-nav-right"
                  onClick={goToNext}
                  aria-label="Next partners"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </>
            )}

            {/* Partners Carousel */}
            <div 
              className="partners-carousel"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="partners-track">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    className="partners-slide"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ 
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                  >
                    {visiblePartners.map((partner, index) => (
                      <motion.a
                        key={`${partner.id}-${currentIndex}`}
                        href={partner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="partner-card-modern"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: index * 0.1,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                        whileHover={{ 
                          scale: 1.05, 
                          y: -8,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="partner-card-glow"></div>
                        <div className="partner-logo-wrapper">
                          <img 
                            src={partner.logo_url} 
                            alt={partner.name}
                            className="partner-logo-modern"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder-logo.png';
                            }}
                          />
                        </div>
                        <div className="partner-info-overlay">
                          <span className="partner-name-modern">{partner.name}</span>
                        </div>
                      </motion.a>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Pagination Dots */}
            {partners.length > partnersPerView && (
              <div className="carousel-pagination">
                {Array.from({ length: partners.length }, (_, index) => (
                  <button
                    key={index}
                    className={`pagination-dot ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to partner ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Partners; 