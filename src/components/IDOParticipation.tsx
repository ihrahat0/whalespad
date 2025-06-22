import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import web3Service from '../services/web3Service';
import automationService from '../services/automationService';
import { supabase } from '../supabaseClient';

interface IDOParticipationProps {
  project: any;
  onUpdate?: () => void;
}

interface UserParticipation {
  contributed: string;
  tokensEarned: string;
  canClaim: boolean;
  hasClaimed: boolean;
  canRefund: boolean;
}

const IDOParticipation: React.FC<IDOParticipationProps> = ({ project, onUpdate }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [userAccount, setUserAccount] = useState<string | null>(null);
  const [participation, setParticipation] = useState<UserParticipation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contributeAmount, setContributeAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    checkConnection();
    if (userAccount && project.ido_presale_contract) {
      loadUserParticipation();
    }
  }, [userAccount, project]);

  const checkConnection = async () => {
    try {
      const account = await web3Service.getAccount();
      setIsConnected(!!account);
      setUserAccount(account);
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      const accounts = await web3Service.connect();
      if (accounts.length > 0) {
        setUserAccount(accounts[0]);
        setIsConnected(true);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUserParticipation = async () => {
    if (!userAccount || !project.ido_presale_contract) return;

    try {
      const [contribution, hasClaimed] = await Promise.all([
        web3Service.getUserContribution(project.ido_presale_contract, userAccount),
        web3Service.hasClaimedTokens(project.ido_presale_contract, userAccount)
      ]);

      const contributed = parseFloat(contribution);
      const presaleRate = project.presale_rate || 1000;
      const tokensEarned = contributed * presaleRate;

      setParticipation({
        contributed: contribution,
        tokensEarned: tokensEarned.toString(),
        canClaim: project.current_phase === 'claimable' && contributed > 0 && !hasClaimed,
        hasClaimed,
        canRefund: project.current_phase === 'failed' && contributed > 0
      });
    } catch (error) {
      console.error('Error loading participation:', error);
    }
  };

  const handleContribute = async () => {
    if (!userAccount || !project.ido_presale_contract || !contributeAmount) return;

    try {
      setIsProcessing(true);
      setError(null);

      const amount = parseFloat(contributeAmount);
      const minContrib = parseFloat(project.min_allocation || project.min_contribution || '0.1');
      const maxContrib = parseFloat(project.max_allocation || project.max_contribution || '10');

      if (amount < minContrib || amount > maxContrib) {
        throw new Error(`Amount must be between ${minContrib} and ${maxContrib} ETH`);
      }

      // Check if sale is active
      if (project.current_phase !== 'live') {
        throw new Error('Sale is not currently active');
      }

      const txHash = await web3Service.contributeToPool(project.ido_presale_contract, contributeAmount);
      
      // Record contribution in database
      await recordContribution(txHash, amount);
      
      // Refresh participation data
      setTimeout(() => {
        loadUserParticipation();
        onUpdate?.();
      }, 3000);

      setContributeAmount('');
      alert(`Contribution successful! Transaction: ${txHash}`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClaimTokens = async () => {
    if (!userAccount || !project.ido_presale_contract) return;

    try {
      setIsProcessing(true);
      setError(null);

      const txHash = await web3Service.claimTokens(project.ido_presale_contract);
      
      // Record claim in database
      await recordClaim(txHash);
      
      // Refresh participation data
      setTimeout(() => {
        loadUserParticipation();
      }, 3000);

      alert(`Tokens claimed successfully! Transaction: ${txHash}`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClaimRefund = async () => {
    if (!userAccount || !project.ido_presale_contract) return;

    try {
      setIsProcessing(true);
      setError(null);

      const txHash = await web3Service.claimRefund(project.ido_presale_contract);
      
      // Record refund in database
      await recordRefund(txHash);
      
      // Refresh participation data
      setTimeout(() => {
        loadUserParticipation();
      }, 3000);

      alert(`Refund claimed successfully! Transaction: ${txHash}`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const recordContribution = async (txHash: string, amount: number) => {
    try {
      await supabase.from('ido_investments').insert({
        ido_pool_id: project.ido_pool_id,
        project_id: project.id,
        investor_wallet_address: userAccount?.toLowerCase(),
        amount_invested: amount,
        tokens_received: amount * (project.presale_rate || 1000),
        transaction_hash: txHash,
        chain_id: project.ido_chain_id || project.chain_id,
        presale_rate: project.presale_rate || 1000,
        status: 'confirmed'
      });
    } catch (error) {
      console.error('Error recording contribution:', error);
    }
  };

  const recordClaim = async (txHash: string) => {
    try {
      await supabase.from('token_claims').insert({
        project_id: project.id,
        user_wallet_address: userAccount?.toLowerCase(),
        transaction_hash: txHash,
        tokens_claimed: participation?.tokensEarned || '0',
        claimed_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error recording claim:', error);
    }
  };

  const recordRefund = async (txHash: string) => {
    try {
      await supabase.from('refunds').insert({
        project_id: project.id,
        user_wallet_address: userAccount?.toLowerCase(),
        transaction_hash: txHash,
        amount_refunded: participation?.contributed || '0',
        refunded_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error recording refund:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="ido-participation-card">
        <div className="connect-wallet-section">
          <h3>Connect Wallet to Participate</h3>
          <p>Connect your wallet to join the IDO and manage your investments</p>
          <motion.button
            className="connect-wallet-btn"
            onClick={connectWallet}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="ido-participation-card">
      <div className="participation-header">
        <h3>IDO Participation</h3>
        <div className="wallet-info">
          <span className="wallet-address">
            {userAccount?.slice(0, 6)}...{userAccount?.slice(-4)}
          </span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* User's Current Participation */}
      {participation && parseFloat(participation.contributed) > 0 && (
        <div className="participation-stats">
          <h4>Your Participation</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <label>Contributed</label>
              <span>{parseFloat(participation.contributed).toFixed(4)} ETH</span>
            </div>
            <div className="stat-item">
              <label>Tokens Earned</label>
              <span>{parseFloat(participation.tokensEarned).toLocaleString()} {project.token_symbol}</span>
            </div>
            <div className="stat-item">
              <label>Status</label>
              <span className={`status ${participation.hasClaimed ? 'claimed' : 'pending'}`}>
                {participation.hasClaimed ? 'Claimed' : 'Ready to Claim'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Contribution Section */}
      {project.current_phase === 'live' && (
        <div className="contribute-section">
          <h4>Join the IDO</h4>
          <div className="contribute-form">
            <div className="input-group">
              <label>Amount (ETH)</label>
              <input
                type="number"
                value={contributeAmount}
                onChange={(e) => setContributeAmount(e.target.value)}
                placeholder="0.0"
                min={project.min_allocation || project.min_contribution || 0.1}
                max={project.max_allocation || project.max_contribution || 10}
                step="0.01"
              />
              <div className="input-help">
                Min: {project.min_allocation || project.min_contribution || '0.1'} ETH | 
                Max: {project.max_allocation || project.max_contribution || '10'} ETH
              </div>
            </div>
            <motion.button
              className="contribute-btn"
              onClick={handleContribute}
              disabled={isProcessing || !contributeAmount || parseFloat(contributeAmount) <= 0}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isProcessing ? 'Processing...' : `Contribute ${contributeAmount || '0'} ETH`}
            </motion.button>
          </div>
        </div>
      )}

      {/* Claim Section */}
      {participation?.canClaim && (
        <div className="claim-section">
          <h4>Claim Your Tokens</h4>
          <p>You can now claim your {project.token_symbol} tokens!</p>
          <motion.button
            className="claim-btn"
            onClick={handleClaimTokens}
            disabled={isProcessing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isProcessing ? 'Claiming...' : `Claim ${parseFloat(participation.tokensEarned).toLocaleString()} ${project.token_symbol}`}
          </motion.button>
        </div>
      )}

      {/* Refund Section */}
      {participation?.canRefund && (
        <div className="refund-section">
          <h4>Claim Refund</h4>
          <p>This IDO was unsuccessful. You can claim your refund.</p>
          <motion.button
            className="refund-btn"
            onClick={handleClaimRefund}
            disabled={isProcessing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isProcessing ? 'Processing...' : `Claim Refund: ${parseFloat(participation.contributed).toFixed(4)} ETH`}
          </motion.button>
        </div>
      )}

      {/* Already Claimed */}
      {participation?.hasClaimed && (
        <div className="claimed-section">
          <h4>✅ Tokens Claimed</h4>
          <p>You have successfully claimed your {project.token_symbol} tokens!</p>
        </div>
      )}
    </div>
  );
};

export default IDOParticipation; 