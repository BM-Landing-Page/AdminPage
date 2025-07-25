import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, Award, Linkedin, Building, Star } from 'lucide-react';

interface Achievement {
  id: string;
  description: string;  // Changed from achievement_text
  created_at: string;
}

interface TeamMember {
  id: string;
  name: string;
  description: string;
  role: string;
  years_experience: number;
  education_background: string;
  joined_month: number;
  joined_year: number;
  linkedin_url: string;
  department: string;
  priority: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
  achievements: Achievement[];
}

const DEPARTMENT_OPTIONS = [
  'chief executive',
  'admin team',
  'facilitators team',
  'support staff',
  'franchise team'
];

const TeamManager: React.FC = () => {
  const { token } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    role: '',
    years_experience: 0,
    education_background: '',
    joined_month: 1,
    joined_year: new Date().getFullYear(),
    linkedin_url: '',
    department: '',
    priority: 0,
    image: null as File | null,
    achievements: [] as string[],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await api.team.getAll();
      setMembers(data);
    } catch (error: any) {
      console.error('Error fetching members:', error);
      setError('Failed to load team members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const data = new FormData();
    
    // Add basic fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'image' && value) {
        data.append('file', value);  // Changed from 'image' to 'file'
      } else if (key === 'achievements') {
        // Add each achievement separately
        (value as string[]).forEach(achievement => {
          if (achievement.trim()) {
            data.append('achievements[]', achievement);  // Changed to match backend
          }
        });
      } else if (key !== 'image') {
        data.append(key, value.toString());
      }
    });

    try {
      if (editingMember) {
        await api.team.update(editingMember.id, data, token);
      } else {
        await api.team.create(data, token);
      }
      await fetchMembers();
      resetForm();
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this member?')) return;

    try {
      await api.team.delete(id, token);
      fetchMembers();
    } catch (error: any) {
      console.error('Error deleting member:', error);
      setError('Failed to delete member. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      role: '',
      years_experience: 0,
      education_background: '',
      joined_month: 1,
      joined_year: new Date().getFullYear(),
      linkedin_url: '',
      department: '',
      priority: 0,
      image: null,
      achievements: [],
    });
    setShowForm(false);
    setEditingMember(null);
    setError(null);
  };

  const startEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      description: member.description,
      role: member.role,
      years_experience: member.years_experience,
      education_background: member.education_background,
      joined_month: member.joined_month,
      joined_year: member.joined_year,
      linkedin_url: member.linkedin_url,
      department: member.department || '',
      priority: member.priority || 0,
      image: null,
      achievements: member.achievements.map(a => a.description),  // Changed from achievement_text
    });
    setShowForm(true);
  };

  const addAchievement = () => {
    setFormData({
      ...formData,
      achievements: [...formData.achievements, ''],
    });
  };

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index] = value;
    setFormData({ ...formData, achievements: newAchievements });
  };

  const removeAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== index),
    });
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
        <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>New Member</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingMember ? 'Edit Member' : 'Add New Member'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter member's full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title / Role *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Senior Developer, Marketing Manager"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Description *
              </label>
              <textarea
                placeholder="Brief description of the member's background, expertise, and contributions"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Department</option>
                  {DEPARTMENT_OPTIONS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept.charAt(0).toUpperCase() + dept.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Priority *
                </label>
                <input
                  type="number"
                  placeholder="0 = highest priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first (0 = highest priority)</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  placeholder="e.g., 5"
                  value={formData.years_experience}
                  onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Joined Month *
                </label>
                <input
                  type="number"
                  placeholder="1-12"
                  value={formData.joined_month}
                  min="1"
                  max="12"
                  onChange={(e) => setFormData({ ...formData, joined_month: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">1 = January, 12 = December</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Joined Year *
                </label>
                <input
                  type="number"
                  placeholder="e.g., 2023"
                  value={formData.joined_year}
                  onChange={(e) => setFormData({ ...formData, joined_year: parseInt(e.target.value) || new Date().getFullYear() })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Education Background *
              </label>
              <input
                type="text"
                placeholder="e.g., MBA from Harvard Business School, B.S. Computer Science"
                value={formData.education_background}
                onChange={(e) => setFormData({ ...formData, education_background: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn Profile URL *
              </label>
              <input
                type="url"
                placeholder="https://www.linkedin.com/in/username"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Photo
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">Supported formats: JPEG, JPG, PNG, GIF</p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Key Achievements & Accomplishments
                </label>
                <button
                  type="button"
                  onClick={addAchievement}
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Achievement
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-3">Add notable achievements, awards, certifications, or key contributions</p>
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) => updateAchievement(index, e.target.value)}
                    placeholder="e.g., Led successful product launch increasing revenue by 25%"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
                    className="text-red-500 hover:text-red-700 px-2"
                    title="Remove achievement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {formData.achievements.length === 0 && (
                <div className="text-sm text-gray-500 italic p-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
                  No achievements added yet. Click "Add Achievement" to get started.
                </div>
              )}
            </div>
            
            <div className="flex space-x-2 pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
              >
                {editingMember ? 'Update Member' : 'Create Member'}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {member.image_url && (
              <img
                src={member.image_url}
                alt={member.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  {member.priority > 0 && (
                    <div className="flex items-center text-xs text-amber-600 mb-1">
                      <Star className="w-3 h-3 mr-1" />
                      Priority: {member.priority}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(member)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-blue-600 font-medium text-sm mb-2">{member.role}</p>
              
              {member.department && (
                <div className="flex items-center text-xs text-gray-600 mb-2">
                  <Building className="w-3 h-3 mr-1" />
                  {member.department.charAt(0).toUpperCase() + member.department.slice(1)}
                </div>
              )}
              
              <p className="text-gray-600 text-sm mb-3">{member.description}</p>
              <div className="text-xs text-gray-500 space-y-1 mb-3">
                <p>Experience: {member.years_experience} years</p>
                <p>Education: {member.education_background}</p>
                <p>Joined: {member.joined_month}/{member.joined_year}</p>
              </div>
              
              {member.achievements.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    Achievements
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {member.achievements.map((achievement) => (
                      <li key={achievement.id} className="flex items-start">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {achievement.description}  {/* Changed from achievement_text */}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-blue-500 hover:text-blue-700 text-sm"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManager;