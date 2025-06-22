import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiList, FiPlusCircle, FiUsers, FiSettings, FiLogOut, 
  FiEye, FiEdit, FiFileText, FiBookOpen, FiSearch, FiFilter,
  FiTrendingUp, FiDollarSign, FiActivity, FiCalendar,
  FiCheck, FiX, FiMoreVertical, FiDownload, FiBell,
  FiStar, FiTarget, FiPieChart, FiClock
} from 'react-icons/fi';
import BlogManagement from './BlogManagement';
import { supabase } from '../../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import AdminManagementComponent from '../../components/admin/AdminManagementComponent';
import PartnersManagement from './PartnersManagement';
import PhaseManagement from '../../components/admin/PhaseManagement';

// Premium Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: { 
      bg: 'bg-gradient-to-r from-amber-400/20 to-yellow-500/20', 
      text: 'text-amber-300',
      border: 'border-amber-400/30',
      glow: 'shadow-amber-400/20'
    },
    approved: { 
      bg: 'bg-gradient-to-r from-emerald-400/20 to-green-500/20', 
      text: 'text-emerald-300',
      border: 'border-emerald-400/30',
      glow: 'shadow-emerald-400/20'
    },
    rejected: { 
      bg: 'bg-gradient-to-r from-red-400/20 to-rose-500/20', 
      text: 'text-red-300',
      border: 'border-red-400/30',
      glow: 'shadow-red-400/20'
    },
    live: { 
      bg: 'bg-gradient-to-r from-blue-400/20 to-cyan-500/20', 
      text: 'text-blue-300',
      border: 'border-blue-400/30',
      glow: 'shadow-blue-400/20'
    },
    active: { 
      bg: 'bg-gradient-to-r from-green-400/20 to-emerald-500/20', 
      text: 'text-green-300',
      border: 'border-green-400/30',
      glow: 'shadow-green-400/20'
    },
    upcoming: { 
      bg: 'bg-gradient-to-r from-purple-400/20 to-violet-500/20', 
      text: 'text-purple-300',
      border: 'border-purple-400/30',
      glow: 'shadow-purple-400/20'
    },
    completed: { 
      bg: 'bg-gradient-to-r from-gray-400/20 to-slate-500/20', 
      text: 'text-gray-300',
      border: 'border-gray-400/30',
      glow: 'shadow-gray-400/20'
    },
    ended: { 
      bg: 'bg-gradient-to-r from-gray-400/20 to-slate-500/20', 
      text: 'text-gray-300',
      border: 'border-gray-400/30',
      glow: 'shadow-gray-400/20'
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ended;

  return (
    <motion.span 
      whileHover={{ scale: 1.05 }}
      className={`
        ${config.bg} ${config.text} ${config.border} ${config.glow}
        px-3 py-1.5 rounded-full text-xs font-medium border
        backdrop-blur-sm shadow-lg transition-all duration-300
        hover:shadow-lg uppercase tracking-wide
      `}
    >
      {status}
    </motion.span>
  );
};

// Premium Metric Card Component
const MetricCard = ({ title, value, icon: Icon, trend, trendValue, color }: any) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 
               border border-gray-700/50 backdrop-blur-xl shadow-2xl group"
  >
    {/* Animated background gradient */}
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
    
    {/* Glow effect */}
    <div className={`absolute -inset-1 bg-gradient-to-r ${color} opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500`} />
    
    <div className="relative p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
            <FiTrendingUp className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
      </div>
    </div>
  </motion.div>
);

// Premium Navigation Item Component
const NavItem = ({ icon: Icon, label, isActive, onClick, badge }: any) => (
  <motion.button
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      flex items-center w-full px-4 py-3 rounded-xl transition-all duration-300 group relative
      ${isActive 
        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 shadow-lg shadow-blue-500/20' 
        : 'hover:bg-gray-700/30 hover:border-gray-600/50 border border-transparent'
      }
    `}
  >
    <Icon className={`mr-3 w-5 h-5 transition-colors duration-300 ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`} />
    <span className={`font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
      {label}
    </span>
    {badge && (
      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">{badge}</span>
    )}
    {isActive && (
      <motion.div
        layoutId="activeIndicator"
        className="absolute left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full"
      />
    )}
  </motion.button>
);

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const navigate = useNavigate();

  // State for Create IDO Form
  const [tokenAddress, setTokenAddress] = useState('');
  const [totalSupply, setTotalSupply] = useState<number | string>('');
  const [hardCap, setHardCap] = useState<number | string>('');
  const [softCap, setSoftCap] = useState<number | string>('');
  const [minAllocation, setMinAllocation] = useState<number | string>('');
  const [maxAllocation, setMaxAllocation] = useState<number | string>('');
  const [presaleRate, setPresaleRate] = useState<number | string>('');
  const [listingRate, setListingRate] = useState<number | string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [liquidityPercentage, setLiquidityPercentage] = useState<number | string>('');
  const [liquidityUnlockDate, setLiquidityUnlockDate] = useState('');
  const [ownerWallet, setOwnerWallet] = useState('');
  const [selectedChainId, setSelectedChainId] = useState<number>(1);
  const [presaleContractAddress, setPresaleContractAddress] = useState('');
  const [idoCreationError, setIdoCreationError] = useState<string | null>(null);
  const [idoCreationSuccess, setIdoCreationSuccess] = useState<string | null>(null);

  // State for creating new project from scratch
  const [createFromScratch, setCreateFromScratch] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [telegram, setTelegram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [discord, setDiscord] = useState('');
  const [category, setCategory] = useState('DeFi');
  
  // IDO management states
  const [existingIdos, setExistingIdos] = useState<any[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Tokenomics state
  const [tokenomicsEntries, setTokenomicsEntries] = useState([
    { name: 'Presale', percentage: '15', color: '#00d4ff' },
    { name: 'Liquidity', percentage: '25', color: '#00ff88' },
    { name: 'Team', percentage: '20', color: '#8b5cf6' },
    { name: 'Marketing', percentage: '10', color: '#ffd700' },
    { name: 'Development', percentage: '15', color: '#ff6b35' },
    { name: 'Treasury', percentage: '15', color: '#4f8fff' }
  ]);

  // Admin user data from sessionStorage
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    try {
      const storedAdminUser = sessionStorage.getItem('adminUser');
      if (storedAdminUser) {
        const parsedUser = JSON.parse(storedAdminUser);
        setAdminUser(parsedUser);
      } else {
        navigate('/admin');
      }
    } catch (e) {
      console.error("Failed to parse adminUser from session storage:", e);
      navigate('/admin');
    }
    fetchProjects();
    fetchAvailableProjects();
    fetchExistingIdos();
  }, [navigate]);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('project_submissions')
      .select('*');
    if (error) {
      console.error('Error fetching projects:', error);
    } else {
      setProjects(data || []);
    }
  };

  const fetchAvailableProjects = async () => {
    const { data, error } = await supabase
      .from('project_submissions')
      .select('id, project_name, token_symbol')
      .eq('status', 'approved');
    if (error) {
      console.error('Error fetching approved projects:', error);
    } else {
      setAvailableProjects(data || []);
    }
  };

  const fetchExistingIdos = async () => {
    try {
      // Use project_details_view which has proper relationships and computed status
      const { data, error } = await supabase
        .from('project_details_view')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch from project_details_view:', error);
        
        // Fallback: try direct ido_pools query
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('ido_pools')
          .select(`
            *,
            project_submissions (
              project_name,
              logo_url,
              banner_url,
              token_symbol,
              slug,
              category
            )
          `)
          .order('created_at', { ascending: false });

        if (fallbackError) {
          console.error('Failed to fetch IDOs:', fallbackError);
          setExistingIdos([]);
          return;
        }

        // Transform fallback data to match expected structure
        const transformedData = (fallbackData || []).map(ido => ({
          ...ido,
          project_submissions: ido.project_submissions || {
            project_name: 'Unknown Project',
            logo_url: null,
            banner_url: null,
            token_symbol: 'TOKEN',
            slug: null,
            category: 'DeFi'
          }
        }));

        setExistingIdos(transformedData);
      } else {
        // Transform project_details_view data to match IDO pool structure for admin
        const transformedData = (data || []).filter(project => project.ido_id).map(project => ({
          id: project.ido_id,
          project_id: project.id,
          token_address: project.contract_address,
          total_supply: project.total_supply,
          hard_cap: project.hard_cap,
          soft_cap: project.soft_cap,
          presale_rate: project.token_price,
          listing_rate: project.listing_price,
          start_date: project.ido_start_date,
          end_date: project.ido_end_date,
          status: project.computed_ido_status || project.pool_status,
          chain_id: project.ido_chain_id || 56,
          presale_contract_address: project.presale_contract_address,
          native_token_symbol: project.native_token_symbol || 'BNB',
          created_at: project.created_at,
          project_submissions: {
            project_name: project.project_name,
            logo_url: project.logo_url,
            banner_url: project.banner_url,
            token_symbol: project.token_symbol,
            slug: project.slug,
            category: project.category
          }
        }));

        setExistingIdos(transformedData);
        
        console.log('IDOs loaded from project_details_view:', {
          total: transformedData.length,
          live: transformedData.filter(ido => ido.status === 'active').length,
          upcoming: transformedData.filter(ido => ido.status === 'upcoming').length,
          completed: transformedData.filter(ido => ido.status === 'completed').length
        });
      }
    } catch (err) {
      console.error('Error fetching IDOs:', err);
      setExistingIdos([]);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const handleViewProject = (project: any) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleUpdateProjectStatus = async (projectId: string, newStatus: string) => {
    const { data, error } = await supabase
      .from('project_submissions')
      .update({ status: newStatus })
      .eq('id', projectId);
    if (error) {
      console.error('Error updating project status:', error);
      alert('Failed to update project status.');
    } else {
      alert(`Project status updated to ${newStatus}!`);
      fetchProjects();
    }
  };

  const filteredProjects = projects.filter(project => {
    let matchesStatus = true;
    let matchesSearch = true;

    if (statusFilter) {
      matchesStatus = project.status === statusFilter;
    }

    if (searchQuery) {
      matchesSearch = project.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      project.token_symbol.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return matchesStatus && matchesSearch;
  });

  // Helper function to get chain info
  const getChainInfo = (chainId: number) => {
    const chains = {
      1: { name: 'Ethereum', symbol: 'ETH' },
      56: { name: 'BNB Smart Chain', symbol: 'BNB' },
      137: { name: 'Polygon', symbol: 'MATIC' },
      42161: { name: 'Arbitrum', symbol: 'ETH' },
      10: { name: 'Optimism', symbol: 'ETH' }
    };
    return chains[chainId as keyof typeof chains] || { name: 'Unknown', symbol: 'ETH' };
  };

  // Function to create project from scratch
  const handleCreateProjectFromScratch = async () => {
    if (!projectName || !tokenSymbol || !logoUrl || !bannerUrl) {
      setIdoCreationError('Please fill in all required project fields: Name, Token Symbol, Logo URL, and Banner URL.');
      return;
    }

    try {
      // Generate slug from project name
      const slug = projectName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Create new project
      const newProject = {
        project_name: projectName,
        token_symbol: tokenSymbol,
        category: category,
        description: projectDescription || `${projectName} - Revolutionary ${category} project`,
        full_description: fullDescription || projectDescription || `${projectName} is bringing innovation to the ${category} space with cutting-edge technology and a strong community focus.`,
        features: ['Innovative Technology', 'Strong Community', 'Experienced Team', 'Proven Track Record'],
        rating: 9.5,
        logo_url: logoUrl,
        banner_url: bannerUrl,
        website: website || '',
        telegram: telegram || '',
        twitter: twitter || '',
        discord: discord || '',
        medium: '',
        whitepaper: '',
        audit_link: '',
        has_audit: false,
        total_supply: parseInt(totalSupply as string) || 1000000,
        presale_price: 1 / parseFloat(presaleRate as string || '1000'),
        listing_price: listingRate ? 1 / parseFloat(listingRate as string) : 1 / parseFloat(presaleRate as string || '1000'),
        min_contribution: parseFloat(minAllocation as string || '0.1'),
        max_contribution: parseFloat(maxAllocation as string || '10'),
        soft_cap: parseFloat(softCap as string || '50'),
        hard_cap: parseFloat(hardCap as string || '100'),
        current_raised: 0,
        investor_count: 0,
        presale_start: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
        presale_end: endDate ? new Date(endDate).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        liquidity_percent: `${liquidityPercentage || 70}%`,
        liquidity_lock_time: '12 months',
        expected_roi: '200%',
        contract_address: tokenAddress || '',
        slug: slug,
        status: 'approved',
        chain_id: selectedChainId,
        presale_contract_address: presaleContractAddress,
        native_token_symbol: getChainInfo(selectedChainId).symbol
      };

      const { data: projectData, error: projectError } = await supabase
        .from('project_submissions')
        .insert([newProject])
        .select()
        .single();

      if (projectError) {
        throw projectError;
      }

      // Set the created project as selected
      setSelectedProjectId(projectData.id);
      setCreateFromScratch(false);
      
      // Refresh available projects
      fetchAvailableProjects();
      
      setIdoCreationSuccess(`Project "${projectName}" created successfully! You can now create the IDO pool.`);
      
    } catch (e: any) {
      console.error('Failed to create project:', e);
      setIdoCreationError(`Failed to create project: ${e.message || 'An unexpected error occurred'}`);
    }
  };

  // Function to delete IDO
  const handleDeleteIDO = async (idoId: string) => {
    try {
      console.log('Attempting to delete IDO with ID:', idoId);
      
      // First check if the IDO exists and get current user session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session ? 'Authenticated' : 'Not authenticated');
      
      // Check if IDO exists before deletion
      const { data: existingIdo, error: checkError } = await supabase
        .from('ido_pools')
        .select('id, project_id')
        .eq('id', idoId)
        .single();

      if (checkError) {
        console.error('Error checking IDO existence:', checkError);
        throw new Error(`IDO not found or access denied: ${checkError.message}`);
      }

      console.log('IDO found:', existingIdo);

      // Manual deletion in correct order to avoid trigger conflicts
      // The trigger on ido_investments tries to update ido_pool_stats during CASCADE delete
      // So we need to delete in the right order to avoid foreign key violations

      // 1. First, delete ido_pool_stats (this avoids the trigger trying to update a deleted record)
      const { error: statsDeleteError } = await supabase
        .from('ido_pool_stats')
        .delete()
        .eq('ido_pool_id', idoId);

      if (statsDeleteError) {
        console.error('Error deleting pool stats:', statsDeleteError);
        throw new Error(`Failed to delete pool stats: ${statsDeleteError.message}`);
      }

      // 2. Then delete ido_investments (trigger won't cause issues since ido_pool_stats is already gone)
      const { error: investmentsDeleteError } = await supabase
        .from('ido_investments')
        .delete()
        .eq('ido_pool_id', idoId);

      if (investmentsDeleteError) {
        console.error('Error deleting investments:', investmentsDeleteError);
        throw new Error(`Failed to delete investments: ${investmentsDeleteError.message}`);
      }

      // 3. Finally, delete the ido_pools record
      const { data: deleteData, error: deleteError } = await supabase
        .from('ido_pools')
        .delete()
        .eq('id', idoId)
        .select(); // This will return the deleted rows if successful

      console.log('Delete response:', { data: deleteData, error: deleteError });

      if (deleteError) {
        console.error('Delete error details:', deleteError);
        throw new Error(`Delete failed: ${deleteError.message}`);
      }

      if (!deleteData || deleteData.length === 0) {
        throw new Error('No rows were deleted. This might be a permissions issue.');
      }

      console.log('Successfully deleted IDO pool and all related data manually (avoiding trigger conflicts).', deleteData);

      // Refresh the IDO list
      fetchExistingIdos();
      setShowDeleteConfirm(null);
      alert('IDO deleted successfully!');

    } catch (e: any) {
      console.error('Failed to delete IDO:', e);
      alert(`Failed to delete IDO: ${e.message || 'An unexpected error occurred'}`);
    }
  };

  // Reset form when switching between modes
  const resetForm = () => {
    setProjectName('');
    setTokenSymbol('');
    setProjectDescription('');
    setFullDescription('');
    setLogoUrl('');
    setBannerUrl('');
    setWebsite('');
    setTelegram('');
    setTwitter('');
    setDiscord('');
    setCategory('DeFi');
    setTokenAddress('');
    setTotalSupply('');
    setHardCap('');
    setSoftCap('');
    setMinAllocation('');
    setMaxAllocation('');
    setPresaleRate('');
    setListingRate('');
    setStartDate('');
    setEndDate('');
    setLiquidityPercentage('');
    setLiquidityUnlockDate('');
    setOwnerWallet('');
    setSelectedChainId(1);
    setPresaleContractAddress('');
    setIdoCreationError(null);
    setIdoCreationSuccess(null);
  };

  const handleCreateIDO = async (e: React.FormEvent) => {
    e.preventDefault();
    setIdoCreationError(null);
    setIdoCreationSuccess(null);

    if (!selectedProjectId || !tokenAddress || !totalSupply || !hardCap ||
        !presaleRate || !startDate || !endDate || !ownerWallet || !presaleContractAddress) {
      setIdoCreationError('Please fill in all required fields: Project, Token Address, Total Supply, Hard Cap, Presale Rate, Start Date, End Date, Owner Wallet, and Presale Contract Address.');
      return;
    }

    const chainInfo = getChainInfo(selectedChainId);

    const newIDO = {
      project_id: selectedProjectId,
      token_address: tokenAddress,
      total_supply: parseFloat(totalSupply as string),
      hard_cap: parseFloat(hardCap as string),
      soft_cap: softCap ? parseFloat(softCap as string) : null,
      min_allocation: minAllocation ? parseFloat(minAllocation as string) : null,
      max_allocation: maxAllocation ? parseFloat(maxAllocation as string) : null,
      presale_rate: parseFloat(presaleRate as string),
      listing_rate: listingRate ? parseFloat(listingRate as string) : null,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      liquidity_percentage: liquidityPercentage ? parseFloat(liquidityPercentage as string) : null,
      liquidity_unlock_date: liquidityUnlockDate ? new Date(liquidityUnlockDate).toISOString() : null,
      owner_wallet: ownerWallet,
      chain_id: selectedChainId,
      presale_contract_address: presaleContractAddress,
      native_token_symbol: chainInfo.symbol,
      status: 'upcoming'
    };

    try {
      const { data, error } = await supabase
        .from('ido_pools')
        .insert([newIDO]);

      if (error) {
        throw error;
      }

      // Insert tokenomics data if IDO creation was successful
      if (data && data[0] && tokenomicsEntries.length > 0) {
        const totalSupplyNum = parseInt(totalSupply as string);
        
        const tokenomicsData = tokenomicsEntries.map(entry => ({
          project_id: selectedProjectId,
          name: entry.name,
          percentage: parseInt(entry.percentage),
          amount: Math.floor((parseInt(entry.percentage) / 100) * totalSupplyNum),
          color: entry.color,
          description: `${entry.name} allocation`
        }));

        const { error: tokenomicsError } = await supabase
          .from('project_tokenomics')
          .insert(tokenomicsData);

        if (tokenomicsError) {
          console.error('Error inserting tokenomics:', tokenomicsError);
          setIdoCreationError('IDO created but failed to save tokenomics data');
          return;
        }
      }

      setIdoCreationSuccess('IDO and tokenomics created successfully!');
      fetchExistingIdos(); // Refresh IDO list
      setSelectedProjectId('');
      setTokenAddress('');
      setTotalSupply('');
      setHardCap('');
      setSoftCap('');
      setMinAllocation('');
      setMaxAllocation('');
      setPresaleRate('');
      setListingRate('');
      setStartDate('');
      setEndDate('');
      setLiquidityPercentage('');
      setLiquidityUnlockDate('');
      setOwnerWallet('');
      setSelectedChainId(1);
      setPresaleContractAddress('');
      setTokenomicsEntries([
        { name: 'Presale', percentage: '15', color: '#00d4ff' },
        { name: 'Liquidity', percentage: '25', color: '#00ff88' },
        { name: 'Team', percentage: '20', color: '#8b5cf6' },
        { name: 'Marketing', percentage: '10', color: '#ffd700' },
        { name: 'Development', percentage: '15', color: '#ff6b35' },
        { name: 'Treasury', percentage: '15', color: '#4f8fff' }
      ]);

    } catch (e: any) {
      console.error('Failed to create IDO:', e);
      setIdoCreationError(`Failed to create IDO: ${e.message || 'An unexpected error occurred'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '30s' }} />
      </div>

      <div className="flex relative z-10">
        {/* Premium Sidebar */}
        <motion.div 
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-80 bg-gray-800/30 backdrop-blur-xl border-r border-gray-700/50 p-6 flex flex-col relative"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FiTarget className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  WhalesPad Admin
                </h2>
                <p className="text-sm text-gray-400">
                  {adminUser ? adminUser.username : 'Loading...'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>System Online</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-grow space-y-2">
            <NavItem
              icon={FiHome}
              label="Dashboard"
              isActive={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
            />
            <NavItem
              icon={FiList}
              label="Project Management"
              isActive={activeTab === 'project-management'}
              onClick={() => setActiveTab('project-management')}
              badge={projects.filter(p => p.status === 'pending').length}
            />
            <NavItem
              icon={FiPlusCircle}
              label="Create IDO"
              isActive={activeTab === 'ido-creation'}
              onClick={() => setActiveTab('ido-creation')}
            />
            <NavItem
              icon={FiPieChart}
              label="Manage IDOs"
              isActive={activeTab === 'ido-management'}
              onClick={() => setActiveTab('ido-management')}
              badge={existingIdos.length}
            />
            <NavItem
              icon={FiClock}
              label="Phase Management"
              isActive={activeTab === 'phase-management'}
              onClick={() => setActiveTab('phase-management')}
            />
            <NavItem
              icon={FiBookOpen}
              label="Blog Management"
              isActive={activeTab === 'blog-management'}
              onClick={() => setActiveTab('blog-management')}
            />
            <NavItem
              icon={FiUsers}
              label="Admin Management"
              isActive={activeTab === 'admin-management'}
              onClick={() => setActiveTab('admin-management')}
            />
            <NavItem
              icon={FiStar}
              label="Partners"
              isActive={activeTab === 'partners-management'}
              onClick={() => setActiveTab('partners-management')}
            />
            <NavItem
              icon={FiSettings}
              label="Settings"
              isActive={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            />
          </nav>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="mt-8 flex items-center w-full px-4 py-3 rounded-xl text-red-400 
                       hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 
                       transition-all duration-300 group"
          >
            <FiLogOut className="mr-3 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </motion.div>

        {/* Main Content */}
        <div className="flex-grow overflow-hidden">
          <div className="h-full overflow-y-auto p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        Admin Dashboard
                      </h1>
                      <p className="text-gray-400">Welcome back! Here's what's happening with your launchpad.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
                      >
                        <FiBell className="w-5 h-5 text-gray-400" />
                      </motion.button>
                      <Link
                        to="/admin/blog/create"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                                 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 
                                 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 group"
                      >
                        <FiEdit className="group-hover:rotate-12 transition-transform duration-300" />
                        Create New Blog
                      </Link>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                      title="Total Projects"
                      value={projects.length}
                      icon={FiFileText}
                      trend="up"
                      trendValue="+12%"
                      color="from-blue-500 to-cyan-500"
                    />
                    <MetricCard
                      title="Pending Projects"
                      value={projects.filter(p => p.status === 'pending').length}
                      icon={FiActivity}
                      trend="down"
                      trendValue="-5%"
                      color="from-amber-500 to-orange-500"
                    />
                    <MetricCard
                      title="Approved Projects"
                      value={projects.filter(p => p.status === 'approved').length}
                      icon={FiCheck}
                      trend="up"
                      trendValue="+8%"
                      color="from-emerald-500 to-green-500"
                    />
                    <MetricCard
                      title="Live IDO Pools"
                      value={existingIdos.filter(ido => ido.status === 'active').length}
                      icon={FiDollarSign}
                      color="from-purple-500 to-pink-500"
                    />
                  </div>

                  {/* Recent Projects Section */}
                  <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
                    {/* Section Header */}
                    <div className="p-6 border-b border-gray-700/50">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-bold text-white mb-2">Recent Project Submissions</h2>
                          <p className="text-gray-400">Manage and review project applications</p>
                        </div>
                        
                        {/* Search and Filter Controls */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="text"
                              placeholder="Search projects..."
                              className="w-full sm:w-64 pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 
                                       rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 
                                       focus:bg-gray-700/70 transition-all duration-300"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                          <div className="relative">
                            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                              className="w-full sm:w-48 pl-10 pr-10 py-3 bg-gray-700/50 border border-gray-600/50 
                                       rounded-xl text-white focus:outline-none focus:border-blue-500/50 
                                       focus:bg-gray-700/70 transition-all duration-300 appearance-none"
                              value={statusFilter}
                              onChange={(e) => setStatusFilter(e.target.value)}
                            >
                              <option value="">All Statuses</option>
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                              <option value="live">Live</option>
                              <option value="ended">Ended</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      {/* Table Header */}
                      <div className="grid grid-cols-5 gap-4 p-6 bg-gray-700/20 text-gray-400 text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <FiFileText className="w-4 h-4" />
                          <span>Project Details</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FiTarget className="w-4 h-4" />
                          <span>Symbol</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FiActivity className="w-4 h-4" />
                          <span>Status</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FiCalendar className="w-4 h-4" />
                          <span>Submitted</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <FiSettings className="w-4 h-4" />
                          <span>Actions</span>
                        </div>
                      </div>

                      {/* Table Body */}
                      <div className="divide-y divide-gray-700/30">
                        {filteredProjects.length > 0 ? (
                          filteredProjects.map((project, index) => (
                            <motion.div
                              key={project.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="grid grid-cols-5 gap-4 p-6 hover:bg-gray-700/20 transition-all duration-300 group"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                  {project.project_name?.substring(0, 2) || 'NP'}
                                </div>
                                <div>
                                  <div className="text-white font-medium group-hover:text-blue-400 transition-colors duration-300">
                                    {project.project_name}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {project.email || 'No email'}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center">
                                <span className="text-white font-mono bg-gray-700/50 px-2 py-1 rounded text-sm">
                                  {project.token_symbol}
                                </span>
                              </div>
                              
                              <div className="flex items-center">
                                <StatusBadge status={project.status} />
                              </div>
                              
                              <div className="flex items-center text-gray-300 text-sm">
                                {new Date(project.submitted_at).toLocaleDateString()}
                              </div>
                              
                              <div className="flex items-center justify-center space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleViewProject(project)}
                                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 
                                           rounded-lg text-blue-400 hover:text-blue-300 transition-all duration-300"
                                  title="View Details"
                                >
                                  <FiEye className="w-4 h-4" />
                                </motion.button>
                                
                                {project.status === 'pending' && (
                                  <>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleUpdateProjectStatus(project.id, 'approved')}
                                      className="p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 
                                               rounded-lg text-green-400 hover:text-green-300 transition-all duration-300"
                                      title="Approve"
                                    >
                                      <FiCheck className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleUpdateProjectStatus(project.id, 'rejected')}
                                      className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 
                                               rounded-lg text-red-400 hover:text-red-300 transition-all duration-300"
                                      title="Reject"
                                    >
                                      <FiX className="w-4 h-4" />
                                    </motion.button>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="p-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                              <FiFileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-400 text-lg">No projects found</p>
                            <p className="text-gray-500 text-sm mt-2">Projects will appear here once submitted</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Enhanced Project Management */}
              {activeTab === 'project-management' && (
                <motion.div
                  key="project-management"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        Project Management
                      </h1>
                      <p className="text-gray-400">Review, approve, and manage submitted projects</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl"
                      >
                        <FiFilter className="w-5 h-5 text-gray-400" />
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl"
                      >
                        <FiDownload className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white 
                                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                                     focus:border-blue-500/50 transition-all duration-300"
                          />
                        </div>
                      </div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                 transition-all duration-300"
                      >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {/* Projects Table */}
                  <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
                    <div className="p-6 border-b border-gray-700/50">
                      <h3 className="text-xl font-semibold text-white">All Projects</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {filteredProjects.length} projects found
                      </p>
                    </div>
                    
                    <div className="overflow-x-auto">
                      {filteredProjects.length > 0 ? (
                        <div className="divide-y divide-gray-700/30">
                          {filteredProjects.map((project, index) => (
                            <motion.div
                              key={project.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="grid grid-cols-6 gap-4 p-6 hover:bg-gray-700/20 transition-all duration-300 group"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                  {project.project_name?.substring(0, 2) || 'NP'}
                                </div>
                                <div>
                                  <div className="text-white font-medium group-hover:text-blue-400 transition-colors duration-300">
                                    {project.project_name}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {project.email || 'No email'}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center">
                                <span className="text-white font-mono bg-gray-700/50 px-2 py-1 rounded text-sm">
                                  {project.token_symbol}
                                </span>
                              </div>
                              
                              <div className="flex items-center">
                                <StatusBadge status={project.status} />
                              </div>
                              
                              <div className="flex items-center text-gray-400 text-sm">
                                {new Date(project.submitted_at).toLocaleDateString()}
                              </div>
                              
                              <div className="flex items-center">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleViewProject(project)}
                                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 
                                           rounded-lg text-blue-400 hover:text-blue-300 transition-all duration-300"
                                  title="View Details"
                                >
                                  <FiEye className="w-4 h-4" />
                                </motion.button>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                {project.status === 'pending' && (
                                  <>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleUpdateProjectStatus(project.id, 'approved')}
                                      className="p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 
                                               rounded-lg text-green-400 hover:text-green-300 transition-all duration-300"
                                      title="Approve"
                                    >
                                      <FiCheck className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleUpdateProjectStatus(project.id, 'rejected')}
                                      className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 
                                               rounded-lg text-red-400 hover:text-red-300 transition-all duration-300"
                                      title="Reject"
                                    >
                                      <FiX className="w-4 h-4" />
                                    </motion.button>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-12 text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                            <FiFileText className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-400 text-lg">No projects found</p>
                          <p className="text-gray-500 text-sm mt-2">Projects will appear here once submitted</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'ido-creation' && (
                <motion.div
                  key="ido-creation"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                        Create IDO Pool
                      </h2>
                      <p className="text-gray-400">Set up a new IDO pool for approved projects</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
                      <FiPlusCircle className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>

                  <form onSubmit={handleCreateIDO} className="space-y-6">
                    {/* Project Selection */}
                    <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FiTarget className="w-5 h-5 text-blue-400" />
                        Project Selection
                      </h3>
                      
                      {/* Mode Selection */}
                      <div className="flex gap-4 mb-6">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setCreateFromScratch(false);
                            resetForm();
                          }}
                          className={`flex-1 p-4 rounded-xl border transition-all duration-300 ${
                            !createFromScratch
                              ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                              : 'bg-gray-700/30 border-gray-600/50 text-gray-400 hover:border-gray-500/50'
                          }`}
                        >
                          <div className="text-center">
                            <FiList className="w-6 h-6 mx-auto mb-2" />
                            <div className="font-medium">Use Existing Project</div>
                            <div className="text-xs opacity-75">Select from approved submissions</div>
                          </div>
                        </motion.button>
                        
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setCreateFromScratch(true);
                            setSelectedProjectId('');
                            resetForm();
                          }}
                          className={`flex-1 p-4 rounded-xl border transition-all duration-300 ${
                            createFromScratch
                              ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                              : 'bg-gray-700/30 border-gray-600/50 text-gray-400 hover:border-gray-500/50'
                          }`}
                        >
                          <div className="text-center">
                            <FiPlusCircle className="w-6 h-6 mx-auto mb-2" />
                            <div className="font-medium">Create New Project</div>
                            <div className="text-xs opacity-75">Full admin control with logos & banners</div>
                          </div>
                        </motion.button>
                      </div>

                      {!createFromScratch ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Select Approved Project*
                          </label>
                          <select
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                     transition-all duration-300"
                            required={!createFromScratch}
                          >
                            <option value="">Choose a project...</option>
                            {availableProjects.length > 0 ? (
                              availableProjects.map((project) => (
                              <option key={project.id} value={project.id}>
                                {project.project_name} ({project.token_symbol})
                              </option>
                              ))
                            ) : (
                              <option value="" disabled>No approved projects available</option>
                            )}
                          </select>
                          {availableProjects.length === 0 && (
                            <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                              <p className="text-amber-400 text-sm">
                                ⚠️ No approved projects available. Either create a new project above or run the database setup script to add sample data.
                              </p>
                        </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Project Name*
                              </label>
                              <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="QuantumChain Protocol"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                         focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 
                                         transition-all duration-300"
                                required={createFromScratch}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Token Symbol*
                              </label>
                              <input
                                type="text"
                                value={tokenSymbol}
                                onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                                placeholder="QCP"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                         focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 
                                         transition-all duration-300"
                                required={createFromScratch}
                              />
                      </div>
                    </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Logo URL*
                              </label>
                              <input
                                type="url"
                                value={logoUrl}
                                onChange={(e) => setLogoUrl(e.target.value)}
                                placeholder="https://example.com/logo.png"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                         focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 
                                         transition-all duration-300"
                                required={createFromScratch}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Banner URL*
                              </label>
                              <input
                                type="url"
                                value={bannerUrl}
                                onChange={(e) => setBannerUrl(e.target.value)}
                                placeholder="https://example.com/banner.jpg"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                         focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 
                                         transition-all duration-300"
                                required={createFromScratch}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Category
                            </label>
                            <select
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                       focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 
                                       transition-all duration-300"
                            >
                              <option value="DeFi">DeFi</option>
                              <option value="GameFi">GameFi</option>
                              <option value="NFT">NFT</option>
                              <option value="Infrastructure">Infrastructure</option>
                              <option value="AI">AI</option>
                              <option value="Web3">Web3</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Project Description
                            </label>
                            <textarea
                              value={projectDescription}
                              onChange={(e) => setProjectDescription(e.target.value)}
                              placeholder="Brief description of the project..."
                              rows={3}
                              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                       focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 
                                       transition-all duration-300 resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Website
                              </label>
                              <input
                                type="url"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="https://project.com"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                         focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 
                                         transition-all duration-300"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Telegram
                              </label>
                              <input
                                type="url"
                                value={telegram}
                                onChange={(e) => setTelegram(e.target.value)}
                                placeholder="https://t.me/project"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                         focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 
                                         transition-all duration-300"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Twitter
                              </label>
                              <input
                                type="url"
                                value={twitter}
                                onChange={(e) => setTwitter(e.target.value)}
                                placeholder="https://twitter.com/project"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                         focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 
                                         transition-all duration-300"
                              />
                            </div>
                          </div>

                          {createFromScratch && (
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleCreateProjectFromScratch}
                              disabled={!projectName || !tokenSymbol || !logoUrl || !bannerUrl}
                              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
                                       disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                                       text-white font-semibold rounded-xl transition-all duration-300"
                            >
                              Create Project & Continue with IDO
                            </motion.button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Blockchain & Contract Details */}
                    <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FiDollarSign className="w-5 h-5 text-green-400" />
                        Blockchain & Contract Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Blockchain*
                          </label>
                          <select
                            value={selectedChainId}
                            onChange={(e) => setSelectedChainId(parseInt(e.target.value))}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                     transition-all duration-300"
                            required
                          >
                            <option value={1}>Ethereum (ETH)</option>
                            <option value={56}>BNB Smart Chain (BNB)</option>
                            <option value={137}>Polygon (MATIC)</option>
                            <option value={42161}>Arbitrum (ETH)</option>
                            <option value={10}>Optimism (ETH)</option>
                          </select>
                          <p className="text-xs text-gray-400 mt-1">
                            Native token: {getChainInfo(selectedChainId).symbol}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Token Address*
                          </label>
                          <input
                            type="text"
                            value={tokenAddress}
                            onChange={(e) => setTokenAddress(e.target.value)}
                            placeholder="0x..."
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                     transition-all duration-300"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Presale Contract Address*
                          </label>
                          <input
                            type="text"
                            value={presaleContractAddress}
                            onChange={(e) => setPresaleContractAddress(e.target.value)}
                            placeholder="0x..."
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                     transition-all duration-300"
                            required
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            Users will send {getChainInfo(selectedChainId).symbol} to this address
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Total Supply*
                          </label>
                          <input
                            type="number"
                            value={totalSupply}
                            onChange={(e) => setTotalSupply(e.target.value)}
                            placeholder="1000000"
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                     transition-all duration-300"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fundraising Details */}
                    <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FiPieChart className="w-5 h-5 text-purple-400" />
                        Fundraising Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Hard Cap ({getChainInfo(selectedChainId).symbol})*
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={hardCap}
                            onChange={(e) => setHardCap(e.target.value)}
                            placeholder="100"
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                     transition-all duration-300"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Soft Cap ({getChainInfo(selectedChainId).symbol})
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={softCap}
                            onChange={(e) => setSoftCap(e.target.value)}
                            placeholder="50"
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                     transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Min Allocation ({getChainInfo(selectedChainId).symbol})
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={minAllocation}
                            onChange={(e) => setMinAllocation(e.target.value)}
                            placeholder="0.1"
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                     transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Max Allocation ({getChainInfo(selectedChainId).symbol})
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={maxAllocation}
                            onChange={(e) => setMaxAllocation(e.target.value)}
                            placeholder="10"
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                     transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Rates */}
                    <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FiActivity className="w-5 h-5 text-yellow-400" />
                        Pricing & Rates
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Presale Rate (Tokens per {getChainInfo(selectedChainId).symbol})*
                          </label>
                          <input
                            type="number"
                            value={presaleRate}
                            onChange={(e) => setPresaleRate(e.target.value)}
                            placeholder="1000"
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                     transition-all duration-300"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Listing Rate (Tokens per {getChainInfo(selectedChainId).symbol})
                          </label>
                          <input
                            type="number"
                            value={listingRate}
                            onChange={(e) => setListingRate(e.target.value)}
                            placeholder="800"
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                     transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FiCalendar className="w-5 h-5 text-cyan-400" />
                        Timeline
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Start Date*
                          </label>
                          <input
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                     transition-all duration-300"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            End Date*
                          </label>
                          <input
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                     transition-all duration-300"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Liquidity Settings */}
                    <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FiTrendingUp className="w-5 h-5 text-indigo-400" />
                        Liquidity Settings
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Liquidity Percentage (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={liquidityPercentage}
                            onChange={(e) => setLiquidityPercentage(e.target.value)}
                            placeholder="70"
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                     transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Liquidity Unlock Date
                          </label>
                          <input
                            type="datetime-local"
                            value={liquidityUnlockDate}
                            onChange={(e) => setLiquidityUnlockDate(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                     transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Owner Wallet */}
                    <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FiUsers className="w-5 h-5 text-orange-400" />
                        Owner Details
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Owner Wallet Address*
                        </label>
                        <input
                          type="text"
                          value={ownerWallet}
                          onChange={(e) => setOwnerWallet(e.target.value)}
                          placeholder="0x..."
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white 
                                   focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                   transition-all duration-300"
                          required
                        />
                      </div>
                    </div>

                    {/* Tokenomics Configuration */}
                    <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FiPieChart className="w-5 h-5 text-pink-400" />
                        Tokenomics Distribution
                      </h3>
                      <div className="space-y-4">
                        {tokenomicsEntries.map((entry, index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-800/50 border border-gray-600/30 rounded-xl">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Category Name
                              </label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white 
                                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                         transition-all duration-300"
                                value={entry.name}
                                onChange={(e) => {
                                  const newEntries = [...tokenomicsEntries];
                                  newEntries[index].name = e.target.value;
                                  setTokenomicsEntries(newEntries);
                                }}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Percentage
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white 
                                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                         transition-all duration-300"
                                value={entry.percentage}
                                onChange={(e) => {
                                  const newEntries = [...tokenomicsEntries];
                                  newEntries[index].percentage = e.target.value;
                                  setTokenomicsEntries(newEntries);
                                }}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Color
                              </label>
                              <input
                                type="color"
                                className="w-full h-10 bg-gray-700/50 border border-gray-600/50 rounded-lg cursor-pointer"
                                value={entry.color}
                                onChange={(e) => {
                                  const newEntries = [...tokenomicsEntries];
                                  newEntries[index].color = e.target.value;
                                  setTokenomicsEntries(newEntries);
                                }}
                              />
                            </div>
                            
                            <div className="flex items-end">
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  const newEntries = tokenomicsEntries.filter((_, i) => i !== index);
                                  setTokenomicsEntries(newEntries);
                                }}
                                className="w-full bg-red-500/20 border border-red-500/30 text-red-300 px-3 py-2 rounded-lg 
                                         hover:bg-red-500/30 transition-all duration-200"
                              >
                                <FiX className="w-4 h-4 mx-auto" />
                              </motion.button>
                            </div>
                          </div>
                        ))}
                        
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setTokenomicsEntries([...tokenomicsEntries, { name: '', percentage: '0', color: '#ffffff' }]);
                          }}
                          className="w-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 px-4 py-3 rounded-xl 
                                   hover:bg-cyan-500/30 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <FiPlusCircle className="w-4 h-4" />
                          <span>Add Tokenomics Entry</span>
                        </motion.button>
                        
                        <div className="text-center text-sm">
                          <span className="text-gray-400">
                            Total: {tokenomicsEntries.reduce((sum, entry) => sum + parseInt(entry.percentage || '0'), 0)}%
                          </span>
                          {tokenomicsEntries.reduce((sum, entry) => sum + parseInt(entry.percentage || '0'), 0) !== 100 && (
                            <span className="text-red-400 ml-2">(Should equal 100%)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Error/Success Messages */}
                    {idoCreationError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"
                      >
                        <p className="text-red-400 text-sm">{idoCreationError}</p>
                      </motion.div>
                    )}

                    {idoCreationSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-500/10 border border-green-500/30 rounded-xl p-4"
                      >
                        <p className="text-green-400 text-sm">{idoCreationSuccess}</p>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={createFromScratch && !selectedProjectId}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                                 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                                 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 
                                 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 flex items-center gap-2"
                      >
                        <FiPlusCircle className="w-5 h-5" />
                        Create IDO Pool
                      </motion.button>
                    </div>
                  </form>

                  {/* IDO Management Section */}
                  <div className="mt-12 bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Existing IDO Pools</h3>
                        <p className="text-gray-400 text-sm">Manage and delete existing IDO pools</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={fetchExistingIdos}
                        className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-all duration-200"
                        title="Refresh IDO List"
                      >
                        <FiDownload className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {existingIdos.length > 0 ? (
                      <div className="space-y-4">
                        {existingIdos.map((ido) => (
                          <motion.div
                            key={ido.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-800/50 border border-gray-600/30 rounded-xl p-4 hover:border-gray-500/50 transition-all duration-300"
                          >
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                              {/* Project Info */}
                              <div className="flex items-center space-x-3">
                                {ido.project_submissions?.logo_url && (
                                  <img
                                    src={ido.project_submissions.logo_url}
                                    alt={ido.project_submissions.project_name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzM3NDE1MSIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiM5Q0EzQUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPj88L3RleHQ+Cjwvc3ZnPgo=';
                                    }}
                                  />
                                )}
                                <div>
                                  <div className="text-white font-medium">
                                    {ido.project_submissions?.project_name || 'Unknown Project'}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {ido.project_submissions?.token_symbol || 'TOKEN'}
                                  </div>
                                </div>
                              </div>

                              {/* Chain & Status */}
                              <div className="space-y-1">
                                <div className="text-sm text-gray-300">
                                  {getChainInfo(ido.chain_id).name}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <StatusBadge status={ido.status} />
                                </div>
                              </div>

                              {/* Financial Info */}
                              <div className="space-y-1">
                                <div className="text-sm text-gray-300">
                                  <span className="text-gray-400">Hard Cap:</span> {ido.hard_cap} {ido.native_token_symbol}
                                </div>
                                <div className="text-sm text-gray-300">
                                  <span className="text-gray-400">Rate:</span> {ido.presale_rate} tokens/{ido.native_token_symbol}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center space-x-2 justify-end">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => window.open(`/project/${ido.project_submissions?.slug}`, '_blank')}
                                  className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-all duration-200"
                                  title="View Project"
                                >
                                  <FiEye className="w-4 h-4" />
                                </motion.button>
                                
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setShowDeleteConfirm(ido.id)}
                                  className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-all duration-200"
                                  title="Delete IDO"
                                >
                                  <FiX className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-600/50 rounded-full flex items-center justify-center">
                          <FiPieChart className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-400 text-lg">No IDO pools found</p>
                        <p className="text-gray-500 text-sm mt-2">Create your first IDO pool above</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'ido-management' && (
                <motion.div
                  key="ido-management"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        IDO Pool Management
                      </h1>
                      <p className="text-gray-400">Manage all IDO pools and their status</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={fetchExistingIdos}
                        className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-500/30 transition-all duration-200 flex items-center gap-2"
                      >
                        <FiDownload className="w-4 h-4" />
                        <span className="hidden sm:inline">Refresh</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* IDO Management Grid */}
                  <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
                    <div className="p-6 border-b border-gray-700/50">
                      <h3 className="text-xl font-semibold text-white">All IDO Pools</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {existingIdos.length} pools found
                      </p>
                    </div>

                    {existingIdos.length > 0 ? (
                      <div className="divide-y divide-gray-700/30">
                        {existingIdos.map((ido, index) => (
                          <motion.div
                            key={ido.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 hover:bg-gray-700/20 transition-all duration-300 group"
                          >
                            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                              {/* Project Info with Logo */}
                              <div className="lg:col-span-2 flex items-center space-x-4">
                                {ido.project_submissions?.logo_url ? (
                                  <img
                                    src={ido.project_submissions.logo_url}
                                    alt={ido.project_submissions.project_name}
                                    className="w-16 h-16 rounded-xl object-cover border-2 border-gray-600/50"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IiMzNzQxNTEiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzlDQTNBRiI+CjxwYXRoIGQ9Ik0xNiA4YTggOCAwIDEgMSAwIDE2IDggOCAwIDAgMSAwLTE2ek0xMCAxNGE0IDQgMCAxIDAgOCAwIDQgNCAwIDAgMC04IDBaIi8+Cjwvc3ZnPgo=';
                                    }}
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                    {ido.project_submissions?.project_name?.substring(0, 2) || '??'}
                                  </div>
                                )}
                                <div>
                                  <div className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors duration-300">
                                    {ido.project_submissions?.project_name || 'Unknown Project'}
                                  </div>
                                  <div className="text-gray-400 text-sm">
                                    {ido.project_submissions?.token_symbol || 'TOKEN'}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {getChainInfo(ido.chain_id).name}
                                  </div>
                                </div>
                              </div>

                              {/* Financial Info */}
                              <div className="space-y-1">
                                <div className="text-white font-medium">{ido.hard_cap} {ido.native_token_symbol}</div>
                                <div className="text-xs text-gray-400">Hard Cap</div>
                              </div>

                              {/* Rate */}
                              <div className="space-y-1">
                                <div className="text-white font-medium">{ido.presale_rate}</div>
                                <div className="text-xs text-gray-400">Rate (tokens/{ido.native_token_symbol})</div>
                              </div>

                              {/* Status */}
                              <div className="flex items-center">
                                <StatusBadge status={ido.status} />
                              </div>

                              {/* Actions */}
                              <div className="flex items-center space-x-2 justify-end">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => window.open(`/project/${ido.project_submissions?.slug}`, '_blank')}
                                  className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-all duration-200"
                                  title="View Project"
                                >
                                  <FiEye className="w-4 h-4" />
                                </motion.button>
                                
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setShowDeleteConfirm(ido.id)}
                                  className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-all duration-200"
                                  title="Delete IDO"
                                >
                                  <FiX className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                          <FiPieChart className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-400 text-lg">No IDO pools found</p>
                        <p className="text-gray-500 text-sm mt-2">Create your first IDO pool in the "Create IDO" section</p>
                        
                        {/* Database setup notice */}
                        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl max-w-md mx-auto">
                          <p className="text-blue-400 text-sm font-medium mb-2">🔧 Database Setup Required?</p>
                          <p className="text-blue-300 text-xs">
                            If you're seeing relationship errors, run the database fix script:
                          </p>
                          <code className="text-blue-200 text-xs block mt-2 p-2 bg-blue-900/20 rounded">
                            node src/utils/fixIdoDatabase.js
                          </code>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'phase-management' && (
                <motion.div
                  key="phase-management"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <PhaseManagement adminUser={adminUser} />
                </motion.div>
              )}

              {activeTab === 'blog-management' && (
                <motion.div
                  key="blog-management"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                                 >
                   <BlogManagement adminUser={adminUser} />
                 </motion.div>
              )}

              {activeTab === 'admin-management' && (
                <motion.div
                  key="admin-management"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                                 >
                   <AdminManagementComponent adminUser={adminUser} />
                 </motion.div>
              )}

              {activeTab === 'partners-management' && (
                <motion.div
                  key="partners-management"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <PartnersManagement />
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8"
                >
                  <h2 className="text-3xl font-bold text-white mb-6">Settings</h2>
                  <p className="text-gray-400">Settings panel coming soon...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                  <FiX className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Delete IDO Pool</h3>
                <p className="text-gray-400 mb-6">
                  Are you sure you want to delete this IDO pool? This action cannot be undone and will remove the project from the landing page.
                </p>
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-gray-300 
                             hover:bg-gray-600/50 transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDeleteIDO(showDeleteConfirm)}
                    className="flex-1 px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 
                             hover:bg-red-500/30 transition-all duration-300"
                  >
                    Delete IDO
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Modal for Project Details */}
      <AnimatePresence>
        {showModal && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Project Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-300"
                >
                  <FiX className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">Project Name</label>
                    <p className="text-white font-medium">{selectedProject.project_name}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Token Symbol</label>
                    <p className="text-white font-medium">{selectedProject.token_symbol}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm">Description</label>
                  <p className="text-white">{selectedProject.description || 'No description provided'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">Status</label>
                    <div className="mt-1">
                      <StatusBadge status={selectedProject.status} />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Submitted</label>
                    <p className="text-white">{new Date(selectedProject.submitted_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              {selectedProject.status === 'pending' && (
                <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-700/50">
                  <button
                    onClick={() => {
                      handleUpdateProjectStatus(selectedProject.id, 'approved');
                      setShowModal(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                             text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 
                             shadow-lg hover:shadow-xl hover:shadow-green-500/25"
                  >
                    Approve Project
                  </button>
                  <button
                    onClick={() => {
                      handleUpdateProjectStatus(selectedProject.id, 'rejected');
                      setShowModal(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 
                             text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 
                             shadow-lg hover:shadow-xl hover:shadow-red-500/25"
                  >
                    Reject Project
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard; 