import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { FiUser, FiCalendar, FiClock, FiEye, FiHeart, FiArrowLeft } from 'react-icons/fi';
// import BlogNavbar from '../components/BlogNavbar';
import Navigation from '../components/Navigation';
import DOMPurify from 'dompurify';

type Blog = {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  views: number;
  love_reactions: number;
  profile_picture_url?: string;
  banner_image_url?: string;
  status: string;
};


const BlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) {
        setError('Blog ID is missing.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // Fetch blog post and join with admins to get author details
        const { data, error } = await supabase
          .from('blogs')
          .select(`
            *,
            admins (username, profile_picture_url)
          `)
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('Blog post not found');
        }

        console.log("Blog data:", data); // Debug log

        // Format the blog data
        const formattedBlog: Blog = {
          ...data,
          author_name: data.admins ? data.admins.username : 'Unknown',
          profile_picture_url: data.admins ? data.admins.profile_picture_url : undefined,
          views: data.views || 0,
          love_reactions: data.love_reactions || 0,
        };

        setBlog(formattedBlog);

        // Increment view count
        await incrementViewCount(data.id, data.views || 0);
        
      } catch (e: any) {
        console.error('Error fetching blog post:', e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const incrementViewCount = async (blogId: string, currentViews: number) => {
    try {
      await supabase
        .from('blogs')
        .update({ views: currentViews + 1 })
        .eq('id', blogId);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const handleLoveReaction = async () => {
    if (!blog || hasLiked) return;
    
    try {
      const updatedReactions = blog.love_reactions + 1;
      
      await supabase
        .from('blogs')
        .update({ love_reactions: updatedReactions })
        .eq('id', blog.id);
      
      setBlog({
        ...blog,
        love_reactions: updatedReactions
      });
      
      setHasLiked(true);
      localStorage.setItem(`liked_blog_${blog.id}`, 'true');
      
    } catch (error) {
      console.error('Error updating love reactions:', error);
    }
  };

  // Check if user has already liked this post
  useEffect(() => {
    if (blog) {
      const hasLikedBefore = localStorage.getItem(`liked_blog_${blog.id}`) === 'true';
      setHasLiked(hasLikedBefore);
    }
  }, [blog]);

  // Format date in a readable way
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to render blog content with support for inline images
  const renderContent = (content: string) => {
    if (!content) return null;
    
    // Process the content to convert markdown image syntax to HTML
    let processedContent = content;
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    
    processedContent = processedContent.replace(imageRegex, (match, alt, url) => {
      return `<div class="my-6 text-center">
        <img src="${url}" alt="${alt}" class="mx-auto rounded-lg max-h-96 shadow-lg border border-gray-700/50" />
        ${alt !== 'Image' && alt !== 'Blog image' ? `<p class="text-center text-gray-400 text-sm mt-2">${alt}</p>` : ''}
      </div>`;
    });
    
    // Split content by paragraphs (double line breaks) and wrap each in <p> tags
    const paragraphs = processedContent.split('\n\n').filter(p => p.trim() !== '');
    const htmlContent = paragraphs.map(p => {
      // If the paragraph is already an HTML element (from image replacement), return as is
      if (p.trim().startsWith('<div')) {
        return p;
      }
      // Otherwise, wrap in paragraph tags
      return `<p class="mb-4">${p}</p>`;
    }).join('');
    
    // Sanitize the HTML to prevent XSS attacks
    const sanitizedHtml = DOMPurify.sanitize(htmlContent);
    
    return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
  };

  if (loading) {
    return (
      <>
        <Navigation />
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
        <Navigation />
        {/* <BlogNavbar /> */}
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg p-4 text-center my-8 mt-24 max-w-4xl mx-auto">
          <p className="font-medium">Error: {error}</p>
          <Link to="/blog" className="inline-block mt-4 text-blue-400 hover:text-blue-500">
            <FiArrowLeft className="inline mr-2" /> Return to Blog List
          </Link>
        </div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navigation />
        {/* <BlogNavbar /> */}
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-12 text-center max-w-4xl mx-auto my-16 mt-24">
          <h3 className="text-2xl font-medium text-gray-400 mb-2">Blog post not found</h3>
          <Link to="/blog" className="inline-block mt-4 text-blue-400 hover:text-blue-500">
            <FiArrowLeft className="inline mr-2" /> Return to Blog List
          </Link>
        </div>
      </>
    );
  }

  return (
    <div className="blog-page-wrapper">
      <Navigation />
      {/* <BlogNavbar /> */}
      
      {/* Background Effects */}
      <div className="blog-bg-effects">
        <div className="blog-orb-1"></div>
        <div className="blog-orb-2"></div>
        <div className="blog-grid-pattern"></div>
      </div>
      
      {/* Hero Banner */}
      <div className="blog-detail-hero">
        {blog.banner_image_url ? (
          <img 
            src={blog.banner_image_url} 
            alt={blog.title} 
            onError={(e) => {
              console.log("Banner image failed to load:", blog.banner_image_url);
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/10 text-9xl font-bold">
            WhalesPad
          </div>
        )}
      </div>
      
      <div className="blog-detail-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            to="/blog" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors group"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Blog List
          </Link>
          
          <div className="blog-detail-card">
            <div className="blog-detail-header">
              {/* Title */}
              <h1 className="blog-detail-title">{blog.title}</h1>
              
              {/* Meta Info */}
              <div className="blog-detail-meta">
                <div className="blog-detail-author">
                  <div className="blog-detail-author-avatar">
                    {blog.profile_picture_url ? (
                      <img 
                        src={blog.profile_picture_url} 
                        alt={blog.author_name} 
                      />
                    ) : (
                      <FiUser className="text-2xl text-gray-400" />
                    )}
                  </div>
                  <div className="blog-detail-author-info">
                    <div className="blog-detail-author-name">{blog.author_name}</div>
                    <div className="blog-detail-date">
                      <FiCalendar className="mr-1" /> {formatDate(blog.created_at)}
                      {blog.created_at !== blog.updated_at && (
                        <span className="ml-3">
                          <FiClock className="mr-1 inline" /> Updated: {formatDate(blog.updated_at)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="blog-detail-stats">
                  <div className="blog-detail-stat">
                    <FiEye /> 
                    <span>{blog.views} views</span>
                  </div>
                  <div className="blog-detail-stat">
                    <FiHeart className="text-pink-500" /> 
                    <span>{blog.love_reactions} reactions</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="blog-article-content">
              {renderContent(blog.content)}
            </div>
            
            {/* Actions */}
            <div className="blog-actions">
              <button 
                onClick={handleLoveReaction}
                disabled={hasLiked}
                className={`blog-love-button ${hasLiked ? 'loved' : ''}`}
              >
                <FiHeart className={hasLiked ? 'fill-current' : ''} /> 
                <span>{hasLiked ? 'Loved' : 'Love this article'}</span>
              </button>
              
              <div className="blog-share-buttons">
                <button className="blog-share-button" title="Share on Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                  </svg>
                </button>
                <button className="blog-share-button" title="Share on LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="text-center mt-8 text-gray-500 text-sm">
              {blog.status === 'published' ? 'Published' : 'Draft'}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPostDetail; 