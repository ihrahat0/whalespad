import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiImage, FiSave, FiX, FiCheck, FiPlusCircle } from 'react-icons/fi';
import { supabase } from '../../supabaseClient';
import BlogNavbar from '../../components/BlogNavbar';

const CreateBlogPost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [inlineImageUrl, setInlineImageUrl] = useState('');
  const [showInlineImageInput, setShowInlineImageInput] = useState(false);
  const [bannerImageValid, setBannerImageValid] = useState(true);
  
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  // Check if user is logged in and is an admin
  useEffect(() => {
    const checkAuth = async () => {
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
    };
    
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }
    
    if (!adminUser) {
      setError('You must be logged in as an admin to create a blog post');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Create blog post without banner_image_url first
      const blogData = {
        title,
        content,
        author_id: adminUser.id,
        status,
        views: 0,
        love_reactions: 0
      };
      
      // Try to add banner_image_url if provided
      if (bannerImageUrl && bannerImageValid) {
        try {
          // Check if we can include banner_image_url
          const { error: testError } = await supabase
            .from('blogs')
            .select('banner_image_url')
            .limit(1);
            
          if (!testError) {
            // If no error, we can include the banner_image_url
            Object.assign(blogData, { banner_image_url: bannerImageUrl });
          }
        } catch (err) {
          console.warn('Could not include banner_image_url, continuing without it');
        }
      }
      
      // Insert the blog post
      const { error } = await supabase
        .from('blogs')
        .insert([blogData]);
        
      if (error) {
        // If there's an error about banner_image_url, try again without it
        if (error.message.includes('banner_image_url')) {
          delete (blogData as any).banner_image_url;
          
          const { error: retryError } = await supabase
            .from('blogs')
            .insert([blogData]);
            
          if (retryError) throw retryError;
        } else {
          throw error;
        }
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
      
    } catch (err: any) {
      console.error('Error creating blog post:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const checkImageUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const validateBannerImage = async (url: string) => {
    if (!url) {
      setBannerImageValid(true);
      return;
    }
    
    const isValid = await checkImageUrl(url);
    setBannerImageValid(isValid);
    return isValid;
  };
  
  const handleBannerImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setBannerImageUrl(url);
    if (url) {
      validateBannerImage(url);
    }
  };
  
  const handleBannerPreview = () => {
    if (!bannerImageUrl) return null;
    
    return (
      <div className="mt-4 relative">
        <img 
          src={bannerImageUrl} 
          alt="Banner preview" 
          className={`w-full h-64 object-cover rounded-lg border ${bannerImageValid ? 'border-gray-700' : 'border-red-500'}`}
          onError={() => setBannerImageValid(false)}
          onLoad={() => setBannerImageValid(true)}
        />
        <button
          type="button"
          onClick={() => setBannerImageUrl('')}
          className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full"
        >
          <FiX />
        </button>
        {!bannerImageValid && (
          <div className="mt-2 text-red-400 text-sm">
            This image URL appears to be invalid or inaccessible. Please check the URL or try another image.
          </div>
        )}
      </div>
    );
  };

  const handleAddInlineImage = async () => {
    if (!inlineImageUrl) return;
    
    // Validate the image URL first
    const isValid = await checkImageUrl(inlineImageUrl);
    
    if (!isValid) {
      setError("The image URL appears to be invalid. Please check the URL and try again.");
      return;
    }
    
    if (contentRef.current) {
      const imageMarkdown = `\n![Image](${inlineImageUrl})\n`;
      const currentContent = content;
      const cursorPosition = contentRef.current.selectionStart;
      
      const newContent = 
        currentContent.substring(0, cursorPosition) + 
        imageMarkdown + 
        currentContent.substring(cursorPosition);
      
      setContent(newContent);
      setInlineImageUrl('');
      setShowInlineImageInput(false);
      setError(null);
      
      // Focus back on the content textarea
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.focus();
          contentRef.current.selectionStart = cursorPosition + imageMarkdown.length;
          contentRef.current.selectionEnd = cursorPosition + imageMarkdown.length;
        }
      }, 100);
    }
  };

  const previewInlineImage = () => {
    if (!inlineImageUrl) return null;
    
    return (
      <div className="mt-2 mb-3">
        <img 
          src={inlineImageUrl} 
          alt="Preview" 
          className="max-h-32 rounded-lg border border-gray-700"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            setError("The image URL appears to be invalid. Please check the URL.");
          }}
          onLoad={() => setError(null)}
        />
      </div>
    );
  };

  return (
    <>
      <BlogNavbar isAdmin={true} />
      <div className="pt-24 px-6 pb-16 bg-[#0B1120] min-h-screen">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-white">Create New Blog Post</h1>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FiX /> Cancel
              </button>
            </div>
            
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
                {error}
                {error.includes('banner_image_url') && (
                  <p className="mt-2 text-sm">
                    Note: The banner image feature requires a database update. Your blog post will still be created without the banner image.
                  </p>
                )}
              </div>
            )}
            
            {success && (
              <div className="bg-green-900/50 border border-green-700 text-green-100 px-4 py-3 rounded-lg mb-6 flex items-center">
                <FiCheck className="mr-2" /> Blog post created successfully! Redirecting...
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="bg-gray-800/80 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-gray-700/50">
              {/* Title */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-gray-300 text-sm font-bold mb-2">
                  Blog Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-600"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter an engaging title for your blog post"
                  required
                />
              </div>
              
              {/* Banner Image */}
              <div className="mb-6">
                <label htmlFor="bannerImageUrl" className="block text-gray-300 text-sm font-bold mb-2">
                  Banner Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    id="bannerImageUrl"
                    className={`shadow appearance-none border rounded-lg w-full py-3 px-4 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${!bannerImageValid && bannerImageUrl ? 'border-red-500' : 'border-gray-600'}`}
                    value={bannerImageUrl}
                    onChange={handleBannerImageChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg flex items-center"
                    onClick={() => document.getElementById('bannerImageUrl')?.focus()}
                  >
                    <FiImage />
                  </button>
                </div>
                {bannerImageUrl && handleBannerPreview()}
              </div>
              
              {/* Content */}
              <div className="mb-6">
                <label htmlFor="content" className="block text-gray-300 text-sm font-bold mb-2 flex justify-between items-center">
                  <span>Blog Content</span>
                  <button
                    type="button"
                    onClick={() => setShowInlineImageInput(!showInlineImageInput)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center text-sm gap-1"
                    title="Add Image"
                  >
                    <FiImage className="text-sm" /> Add Image
                  </button>
                </label>
                
                {showInlineImageInput && (
                  <div className="mb-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                    <label className="block text-gray-300 text-sm font-bold mb-2">
                      Insert Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-600"
                        value={inlineImageUrl}
                        onChange={(e) => setInlineImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                      <button
                        type="button"
                        onClick={handleAddInlineImage}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center"
                      >
                        <FiPlusCircle className="mr-1" /> Insert
                      </button>
                    </div>
                    {inlineImageUrl && previewInlineImage()}
                  </div>
                )}
                
                <textarea
                  ref={contentRef}
                  id="content"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-600 h-64 resize-y"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog post content here. You can use line breaks for paragraphs and add images using the button above."
                  required
                ></textarea>
                
                <p className="text-gray-400 text-sm mt-2">
                  Tip: Use double line breaks to create new paragraphs. Click the "Add Image" button to insert images into your content.
                </p>
              </div>
              
              {/* Status */}
              <div className="mb-8">
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Publication Status
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue-600 h-5 w-5"
                      name="status"
                      value="draft"
                      checked={status === 'draft'}
                      onChange={() => setStatus('draft')}
                    />
                    <span className="ml-2 text-gray-300">Save as Draft</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-green-600 h-5 w-5"
                      name="status"
                      value="published"
                      checked={status === 'published'}
                      onChange={() => setStatus('published')}
                    />
                    <span className="ml-2 text-gray-300">Publish Immediately</span>
                  </label>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-all ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave /> {status === 'published' ? 'Publish Blog Post' : 'Save as Draft'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CreateBlogPost; 