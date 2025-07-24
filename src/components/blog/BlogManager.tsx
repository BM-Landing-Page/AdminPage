import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, Star, ImageIcon } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  feature: boolean;
  thumbnail?: string; // Changed from thumbnail_url to thumbnail
  created_at: string;
}

const BlogManager: React.FC = () => {
  const { token } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    feature: false,
    thumbnail: null as File | null,
  });
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await api.blog.getAll();
      console.log('Fetched blog posts:', data); // Debug log
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('author', formData.author);
    data.append('feature', formData.feature.toString());
    if (formData.thumbnail) {
      data.append('thumbnail', formData.thumbnail);
      console.log('Uploading thumbnail:', formData.thumbnail.name); // Debug log
    }

    try {
      if (editingPost) {
        await api.blog.update(editingPost.id, data, token);
      } else {
        await api.blog.create(data, token);
      }
      fetchPosts();
      resetForm();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.blog.delete(id, token);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      author: '',
      feature: false,
      thumbnail: null,
    });
    setShowForm(false);
    setEditingPost(null);
  };

  const startEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      author: post.author,
      feature: post.feature,
      thumbnail: null,
    });
    setShowForm(true);
  };

  const handleImageError = (postId: string, imageUrl: string) => {
    console.error(`Failed to load image for post ${postId}:`, imageUrl); // Debug log
    setImageLoadErrors(prev => new Set(prev).add(postId));
  };

  const getImageUrl = (post: BlogPost) => {
    if (!post.thumbnail) { // Changed from thumbnail_url to thumbnail
      console.log(`No thumbnail for post ${post.id}`); // Debug log
      return null;
    }
    
    console.log(`Original thumbnail for post ${post.id}:`, post.thumbnail); // Debug log
    
    // Handle different possible URL formats
    let finalUrl: string;
    
    if (post.thumbnail.startsWith('http')) {
      finalUrl = post.thumbnail;
    } else if (post.thumbnail.startsWith('/')) {
      finalUrl = post.thumbnail;
    } else {
      // Try different base URL combinations - adjust these based on your API setup
      const possibleUrls = [
        `${window.location.origin}/${post.thumbnail}`,
        `${window.location.origin}/uploads/${post.thumbnail}`,
        `${window.location.origin}/api/uploads/${post.thumbnail}`,
        `/uploads/${post.thumbnail}`,
        `/${post.thumbnail}`
      ];
      
      finalUrl = possibleUrls[0]; // Default to first option
      console.log('Possible image URLs to try:', possibleUrls); // Debug log
    }
    
    console.log(`Final image URL for post ${post.id}:`, finalUrl); // Debug log
    return finalUrl;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingPost ? 'Edit Post' : 'Create New Post'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <textarea
              placeholder="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files?.[0] || null })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.feature}
                  onChange={(e) => setFormData({ ...formData, feature: e.target.checked })}
                  className="rounded"
                />
                <span>Featured Post</span>
              </label>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                {editingPost ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {posts.map((post) => {
          const imageUrl = getImageUrl(post);
          const hasImageError = imageLoadErrors.has(post.id);
          
          return (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              {/* Debug Info - Remove this in production */}
              
              
              {/* Image Section */}
              <div className="relative h-48 bg-gray-100">
                {imageUrl && !hasImageError ? (
                  <img
                    src={imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(post.id, imageUrl)}
                    onLoad={() => console.log(`Image loaded successfully for post ${post.id}`)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">
                        {hasImageError ? 'Failed to load image' : 'No image available'}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Featured Badge */}
                {post.feature && (
                  <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full flex items-center space-x-1 text-xs font-medium">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Featured</span>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => startEdit(post)}
                    className="bg-white bg-opacity-90 hover:bg-opacity-100 text-blue-500 p-2 rounded-full shadow-sm transition-all duration-200"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="bg-white bg-opacity-90 hover:bg-opacity-100 text-red-500 p-2 rounded-full shadow-sm transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-6">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm">By {post.author}</p>
                </div>
                
                <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                  {post.content}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  {imageUrl && !hasImageError && (
                    <span className="flex items-center space-x-1">
                      <ImageIcon className="w-3 h-3" />
                      <span>Has Image</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No blog posts found</p>
        </div>
      )}
    </div>
  );
};

export default BlogManager;