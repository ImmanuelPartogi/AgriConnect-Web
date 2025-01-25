import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets'; // Import yang sesuai
import { FaPen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [settingsData, setSettingsData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        // Mengambil token dari localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No token found');
        }

        // Mengambil ID pengguna dari token atau tempat lain
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Mengdecode token JWT jika token JWT digunakan
        const userId = decodedToken.id;  // Pastikan ID ada di dalam token, jika tidak, ambil dari tempat lain

        // Request data pengaturan berdasarkan ID pengguna
        const response = await fetch(`http://localhost:4000/api/pengguna/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        // Jika response sukses
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setSettingsData(data.data); // Mengatur data pengaturan

      } catch (error) {
        console.error('Error fetching settings data:', error);
      }
    };

    fetchSettingsData();
  }, []);

  const handleEditClick = () => {
    navigate('/edit-pengaturan');
  };

  // Jika data belum ada (loading state)
  if (!settingsData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Menampilkan data pengaturan setelah berhasil diambil
  return (
    <div className="p-6 flex justify-center">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-2xl p-8 space-y-6 relative">
        <div className="absolute top-4 right-4 space-x-4">
          <button
            onClick={handleEditClick}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            <FaPen className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-semibold text-gray-800 pb-10">Pengaturan Akun</h1>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
            <p className="text-sm text-gray-500 w-1/3">Nama Lengkap</p>
            <p className="text-sm text-gray-800 font-medium break-words w-2/3">{settingsData.nama || '-'}</p>
          </div>
          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
            <p className="text-sm text-gray-500 w-1/3">Email</p>
            <p className="text-sm text-gray-800 font-medium break-words w-2/3">{settingsData.email || '-'}</p>
          </div>
          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
            <p className="text-sm text-gray-500 w-1/3">Pengalaman</p>
            <p className="text-sm text-gray-800 font-medium break-words w-2/3">{settingsData.pengalaman || '-'}</p>
          </div>
          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
            <p className="text-sm text-gray-500 w-1/3">Tentang</p>
            <p className="text-sm text-gray-800 font-medium break-words w-2/3">{settingsData.tentang || '-'}</p>
          </div>
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-500 w-1/3">Alamat</p>
            <p className="text-sm text-gray-800 break-words w-2/3">{settingsData.alamat || '-'}</p>
          </div>

          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
            <p className="text-sm text-gray-500 w-1/3">Jenis Kelamin</p>
            <p className="text-sm text-gray-800 font-medium break-words w-2/3">{settingsData.jenis_kelamin || '-'}</p>
          </div>
          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
            <p className="text-sm text-gray-500 w-1/3">Pekerjaan</p>
            <p className="text-sm text-gray-800 font-medium break-words w-2/3">{settingsData.pekerjaan || '-'}</p>
          </div>
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-500 w-1/3">No Hp</p>
            <p className="text-sm text-gray-800 font-medium break-words w-2/3">{settingsData.no_hp || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
