import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Users, Phone, Shield, Plus, Trash2, Edit2, Check, X, CheckCircle2 } from 'lucide-react';

const ManageWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWorker, setNewWorker] = useState({ name: '', contact: '', specialization: '' });
  const [summary, setSummary] = useState({ required: 0, registered: 0 });

  const fetchData = async () => {
    try {
      const [workersRes, complaintsRes] = await Promise.all([
        api.get('/workers'),
        api.get('/complaints')
      ]);
      setWorkers(workersRes.data);
      
      const totalRequired = complaintsRes.data.reduce((acc, curr) => acc + (curr.workers_assigned || 0), 0);
      setSummary({
        required: totalRequired,
        registered: workersRes.data.length
      });
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddWorker = async (e) => {
    e.preventDefault();
    try {
      await api.post('/workers', newWorker);
      toast.success('Worker added successfully');
      setNewWorker({ name: '', contact: '', specialization: '' });
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to add worker');
    }
  };

  const handleDeleteWorker = async (id) => {
    if (!window.confirm('Remove this worker from the system?')) return;
    try {
      await api.delete(`/workers/${id}`);
      toast.success('Worker removed');
      fetchData();
    } catch (err) {
      toast.error('Failed to remove worker');
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Maintenance Staff</h1>
            <p className="text-gray-500 mt-1">Manage and assign workers for infrastructure repairs.</p>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            {showAddForm ? <X size={20} /> : <Plus size={20} />}
            {showAddForm ? 'Cancel' : 'Add New Worker'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Staff Registered</h3>
            <p className="text-3xl font-bold text-gray-900">{summary.registered}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Workers Needed (From Reports)</h3>
            <p className="text-3xl font-bold text-blue-600">{summary.required}</p>
            {summary.registered < summary.required && (
              <p className="text-xs text-red-500 font-bold mt-2">⚠️ Need {summary.required - summary.registered} more workers!</p>
            )}
          </div>
        </div>

        {showAddForm && (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl animate-in slide-in-from-top-4 duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Worker Details</h2>
            <form onSubmit={handleAddWorker} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  value={newWorker.name}
                  onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Number</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. +1 234 567 890"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  value={newWorker.contact}
                  onChange={(e) => setNewWorker({...newWorker, contact: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Specialization</label>
                <input 
                  type="text" 
                  placeholder="e.g. Asphalt Specialist"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  value={newWorker.specialization}
                  onChange={(e) => setNewWorker({...newWorker, specialization: e.target.value})}
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all">
                  Register Worker
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map(worker => (
            <div key={worker.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
                  {worker.name[0]}
                </div>
                <button 
                  onClick={() => handleDeleteWorker(worker.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1">{worker.name}</h3>
              <p className="text-sm text-gray-500 mb-6">{worker.specialization || 'General Maintenance'}</p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Phone size={14} className="text-gray-400" />
                  </div>
                  <span className="text-sm font-medium">{worker.contact}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Shield size={14} className="text-gray-400" />
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    worker.status === 'Available' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                  }`}>
                    {worker.status}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {workers.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">No workers registered yet.</p>
              <button onClick={() => setShowAddForm(true)} className="mt-4 text-blue-600 font-bold hover:underline">
                Register your first worker
              </button>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Staff Requirements by Project</h2>
          <div className="space-y-4">
            {workers.length === 0 ? (
              <p className="text-gray-500 italic">Register workers above to begin assignments.</p>
            ) : (
              <p className="text-sm text-gray-500 mb-4">The following reports require on-site personnel:</p>
            )}
            
            <div className="grid gap-4">
              {summary.required > 0 ? (
                // We'll fetch this from the same fetchData call
                // For simplicity, I'll just show the count for now, 
                // but let's assume we have the reports in a state
                <p className="text-sm font-medium text-gray-700">
                   Check the <Link to="/admin" className="text-blue-600 hover:underline">Admin Dashboard Map</Link> to assign specific registered workers to active locations.
                </p>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100">
                  <CheckCircle2 size={20} />
                  <span className="font-bold">All active projects have sufficient staffing or are completed.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageWorkers;
