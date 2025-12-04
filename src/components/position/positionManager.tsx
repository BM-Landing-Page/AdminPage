import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Trash2, Edit } from 'lucide-react';

interface Position {
  id: string;
  name: string;
  description: string;
}

const PositionsManager: React.FC = () => {
  const { token } = useAuth();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchPositions = async () => {
    try {
      const data = await api.positions.getAll();
      setPositions(data);
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleSubmit = async () => {
    if (!token) return;

    try {
      if (editingId) {
        await api.positions.update(editingId, { name, description }, token);
        setEditingId(null);
      } else {
        await api.positions.create({ name, description }, token);
      }
      setName('');
      setDescription('');
      fetchPositions();
    } catch (error) {
      console.error('Error saving position:', error);
    }
  };

  const handleEdit = (position: Position) => {
    setName(position.name);
    setDescription(position.description);
    setEditingId(position.id);
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this position?')) return;

    try {
      await api.positions.delete(id, token);
      fetchPositions();
    } catch (error) {
      console.error('Error deleting position:', error);
    }
  };

  if (loading) return <p className="text-center py-8">Loading positions...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          {editingId ? 'Edit Position' : 'Add Position'}
        </h2>
        <div className="space-y-3 sm:space-y-4">
          <input
            type="text"
            placeholder="Position Name"
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="border border-gray-300 p-3 w-full rounded-lg min-h-[6rem] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium w-full sm:w-auto"
          >
            {editingId ? 'Update Position' : 'Add Position'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Description
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {positions.map((pos) => (
                <tr key={pos.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{pos.name}</div>
                    <div className="text-sm text-gray-500 sm:hidden">{pos.description}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                    <div className="text-sm text-gray-900">{pos.description}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleEdit(pos)} 
                        className="text-yellow-600 hover:text-yellow-900 transition-colors"
                        aria-label="Edit position"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(pos.id)} 
                        className="text-red-600 hover:text-red-900 transition-colors"
                        aria-label="Delete position"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {positions.length === 0 && (
          <p className="text-center py-8 text-gray-500">No positions found</p>
        )}
      </div>
    </div>
  );
};

export default PositionsManager;