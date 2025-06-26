import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import Features from './components/Features';
import LaunchpadStats from './components/LaunchpadStats';
import TokenSale from './components/TokenSale';
import Footer from './components/Footer';
import { WalletConnectProvider } from './components/WalletConnectProvider';
import { FloatingConnectWallet } from './components/FloatingConnectWallet';
import CreatePresalePage from './pages/CreatePresale';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import SubmitProject from './pages/SubmitProject';
import TeamProfiles from './components/TeamProfiles';
import BlogList from './pages/BlogList';
import BlogPostDetail from './pages/BlogPostDetail';
import CreateBlogPost from './pages/admin/CreateBlogPost';
import ProjectDetails from './pages/ProjectDetails';
import Partners from './components/Partners';
import PartnersManagement from './pages/admin/PartnersManagement';
import StakingAirdrop from './pages/StakingAirdrop';
import AirDrop from './pages/AirDrop';

import IDOSales from './pages/IDOSales';
import Navigation from './components/Navigation';
import TrendingCoins from './components/TrendingCoins';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Disclaimer from './pages/Disclaimer';
import CookiePolicy from './pages/CookiePolicy';
import GamePlan from './pages/GamePlan';
import Security from './pages/Security';
import Careers from './pages/Careers';

function App() {
  return (
    <WalletConnectProvider>
      <div className="App">
        {/* Global Background Effects */}
        <div className="global-bg-effects">
          <div className="bg-gradient-orb bg-orb-1"></div>
          <div className="bg-gradient-orb bg-orb-2"></div>
          <div className="bg-gradient-orb bg-orb-3"></div>
          <div className="bg-grid-pattern"></div>
          <div className="bg-particles"></div>
        </div>
        
        {/* Global Floating Connect Wallet Button */}
        <FloatingConnectWallet />
        
        <Router>
          <Routes>
            <Route path="/" element={
              <>
                <Navigation />
                <TrendingCoins />
                <Hero />
                <Features />
                <LaunchpadStats />
        
                <TeamProfiles />
                <TokenSale />
                <Partners />
                <Footer />
              </>
            } />
            <Route path="/create-presale" element={<CreatePresalePage />} />
            <Route path="/submit-project" element={<SubmitProject />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/blog/create" element={<CreateBlogPost />} />
            <Route path="/admin/partners" element={<PartnersManagement />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogPostDetail />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/ido-sales" element={<IDOSales />} />
            <Route path="/staking" element={<StakingAirdrop />} />
            <Route path="/airdrop" element={<AirDrop />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/gameplan" element={<GamePlan />} />
            <Route path="/security" element={<Security />} />
            <Route path="/careers" element={<Careers />} />
          </Routes>
        </Router>
      </div>
    </WalletConnectProvider>
  );
}

export default App;
