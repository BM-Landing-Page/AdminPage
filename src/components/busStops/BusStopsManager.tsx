import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface BusStopsManagerProps {
  routeId: string | number;
}

interface BusStop {
  id: string | number;
  name: string;
  pickup?: string | null;
  drop?: string | null;
  order?: number | null;
}


export default function BusStopsManager({ routeId }: BusStopsManagerProps) {
  const { token } = useAuth();
  const [stops, setStops] = useState<BusStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', pickup: '', drop: '', order: '', route: routeId });
  const [editId, setEditId] = useState<string | number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStops = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.busStops.getByRoute(routeId);
      setStops(data);
    } catch (err) {
      setError('Failed to load bus stops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStops();
    setForm(f => ({ ...f, route: routeId }));
  }, [routeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setActionLoading(true);
    try {
      const payload = {
        name: form.name,
        pickup: form.pickup || undefined,
        drop: form.drop || undefined,
        order: form.order ? parseInt(form.order) : undefined,
        route: routeId,
      };
      if (editId) {
        await api.busStops.update(editId, payload, token!);
      } else {
        await api.busStops.create(payload, token!);
      }
      setForm({ name: '', pickup: '', drop: '', order: '', route: routeId });
      setEditId(null);
      fetchStops();
    } catch (err) {
      setError('Failed to save bus stop');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (stop: BusStop) => {
    setForm({
      name: stop.name,
      pickup: stop.pickup || '',
      drop: stop.drop || '',
      order: stop.order?.toString() || '',
      route: routeId,
    });
    setEditId(stop.id);
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Delete this bus stop?')) return;
    setActionLoading(true);
    try {
      await api.busStops.delete(id, token!);
      fetchStops();
    } catch (err) {
      setError('Failed to delete bus stop');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded shadow">
      <h3 className="text-xl font-semibold mb-3">Bus Stops</h3>
      <form className="mb-6" onSubmit={handleSubmit}>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Stop Name"
            className="border rounded px-2 py-1 w-1/3"
            required
          />
          <input
            type="time"
            name="pickup"
            value={form.pickup}
            onChange={handleChange}
            placeholder="Pickup Time"
            className="border rounded px-2 py-1 w-1/3"
          />
          <input
            type="time"
            name="drop"
            value={form.drop}
            onChange={handleChange}
            placeholder="Drop Time"
            className="border rounded px-2 py-1 w-1/3"
          />
        </div>
        <input
          type="number"
          name="order"
          value={form.order}
          onChange={handleChange}
          placeholder="Order"
          className="border rounded px-2 py-1 mb-2 w-1/4"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded shadow hover:bg-blue-700 disabled:opacity-50"
          disabled={actionLoading}
        >
          {editId ? 'Update Stop' : 'Add Stop'}
        </button>
        {editId && (
          <button
            type="button"
            className="ml-2 px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
            onClick={() => { setEditId(null); setForm({ name: '', pickup: '', drop: '', order: '', route: routeId }); }}
          >Cancel</button>
        )}
      </form>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : stops.length === 0 ? (
        <div className="text-gray-500">No stops found for this route.</div>
      ) : (
        <ol className="list-decimal ml-6">
          {stops.map(stop => (
            <li key={stop.id} className="mb-2 flex items-center justify-between">
              <span>
                <span className="font-medium">{stop.name}</span>
                {stop.pickup && <span className="ml-2 text-xs text-green-600">Pickup: {stop.pickup}</span>}
                {stop.drop && <span className="ml-2 text-xs text-blue-600">Drop: {stop.drop}</span>}
                {typeof stop.order === 'number' && <span className="ml-2 text-xs text-gray-500">Order: {stop.order}</span>}
              </span>
              <span className="flex gap-2">
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded bg-yellow-100 hover:bg-yellow-200"
                  onClick={() => handleEdit(stop)}
                  disabled={actionLoading}
                >Edit</button>
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700"
                  onClick={() => handleDelete(stop.id)}
                  disabled={actionLoading}
                >Delete</button>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
