import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, Eye, EyeOff, ExternalLink, Image as ImageIcon, Link } from 'lucide-react';

interface Popup {
  id: string;
  image_url?: string;
  url?: string;
  created_at: string;
  updated_at?: string;
}

const PopupManager: React.FC = () => {
  const { token } = useAuth();
  const [popup, setPopup] = useState<Popup | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    image: null as File | null,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchPopup();
  }, []);

  const fetchPopup = async () => {
    try {
      setLoading(true);
      const data = await api.popup.get();
      setPopup(data);
    } catch (error: any) {
      console.error('Error fetching popup:', error);
      setError('Failed to load popup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const data = new FormData();
    
    // Add URL if provided
    if (formData.url.trim()) {
      data.append('url', formData.url.trim());
    }
    
    // Add image if provided
    if (formData.image) {
      data.append('file', formData.image);
    }

    try {
      setError(null);
      let response;
      
      if (isEditing && popup) {
        response = await api.popup.update(data, token);
        setSuccess('Popup updated successfully!');
      } else {
        response = await api.popup.create(data, token);
        setSuccess('Popup created successfully!');
      }
      
      await fetchPopup();
      resetForm();
    } catch (error: any) {
      console.error('Error saving popup:', error);
      setError('Failed to save popup. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!token || !popup || !confirm('Are you sure you want to delete the popup? This action cannot be undone.')) return;

    try {
      setError(null);
      await api.popup.delete(token);
      setPopup(null);
      setSuccess('Popup deleted successfully!');
      resetForm();
    } catch (error: any) {
      console.error('Error deleting popup:', error);
      setError('Failed to delete popup. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      url: '',
      image: null,
    });
    setShowForm(false);
    setIsEditing(false);
    setPreviewMode(false);
    setError(null);
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(null), 3000);
  };

  const startEdit = () => {
    if (popup) {
      setIsEditing(true);
      setFormData({
        url: popup.url || '',
        image: null,
      });
      setShowForm(true);
    }
  };

  const startCreate = () => {
    setIsEditing(false);
    setFormData({
      url: '',
      image: null,
    });
    setShowForm(true);
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
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
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Popup Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage the website popup banner (only one popup can be active at a time)</p>
        </div>
        <div className="flex space-x-2">
          {popup && (
            <button
              onClick={togglePreview}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 ${
                previewMode 
                  ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{previewMode ? 'Hide Preview' : 'Preview'}</span>
            </button>
          )}
          <button
            onClick={popup ? startEdit : startCreate}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            {popup ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{popup ? 'Edit Popup' : 'Create Popup'}</span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{success}</span>
          <button 
            onClick={() => setSuccess(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}

      {/* Preview Mode */}
      {previewMode && popup && (
        <div className="bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Popup Preview
          </h3>
          <div className="bg-white rounded-lg shadow-lg max-w-md mx-auto overflow-hidden">
            {popup.image_url && (
              <img
                src={popup.image_url}
                alt="Popup"
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              {popup.url && (
                <a
                  href={popup.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-500 hover:text-blue-700 font-medium"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Visit Link
                </a>
              )}
              {!popup.url && !popup.image_url && (
                <p className="text-gray-500 italic">Empty popup</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {isEditing ? 'Edit Popup' : 'Create New Popup'}
            </h3>
            {isEditing && (
              <span className="text-sm text-amber-600 bg-amber-100 px-2 py-1 rounded">
                This will replace the existing popup
              </span>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Link className="w-4 h-4 inline mr-1" />
                Destination URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://example.com/promo"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Where users will go when they click the popup</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <ImageIcon className="w-4 h-4 inline mr-1" />
                Popup Image (Optional)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">Supported formats: JPEG, JPG, PNG, GIF (Max 5MB)</p>
              {isEditing && popup?.image_url && (
                <div className="mt-2 text-xs text-blue-600">
                  Current image will be replaced if you upload a new one
                </div>
              )}
            </div>

            {/* Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You can create a popup with just an image, just a URL, or both. 
                At least one field should be provided for the popup to be meaningful.
              </p>
            </div>
            
            <div className="flex space-x-2 pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                disabled={!formData.url.trim() && !formData.image}
              >
                {isEditing ? 'Update Popup' : 'Create Popup'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Current Popup Display */}
      {!showForm && popup && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Current Active Popup</h3>
              <div className="flex space-x-2">
                <button
                  onClick={startEdit}
                  className="text-blue-500 hover:text-blue-700 p-2 rounded transition-colors duration-200"
                  title="Edit popup"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700 p-2 rounded transition-colors duration-200"
                  title="Delete popup"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {popup.image_url && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <ImageIcon className="w-4 h-4 mr-1" />
                    Image
                  </h4>
                  <img
                    src={popup.image_url}
                    alt="Popup"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
              
              <div className="space-y-4">
                {popup.url && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                      <Link className="w-4 h-4 mr-1" />
                      Destination URL
                    </h4>
                    <a
                      href={popup.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 break-all inline-flex items-center"
                    >
                      {popup.url}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Created</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(popup.created_at).toLocaleString()}
                  </p>
                </div>
                
                {popup.updated_at && popup.updated_at !== popup.created_at && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Last Updated</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(popup.updated_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Popup State */}
      {!showForm && !popup && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="max-w-sm mx-auto">
            <div className="bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Popup</h3>
            <p className="text-gray-600 mb-4">
              There is currently no popup configured for your website.
            </p>
            <button
              onClick={startCreate}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              Create First Popup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupManager;