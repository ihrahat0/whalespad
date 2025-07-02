import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff, FiSave, FiX } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  is_active: boolean;
  display_order: number;
}

interface CategoryManagementProps {
  adminUser: { id: string; username: string; role: string };
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({ adminUser }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: '💰'
  });

  const availableIcons = ['💰', '🔒', '🚀', '💎', '⭐', '🔥', '💫', '🎯', '⚡', '🌟'];
  const availableColors = [
    '#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', 
    '#EF4444', '#EC4899', '#6366F1', '#84CC16', '#F97316'
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sale_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch categories');
      } else {
        setCategories(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '_')
      .replace(/-+/g, '_')
      .replace(/^-+|-+$/g, '');
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setLoading(true);
      const slug = generateSlug(formData.name);
      const maxOrder = Math.max(...categories.map(c => c.display_order), 0);

      const { error } = await supabase
        .from('sale_categories')
        .insert([{
          name: formData.name.trim(),
          slug,
          description: formData.description.trim(),
          color: formData.color,
          icon: formData.icon,
          display_order: maxOrder + 1
        }]);

      if (error) {
        if (error.code === '23505') {
          setError('A category with this name already exists');
        } else {
          throw error;
        }
      } else {
        setSuccess('Category created successfully!');
        setFormData({ name: '', description: '', color: '#3B82F6', icon: '💰' });
        setShowCreateForm(false);
        fetchCategories();
      }
    } catch (err: any) {
      console.error('Error creating category:', err);
      setError(err.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (category: Category) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('sale_categories')
        .update({
          name: category.name,
          description: category.description,
          color: category.color,
          icon: category.icon
        })
        .eq('id', category.id);

      if (error) throw error;

      setSuccess('Category updated successfully!');
      setEditingCategory(null);
      fetchCategories();
    } catch (err: any) {
      console.error('Error updating category:', err);
      setError(err.message || 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryStatus = async (categoryId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('sale_categories')
        .update({ is_active: !currentStatus })
        .eq('id', categoryId);

      if (error) throw error;

      setSuccess(`Category ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      fetchCategories();
    } catch (err: any) {
      console.error('Error toggling category status:', err);
      setError(err.message || 'Failed to update category status');
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"? This will affect all projects using this category.`)) {
      return;
    }

    try {
      setLoading(true);
      
      // Check if any projects are using this category
      const { data: projects, error: checkError } = await supabase
        .from('project_submissions')
        .select('id')
        .eq('custom_category', categoryName.toLowerCase().replace(/\s+/g, '_'));

      if (checkError) throw checkError;

      if (projects && projects.length > 0) {
        setError(`Cannot delete category "${categoryName}" because ${projects.length} project(s) are using it.`);
        return;
      }

      const { error } = await supabase
        .from('sale_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      setSuccess('Category deleted successfully!');
      fetchCategories();
    } catch (err: any) {
      console.error('Error deleting category:', err);
      setError(err.message || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Sale Categories</h1>
          <p className="text-gray-400">Manage sale categories for your launchpad</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            clearMessages();
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg text-white font-semibold shadow-lg"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Category</span>
        </motion.button>
      </div>

      {/* Alerts */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg flex justify-between items-center"
        >
          <span>{error}</span>
          <button onClick={clearMessages}><FiX className="w-4 h-4" /></button>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg flex justify-between items-center"
        >
          <span>{success}</span>
          <button onClick={clearMessages}><FiX className="w-4 h-4" /></button>
        </motion.div>
      )}

      {/* Create Category Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Create New Category</h2>
          
          <form onSubmit={handleCreateCategory} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Private Sale"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Icon</label>
                <div className="grid grid-cols-5 gap-2">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`p-3 rounded-lg text-2xl transition-all ${
                        formData.icon === icon
                          ? 'bg-blue-500/30 border-2 border-blue-500'
                          : 'bg-gray-700/50 border border-gray-600 hover:bg-gray-600/50'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Brief description of this category..."
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Color</label>
              <div className="grid grid-cols-5 gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-12 h-12 rounded-lg transition-all ${
                      formData.color === color
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800'
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Category'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Categories List */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Categories ({categories.length})</h2>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📂</div>
            <p className="text-gray-400">No categories created yet</p>
            <p className="text-gray-500 text-sm">Create your first category to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-gray-700/20 transition-colors"
              >
                {editingCategory?.id === category.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      />
                      <textarea
                        value={editingCategory.description}
                        onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                        rows={2}
                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      />
                    </div>
                    
                    <div className="flex space-x-4">
                      <div className="flex space-x-2">
                        {availableIcons.map((icon) => (
                          <button
                            key={icon}
                            onClick={() => setEditingCategory({ ...editingCategory, icon })}
                            className={`p-2 rounded text-lg ${
                              editingCategory.icon === icon ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setEditingCategory({ ...editingCategory, color })}
                          className={`w-8 h-8 rounded ${
                            editingCategory.color === color ? 'ring-2 ring-white' : ''
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateCategory(editingCategory)}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        <FiSave className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        <FiX className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                        style={{ backgroundColor: category.color + '20', color: category.color }}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                        <p className="text-gray-400 text-sm">{category.description || 'No description'}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">Slug: {category.slug}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            category.is_active 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {category.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleCategoryStatus(category.id, category.is_active)}
                        className={`p-2 rounded-lg transition-colors ${
                          category.is_active 
                            ? 'text-yellow-400 hover:bg-yellow-500/20' 
                            : 'text-green-400 hover:bg-green-500/20'
                        }`}
                        title={category.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {category.is_active ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id, category.name)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement; 