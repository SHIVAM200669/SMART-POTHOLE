import React, { useState, useRef } from 'react';
import { Camera, MapPin, Send, Loader2, X, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ReportForm = ({ onReportSubmitted }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const getCurrentLocation = () => {
    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setFetchingLocation(false);
        toast.success('Location detected!');
      },
      (err) => {
        console.error(err);
        setFetchingLocation(false);
        toast.error('Could not get location.');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !location) {
      toast.error('Please provide an image and location.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('latitude', location.lat);
    formData.append('longitude', location.lng);
    formData.append('description', description);

    try {
      const res = await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.aiStatus?.includes('Invalid/Fake')) {
        toast.error('Report rejected: Image is not a pothole.');
      } else {
        toast.success('Report submitted successfully!');
        setFile(null);
        setPreview(null);
        setDescription('');
        onReportSubmitted();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit report.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Camera className="text-white" size={20} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Report a Pothole</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Area */}
        <div 
          onClick={() => !preview && fileInputRef.current.click()}
          className={`
            relative rounded-2xl border-2 border-dashed transition-all duration-300
            ${preview ? 'border-transparent' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'}
          `}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
            accept="image/*"
          />
          
          {preview ? (
            <div className="relative rounded-2xl overflow-hidden group">
              <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreview(null);
                    setFile(null);
                  }}
                  className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/40 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center">
              <div className="bg-gray-100 p-4 rounded-full text-gray-400 mb-4">
                <ImageIcon size={32} />
              </div>
              <p className="text-sm font-semibold text-gray-700">Click to upload or drag image</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={getCurrentLocation}
                disabled={fetchingLocation}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all disabled:opacity-50"
              >
                {fetchingLocation ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} className="text-blue-600" />}
                {location ? 'Location Fixed' : 'Get Current Location'}
              </button>
              {location && (
                <div className="px-4 py-3 bg-green-50 border border-green-100 rounded-xl flex items-center">
                  <CheckCircle2 size={18} className="text-green-500" />
                </div>
              )}
            </div>
            {location && (
              <p className="mt-2 text-[10px] font-mono text-gray-400 bg-gray-50 p-2 rounded-lg text-center">
                LAT: {location.lat.toFixed(6)} | LNG: {location.lng.toFixed(6)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description (Optional)</label>
            <textarea 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all resize-none h-24"
              placeholder="Tell us about the damage..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading || !file || !location}
          className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-50 disabled:hover:shadow-none"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>AI Validating Report...</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>Submit Report</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
