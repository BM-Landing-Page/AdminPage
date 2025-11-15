import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface Batch {
  batch_id: string;
  batch_year: number;
  description: string;
}

const BatchManager: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [form, setForm] = useState<{ batch_year: number; description: string }>({ batch_year: new Date().getFullYear(), description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const data = await api.batches.getAll();
      setBatches(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Get token from localStorage or context
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');
      if (editingId) {
        // Update batch
        await api.batches.update(editingId, form, token);
      } else {
        // Create batch
        await api.batches.create(form, token);
      }
      setForm({ batch_year: new Date().getFullYear(), description: '' });
      setEditingId(null);
      fetchBatches();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (batch: Batch) => {
    setForm({ batch_year: batch.batch_year, description: batch.description });
    setEditingId(batch.batch_id);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');
      await api.batches.delete(id, token);
      fetchBatches();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Batch Manager</h2>
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="number"
          name="batch_year"
          value={form.batch_year}
          onChange={handleChange}
          placeholder="Batch Year"
          className="border p-2 rounded w-full"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 rounded w-full"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? 'Update Batch' : 'Add Batch'}
        </button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Batch Year</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map(batch => (
              <tr key={batch.batch_id}>
                <td className="p-2 border">{batch.batch_year}</td>
                <td className="p-2 border">{batch.description}</td>
                <td className="p-2 border space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => handleEdit(batch)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(batch.batch_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BatchManager;
