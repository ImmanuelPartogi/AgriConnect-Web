import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPen, FaUser, FaEnvelope, FaBriefcase, FaMapMarkerAlt, FaPhone, FaInfo } from 'react-icons/fa';

const Settings = () => {
  const [settingsData, setSettingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        const response = await fetch(`http://localhost:4000/api/pengguna/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

        const data = await response.json();
        setSettingsData(data.data);
      } catch (error) {
        console.error('Error fetching settings data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettingsData();
  }, []);

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
      <div className="flex-shrink-0">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-sm text-gray-900 mt-1">{value || '-'}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200">
        <div className="text-center p-6 relative border-b border-gray-200">
          <button
            onClick={() => navigate('/edit-pengaturan')}
            className="absolute right-6 top-6 p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
          >
            <FaPen className="w-4 h-4 text-blue-600" />
          </button>

          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {settingsData.nama?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {settingsData.nama}
              </h2>
              <p className="text-gray-500 mt-1">{settingsData.pekerjaan}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow icon={FaUser} label="Nama Lengkap" value={settingsData.nama} />
            <InfoRow icon={FaEnvelope} label="Email" value={settingsData.email} />
            <InfoRow icon={FaBriefcase} label="Pengalaman" value={settingsData.pengalaman} />
            <InfoRow icon={FaInfo} label="Tentang" value={settingsData.tentang} />
            <InfoRow icon={FaMapMarkerAlt} label="Alamat" value={settingsData.alamat} />
            <InfoRow icon={FaUser} label="Jenis Kelamin" value={settingsData.jenis_kelamin} />
            <InfoRow icon={FaBriefcase} label="Pekerjaan" value={settingsData.pekerjaan} />
            <InfoRow icon={FaPhone} label="No HP" value={settingsData.no_hp} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;