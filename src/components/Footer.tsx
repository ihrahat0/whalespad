import React from 'react';
import { motion } from 'framer-motion';
import { MdWaves } from 'react-icons/md';

const Footer: React.FC = () => {
  const socialLinks = [
    { 
      icon: '/images/social/telegram-channel.png', 
      href: 'https://t.me/WhalesPadOfficial', 
      label: 'TG CHANNEL',
      alt: 'T'
    },
    { 
      icon: '/images/social/telegram-channel.png', 
      href: 'https://t.me/WhalesPadChat', 
      label: 'TG CHAT',
      alt: 'T'
    },
    { 
      icon: '/images/social/x-twitter.png', 
      href: 'https://x.com/WhalesPadInfo', 
      label: 'X (Twitter) 2',
      alt: '𝕏'
    },
    { 
      icon: '/images/social/medium.png', 
      href: 'https://medium.com/@whalespadinfo', 
      label: 'Medium',
      alt: 'M'
    },
    { 
      icon: '/images/social/facebook.png', 
      href: 'https://www.facebook.com/whalespadofficial', 
      label: 'Facebook',
      alt: 'F'
    },
    { 
      icon: '/images/social/binance-live.png', 
      href: 'https://www.binance.com/en/live/u/69173772', 
      label: 'Binance Live',
      alt: '📞'
    },
    { 
      icon: '/images/social/youtube.png', 
      href: 'https://www.youtube.com/@whalespad', 
      label: 'YouTube',
      alt: '📺'
    }
  ];

  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Projects', href: '/ido-sales' },
        { name: 'Staking', href: '/staking' },
        { name: 'Airdrop', href: '/airdrop' },
        { name: 'Submit Project', href: '/submit-project' },
        { name: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'Game Plan', href: '/gameplan' },
        { name: 'Security', href: '/security' },
        { name: 'Careers', href: '/careers' },
        { name: 'About Us', href: '#about' },
        { name: 'Contact', href: '#contact' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Disclaimer', href: '/disclaimer' },
        { name: 'Cookie Policy', href: '/cookie-policy' }
      ]
    }
  ];

  return (
    <footer className="whalespad-footer">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Main Footer Content */}
          <div className="footer-main">
            {/* Brand Section */}
            <div className="footer-brand-section">
              <div className="footer-logo">
                <img max-w-20 src="/images/logo/logo.png" alt="WhalesPad" className="footer-logo-image" />
              </div>
              <p className="footer-description">
              WhalesPad is a decentralized launchpad and incubator for Web3 startups in DeFi, AI, GameFi, NFTs, and the Metaverse. By staking $WPT, users get early access to promising project tokens and unique Web3 investment opportunities.
              </p>
              <div className="footer-socials">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="footer-social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <img 
                      src={social.icon} 
                      alt={social.label}
                      width="20"
                      height="20"
                      onError={(e) => {
                        // Fallback to text if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = social.alt;
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links Grid */}
            <div className="footer-links-grid">
              {footerSections.map((section, index) => (
                <div key={index} className="footer-column">
                  <h4 className="footer-column-title">{section.title}</h4>
                  <ul className="footer-column-links">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a href={link.href} className="footer-link">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-bottom-left">
              <p>©2025 All rights reserved by whalespad.org Powered by WhalesPad.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 