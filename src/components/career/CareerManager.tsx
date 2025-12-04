import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Eye, Trash2, Mail, Phone, MapPin } from 'lucide-react';

interface CareerForm {
  id?: string;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  phone?: string;
  date_of_birth: string;
  marital_status?: string;
  languages_known?: string[];
  address?: string;
  how_do_you_know_us?: string;
  educational_qualification?: string;
  work_experience?: string;
  area_of_expertise?: string;
  why_join?: string;
  position?: { id: string; name: string }; // ✅ Include position name
  created_at?: string;
}

const CareerManager: React.FC = () => {
  const { token } = useAuth();
  const [entries, setEntries] = useState<CareerForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<CareerForm | null>(null);

  const fetchEntries = async () => {
    if (!token) return;

    try {
      const data = await api.career.getAll(token);
      setEntries(data);
    } catch (error) {
      console.error('Error fetching career entries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this entry?')) return;

    try {
      await api.career.delete(id, token);
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Career Applications</h2>
        <div className="text-sm text-gray-500">Total: {entries.length} applications</div>
      </div>

      {/* Entry Details Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Career Application Details</h3>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-400 hover:text-gray-600"
                >✕</button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-lg font-semibold">{selectedEntry.first_name} {selectedEntry.last_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <p>{selectedEntry.gender}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position Applied</label>
                    <p>{selectedEntry.position?.name || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <p>{new Date(selectedEntry.date_of_birth).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{selectedEntry.email}</span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{selectedEntry.phone || 'Not provided'}</span>
                    </p>
                  </div>
                </div>

                {selectedEntry.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <span>{selectedEntry.address}</span>
                    </p>
                  </div>
                )}

                {selectedEntry.created_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted</label>
                    <p>{new Date(selectedEntry.created_at).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.first_name} {entry.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.position?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => setSelectedEntry(entry)} className="text-blue-600 hover:text-blue-900"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(entry.id!)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {entries.length === 0 && (
          <div className="text-center py-12 text-gray-500">No career applications found</div>
        )}
      </div>
    </div>
  );
};

export default CareerManager;
