import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import BusStopsManager from '../busStops/BusStopsManager';
import { useAuth } from '../../context/AuthContext';


export default function BusRoutesManager() {
  const { token } = useAuth();
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ route_name: '', bus_number: '', active: true });
  const [editId, setEditId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRoutes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.busRoutes.getAll();
      setRoutes(data);
    } catch (err) {
      setError('Failed to load bus routes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.route_name || !form.bus_number) return;
    setActionLoading(true);
    try {
      if (editId) {
        await api.busRoutes.update(editId, form, token!);
      } else {
        await api.busRoutes.create(form, token!);
      }
      setForm({ route_name: '', bus_number: '', active: true });
      setEditId(null);
      fetchRoutes();
    } catch (err) {
      setError('Failed to save bus route');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (route: any) => {
    setForm({ route_name: route.route_name, bus_number: route.bus_number, active: route.active });
    setEditId(route.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this bus route and all its stops?')) return;
    setActionLoading(true);
    try {
      await api.busRoutes.delete(id, token!);
      if (selectedRoute?.id === id) setSelectedRoute(null);
      fetchRoutes();
    } catch (err) {
      setError('Failed to delete bus route');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Bus Routes</h2>
      <form className="mb-6" onSubmit={handleSubmit}>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            name="route_name"
            value={form.route_name}
            onChange={handleChange}
            placeholder="Route Name"
            className="border rounded px-2 py-1 w-1/2"
            required
          />
          <input
            type="text"
            name="bus_number"
            value={form.bus_number}
            onChange={handleChange}
            placeholder="Bus Number"
            className="border rounded px-2 py-1 w-1/2"
            required
          />
        </div>
        <label className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
          />
          Active
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded shadow hover:bg-blue-700 disabled:opacity-50"
          disabled={actionLoading}
        >
          {editId ? 'Update Route' : 'Add Route'}
        </button>
        {editId && (
          <button
            type="button"
            className="ml-2 px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
            onClick={() => { setEditId(null); setForm({ route_name: '', bus_number: '', active: true }); }}
          >Cancel</button>
        )}
      </form>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <ul className="mb-4">
          {routes.map(route => (
            <li
              key={route.id}
              className={`flex items-center justify-between cursor-pointer p-2 rounded mb-2 hover:bg-blue-100 ${selectedRoute?.id === route.id ? 'bg-blue-200' : ''}`}
              onClick={() => setSelectedRoute(route)}
            >
              <span>
                <span className="font-semibold">{route.route_name}</span> <span className="text-gray-600">({route.bus_number})</span>
                {route.active === false && <span className="ml-2 text-xs text-red-500">Inactive</span>}
              </span>
              <span className="flex gap-2">
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded bg-yellow-100 hover:bg-yellow-200"
                  onClick={e => { e.stopPropagation(); handleEdit(route); }}
                  disabled={actionLoading}
                >Edit</button>
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700"
                  onClick={e => { e.stopPropagation(); handleDelete(route.id); }}
                  disabled={actionLoading}
                >Delete</button>
              </span>
            </li>
          ))}
        </ul>
      )}
      {selectedRoute && (
        <BusStopsManager routeId={selectedRoute.id} />
      )}
    </div>
  );
}
