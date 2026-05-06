import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React from 'react';
import { Users, Clock, User, Mail, CheckCircle2 } from 'lucide-react';

// Fix leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ complaints, onUpdate, isAdmin }) => {
  const defaultCenter = [12.8227, 80.0441]; // Centered around the reported location in your screenshot

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-inner">
      <MapContainer 
        center={complaints.length > 0 ? [complaints[0].latitude, complaints[0].longitude] : defaultCenter} 
        zoom={13} 
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {complaints.map(c => (
          <Marker key={c.id} position={[c.latitude, c.longitude]}>
            <Popup className="admin-map-popup">
              <div className="w-64 p-1">
                <img 
                  src={c.image_url.startsWith('http') ? c.image_url : `http://localhost:5000${c.image_url}`} 
                  alt="Pothole" 
                  className="w-full h-32 object-cover rounded-xl mb-3 shadow-sm" 
                />
                
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1">{c.description || 'Pothole Report'}</h3>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                        <User size={12} className="text-blue-500" />
                        <span>{c.user_name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                        <Mail size={12} className="text-blue-500" />
                        <span>{c.user_email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</label>
                      <select 
                        disabled={!isAdmin}
                        value={c.status}
                        onChange={(e) => onUpdate(c.id, { status: e.target.value })}
                        className={`text-[10px] font-bold px-2 py-1.5 rounded-lg border focus:outline-none transition-all cursor-pointer ${
                          c.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' : 
                          c.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                          'bg-yellow-50 text-yellow-700 border-yellow-100'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    {isAdmin && (
                      <>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assign Workers</label>
                          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1">
                            <Users size={12} className="text-gray-400" />
                            <input 
                              type="number"
                              className="text-[10px] font-bold text-gray-700 bg-transparent border-none p-0 w-full focus:ring-0"
                              value={c.workers_assigned || 0}
                              onChange={(e) => onUpdate(c.id, { workers_assigned: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Est. Days</label>
                          <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-lg px-2 py-1">
                            <Clock size={12} className="text-purple-400" />
                            <input 
                              type="number"
                              className="text-[10px] font-bold text-purple-700 bg-transparent border-none p-0 w-full focus:ring-0"
                              value={c.estimated_completion_time || ''}
                              placeholder="0"
                              onChange={(e) => onUpdate(c.id, { estimated_completion_time: e.target.value })}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
