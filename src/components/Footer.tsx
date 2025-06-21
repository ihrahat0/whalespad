import React from 'react';
import { motion } from 'framer-motion';

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
        { name: 'Stats', href: '#stats' },
        { name: 'Giveaways', href: '#giveaways' },
        { name: 'DAO', href: '#dao' }
      ]
    },
    {
      title: 'Learn',
      links: [
        { name: 'Introduction & Overview', href: '#overview' },
        { name: 'Tier System & Staking', href: '/staking' },
        { name: 'Frequently Asked Questions', href: '#faq' },
        { name: 'WhalesPad Incubation Program', href: '#incubation' },
        { name: 'Documentation Page', href: '#docs' },
        { name: 'IDO Launchpad Basics for Beginners', href: '#basics' }
      ]
    },
    {
      title: 'Products',
      links: [
        { name: 'WhalesPad (Main Website)', href: '/' },
        { name: 'WhalesPad NFT Generator', href: '#nft' },
        { name: 'CryptoGuard', href: '#cryptoguard' },
        { name: 'Crypto AI Hub', href: '#ai-hub' }
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
                <span className="footer-logo-icon">🐋</span>
                <span className="footer-logo-text">WhalesPad</span>
              </div>
              <p className="footer-description">
                WhalesPad, a cutting-edge launchpad and DeFi platform powered by WhalesPad.
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