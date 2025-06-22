import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiClock, FiPlay, FiPause, FiSquare, FiSettings, FiCalendar, 
  FiEye, FiEdit, FiSave, FiX, FiRefreshCw, FiAlertTriangle,
  FiCheckCircle, FiCircle, FiPlayCircle
} from 'react-icons/fi';
import { supabase } from '../../supabaseClient';

type PhaseType = 'upcoming' | 'live' | 'filled' | 'claimable' | 'ended';

interface Project {
  id: string;
  project_name: string;
  token_symbol: string;
  logo_url: string;
  slug: string;
  presale_start: string;
  presale_end: string;
  current_phase?: PhaseType;
  phase_override?: PhaseType;
  phase_updated_at?: string;
  whitelist_start?: string;
  whitelist_end?: string;
  claim_start?: string;
  listing_date?: string;
  vesting_start?: string;
}

interface PhaseManagementProps {
  adminUser?: any;
}

const PhaseManagement: React.FC<PhaseManagementProps> = ({ adminUser }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Phase override states
  const [phaseOverride, setPhaseOverride] = useState<PhaseType | ''>('');
  const [customDates, setCustomDates] = useState({
    whitelist_start: '',
    whitelist_end: '',
    presale_start: '',
    presale_end: '',
    claim_start: '',
    listing_date: '',
    vesting_start: ''
  });

  const phaseOptions: { value: PhaseType; label: string; color: string; icon: any }[] = [
    { value: 'upcoming', label: 'UPCOMING', color: 'from-purple-500 to-violet-600', icon: FiClock },
    { value: 'live', label: 'LIVE/SWAP', color: 'from-green-500 to-emerald-600', icon: FiPlay },
    { value: 'filled', label: 'FILLED', color: 'from-blue-500 to-cyan-600', icon: FiPause },
    { value: 'claimable', label: 'CLAIMABLE', color: 'from-yellow-500 to-orange-600', icon: FiPlayCircle },
    { value: 'ended', label: 'ENDED', color: 'from-gray-500 to-slate-600', icon: FiSquare }
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_submissions')
        .select(`
          id, project_name, token_symbol, logo_url, slug,
          presale_start, presale_end, current_phase, phase_override,
          phase_updated_at, whitelist_start, whitelist_end,
          claim_start, listing_date, vesting_start
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      setError(`Failed to fetch projects: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getPhaseInfo = (project: Project) => {
    const now = new Date();
    const presaleStart = new Date(project.presale_start);
    const presaleEnd = new Date(project.presale_end);
    
    // If admin override is active, use that
    if (project.phase_override) {
      const overridePhase = phaseOptions.find(p => p.value === project.phase_override);
      return {
        currentPhase: project.phase_override,
        isOverride: true,
        ...overridePhase
      };
    }

    // Auto-calculated phase
    let currentPhase: PhaseType = 'upcoming';
    if (now >= presaleStart && now <= presaleEnd) {
      currentPhase = 'live';
    } else if (now > presaleEnd) {
      // Simple logic: if presale ended, check if we have claim date
      if (project.claim_start && now >= new Date(project.claim_start)) {
        if (project.listing_date && now >= new Date(project.listing_date)) {
          currentPhase = 'ended';
        } else {
          currentPhase = 'claimable';
        }
      } else {
        currentPhase = 'filled';
      }
    }

    const phaseInfo = phaseOptions.find(p => p.value === currentPhase);
    return {
      currentPhase,
      isOverride: false,
      ...phaseInfo
    };
  };

  const handleOpenPhaseModal = (project: Project) => {
    setSelectedProject(project);
    setPhaseOverride(project.phase_override || '');
    
    // Populate custom dates
    setCustomDates({
      whitelist_start: project.whitelist_start ? new Date(project.whitelist_start).toISOString().slice(0, 16) : '',
      whitelist_end: project.whitelist_end ? new Date(project.whitelist_end).toISOString().slice(0, 16) : '',
      presale_start: project.presale_start ? new Date(project.presale_start).toISOString().slice(0, 16) : '',
      presale_end: project.presale_end ? new Date(project.presale_end).toISOString().slice(0, 16) : '',
      claim_start: project.claim_start ? new Date(project.claim_start).toISOString().slice(0, 16) : '',
      listing_date: project.listing_date ? new Date(project.listing_date).toISOString().slice(0, 16) : '',
      vesting_start: project.vesting_start ? new Date(project.vesting_start).toISOString().slice(0, 16) : ''
    });
    
    setShowPhaseModal(true);
    setError(null);
    setSuccess(null);
  };

  const handleSavePhaseSettings = async () => {
    if (!selectedProject) return;

    try {
      const updates: any = {
        phase_updated_at: new Date().toISOString()
      };

      // Phase override
      if (phaseOverride) {
        updates.phase_override = phaseOverride;
        updates.current_phase = phaseOverride;
      } else {
        updates.phase_override = null;
      }

      // Custom dates (only update if provided)
      Object.entries(customDates).forEach(([key, value]) => {
        if (value) {
          updates[key] = new Date(value).toISOString();
        }
      });

      const { error } = await supabase
        .from('project_submissions')
        .update(updates)
        .eq('id', selectedProject.id);

      if (error) throw error;

      setSuccess(`Phase settings updated for ${selectedProject.project_name}!`);
      fetchProjects(); // Refresh the list
      
      // Auto-close modal after success
      setTimeout(() => {
        setShowPhaseModal(false);
        setSuccess(null);
      }, 2000);

    } catch (err: any) {
      setError(`Failed to update phase settings: ${err.message}`);
    }
  };

  const handleClearOverride = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('project_submissions')
        .update({
          phase_override: null,
          phase_updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      setSuccess('Phase override cleared! Project will use automatic phase calculation.');
      fetchProjects();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(`Failed to clear override: ${err.message}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex items-center space-x-3">
          <FiRefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
          <span className="text-gray-300">Loading projects...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Phase Management
          </h1>
          <p className="text-gray-400">Control project phases, set custom dates, and manage phase overrides</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchProjects}
          className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-500/30 transition-all duration-200 flex items-center gap-2"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Refresh</span>
        </motion.button>
      </div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3"
          >
            <FiAlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
              <FiX className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3"
          >
            <FiCheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-green-400">{success}</p>
            <button onClick={() => setSuccess(null)} className="ml-auto text-green-400 hover:text-green-300">
              <FiX className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects List */}
      <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
        <div className="p-6 border-b border-gray-700/50">
          <h3 className="text-xl font-semibold text-white">Project Phases</h3>
          <p className="text-gray-400 text-sm mt-1">
            {projects.length} approved projects
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="divide-y divide-gray-700/30">
            {projects.map((project, index) => {
              const phaseInfo = getPhaseInfo(project);
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-700/20 transition-all duration-300 group"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                    {/* Project Info */}
                    <div className="lg:col-span-2 flex items-center space-x-4">
                      {project.logo_url ? (
                        <img
                          src={project.logo_url}
                          alt={project.project_name}
                          className="w-16 h-16 rounded-xl object-cover border-2 border-gray-600/50"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IiMzNzQxNTEiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzlDQTNBRiI+CjxwYXRoIGQ9Ik0xNiA4YTggOCAwIDEgMSAwIDE2IDggOCAwIDAgMSAwLTE2ek0xMCAxNGE0IDQgMCAxIDAgOCAwIDQgNCAwIDAgMC04IDBaIi8+Cjwvc3ZnPgo=';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {project.project_name?.substring(0, 2) || '??'}
                        </div>
                      )}
                      <div>
                        <div className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors duration-300">
                          {project.project_name}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {project.token_symbol}
                        </div>
                      </div>
                    </div>

                    {/* Current Phase */}
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${phaseInfo.color}`}>
                        <phaseInfo.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{phaseInfo.label}</div>
                        {phaseInfo.isOverride && (
                          <div className="text-xs text-yellow-400 flex items-center gap-1">
                            <FiSettings className="w-3 h-3" />
                            Override Active
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="lg:col-span-2 space-y-1">
                      <div className="text-sm text-gray-300">
                        <span className="text-gray-400">Start:</span> {formatDate(project.presale_start)}
                      </div>
                      <div className="text-sm text-gray-300">
                        <span className="text-gray-400">End:</span> {formatDate(project.presale_end)}
                      </div>
                      {project.phase_updated_at && (
                        <div className="text-xs text-gray-500">
                          Last updated: {formatDate(project.phase_updated_at)}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(`/project/${project.slug}`, '_blank')}
                        className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-all duration-200"
                        title="View Project"
                      >
                        <FiEye className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleOpenPhaseModal(project)}
                        className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-all duration-200"
                        title="Manage Phase"
                      >
                        <FiEdit className="w-4 h-4" />
                      </motion.button>

                      {project.phase_override && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleClearOverride(project.id)}
                          className="p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 hover:bg-yellow-500/30 transition-all duration-200"
                          title="Clear Override"
                        >
                          <FiX className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
              <FiClock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg">No approved projects found</p>
            <p className="text-gray-500 text-sm mt-2">Approve projects in the Project Management section first</p>
          </div>
        )}
      </div>

      {/* Phase Management Modal */}
      <AnimatePresence>
        {showPhaseModal && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowPhaseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">Phase Management</h3>
                  <p className="text-gray-400">{selectedProject.project_name}</p>
                </div>
                <button
                  onClick={() => setShowPhaseModal(false)}
                  className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-300"
                >
                  <FiX className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Phase Override Section */}
                <div className="bg-gray-700/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FiSettings className="w-5 h-5" />
                    Phase Override
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Force the project to a specific phase. Leave empty to use automatic phase calculation.
                  </p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPhaseOverride('')}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        phaseOverride === '' 
                          ? 'bg-gray-600/50 border-gray-500 text-white' 
                          : 'bg-gray-700/30 border-gray-600/50 text-gray-400 hover:border-gray-500/70'
                      }`}
                    >
                      <FiCircle className="w-5 h-5 mx-auto mb-2" />
                      <div className="text-sm font-medium">Automatic</div>
                    </motion.button>
                    
                    {phaseOptions.map((phase) => (
                      <motion.button
                        key={phase.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPhaseOverride(phase.value)}
                        className={`p-4 rounded-xl border transition-all duration-300 ${
                          phaseOverride === phase.value
                            ? `bg-gradient-to-r ${phase.color} border-transparent text-white shadow-lg`
                            : 'bg-gray-700/30 border-gray-600/50 text-gray-400 hover:border-gray-500/70'
                        }`}
                      >
                        <phase.icon className="w-5 h-5 mx-auto mb-2" />
                        <div className="text-sm font-medium">{phase.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Custom Dates Section */}
                <div className="bg-gray-700/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FiCalendar className="w-5 h-5" />
                    Custom Dates
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Override default date calculations. Leave empty to use automatic calculations.
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Whitelist Start
                      </label>
                      <input
                        type="datetime-local"
                        value={customDates.whitelist_start}
                        onChange={(e) => setCustomDates(prev => ({ ...prev, whitelist_start: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Whitelist End
                      </label>
                      <input
                        type="datetime-local"
                        value={customDates.whitelist_end}
                        onChange={(e) => setCustomDates(prev => ({ ...prev, whitelist_end: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Presale Start
                      </label>
                      <input
                        type="datetime-local"
                        value={customDates.presale_start}
                        onChange={(e) => setCustomDates(prev => ({ ...prev, presale_start: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Presale End
                      </label>
                      <input
                        type="datetime-local"
                        value={customDates.presale_end}
                        onChange={(e) => setCustomDates(prev => ({ ...prev, presale_end: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Claim Start
                      </label>
                      <input
                        type="datetime-local"
                        value={customDates.claim_start}
                        onChange={(e) => setCustomDates(prev => ({ ...prev, claim_start: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Listing Date
                      </label>
                      <input
                        type="datetime-local"
                        value={customDates.listing_date}
                        onChange={(e) => setCustomDates(prev => ({ ...prev, listing_date: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Vesting Start
                      </label>
                      <input
                        type="datetime-local"
                        value={customDates.vesting_start}
                        onChange={(e) => setCustomDates(prev => ({ ...prev, vesting_start: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700/50">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPhaseModal(false)}
                    className="px-6 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-gray-300 hover:bg-gray-600/50 transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSavePhaseSettings}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 flex items-center gap-2"
                  >
                    <FiSave className="w-4 h-4" />
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhaseManagement; 