import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { FaPen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('/api/profil', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Response JSON:', data);
          setProfileData(data.data); // Update state
        } else {
          console.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    // Log perubahan profileData
    console.log("Profile Data (Updated):", profileData);
  }, [profileData]); // Hanya dipanggil saat profileData berubah

  const handleEditClick = () => {
    navigate('/edit-profile');
  };

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

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
          <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
        </div>
        <div className="flex flex-col items-center">
          <img
            className="w-40 h-40 rounded-full border-4 border-green-400 mb-6 object-cover"
            src={`http://localhost:4000${profileData?.gambar || assets.upload_area}`}
            onError={(e) => {
              e.target.src = assets.upload_area;
            }}
            alt="Profile"
          />
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
            <p className="text-sm text-gray-500 w-1/3">Nama Lengkap</p>
            <p className="text-sm text-gray-800 font-medium break-words w-2/3">{profileData.nama || '-'}</p>
          </div>
          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
            <p className="text-sm text-gray-500 w-1/3">Lokasi</p>
            <p className="text-sm text-gray-800 font-medium break-words w-2/3">{profileData.lokasi || '-'}</p>
          </div>
          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
            <p className="text-sm text-gray-500 w-1/3">Metode Pertanian</p>
            <p className="text-sm text-gray-800 font-medium break-words w-2/3">{profileData.metode_pertanian || '-'}</p>
          </div>
          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
            <p className="text-sm text-gray-500 w-1/3">Produk Ditawarkan</p>
            <p className="text-sm text-gray-800 font-medium break-words w-2/3">{profileData.produk_ditawarkan || '-'}</p>
          </div>
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-500 w-1/3">Bio</p>
            <p className="text-sm text-gray-800 font-medium break-words w-2/3">{profileData.bio || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
