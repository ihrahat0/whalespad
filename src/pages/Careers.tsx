import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Careers: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const jobOpenings = [
    {
      id: 1,
      title: "Senior Blockchain Developer",
      department: "engineering",
      location: "Remote / Global",
      type: "Full-time",
      experience: "5+ years",
      description: "Build the future of DeFi with cutting-edge smart contract development and blockchain integrations.",
      skills: ["Solidity", "React", "Node.js", "Web3", "DeFi Protocols"],
      status: "urgent"
    },
    {
      id: 2,
      title: "DeFi Security Engineer",
      department: "security",
      location: "Remote / Global",
      type: "Full-time", 
      experience: "4+ years",
      description: "Secure our platform and smart contracts against evolving threats in the DeFi ecosystem.",
      skills: ["Smart Contract Auditing", "Penetration Testing", "Security Analysis", "Cryptography"],
      status: "open"
    },
    {
      id: 3,
      title: "Product Manager - Launchpad",
      department: "product",
      location: "Remote / Global",
      type: "Full-time",
      experience: "3+ years",
      description: "Lead product strategy and roadmap for our IDO launchpad platform and ecosystem.",
      skills: ["Product Strategy", "DeFi Knowledge", "User Research", "Analytics", "Roadmap Planning"],
      status: "open"
    },
    {
      id: 4,
      title: "Community Growth Manager",
      department: "marketing",
      location: "Remote / Global",
      type: "Full-time",
      experience: "3+ years",
      description: "Build and nurture our global community across social platforms and events.",
      skills: ["Community Management", "Social Media", "Content Creation", "Event Planning", "Analytics"],
      status: "open"
    },
    {
      id: 5,
      title: "Full-Stack Engineer",
      department: "engineering",
      location: "Remote / Global",
      type: "Full-time",
      experience: "3+ years",
      description: "Develop and maintain our platform frontend and backend infrastructure.",
      skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS/Cloud"],
      status: "open"
    },
    {
      id: 6,
      title: "UI/UX Designer",
      department: "design",
      location: "Remote / Global", 
      type: "Full-time",
      experience: "3+ years",
      description: "Design intuitive and beautiful user experiences for DeFi applications.",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems", "DeFi UX"],
      status: "open"
    },
    {
      id: 7,
      title: "Business Development Lead",
      department: "business",
      location: "Remote / Global",
      type: "Full-time",
      experience: "4+ years",
      description: "Drive partnerships and strategic alliances in the blockchain and DeFi space.",
      skills: ["Partnership Development", "Negotiation", "DeFi Networks", "Strategic Planning"],
      status: "open"
    },
    {
      id: 8,
      title: "Content Marketing Specialist",
      department: "marketing",
      location: "Remote / Global",
      type: "Contract",
      experience: "2+ years",
      description: "Create compelling content that educates and engages our DeFi community.",
      skills: ["Content Writing", "SEO", "Social Media", "Video Production", "DeFi Knowledge"],
      status: "open"
    }
  ];

  const departments = [
    { id: 'all', name: 'All Departments', icon: '🌟' },
    { id: 'engineering', name: 'Engineering', icon: '⚡' },
    { id: 'security', name: 'Security', icon: '🛡️' },
    { id: 'product', name: 'Product', icon: '🚀' },
    { id: 'design', name: 'Design', icon: '🎨' },
    { id: 'marketing', name: 'Marketing', icon: '📢' },
    { id: 'business', name: 'Business Development', icon: '🤝' }
  ];

  const benefits = [
    {
      icon: "🌍",
      title: "Remote-First Culture",
      description: "Work from anywhere in the world with flexible hours and async collaboration"
    },
    {
      icon: "💰",
      title: "Competitive Compensation",
      description: "Top-tier salaries plus equity and token incentives aligned with our success"
    },
    {
      icon: "🚀",
      title: "Cutting-Edge Projects",
      description: "Work on revolutionary DeFi technology that's shaping the future of finance"
    },
    {
      icon: "📚",
      title: "Learning & Growth",
      description: "Unlimited learning budget, conferences, and professional development opportunities"
    },
    {
      icon: "🏥",
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental health support, and wellness stipends"
    },
    {
      icon: "⚖️",
      title: "Work-Life Balance",
      description: "Flexible PTO, mental health days, and respect for your personal time"
    },
    {
      icon: "🎯",
      title: "Mission-Driven",
      description: "Make a real impact on financial inclusion and decentralization globally"
    },
    {
      icon: "🌟",
      title: "Amazing Team",
      description: "Work with world-class talent from leading tech and blockchain companies"
    }
  ];

  const cultureValues = [
    {
      icon: "🔥",
      title: "Innovation First",
      description: "We constantly push boundaries and embrace new technologies to stay ahead in DeFi"
    },
    {
      icon: "🤝",
      title: "Collaboration",
      description: "We believe the best solutions come from diverse perspectives working together"
    },
    {
      icon: "🌟",
      title: "Excellence",
      description: "We set high standards and deliver exceptional quality in everything we do"
    },
    {
      icon: "🌍",
      title: "Global Impact",
      description: "We're building technology that democratizes finance for people worldwide"
    },
    {
      icon: "💫",
      title: "Transparency",
      description: "We communicate openly, share knowledge freely, and operate with full transparency"
    },
    {
      icon: "⚡",
      title: "Move Fast",
      description: "We make quick decisions, iterate rapidly, and adapt to the fast-paced crypto world"
    }
  ];

  const filteredJobs = selectedDepartment === 'all' 
    ? jobOpenings 
    : jobOpenings.filter(job => job.department === selectedDepartment);

  return (
    <div className="careers-page">
      <Navigation />
      
      {/* Hero Section */}
      <div className="careers-hero">
        <div className="legal-bg-effects">
          <div className="bg-gradient-orb bg-orb-1"></div>
          <div className="bg-gradient-orb bg-orb-2"></div>
          <div className="bg-grid-pattern"></div>
        </div>
        
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="careers-hero-content"
          >
            <h1 className="careers-title">Career a Whales Pad vull</h1>
            <p className="careers-subtitle">
              Build the future of decentralized finance with a world-class team of innovators, 
              engineers, and visionaries from around the globe.
            </p>
            <div className="careers-badge">
              <span className="badge-icon">🚀</span>
              <span>We're Hiring Top Talent</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Culture Section */}
      <div className="culture-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="section-title">Our Culture & Values</h2>
            <div className="culture-grid">
              {cultureValues.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="culture-card"
                  whileHover={{ y: -5 }}
                >
                  <div className="culture-icon">{value.icon}</div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="section-title">Why Join WhalesPad?</h2>
            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="benefit-card"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="benefit-icon">{benefit.icon}</div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Job Openings Section */}
      <div className="jobs-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="section-title">Open Positions</h2>
            
            {/* Department Filter */}
            <div className="department-filter">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  className={`filter-btn ${selectedDepartment === dept.id ? 'active' : ''}`}
                  onClick={() => setSelectedDepartment(dept.id)}
                >
                  <span className="filter-icon">{dept.icon}</span>
                  {dept.name}
                </button>
              ))}
            </div>

            {/* Job Listings */}
            <div className="jobs-grid">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`job-card ${job.status}`}
                  whileHover={{ y: -5 }}
                >
                  <div className="job-header">
                    <h3>{job.title}</h3>
                    <div className={`job-status ${job.status}`}>
                      {job.status === 'urgent' && '🔥 Urgent'}
                      {job.status === 'open' && '✅ Open'}
                    </div>
                  </div>
                  
                  <div className="job-meta">
                    <span className="job-location">📍 {job.location}</span>
                    <span className="job-type">💼 {job.type}</span>
                    <span className="job-experience">⭐ {job.experience}</span>
                  </div>
                  
                  <p className="job-description">{job.description}</p>
                  
                  <div className="job-skills">
                    {job.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                  
                  <div className="job-actions">
                    <button className="job-apply-btn">Apply Now</button>
                    <button className="job-details-btn">View Details</button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="no-jobs">
                <h3>No openings in this department</h3>
                <p>Check back soon or explore other departments!</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Application Process */}
      <div className="process-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="section-title">Our Hiring Process</h2>
            <div className="process-timeline">
              <div className="process-step">
                <div className="step-number">1</div>
                <h3>Application</h3>
                <p>Submit your application with resume and portfolio</p>
              </div>
              <div className="process-step">
                <div className="step-number">2</div>
                <h3>Initial Screen</h3>
                <p>Brief call with our talent team to discuss your background</p>
              </div>
              <div className="process-step">
                <div className="step-number">3</div>
                <h3>Technical Assessment</h3>
                <p>Skills evaluation relevant to the role requirements</p>
              </div>
              <div className="process-step">
                <div className="step-number">4</div>
                <h3>Team Interviews</h3>
                <p>Meet with team members and hiring manager</p>
              </div>
              <div className="process-step">
                <div className="step-number">5</div>
                <h3>Final Interview</h3>
                <p>Culture fit and final discussion with leadership</p>
              </div>
              <div className="process-step">
                <div className="step-number">6</div>
                <h3>Welcome Aboard!</h3>
                <p>Offer, onboarding, and joining the whale pod</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="careers-cta">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="cta-content"
          >
            <h2>Don't See Your Role?</h2>
            <p>
              We're always looking for exceptional talent. If you're passionate about DeFi 
              and want to make an impact, we'd love to hear from you.
            </p>
            <div className="cta-actions">
              <button className="cta-button primary">Send Open Application</button>
              <button className="cta-button secondary">Join Talent Pool</button>
            </div>
            <div className="contact-info">
              <p>contact@whalespad.com</p>
              {/* <p>💼 LinkedIn: /company/whalespad</p> */}
              <p>X: <a href="https://twitter.com/WhalesPadinfo" target="_blank" rel="noopener noreferrer">@WhalesPadinfo</a></p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Careers; 