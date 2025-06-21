import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash, FiPlusCircle, FiImage, FiEye, FiHeart, FiArrowLeft, FiSettings } from 'react-icons/fi';
import { supabase } from '../../supabaseClient'; // Import Supabase client
import { Link } from 'react-router-dom';

type Blog = {
  id: number;
  title: string;
  content: string;
  author_id: string; // Changed to string for Supabase UUID
  author_name: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  views: number;
  love_reactions: number;
  banner_image_url?: string;
};

interface BlogManagementProps {
  adminUser: any;
}

const BlogManagement: React.FC<BlogManagementProps> = ({ adminUser }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'create'
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [newBlogStatus, setNewBlogStatus] = useState<'draft' | 'published'>('draft');
  const [newBlogBannerUrl, setNewBlogBannerUrl] = useState('');

  const authorId = adminUser.id; // Using adminUser prop

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select(`*,
          admins (username)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      // Map the data to include author_name directly
      const formattedBlogs: Blog[] = (data || []).map(blog => ({
        ...blog,
        author_name: blog.admins ? blog.admins.username : 'Unknown', // Access username from joined table
        views: blog.views || 0, // Ensure views is a number, default to 0
        love_reactions: blog.love_reactions || 0, // Ensure love_reactions is a number, default to 0
      }));

      setBlogs(formattedBlogs);

    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle || !newBlogContent || !authorId) {
      setError('Title, content, and author are required.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('blogs')
        .insert([
          {
            title: newBlogTitle,
            content: newBlogContent,
            author_id: authorId,
            status: newBlogStatus,
            views: 0,
            love_reactions: 0,
            banner_image_url: newBlogBannerUrl || null,
          },
        ])
        .select(); // Use select to return the inserted data

      if (error) {
        throw error;
      }

      setNewBlogTitle('');
      setNewBlogContent('');
      setNewBlogStatus('draft');
      setNewBlogBannerUrl('');
      setActiveTab('list');
      fetchBlogs();
    } catch (e: any) {
      setError(`Failed to create blog: ${e.message}`);
    }
  };

  const handleEditClick = (blog: Blog) => {
    setEditingBlog(blog);
    setNewBlogTitle(blog.title);
    setNewBlogContent(blog.content);
    setNewBlogStatus(blog.status);
    setNewBlogBannerUrl(blog.banner_image_url || '');
    setActiveTab('create');
  };

  const handleUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog || !newBlogTitle || !newBlogContent || !authorId) {
      setError('Title, content, and author are required.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('blogs')
        .update({
          title: newBlogTitle,
          content: newBlogContent,
          status: newBlogStatus,
          banner_image_url: newBlogBannerUrl || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingBlog.id)
        .select(); // Use select to return the updated data

      if (error) {
        throw error;
      }

      setEditingBlog(null);
      setNewBlogTitle('');
      setNewBlogContent('');
      setNewBlogStatus('draft');
      setNewBlogBannerUrl('');
      setActiveTab('list');
      fetchBlogs();
    } catch (e: any) {
      setError(`Failed to update blog: ${e.message}`);
    }
  };

  const handleDeleteBlog = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      fetchBlogs();
    } catch (e: any) {
      setError(`Failed to delete blog: ${e.message}`);
    }
  };

  const handleUpdateViews = async (blogId: number, currentViews: number) => {
    const newViews = prompt(`Enter new views for blog ID ${blogId}:`, currentViews.toString());
    if (newViews !== null) {
      const parsedViews = parseInt(newViews);
      if (!isNaN(parsedViews) && parsedViews >= 0) {
        try {
          const { error } = await supabase
            .from('blogs')
            .update({ views: parsedViews })
            .eq('id', blogId);
          if (error) throw error;
          fetchBlogs();
        } catch (e: any) {
          setError(`Failed to update views: ${e.message}`);
        }
      } else {
        setError('Invalid number for views.');
      }
    }
  };

  const handleUpdateLoveReactions = async (blogId: number, currentLoveReactions: number) => {
    const newLoveReactions = prompt(`Enter new love reactions for blog ID ${blogId}:`, currentLoveReactions.toString());
    if (newLoveReactions !== null) {
      const parsedLoveReactions = parseInt(newLoveReactions);
      if (!isNaN(parsedLoveReactions) && parsedLoveReactions >= 0) {
        try {
          const { error } = await supabase
            .from('blogs')
            .update({ love_reactions: parsedLoveReactions })
            .eq('id', blogId);
          if (error) throw error;
          fetchBlogs();
        } catch (e: any) {
          setError(`Failed to update love reactions: ${e.message}`);
        }
      } else {
        setError('Invalid number for love reactions.');
      }
    }
  };

  const previewBannerImage = (url: string) => {
    if (!url) return null;
    
    return (
      <div className="mt-2 mb-4">
        <img 
          src={url} 
          alt="Banner preview" 
          className="max-h-40 rounded-lg border border-gray-700 object-cover"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20">
      {/* Admin Header - Clean and Professional */}
      <div className="bg-gray-800/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/admin/dashboard" 
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <FiSettings className="w-6 h-6 text-purple-400" />
                <h1 className="text-2xl font-bold text-white">Blog Management</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'list' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                }`}
                onClick={() => {
                  setActiveTab('list');
                  setEditingBlog(null);
                  setNewBlogTitle('');
                  setNewBlogContent('');
                  setNewBlogStatus('draft');
                  setNewBlogBannerUrl('');
                }}
              >
                Blog List
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'create' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                }`}
                onClick={() => {
                  setActiveTab('create');
                  setEditingBlog(null);
                  setNewBlogTitle('');
                  setNewBlogContent('');
                  setNewBlogStatus('draft');
                  setNewBlogBannerUrl('');
                }}
              >
                <FiPlusCircle className="w-4 h-4" />
                <span>Create New Blog</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-900/20 border border-red-500/30 text-red-200 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          {activeTab === 'list' ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Title</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Author</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Created</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">
                          <FiEye className="w-4 h-4" />
                          <span>Views</span>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">
                          <FiHeart className="w-4 h-4" />
                          <span>Reactions</span>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Banner</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/30">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center">
                          <div className="flex items-center justify-center space-x-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
                            <span className="text-gray-300">Loading blogs...</span>
                          </div>
                        </td>
                      </tr>
                    ) : blogs.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center space-y-3">
                            <FiPlusCircle className="w-12 h-12 text-gray-500" />
                            <span className="text-gray-400">No blog posts found.</span>
                            <button
                              onClick={() => setActiveTab('create')}
                              className="text-purple-400 hover:text-purple-300 font-medium"
                            >
                              Create your first blog post
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      blogs.map((blog, index) => (
                        <motion.tr 
                          key={blog.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-700/20 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 text-white font-medium">
                            <div className="max-w-xs">
                              <div className="truncate">{blog.title}</div>
                              {blog.title.length > 30 && (
                                <div className="text-xs text-gray-400 mt-1">Click to edit for full title</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-300">{blog.author_name}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              blog.status === 'published' 
                                ? 'bg-green-900/30 text-green-400 border border-green-700/30' 
                                : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/30'
                            }`}>
                              {blog.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {new Date(blog.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span 
                              className="text-gray-300 cursor-pointer hover:text-blue-400 transition-colors px-2 py-1 rounded hover:bg-blue-900/20"
                              onClick={() => handleUpdateViews(blog.id, blog.views)}
                              title="Click to edit views"
                            >
                              {blog.views}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span 
                              className="text-gray-300 cursor-pointer hover:text-pink-400 transition-colors px-2 py-1 rounded hover:bg-pink-900/20"
                              onClick={() => handleUpdateLoveReactions(blog.id, blog.love_reactions)}
                              title="Click to edit reactions"
                            >
                              {blog.love_reactions}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {blog.banner_image_url ? (
                              <a 
                                href={blog.banner_image_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 flex items-center space-x-1 transition-colors"
                              >
                                <FiImage className="w-4 h-4" />
                                <span>View</span>
                              </a>
                            ) : (
                              <span className="text-gray-500">None</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleEditClick(blog)}
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 p-2 rounded-lg transition-all duration-200"
                                title="Edit blog"
                              >
                                <FiEdit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(blog.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded-lg transition-all duration-200"
                                title="Delete blog"
                              >
                                <FiTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700/30"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                <p className="text-gray-400">
                  {editingBlog ? 'Update your blog post details below.' : 'Fill in the details to create a new blog post.'}
                </p>
              </div>
              
              <form onSubmit={editingBlog ? handleUpdateBlog : handleCreateBlog} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <label htmlFor="blogTitle" className="block text-gray-300 text-sm font-semibold mb-3">
                      Blog Title *
                    </label>
                    <input
                      type="text"
                      id="blogTitle"
                      className="w-full py-3 px-4 bg-gray-700/50 backdrop-blur-sm text-white rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                      value={newBlogTitle}
                      onChange={(e) => setNewBlogTitle(e.target.value)}
                      placeholder="Enter an engaging blog title..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="blogStatus" className="block text-gray-300 text-sm font-semibold mb-3">
                      Publication Status
                    </label>
                    <select
                      id="blogStatus"
                      className="w-full py-3 px-4 bg-gray-700/50 backdrop-blur-sm text-white rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                      value={newBlogStatus}
                      onChange={(e) => setNewBlogStatus(e.target.value as 'draft' | 'published')}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="blogBannerUrl" className="block text-gray-300 text-sm font-semibold mb-3">
                      Banner Image URL
                    </label>
                    <input
                      type="url"
                      id="blogBannerUrl"
                      className="w-full py-3 px-4 bg-gray-700/50 backdrop-blur-sm text-white rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                      value={newBlogBannerUrl}
                      onChange={(e) => setNewBlogBannerUrl(e.target.value)}
                      placeholder="https://example.com/banner-image.jpg"
                    />
                    {newBlogBannerUrl && previewBannerImage(newBlogBannerUrl)}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="blogContent" className="block text-gray-300 text-sm font-semibold mb-3">
                    Blog Content *
                  </label>
                  <textarea
                    id="blogContent"
                    className="w-full py-4 px-4 bg-gray-700/50 backdrop-blur-sm text-white rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 h-64 resize-y"
                    value={newBlogContent}
                    onChange={(e) => setNewBlogContent(e.target.value)}
                    placeholder="Write your blog content here... You can use markdown formatting."
                    required
                  ></textarea>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700/30">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('list');
                      setEditingBlog(null);
                      setNewBlogTitle('');
                      setNewBlogContent('');
                      setNewBlogStatus('draft');
                      setNewBlogBannerUrl('');
                    }}
                    className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-gray-300 font-medium rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-600/25"
                  >
                    {editingBlog ? 'Update Blog Post' : 'Create Blog Post'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogManagement; 