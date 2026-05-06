import React, { useState } from 'react';
import { Calendar, MapPin, Trash2, Edit2, CheckCircle2, Clock, Users, ChevronRight, X, Check } from 'lucide-react';

const ReportCard = ({ report, onUpdate, onDelete, isAdmin }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(report.description);

  const statusColors = {
    'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-100',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-100',
    'Completed': 'bg-green-50 text-green-700 border-green-100'
  };

  const handleUpdate = () => {
    onUpdate(report.id, { description: newDescription });
    setIsEditing(false);
  };

  const getProgress = (status) => {
    if (status === 'Pending') return 20;
    if (status === 'In Progress') return 60;
    if (status === 'Completed') return 100;
    return 0;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
      <div className="md:flex">
        {/* Image */}
        <div className="md:w-48 h-48 md:h-auto relative overflow-hidden">
          <img 
            src={report.image_url.startsWith('http') ? report.image_url : `http://localhost:5000${report.image_url}`} 
            alt="Pothole" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 text-xs font-bold rounded-full border backdrop-blur-md ${statusColors[report.status]}`}>
              {report.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                <Calendar size={14} />
                <span>{new Date(report.created_at).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <MapPin size={14} />
                <span className="truncate max-w-[200px]">{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</span>
              </div>
              
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                  <button onClick={handleUpdate} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                    <Check size={16} />
                  </button>
                  <button onClick={() => setIsEditing(false)} className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <p className="text-gray-900 font-medium line-clamp-2 mb-1">{report.description}</p>
              )}
              
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">AI Validation:</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  report.ai_status?.includes('Valid') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {report.ai_status}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 ml-4">
              {(!isAdmin && report.status === 'Pending') && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
              )}
              <button 
                onClick={() => onDelete(report.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Users size={16} className="text-gray-400" />
              <span>{report.workers_assigned || 0} Workers</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Clock size={16} className="text-gray-400" />
              <span className="truncate">{report.estimated_completion_time || 'No estimate yet'}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Progress</span>
              <span className="text-[10px] font-bold text-blue-600">{getProgress(report.status)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                style={{ width: `${getProgress(report.status)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
