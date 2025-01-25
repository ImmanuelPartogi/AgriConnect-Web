import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { FaPen, FaPlus, FaMapMarkerAlt, FaLeaf, FaBox } from 'react-icons/fa';

function Profile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isProduksLoading, setIsProduksLoading] = useState(true);
  const [error, setError] = useState(null);
  const [produk, setProduk] = useState([]);

  // Fetch Profile Data
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsProfileLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found');

        const response = await fetch('/api/profil', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setProfileData(data.data || null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching profile data:', err);
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    const fetchProdukData = async () => {
      setIsProduksLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found');

        const response = await fetch('http://localhost:4000/api/produk/produkPetani', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Response error:", errorText);
          throw new Error('Failed to fetch products data');
        }

        const data = await response.json();
        setProduk(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products data:', err);
      } finally {
        setIsProduksLoading(false);
      }
    };
    fetchProdukData();
  }, []);

  if (isProfileLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-600 font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 transition-all duration-300 hover:shadow-xl">
          <div className="relative h-48 bg-gradient-to-r from-green-600 to-green-400">
            <button
              onClick={() => navigate('/edit-profile')}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
            >
              <FaPen className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative px-8 pb-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative -mt-24">
                <img
                  className="w-48 h-48 rounded-xl border-4 border-white shadow-lg object-cover"
                  src={`http://localhost:4000${profileData?.gambar || assets.upload_area}`}
                  onError={(e) => { e.target.src = assets.upload_area; }}
                  alt="Profile"
                />
              </div>
              
              <div className="flex-1 md:ml-8 mt-6 md:mt-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{profileData?.nama || '-'}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Lokasi</p>
                      <p className="text-gray-900">{profileData?.lokasi || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <FaLeaf className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Metode Pertanian</p>
                      <p className="text-gray-900">{profileData?.metode_pertanian || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <FaBox className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Produk Ditawarkan</p>
                      <p className="text-gray-900">{profileData?.produk_ditawarkan || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hasil Panen Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Hasil Panen</h3>
            <button 
              onClick={() => navigate('/tambah-produk')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300"
            >
              <FaPlus className="w-4 h-4" />
              <span>Tambah Produk</span>
            </button>
          </div>

          {isProduksLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="rounded-xl bg-gray-200 h-56 w-full"></div>
                </div>
              ))}
            </div>
          ) : produk.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {produk.map((item, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/detail-produk/${item.id}`)}
                  className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img
                    src={item?.gambar ? `http://localhost:4000${item.gambar}` : assets.admin_logo}
                    alt={item.nama || 'Produk tidak tersedia'}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = assets?.placeholder || '/default-placeholder.png';
                    }}
                  />
                  {item.nama && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="font-medium">{item.nama}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Tidak ada hasil panen yang tersedia.</p>
              <p className="text-sm text-gray-400 mt-2">Klik tombol tambah untuk menambahkan produk baru</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;