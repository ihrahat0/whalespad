import React from 'react';
import { motion } from 'framer-motion';

const Features: React.FC = () => {
  const features = [
    {
      icon: '🔒',
      title: 'Military-Grade Security',
      description: 'Multi-signature wallets, smart contract audits, and institutional-level security protocols protect your investments.',
      highlight: 'Bank-Level',
      color: 'var(--primary-cyan)',
      gradient: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 212, 255, 0.05))'
    },
    {
      icon: '⚡',
      title: 'Lightning-Fast Execution',
      description: 'Execute trades and participate in launches with millisecond precision through our optimized blockchain infrastructure.',
      highlight: '<100ms',
      color: 'var(--accent-gold)',
      gradient: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05))'
    },
    {
      icon: '🎯',
      title: 'Precision Analytics',
      description: 'AI-powered market analysis, risk assessment tools, and real-time project evaluation for informed decisions.',
      highlight: '99.5% Accuracy',
      color: 'var(--primary-green)',
      gradient: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 255, 136, 0.05))'
    },
    {
      icon: '👑',
      title: 'Exclusive Access',
      description: 'VIP allocation tiers, early-bird privileges, and premium project access reserved for qualified investors.',
      highlight: 'Elite Only',
      color: 'var(--accent-purple)',
      gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))'
    },
    {
      icon: '🚀',
      title: 'Launch Acceleration',
      description: 'Comprehensive project incubation, marketing support, and technical assistance for successful token launches.',
      highlight: '10x Growth',
      color: 'var(--accent-orange)',
      gradient: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(255, 107, 53, 0.05))'
    },
    {
      icon: '',
      title: 'Diamond Rewards',
      description: 'Tiered loyalty program with exclusive benefits, reduced fees, and premium perks for active platform users.',
      highlight: 'Up to 90% Off',
      color: 'var(--chrome-light)',
      gradient: 'linear-gradient(135deg, rgba(232, 232, 232, 0.1), rgba(232, 232, 232, 0.05))'
    }
  ];

  return (
    // <section id="features" className="section" style={{ background: 'var(--surface-bg)' }}>
    //   <div className="container">
    //     {/* Section Header */}
    //     <motion.div 
    //       style={{ textAlign: 'center', marginBottom: '5rem' }}
    //       initial={{ opacity: 0, y: 40 }}
    //       whileInView={{ opacity: 1, y: 0 }}
    //       transition={{ duration: 1 }}
    //       viewport={{ once: true }}
    //     >
    //       <motion.div
    //         style={{
    //           display: 'inline-flex',
    //           alignItems: 'center',
    //           gap: '1rem',
    //           padding: '1rem 2rem',
    //           background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 212, 255, 0.05))',
    //           border: '2px solid rgba(0, 212, 255, 0.2)',
    //           borderRadius: '50px',
    //           marginBottom: '2rem'
    //         }}
    //         initial={{ scale: 0.8, opacity: 0 }}
    //         whileInView={{ scale: 1, opacity: 1 }}
    //         transition={{ duration: 0.6, delay: 0.2 }}
    //         viewport={{ once: true }}
    //       >
    //         <span style={{ fontSize: '1.5rem' }}>⚡</span>
    //         <span style={{ 
    //           fontWeight: '700', 
    //           color: 'var(--primary-cyan)',
    //           textTransform: 'uppercase',
    //           letterSpacing: '2px',
    //           fontSize: '1rem'
    //         }}>
    //           Platform Features
    //         </span>
    //       </motion.div>

    //       <motion.h2 
    //         className="heading-2"
    //         style={{ 
    //           marginBottom: '2rem',
    //           background: 'linear-gradient(135deg, var(--chrome-light), var(--primary-cyan), var(--chrome-light))',
    //           WebkitBackgroundClip: 'text',
    //           WebkitTextFillColor: 'transparent',
    //           backgroundSize: '200% 200%'
    //         }}
    //         animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
    //         transition={{ duration: 4, repeat: Infinity }}
    //       >
    //         Why Choose WhalesPad?
    //       </motion.h2>

    //       <motion.p 
    //         className="body-large"
    //         style={{ 
    //           maxWidth: '800px', 
    //           margin: '0 auto',
    //           fontSize: '1.3rem',
    //           lineHeight: '1.8',
    //           color: 'var(--text-secondary)'
    //         }}
    //         initial={{ opacity: 0, y: 20 }}
    //         whileInView={{ opacity: 1, y: 0 }}
    //         transition={{ duration: 0.8, delay: 0.4 }}
    //         viewport={{ once: true }}
    //       >
    //         Experience the most advanced crypto launchpad with institutional-grade infrastructure, 
    //         cutting-edge technology, and <strong style={{ color: 'var(--primary-cyan)' }}>unmatched security</strong>.
    //       </motion.p>
    //     </motion.div>

    //     {/* Features Grid */}
    //     <div className="grid grid-3" style={{ gap: '3rem' }}>
    //       {features.map((feature, index) => (
    //         <motion.div
    //           key={index}
    //           className="card"
    //           style={{
    //             padding: '3rem',
    //             background: feature.gradient,
    //             border: '2px solid',
    //             borderImage: `linear-gradient(135deg, ${feature.color}40, transparent) 1`,
    //             position: 'relative',
    //             overflow: 'hidden'
    //           }}
    //           initial={{ opacity: 0, y: 60 }}
    //           whileInView={{ opacity: 1, y: 0 }}
    //           transition={{ duration: 0.8, delay: index * 0.1 }}
    //           viewport={{ once: true }}
    //           whileHover={{ 
    //             scale: 1.02, 
    //             y: -10,
    //             transition: { duration: 0.3 }
    //           }}
    //         >
    //           {/* Background Pattern */}
    //           <motion.div
    //             style={{
    //               position: 'absolute',
    //               top: '-50%',
    //               right: '-50%',
    //               width: '200%',
    //               height: '200%',
    //               background: `radial-gradient(circle, ${feature.color}20 0%, transparent 70%)`,
    //               borderRadius: '50%',
    //               opacity: 0
    //             }}
    //             whileHover={{ opacity: 1, scale: 1.2 }}
    //             transition={{ duration: 0.6 }}
    //           />

    //           {/* Premium Badge */}
    //           <motion.div
    //             style={{
    //               position: 'absolute',
    //               top: '1.5rem',
    //               right: '1.5rem',
    //               background: `linear-gradient(135deg, ${feature.color}, ${feature.color}80)`,
    //               color: feature.color === 'var(--chrome-light)' ? '#000' : '#000',
    //               padding: '0.5rem 1rem',
    //               borderRadius: '20px',
    //               fontSize: '0.7rem',
    //               fontWeight: '800',
    //               textTransform: 'uppercase',
    //               letterSpacing: '1px',
    //               boxShadow: `0 0 20px ${feature.color}40`
    //             }}
    //             initial={{ scale: 0, rotate: -180 }}
    //             whileInView={{ scale: 1, rotate: 0 }}
    //             transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
    //             viewport={{ once: true }}
    //           >
    //             {feature.highlight}
    //           </motion.div>

    //           {/* Icon */}
    //           <motion.div 
    //             style={{
    //               width: '80px',
    //               height: '80px',
    //               background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}10)`,
    //               borderRadius: '24px',
    //               display: 'flex',
    //               alignItems: 'center',
    //               justifyContent: 'center',
    //               fontSize: '2.5rem',
    //               marginBottom: '2rem',
    //               border: `2px solid ${feature.color}30`,
    //               position: 'relative',
    //               overflow: 'hidden'
    //             }}
    //             whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
    //             transition={{ duration: 0.6 }}
    //           >
    //             <motion.div
    //               style={{
    //                 position: 'absolute',
    //                 inset: 0,
    //                 background: `linear-gradient(45deg, transparent, ${feature.color}20, transparent)`,
    //                 transform: 'translateX(-100%)'
    //               }}
    //               whileHover={{ transform: 'translateX(100%)' }}
    //               transition={{ duration: 0.6 }}
    //             />
    //             <span style={{ position: 'relative', zIndex: 1 }}>{feature.icon}</span>
    //           </motion.div>

    //           {/* Title */}
    //           <motion.h3 
    //             className="heading-3"
    //             style={{ 
    //               fontSize: '1.6rem',
    //               marginBottom: '1.5rem',
    //               background: `linear-gradient(135deg, var(--text-primary), ${feature.color})`,
    //               WebkitBackgroundClip: 'text',
    //               WebkitTextFillColor: 'transparent',
    //               backgroundClip: 'text'
    //             }}
    //             initial={{ opacity: 0, x: -20 }}
    //             whileInView={{ opacity: 1, x: 0 }}
    //             transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
    //             viewport={{ once: true }}
    //           >
    //             {feature.title}
    //           </motion.h3>

    //           {/* Description */}
    //           <motion.p 
    //             className="body-text"
    //             style={{ 
    //               lineHeight: '1.7',
    //               fontSize: '1.1rem',
    //               color: 'var(--text-secondary)',
    //               marginBottom: '2rem'
    //             }}
    //             initial={{ opacity: 0, y: 20 }}
    //             whileInView={{ opacity: 1, y: 0 }}
    //             transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
    //             viewport={{ once: true }}
    //           >
    //             {feature.description}
    //           </motion.p>

    //           {/* Learn More Link */}
    //           <motion.div
    //             style={{
    //               display: 'flex',
    //               alignItems: 'center',
    //               gap: '0.75rem',
    //               color: feature.color,
    //               fontWeight: '600',
    //               fontSize: '1rem',
    //               cursor: 'pointer',
    //               textTransform: 'uppercase',
    //               letterSpacing: '1px'
    //             }}
    //             whileHover={{ x: 5 }}
    //             initial={{ opacity: 0, x: -20 }}
    //             whileInView={{ opacity: 1, x: 0 }}
    //             transition={{ duration: 0.6, delay: index * 0.1 + 0.6 }}
    //             viewport={{ once: true }}
    //           >
    //             <span>Learn More</span>
    //             <motion.span
    //               style={{ fontSize: '1.2rem' }}
    //               animate={{ x: [0, 5, 0] }}
    //               transition={{ duration: 2, repeat: Infinity }}
    //             >
    //               →
    //             </motion.span>
    //           </motion.div>

    //           {/* Hover Glow Effect */}
    //           <motion.div
    //             style={{
    //               position: 'absolute',
    //               inset: -2,
    //               background: `linear-gradient(135deg, ${feature.color}, transparent, ${feature.color})`,
    //               borderRadius: '26px',
    //               opacity: 0,
    //               zIndex: -1,
    //               filter: 'blur(20px)'
    //             }}
    //             whileHover={{ opacity: 0.3 }}
    //             transition={{ duration: 0.4 }}
    //           />
    //         </motion.div>
    //       ))}
    //     </div>

    //     {/* Call to Action */}
    //     <motion.div
    //       style={{
    //         textAlign: 'center',
    //         marginTop: '6rem',
    //         padding: '4rem',
    //         background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(0, 255, 136, 0.05))',
    //         borderRadius: '32px',
    //         border: '2px solid',
    //         borderImage: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(0, 255, 136, 0.3)) 1',
    //         position: 'relative',
    //         overflow: 'hidden'
    //       }}
    //       initial={{ opacity: 0, y: 40 }}
    //       whileInView={{ opacity: 1, y: 0 }}
    //       transition={{ duration: 1, delay: 0.2 }}
    //       viewport={{ once: true }}
    //     >
    //       {/* Animated Background */}
    //       <motion.div
    //         style={{
    //           position: 'absolute',
    //           top: '50%',
    //           left: '50%',
    //           width: '200%',
    //           height: '200%',
    //           background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
    //           borderRadius: '50%',
    //           transform: 'translate(-50%, -50%)'
    //         }}
    //         animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
    //         transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
    //       />

    //       <motion.h3
    //         className="heading-3"
    //         style={{
    //           marginBottom: '2rem',
    //           fontSize: '2.5rem',
    //           background: 'linear-gradient(135deg, var(--primary-cyan), var(--primary-green))',
    //           WebkitBackgroundClip: 'text',
    //           WebkitTextFillColor: 'transparent',
    //           backgroundClip: 'text',
    //           position: 'relative',
    //           zIndex: 1
    //         }}
    //         initial={{ scale: 0.8, opacity: 0 }}
    //         whileInView={{ scale: 1, opacity: 1 }}
    //         transition={{ duration: 0.8, delay: 0.4 }}
    //         viewport={{ once: true }}
    //       >
    //         Ready to Launch Your Project?
    //       </motion.h3>

    //       <motion.p
    //         className="body-large"
    //         style={{
    //           marginBottom: '3rem',
    //           maxWidth: '600px',
    //           margin: '0 auto 3rem',
    //           fontSize: '1.2rem',
    //           color: 'var(--text-secondary)',
    //           position: 'relative',
    //           zIndex: 1
    //         }}
    //         initial={{ opacity: 0, y: 20 }}
    //         whileInView={{ opacity: 1, y: 0 }}
    //         transition={{ duration: 0.8, delay: 0.6 }}
    //         viewport={{ once: true }}
    //       >
    //         Join hundreds of successful projects that have launched on WhalesPad. 
    //         Get access to our premium features and expert guidance.
    //       </motion.p>

    //       <motion.div
    //         style={{ 
    //           display: 'flex', 
    //           gap: '2rem', 
    //           justifyContent: 'center',
    //           flexWrap: 'wrap',
    //           position: 'relative',
    //           zIndex: 1
    //         }}
    //         initial={{ opacity: 0, y: 20 }}
    //         whileInView={{ opacity: 1, y: 0 }}
    //         transition={{ duration: 0.8, delay: 0.8 }}
    //         viewport={{ once: true }}
    //       >
    //         <motion.button
    //           className="btn btn-primary glow-effect"
    //           style={{
    //             padding: '1.5rem 3rem',
    //             fontSize: '1.1rem',
    //             fontWeight: '700'
    //           }}
    //           whileHover={{ scale: 1.05, y: -3 }}
    //           whileTap={{ scale: 0.95 }}
    //         >
    //           🚀 Start Your Launch
    //         </motion.button>
            
    //         <motion.button
    //           className="btn btn-outline"
    //           style={{
    //             padding: '1.5rem 3rem',
    //             fontSize: '1.1rem',
    //             fontWeight: '700'
    //           }}
    //           whileHover={{ scale: 1.05, y: -3 }}
    //           whileTap={{ scale: 0.95 }}
    //         >
    //           📖 View Documentation
    //         </motion.button>
    //       </motion.div>
    //     </motion.div>
    //   </div>
    // </section>
    <div></div>
  );
};

export default Features; 