import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout/Layout';
import StatCard from '../components/Dashboard/StatCard';
import MapComponent from '../components/MapComponent';
import ReportForm from '../components/ReportForm';
import ReportCard from '../components/Report/ReportCard';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ClipboardList, Clock, CheckCircle2, AlertCircle, Plus, Map as MapIcon, Search, Filter, Loader2, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, avgResolution: 'N/A' });
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'dashboard';

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
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      toast.success('Report deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete report');
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await api.put(`/complaints/${id}`, data);
      toast.success('Report updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update report');
    }
  };

  const renderContent = () => {
    switch (tab) {
      case 'report':
        return (
          <div className="max-w-2xl mx-auto">
            <ReportForm onReportSubmitted={fetchData} />
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Your Reports</h1>
                <p className="text-gray-500">View and manage your submitted pothole reports.</p>
              </div>
              <button 
                onClick={() => setSearchParams({ tab: 'report' })}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                New Report
              </button>
            </div>
            
            <div className="grid gap-6">
              {reports.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                  <div className="bg-gray-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <ClipboardList size={32} />
                  </div>
                  <p className="text-gray-500 font-medium">You haven't submitted any reports yet.</p>
                  <button 
                    onClick={() => setSearchParams({ tab: 'report' })}
                    className="mt-4 text-blue-600 font-bold hover:underline"
                  >
                    Submit your first report
                  </button>
                </div>
              ) : (
                reports.map(report => (
                  <ReportCard 
                    key={report.id} 
                    report={report} 
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                ))
              )}
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Reports" value={stats.total} icon={ClipboardList} color="blue" trend="+12%" />
              <StatCard title="Pending" value={stats.pending} icon={Clock} color="yellow" trend="-5%" />
              <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} color="green" trend="+8%" />
              <StatCard title="Avg Resolution" value={`${stats.avgResolution} days`} icon={AlertCircle} color="purple" />
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Activity Heatmap</h2>
              <div className="h-64 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center">
                <p className="text-gray-400 text-sm">Visual analytics coming soon</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Reports" value={stats.total} icon={ClipboardList} color="blue" />
              <StatCard title="Pending" value={stats.pending} icon={Clock} color="yellow" />
              <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} color="green" />
              <StatCard title="Avg Resolution" value={`${stats.avgResolution} days`} icon={AlertCircle} color="purple" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Live Pothole Map</h2>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Pending
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> In Progress
                    </span>
                  </div>
                </div>
                <div className="h-[450px] rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                  <MapComponent complaints={reports} />
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <div className="space-y-4">
                  {reports.slice(0, 3).map(report => (
                    <div key={report.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                      <img 
                        src={report.image_url.startsWith('http') ? report.image_url : `http://localhost:5000${report.image_url}`} 
                        className="w-12 h-12 rounded-xl object-cover" 
                        alt="" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{report.description || 'Pothole Report'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{new Date(report.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        report.status === 'Completed' ? 'bg-green-500' : report.status === 'In Progress' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}></div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setSearchParams({ tab: 'reports' })}
                    className="w-full py-3 text-sm font-bold text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    View All Reports <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium animate-pulse">Loading dashboard data...</p>
        </div>
      ) : (
        renderContent()
      )}
    </Layout>
  );
};

export default Dashboard;
