import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DetailUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Anda perlu login terlebih dahulu');
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:4000/api/pengguna/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Gagal mengambil data pengguna');
        }

        const data = await response.json();
        if (data.success) {
          setUser(data.data);
        } else {
          toast.error('Pengguna tidak ditemukan');
          navigate('/users');
        }
      } catch (error) {
        toast.error('Terjadi kesalahan saat mengambil data pengguna');
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, navigate]);

  const handleBack = () => {
    navigate('/users');
  };

  const handleEdit = () => {
    navigate(`/users/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Anda perlu login terlebih dahulu');
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:4000/api/pengguna/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus pengguna');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Pengguna berhasil dihapus');
        navigate('/users');
      } else {
        toast.error('Gagal menghapus pengguna');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus pengguna');
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-700 text-lg">
        Pengguna tidak ditemukan
      </div>
    );
  }

  const InfoItem = ({ label, value }) => (
    <div className="flex flex-col gap-1 p-5 border rounded-lg bg-white shadow-md">
      <span className="text-sm font-medium text-gray-500 uppercase">{label}</span>
      <span className="text-base font-semibold text-gray-800">{value}</span>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-br from-gray-50 to-green-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8 border bg-white">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 text-center">Detail Pengguna</h1>
          <p className="text-center text-sm text-gray-600 mt-2">Informasi lengkap mengenai pengguna</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <InfoItem label="Nama" value={user.nama} />
          <InfoItem label="Email" value={user.email} />
          <InfoItem label="Pengalaman" value={user.pengalaman || '-'} />
          <InfoItem label="Tentang" value={user.tentang || '-'} />
          <InfoItem label="Alamat" value={user.alamat || '-'} />
          <InfoItem label="Jenis Kelamin" value={user.jenis_kelamin || '-'} />
          <InfoItem label="Pekerjaan" value={user.pekerjaan || '-'} />
          <InfoItem label="No. Telepon" value={user.no_hp || '-'} />
          <InfoItem 
            label="Peran" 
            value={
              <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-semibold">
                {user.peran}
              </span>
            } 
          />
          <InfoItem 
            label="Akun Dibuat Pada" 
            value={new Date(user.dibuat_pada).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })} 
          />
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleBack}
            className="flex-1 px-6 py-3 bg-white text-black rounded-lg hover:bg-green-50 hover:text-green-600 border focus:outline-none focus:ring-2 focus:ring-green-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center">
            Kembali
          </button>
          <button
            onClick={handleEdit}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center">
            Edit Pengguna
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailUser;
