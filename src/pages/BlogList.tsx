import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient'; // Import Supabase client
import { FiEye, FiHeart, FiCalendar, FiUser } from 'react-icons/fi';
// import BlogNavbar from '../components/BlogNavbar';
import Navigation from '../components/Navigation';

type Blog = {
  id: string; // Changed to string for Supabase UUID
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
  views: number;
  love_reactions: number;
  profile_picture_url?: string;
  banner_image_url?: string;
};

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch only published blogs for the public view and join with admins to get author name and profile picture
        const { data, error } = await supabase
          .from('blogs')
          .select(`
            *,
            admins (username, profile_picture_url)
          `)
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        const formattedBlogs: Blog[] = (data || []).map((blog: any) => ({
          ...blog,
          author_name: blog.admins ? blog.admins.username : 'Unknown',
          profile_picture_url: blog.admins ? blog.admins.profile_picture_url : undefined,
          views: blog.views || 0,
          love_reactions: blog.love_reactions || 0,
        }));

        setBlogs(formattedBlogs);
      } catch (e: any) {
        console.error('Error fetching blogs:', e);
        setError(`Failed to fetch blogs: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Function to truncate text to a specific length with ellipsis
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Function to format date in a readable way
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to extract plain text from content that might contain markdown images
  const getPlainTextContent = (content: string) => {
    // Remove markdown image syntax
    const contentWithoutImages = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '');
    // Remove extra line breaks and trim
    return contentWithoutImages.replace(/\n{3,}/g, '\n\n').trim();
  };

  if (loading) {
    return (
      <>
        {/* <BlogNavbar /> */}
        <div className="flex justify-center items-center min-h-[400px] pt-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg p-4 text-center my-8 mt-24 max-w-4xl mx-auto">
          <p className="font-medium">Error: {error}</p>
        </div>
      </>
    );
  }

  return (
    <div className="blog-page-wrapper">
      <Navigation />
      
      
      {/* Background Effects */}
      <div className="blog-bg-effects">
        <div className="blog-orb-1"></div>
        <div className="blog-orb-2"></div>
        <div className="blog-grid-pattern"></div>
      </div>
      
      <div className="py-16 px-4 pt-28 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Title with gradient border */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
              Latest Articles
            </h1>
            <p className="text-gray-400 text-lg">Discover insights, updates, and news from the WhalesPad ecosystem</p>
          </motion.div>

          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                  className="blog-card-modern"
                >
                  {/* Featured Image */}
                  <div className="blog-image-container">
                    {blog.banner_image_url ? (
                      <img 
                        src={blog.banner_image_url} 
                        alt={blog.title} 
                        className="blog-image"
                        onError={(e) => {
                          console.log("Banner image failed to load:", blog.banner_image_url);
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          // Show the placeholder instead
                          const parent = target.parentElement;
                          if (parent) {
                            const placeholder = document.createElement('div');
                            placeholder.className = 'absolute inset-0 flex items-center justify-center text-white/20 text-6xl font-bold';
                            placeholder.textContent = 'WhalesPad';
                            parent.appendChild(placeholder);
                          }
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/20 text-6xl font-bold">
                        WhalesPad
                      </div>
                    )}
                  </div>
                  
                  <div className="blog-content-modern">
                    {/* Category Badge */}
                    <div className="blog-category-badge">
                      <span>🚀</span>
                      <span>Blockchain</span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="blog-title-modern">
                      <a href={`/blog/${blog.id}`}>{blog.title}</a>
                    </h3>
                    
                    {/* Author & Date Info */}
                    <div className="blog-author-info">
                      <div className="author-avatar">
                        {blog.profile_picture_url ? (
                          <img 
                            src={blog.profile_picture_url} 
                            alt={blog.author_name} 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const icon = document.createElement('span');
                                icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="author-avatar-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                                parent.appendChild(icon.firstChild as Node);
                              }
                            }}
                          />
                        ) : (
                          <FiUser className="author-avatar-icon" />
                        )}
                      </div>
                      <div className="author-details">
                        <div className="author-name">{blog.author_name}</div>
                        <div className="blog-date">
                          <FiCalendar /> {formatDate(blog.created_at)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content Preview */}
                    <p className="blog-excerpt">
                      {truncateText(getPlainTextContent(blog.content), 120)}
                    </p>
                    
                    {/* Stats and Action */}
                    <div className="blog-stats">
                      <div className="blog-stat">
                        <FiEye className="blog-stat-icon" />
                        <span>{blog.views}</span>
                      </div>
                      <div className="blog-stat">
                        <FiHeart className="blog-stat-icon love" />
                        <span>{blog.love_reactions}</span>
                      </div>
                      <div className="ml-auto">
                        <a 
                          href={`/blog/${blog.id}`}
                          className="blog-read-more"
                        >
                          Read More
                          <span>→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <div className="blog-card-modern max-w-md mx-auto p-12">
                <h3 className="text-2xl font-medium text-gray-400 mb-2">No Articles Yet</h3>
                <p className="text-gray-500">Check back soon for new content!</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogList; 