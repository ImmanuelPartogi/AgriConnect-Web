import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DetailProduk = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdukById = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Token tidak ditemukan');
          return;
        }

        const response = await fetch(`http://localhost:4000/api/produk/produkPetani/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(`Gagal mengambil detail produk: ${errorData.message}`);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data.kategori_id && !data.kategori_id.nama) {
          const kategoriResponse = await fetch(`http://localhost:4000/api/kategori/${data.kategori_id}`);
          const kategoriData = await kategoriResponse.json();
          data.kategori_id = kategoriData.nama;
        }

        if (data.gambar && !data.gambar.startsWith('http')) {
          data.gambar = `http://localhost:4000${data.gambar}`;
        }

        setProduk(data);
      } catch (error) {
        toast.error('Terjadi kesalahan saat mengambil detail produk');
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdukById();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Token tidak ditemukan');
          return;
        }

        const response = await fetch(`http://localhost:4000/api/produk/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          toast.success(result.message);
          navigate('/profil');
        } else {
          toast.error(result.message || 'Gagal menghapus produk');
        }
      } catch (error) {
        toast.error('Terjadi kesalahan saat menghapus produk');
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleBack = () => {
    navigate('/profil');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-5">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-800"></div>
            <p className="ml-4 text-gray-600">Memuat detail produk...</p>
          </div>
        ) : produk ? (
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <img
                src={produk.gambar}
                alt={produk.nama}
                className="max-w-full h-auto rounded-lg shadow-md"
              />
            </div>

            <h1 className="text-2xl font-semibold text-gray-800 mb-4">{produk.nama}</h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">{produk.deskripsi}</p>

            <div className="space-y-2">
              <p className="text-sm text-gray-500"><strong>Harga:</strong> Rp {produk.harga}</p>
              <p className="text-sm text-gray-500"><strong>Stok:</strong> {produk.stok}</p>
              <p className="text-sm text-gray-500"><strong>Kategori:</strong> {produk.kategori_id}</p>
              <p className="text-sm text-gray-500"><strong>Lokasi:</strong> {produk.lokasi}</p>
            </div>

            <div className="flex justify-between gap-4 mt-8">
              <button
                onClick={handleBack}
                className="py-2 px-4 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition"
              >
                Kembali
              </button>
              <button
                onClick={handleDelete}
                className="py-2 px-4 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition"
              >
                Hapus Produk
              </button>
              <button
                onClick={() => navigate(`/edit-produk/${id}`)}
                className="py-2 px-4 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-600 transition"
              >
                Edit Produk
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Produk tidak ditemukan</p>
        )}
      </div>
    </div>
  );
};

export default DetailProduk;
