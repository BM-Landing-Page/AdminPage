import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

interface GalleryItem {
  id: string;
  description: string;
  year: number;
  category: string;
  image_url: string;
  created_at: string;
}

// Predefined categories
const CATEGORIES = [
  'Kidsfest',
  'Sports Synod',
  'Field Trips / Edu Trips',
  'Festive Celebrations (Diwali, Christmas, Pongal, etc.)',
  'Club Activities / House Events',
  'Inter-school Competitions',
];

const GalleryManager: React.FC = () => {
  const { token } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [showImageModal, setShowImageModal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    year: new Date().getFullYear(),
    category: '',
    image: null as File | null,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await api.gallery.getAll();
      setItems(data);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingItem) {
        await api.gallery.update(editingItem.id, {
          description: formData.description,
          year: formData.year,
          category: formData.category,
        }, token);
      } else {
        if (!formData.image) {
          alert('Please select an image');
          return;
        }
        const data = new FormData();
        data.append('description', formData.description);
        data.append('year', formData.year.toString());
        data.append('category', formData.category);
        data.append('image', formData.image);

        await api.gallery.create(data, token);
      }
      fetchItems();
      resetForm();
    } catch (error) {
      console.error('Error saving gallery item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this item?')) return;

    try {
      await api.gallery.delete(id, token);
      fetchItems();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      description: '',
      year: new Date().getFullYear(),
      category: '',
      image: null,
    });
    setShowForm(false);
    setEditingItem(null);
  };

  const startEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      description: item.description,
      year: item.year,
      category: item.category,
      image: null,
    });
    setShowForm(true);
  };

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, GalleryItem[]>);

  // Sort categories to match the predefined order
  const sortedCategories = CATEGORIES.filter(category => groupedItems[category]);

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
        <h2 className="text-2xl font-bold text-gray-900">Gallery Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Image</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem ? 'Edit Gallery Item' : 'Add New Image'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="number"
                placeholder="Year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {!editingItem && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image (max 5MB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            )}

            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                {editingItem ? 'Update' : 'Upload'}
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

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="max-w-4xl max-h-full">
            <img
              src={showImageModal}
              alt="Gallery item"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setShowImageModal(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Display images grouped by category */}
      {sortedCategories.length > 0 ? (
        sortedCategories.map((category) => (
          <div key={category} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2">
              {category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {groupedItems[category].map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative group">
                    <img
                      src={item.image_url}
                      alt={item.description}
                      className="w-full h-48 object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
                      onClick={() => setShowImageModal(item.image_url)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <ImageIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.description}</p>
                        <p className="text-xs text-gray-500 mt-1">Year: {item.year}</p>
                      </div>
                      <div className="flex space-x-2 ml-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-500 text-xs">
                      Added: {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No images in gallery</p>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;