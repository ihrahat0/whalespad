import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

const PartnersManagement: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    website_url: '',
    is_active: true,
    display_order: 1
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPartner) {
        // Update existing partner
        const { error } = await supabase
          .from('partners')
          .update(formData)
          .eq('id', editingPartner.id);

        if (error) throw error;
        alert('Partner updated successfully!');
      } else {
        // Add new partner
        const { error } = await supabase
          .from('partners')
          .insert([formData]);

        if (error) throw error;
        alert('Partner added successfully!');
      }

      // Reset form and refresh data
      setFormData({
        name: '',
        logo_url: '',
        website_url: '',
        is_active: true,
        display_order: 1
      });
      setShowAddForm(false);
      setEditingPartner(null);
      fetchPartners();
    } catch (error) {
      console.error('Error saving partner:', error);
      alert('Error saving partner. Please try again.');
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      logo_url: partner.logo_url,
      website_url: partner.website_url,
      is_active: partner.is_active,
      display_order: partner.display_order
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      alert('Partner deleted successfully!');
      setShowDeleteConfirm(null);
      fetchPartners();
    } catch (error) {
      console.error('Error deleting partner:', error);
      alert('Error deleting partner. Please try again.');
    }
  };

  const toggleActive = async (partner: Partner) => {
    try {
      const { error } = await supabase
        .from('partners')
        .update({ is_active: !partner.is_active })
        .eq('id', partner.id);

      if (error) throw error;
      
      fetchPartners();
    } catch (error) {
      console.error('Error updating partner status:', error);
      alert('Error updating partner status. Please try again.');
    }
  };

  const cancelEdit = () => {
    setShowAddForm(false);
    setEditingPartner(null);
    setFormData({
      name: '',
      logo_url: '',
      website_url: '',
      is_active: true,
      display_order: 1
    });
  };

  if (loading) {
    return <div className="loading">Loading partners...</div>;
  }

  return (
    <div className="admin-content">
      <div className="admin-header">
        <h1>Partners Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          Add New Partner
        </button>
      </div>

      {/* Add/Edit Partner Form */}
      {showAddForm && (
        <motion.div 
          className="admin-form-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="admin-form-modal"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
          >
            <h2>{editingPartner ? 'Edit Partner' : 'Add New Partner'}</h2>
            <form onSubmit={handleSubmit} className="partner-form">
              <div className="form-group">
                <label>Partner Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Enter partner name"
                />
              </div>

              <div className="form-group">
                <label>Logo URL</label>
                <input
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                  required
                  placeholder="https://example.com/logo.png"
                />
                {formData.logo_url && (
                  <div className="logo-preview">
                    <img src={formData.logo_url} alt="Preview" style={{maxWidth: '200px', maxHeight: '100px', objectFit: 'contain'}} />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Website URL</label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                  required
                  placeholder="https://partner-website.com"
                />
              </div>

              <div className="form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  />
                  Active
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingPartner ? 'Update Partner' : 'Add Partner'}
                </button>
                <button type="button" className="btn-secondary" onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Partners List */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Name</th>
              <th>Website</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner.id}>
                <td>
                  <img 
                    src={partner.logo_url} 
                    alt={partner.name}
                    style={{maxWidth: '60px', maxHeight: '40px', objectFit: 'contain'}}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder-logo.png';
                    }}
                  />
                </td>
                <td>{partner.name}</td>
                <td>
                  <a href={partner.website_url} target="_blank" rel="noopener noreferrer">
                    {partner.website_url}
                  </a>
                </td>
                <td>{partner.display_order}</td>
                <td>
                  <button
                    className={`status-toggle ${partner.is_active ? 'active' : 'inactive'}`}
                    onClick={() => toggleActive(partner)}
                  >
                    {partner.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(partner)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => setShowDeleteConfirm(partner.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {partners.length === 0 && (
          <div className="empty-state">
            <p>No partners found. Add your first partner to get started!</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="admin-form-overlay">
          <div className="admin-form-modal">
            <h2>Delete Partner</h2>
            <p>Are you sure you want to delete this partner? This action cannot be undone.</p>
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-delete" 
                onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
              >
                Delete Partner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnersManagement; 