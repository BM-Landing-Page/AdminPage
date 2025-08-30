// src/components/feedback/FeedbackManager.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, MessageSquare, User, GraduationCap } from 'lucide-react';

interface Feedback {
  id: string;
  parent_name: string;
  student_name: string;
  grade: number;
  desc: string;
  created_at: string;
}

const FeedbackManager: React.FC = () => {
  const { token } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);
  const [formData, setFormData] = useState({
    parent_name: '',
    student_name: '',
    grade: 0,
    desc: '',
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const data = await api.feedback.getAll();
      console.log('Fetched feedback:', data); // Debug log
      setFeedbacks(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingFeedback) {
        await api.feedback.update(editingFeedback.id, formData, token);
      } else {
        await api.feedback.create(formData, token);
      }
      fetchFeedbacks();
      resetForm();
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this feedback?')) return;

    try {
      await api.feedback.delete(id, token);
      fetchFeedbacks();
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      parent_name: '',
      student_name: '',
      grade: 0,
      desc: '',
    });
    setShowForm(false);
    setEditingFeedback(null);
  };

  const startEdit = (feedback: Feedback) => {
    setEditingFeedback(feedback);
    setFormData({
      parent_name: feedback.parent_name,
      student_name: feedback.student_name,
      grade: feedback.grade,
      desc: feedback.desc,
    });
    setShowForm(true);
  };

  const getGradeBadgeColor = (grade: number) => {
    if (grade <= 2) return 'bg-green-100 text-green-800';
    if (grade <= 5) return 'bg-blue-100 text-blue-800';
    if (grade <= 8) return 'bg-purple-100 text-purple-800';
    if (grade <= 10) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
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
        <h2 className="text-2xl font-bold text-gray-900">Feedback Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>New Feedback</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingFeedback ? 'Edit Feedback' : 'Create New Feedback'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Parent Name"
                value={formData.parent_name}
                onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Student Name"
                value={formData.student_name}
                onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <input
              type="number"
              placeholder="Grade (1-12)"
              min="1"
              max="12"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) || 0 })}
              className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            
            <textarea
              placeholder="Feedback Description"
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                {editingFeedback ? 'Update' : 'Create'}
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
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {feedback.parent_name}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4" />
                      <span>{feedback.student_name}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeBadgeColor(feedback.grade)}`}>
                      Grade {feedback.grade}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(feedback)}
                    className="bg-white bg-opacity-90 hover:bg-opacity-100 text-blue-500 p-2 rounded-full shadow-sm transition-all duration-200"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(feedback.id)}
                    className="bg-white bg-opacity-90 hover:bg-opacity-100 text-red-500 p-2 rounded-full shadow-sm transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-6">
              <div className="flex items-start space-x-2 mb-4">
                <MessageSquare className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {feedback.desc}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
                <span>Submitted on {new Date(feedback.created_at).toLocaleDateString()}</span>
                <span className="flex items-center space-x-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>Parent Voice</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {feedbacks.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No feedback found</p>
          <p className="text-gray-400 text-sm">Create your first feedback entry to get started</p>
        </div>
      )}
    </div>
  );
};

export default FeedbackManager;