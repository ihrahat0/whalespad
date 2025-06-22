import { supabase } from '../supabaseClient';
import web3Service from './web3Service';

interface IDOPhaseUpdate {
  id: string;
  current_phase: string;
  phase_updated_at: string;
  contract_address?: string;
}

class AutomationService {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor() {
    this.setupRealtimeSubscriptions();
  }

  // Start automation monitoring
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🤖 Automation Service Started');
    
    // Check every 30 seconds for phase updates
    this.intervalId = setInterval(() => {
      this.checkPhaseUpdates();
      this.syncWithBlockchain();
    }, 30000);
  }

  // Stop automation monitoring
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('🛑 Automation Service Stopped');
  }

  // Setup real-time subscriptions for database changes
  private setupRealtimeSubscriptions() {
    // Listen for IDO pool updates
    supabase
      .channel('ido-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'project_submissions'
      }, (payload) => {
        console.log('📡 Real-time update:', payload);
        this.handleDatabaseUpdate(payload);
      })
      .subscribe();

    // Listen for phase management updates
    supabase
      .channel('phase-updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'project_submissions',
        filter: 'phase_override=neq.null'
      }, (payload) => {
        console.log('⚙️ Phase override detected:', payload);
        this.handlePhaseOverride(payload);
      })
      .subscribe();
  }

  // Handle database updates
  private async handleDatabaseUpdate(payload: any) {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    if (eventType === 'UPDATE' && newRecord && oldRecord) {
      // Check if contract address was added
      if (!oldRecord.ido_presale_contract && newRecord.ido_presale_contract) {
        await this.initializeContractMonitoring(newRecord);
      }
      
      // Check if phase changed
      if (oldRecord.current_phase !== newRecord.current_phase) {
        await this.triggerPhaseActions(newRecord);
      }
    }
  }

  // Handle admin phase overrides
  private async handlePhaseOverride(payload: any) {
    const project = payload.new;
    console.log(`🔧 Phase override for project ${project.id}: ${project.phase_override}`);
    
    // Trigger blockchain actions if needed
    if (project.ido_presale_contract) {
      await this.executePhaseTransition(project);
    }
  }

  // Check for automatic phase updates based on time
  private async checkPhaseUpdates() {
    try {
      const { data: projects, error } = await supabase
        .from('project_submissions')
        .select('*')
        .in('current_phase', ['upcoming', 'live', 'filled', 'claimable'])
        .is('phase_override', null); // Only auto-update non-overridden projects

      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }

      for (const project of projects || []) {
        await this.checkProjectPhaseTransition(project);
      }
    } catch (error) {
      console.error('Error in phase update check:', error);
    }
  }

  // Check if a specific project needs phase transition
  private async checkProjectPhaseTransition(project: any) {
    const now = new Date();
    const presaleStart = new Date(project.presale_start);
    const presaleEnd = new Date(project.presale_end);
    const claimStart = project.claim_start ? new Date(project.claim_start) : new Date(presaleEnd.getTime() + 24 * 60 * 60 * 1000);
    const listingDate = project.listing_date ? new Date(project.listing_date) : new Date(presaleEnd.getTime() + 7 * 24 * 60 * 60 * 1000);

    let newPhase = project.current_phase;

    // Determine correct phase based on time
    if (now >= listingDate) {
      newPhase = 'ended';
    } else if (now >= claimStart) {
      newPhase = 'claimable';
    } else if (now > presaleEnd) {
      newPhase = 'filled';
    } else if (now >= presaleStart) {
      newPhase = 'live';
    }

    // Update phase if changed
    if (newPhase !== project.current_phase) {
      console.log(`⏰ Auto-advancing project ${project.id} from ${project.current_phase} to ${newPhase}`);
      
      await this.updateProjectPhase(project.id, newPhase);
      await this.triggerPhaseActions({ ...project, current_phase: newPhase });
    }
  }

  // Update project phase in database
  private async updateProjectPhase(projectId: string, newPhase: string) {
    const { error } = await supabase
      .from('project_submissions')
      .update({
        current_phase: newPhase,
        phase_updated_at: new Date().toISOString()
      })
      .eq('id', projectId);

    if (error) {
      console.error('Error updating project phase:', error);
    }
  }

  // Trigger actions based on phase changes
  private async triggerPhaseActions(project: any) {
    const phase = project.current_phase;
    
    switch (phase) {
      case 'live':
        await this.handleLivePhase(project);
        break;
      case 'filled':
        await this.handleFilledPhase(project);
        break;
      case 'claimable':
        await this.handleClaimablePhase(project);
        break;
      case 'ended':
        await this.handleEndedPhase(project);
        break;
    }
  }

  // Handle live phase activation
  private async handleLivePhase(project: any) {
    console.log(`🚀 Project ${project.project_name} is now LIVE!`);
    
    // Start contract if deployed
    if (project.ido_presale_contract) {
      try {
        // You would call startPool() on the contract here
        console.log('Starting IDO pool contract...');
      } catch (error) {
        console.error('Error starting pool:', error);
      }
    }
    
    // Send notifications
    await this.sendPhaseNotification(project, 'live');
  }

  // Handle filled phase
  private async handleFilledPhase(project: any) {
    console.log(`✅ Project ${project.project_name} presale completed!`);
    
    // Finalize contract
    if (project.ido_presale_contract) {
      try {
        // You would call finishPool() on the contract here
        console.log('Finalizing IDO pool contract...');
      } catch (error) {
        console.error('Error finalizing pool:', error);
      }
    }
    
    await this.sendPhaseNotification(project, 'filled');
  }

  // Handle claimable phase
  private async handleClaimablePhase(project: any) {
    console.log(`🎉 Tokens are now claimable for ${project.project_name}!`);
    await this.sendPhaseNotification(project, 'claimable');
  }

  // Handle ended phase
  private async handleEndedPhase(project: any) {
    console.log(`🏁 Project ${project.project_name} has ended.`);
    await this.sendPhaseNotification(project, 'ended');
  }

  // Send notifications for phase changes
  private async sendPhaseNotification(project: any, phase: string) {
    // Here you would integrate with email/push notification services
    console.log(`📧 Sending ${phase} notification for ${project.project_name}`);
    
    // Example: Add to notifications table
    try {
      await supabase
        .from('notifications')
        .insert({
          type: 'phase_change',
          project_id: project.id,
          phase: phase,
          message: `Project ${project.project_name} entered ${phase} phase`,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  }

  // Initialize monitoring for new contracts
  private async initializeContractMonitoring(project: any) {
    console.log(`🔗 Initializing contract monitoring for ${project.project_name}`);
    
    // You could add contract event listeners here
    // For example, listen for Contributed events to update raised amounts
  }

  // Execute phase transition on blockchain
  private async executePhaseTransition(project: any) {
    console.log(`⛓️ Executing blockchain phase transition for ${project.project_name}`);
    
    // This would interact with your smart contracts based on the phase
    // For example, starting/ending the sale, enabling claims, etc.
  }

  // Sync data with blockchain
  private async syncWithBlockchain() {
    try {
      // Get all active projects with contract addresses
      const { data: projects, error } = await supabase
        .from('project_submissions')
        .select('*')
        .not('ido_presale_contract', 'is', null)
        .in('current_phase', ['live', 'filled', 'claimable']);

      if (error || !projects) return;

      for (const project of projects) {
        await this.syncProjectWithContract(project);
      }
    } catch (error) {
      console.error('Error syncing with blockchain:', error);
    }
  }

  // Sync individual project with its contract
  private async syncProjectWithContract(project: any) {
    try {
      if (!project.ido_presale_contract) return;

      // Get current data from contract
      const poolInfo = await web3Service.getPoolInfo(project.ido_presale_contract);
      
      if (poolInfo) {
        // Update database with real-time contract data
        await supabase
          .from('project_submissions')
          .update({
            real_current_raised: poolInfo.totalRaised,
            real_progress_percentage: (parseFloat(poolInfo.totalRaised) / parseFloat(poolInfo.hardCap)) * 100,
            stats_last_updated: new Date().toISOString()
          })
          .eq('id', project.id);
      }
    } catch (error) {
      console.error(`Error syncing project ${project.id}:`, error);
    }
  }

  // Get automation status
  getStatus() {
    return {
      isRunning: this.isRunning,
      startedAt: this.intervalId ? new Date() : null
    };
  }
}

export default new AutomationService(); 