import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout/Layout';
import StatCard from '../components/Dashboard/StatCard';
import MapComponent from '../components/MapComponent';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ClipboardList, Clock, CheckCircle2, AlertCircle, Search, Filter, Users, Calendar, ArrowUpRight, Trash2, MapPin } from 'lucide-react';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, avgResolution: 'N/A' });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [reportsRes, statsRes] = await Promise.all([
        api.get('/complaints'),
        api.get('/complaints/stats')
      ]);
      setReports(reportsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (id, data) => {
    try {
      await api.put(`/complaints/${id}`, data);
      toast.success('Report updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update report');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      toast.success('Report removed');
      fetchData();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const filteredReports = reports.filter(r => {
    const matchesFilter = filter === 'All' || r.status === filter;
    const matchesSearch = r.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.user_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Control Panel</h1>
            <p className="text-gray-500 mt-1">Manage public infrastructure maintenance and pothole repairs.</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
              <Calendar size={18} className="text-blue-600" />
              <span className="text-sm font-bold text-gray-700">Real-time Data</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Complaints" value={stats.total} icon={ClipboardList} color="blue" />
          <StatCard title="Awaiting Action" value={stats.pending} icon={Clock} color="yellow" />
          <StatCard title="Fully Repaired" value={stats.completed} icon={CheckCircle2} color="green" />
          <StatCard title="Avg. Est. Time" value={`${stats.avgEstimated} days`} icon={AlertCircle} color="purple" />
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Infrastructure Health Map</h2>
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
              {['All', 'Pending', 'In Progress', 'Completed'].map(s => (
                <button 
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    filter === s ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[500px]">
            <MapComponent complaints={filteredReports} onUpdate={handleUpdateStatus} isAdmin={true} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Manage Complaints</h2>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by user or description..."
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none w-64 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Complaint</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status & Progress</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Staffing</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Est. Days</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={report.image_url.startsWith('http') ? report.image_url : `http://localhost:5000${report.image_url}`} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                        <div className="max-w-[200px]">
                          <p className="text-sm font-bold text-gray-900 truncate">{report.description || 'No description'}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Users size={10} className="text-gray-400" />
                            <span className="text-[10px] text-gray-500 font-medium">{report.user_name}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-gray-500">{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</span>
                        <a 
                          href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] text-blue-600 font-bold hover:underline mt-1 flex items-center gap-1"
                        >
                          <MapPin size={10} /> View Map
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 min-w-[150px]">
                        <select 
                          value={report.status}
                          onChange={(e) => handleUpdateStatus(report.id, { status: e.target.value })}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-none transition-all cursor-pointer w-fit ${
                            report.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' : 
                            report.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                            'bg-yellow-50 text-yellow-700 border-yellow-100'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              report.status === 'Completed' ? 'bg-green-500' : report.status === 'In Progress' ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: report.status === 'Completed' ? '100%' : report.status === 'In Progress' ? '60%' : '20%' }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5 w-fit">
                        <Users size={14} className="text-gray-400" />
                        <input 
                          type="number"
                          className="text-xs font-bold text-gray-700 bg-transparent border-none p-0 w-8 focus:ring-0"
                          value={report.workers_assigned || 0}
                          onChange={(e) => handleUpdateStatus(report.id, { workers_assigned: e.target.value })}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-xl px-3 py-1.5 w-fit">
                        <Clock size={14} className="text-purple-400" />
                        <input 
                          type="number"
                          placeholder="0"
                          className="text-xs font-bold text-purple-700 bg-transparent border-none p-0 w-8 focus:ring-0"
                          value={report.estimated_completion_time || ''}
                          onChange={(e) => handleUpdateStatus(report.id, { estimated_completion_time: e.target.value })}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleDelete(report.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
