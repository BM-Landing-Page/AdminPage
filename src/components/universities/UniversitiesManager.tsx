import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface University {
  university_id: string;
  university_name: string;
  country: string;
  logo_url?: string;
}

interface OfferCount {
  university_name: string;
  count: number;
}

const UniversitiesManager: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [form, setForm] = useState<{ university_name: string; country: string; logo: File | null }>({ university_name: '', country: '', logo: null });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offerCounts, setOfferCounts] = useState<OfferCount[]>([]);

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const data = await api.universities.getAll();
      setUniversities(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOfferCounts = async () => {
    try {
      const data = await api.universities.getOfferCounts();
      setOfferCounts(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUniversities();
    fetchOfferCounts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'logo' && files) {
      setForm({ ...form, logo: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');
      const formData = new FormData();
      formData.append('university_name', form.university_name);
      formData.append('country', form.country);
      if (form.logo) formData.append('logo', form.logo);
      if (editingId) {
        await api.universities.update(editingId, formData, token);
      } else {
        await api.universities.create(formData, token);
      }
      setForm({ university_name: '', country: '', logo: null });
      setEditingId(null);
      fetchUniversities();
      fetchOfferCounts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (uni: University) => {
    setForm({ university_name: uni.university_name, country: uni.country, logo: null });
    setEditingId(uni.university_id);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');
      await api.universities.delete(id, token);
      fetchUniversities();
      fetchOfferCounts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Universities</h2>
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          name="university_name"
          value={form.university_name}
          onChange={handleChange}
          placeholder="University Name"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="country"
          value={form.country}
          onChange={handleChange}
          placeholder="Country"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="file"
          name="logo"
          accept="image/*"
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? 'Update University' : 'Add University'}
        </button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border mb-8">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Logo</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Country</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {universities.map(uni => (
              <tr key={uni.university_id}>
                <td className="p-2 border">
                  {uni.logo_url ? (
                    <img src={uni.logo_url} alt={uni.university_name} className="h-10 w-10 object-contain" />
                  ) : (
                    <span className="text-gray-400">No Logo</span>
                  )}
                </td>
                <td className="p-2 border">{uni.university_name}</td>
                <td className="p-2 border">{uni.country}</td>
                <td className="p-2 border space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => handleEdit(uni)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(uni.university_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3 className="text-xl font-semibold mb-2">University Offer Counts</h3>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">University</th>
            <th className="p-2 border">Offer Count</th>
          </tr>
        </thead>
        <tbody>
          {offerCounts.map(oc => (
            <tr key={oc.university_name}>
              <td className="p-2 border">{oc.university_name}</td>
              <td className="p-2 border">{oc.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UniversitiesManager;
