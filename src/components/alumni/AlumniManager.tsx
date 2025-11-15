
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AlumniManager() {
  const { token } = useAuth();
  const [alumni, setAlumni] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    testimonial: '',
    batch_id: '',
    current_university_id: '',
    accepted_university_ids: [] as string[],
    photo: null
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch alumni, batches, universities
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [alumniRes, batchRes, uniRes] = await Promise.all([
        api.alumni.getAll(),
        api.batches.getAll(),
        api.universities.getAll()
      ]);
      setAlumni(alumniRes);
      setBatches(batchRes);
      setUniversities(uniRes);
    } catch (err) {
      setError('Failed to load alumni data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, files } = e.target as any;
    if (type === 'file') {
      setForm(f => ({ ...f, photo: files[0] }));
    } else if (name === 'accepted_university_ids') {
      const options = Array.from((e.target as HTMLSelectElement).selectedOptions).map(o => o.value);
      setForm(f => ({ ...f, accepted_university_ids: options }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('testimonial', form.testimonial);
      payload.append('batch_id', form.batch_id);
      payload.append('current_university_id', form.current_university_id);
      form.accepted_university_ids.forEach((id: string) => payload.append('accepted_university_ids', id));
      if (form.photo) payload.append('photo', form.photo);
      if (editId) {
        await api.alumni.update(editId, payload, token!);
      } else {
        await api.alumni.create(payload, token!);
      }
      setForm({ name: '', testimonial: '', batch_id: '', current_university_id: '', accepted_university_ids: [], photo: null });
      setEditId(null);
      fetchData();
    } catch (err) {
      setError('Failed to save alumnus');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (alumnus: any) => {
    setForm({
      name: alumnus.name,
      testimonial: alumnus.testimonial || '',
      batch_id: alumnus.batch_id || '',
      current_university_id: alumnus.current_university_id || '',
      accepted_university_ids: alumnus.alumni_universities?.map((au: any) => au.university_id) || [],
      photo: null
    });
    setEditId(alumnus.alumni_id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this alumnus?')) return;
    setActionLoading(true);
    try {
      await api.alumni.delete(id, token!);
      fetchData();
    } catch (err) {
      setError('Failed to delete alumnus');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Alumni</h2>
      <form className="mb-6" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="border rounded px-2 py-1 w-1/2"
            required
          />
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="border rounded px-2 py-1 w-1/2"
          />
        </div>
        <textarea
          name="testimonial"
          value={form.testimonial}
          onChange={handleChange}
          placeholder="Testimonial"
          className="border rounded px-2 py-1 mb-2 w-full"
        />
        <div className="flex gap-2 mb-2">
          <select
            name="batch_id"
            value={form.batch_id}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-1/2"
            required
          >
            <option value="">Select Batch</option>
            {batches.map(batch => (
              <option key={batch.batch_id} value={batch.batch_id}>{batch.batch_year}</option>
            ))}
          </select>
          <select
            name="current_university_id"
            value={form.current_university_id}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-1/2"
            required
          >
            <option value="">Current University</option>
            {universities.map(u => (
              <option key={u.university_id} value={u.university_id}>{u.university_name}</option>
            ))}
          </select>
        </div>
        <label className="block mb-2">
          Accepted Universities (multi-select):
          <select
            name="accepted_university_ids"
            multiple
            value={form.accepted_university_ids}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          >
            {universities.map(u => (
              <option key={u.university_id} value={u.university_id}>{u.university_name}</option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded shadow hover:bg-blue-700 disabled:opacity-50"
          disabled={actionLoading}
        >
          {editId ? 'Update Alumnus' : 'Add Alumnus'}
        </button>
        {editId && (
          <button
            type="button"
            className="ml-2 px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
            onClick={() => { setEditId(null); setForm({ name: '', testimonial: '', batch_id: '', current_university_id: '', accepted_university_ids: [], photo: null }); }}
          >Cancel</button>
        )}
      </form>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <ul className="mb-4">
          {alumni.map(alumnus => (
            <li key={alumnus.alumni_id} className="flex items-center justify-between p-2 rounded mb-2 bg-gray-50 hover:bg-blue-100">
              <span>
                <span className="font-semibold">{alumnus.name}</span>
                {alumnus.batches && <span className="ml-2 text-xs text-gray-500">Batch: {alumnus.batches.batch_year}</span>}
                {alumnus.universities && <span className="ml-2 text-xs text-blue-600">Current: {alumnus.universities.university_name}</span>}
                {alumnus.testimonial && <span className="ml-2 text-xs text-green-600">Testimonial: {alumnus.testimonial}</span>}
                {alumnus.photo_url && <img src={alumnus.photo_url} alt="Profile" className="inline-block ml-2 w-8 h-8 rounded-full object-cover" />}
                {alumnus.alumni_universities && alumnus.alumni_universities.length > 0 && (
                  <span className="ml-2 text-xs text-purple-600">Accepted: {alumnus.alumni_universities.map((au: any) => au.universities.university_name).join(', ')}</span>
                )}
              </span>
              <span className="flex gap-2">
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded bg-yellow-100 hover:bg-yellow-200"
                  onClick={() => handleEdit(alumnus)}
                  disabled={actionLoading}
                >Edit</button>
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700"
                  onClick={() => handleDelete(alumnus.alumni_id)}
                  disabled={actionLoading}
                >Delete</button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
