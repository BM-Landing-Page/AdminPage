import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  feature: boolean;
  thumbnail_url?: string;
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await api.blog.getAll();
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
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {post.thumbnail_url && (
              <img
                src={post.thumbnail_url}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <span>{post.title}</span>
                  {post.feature && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(post)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2">By {post.author}</p>
              <p className="text-gray-700 line-clamp-3">{post.content}</p>
              <p className="text-gray-500 text-xs mt-3">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogManager;