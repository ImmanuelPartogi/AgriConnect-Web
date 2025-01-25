import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSpinner, FaChevronLeft, FaCalendarAlt, FaClock } from 'react-icons/fa';

const DetailProduk = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const API_BASE_URL = 'http://localhost:4000';

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    try {
      new URL(imagePath); // Check if it's already a valid URL
      return imagePath;
    } catch {
      if (imagePath.startsWith('/uploads/')) {
        return `${API_BASE_URL}${imagePath}`;
      } else if (imagePath.startsWith('uploads/')) {
        return `${API_BASE_URL}/${imagePath}`;
      } else {
        return `${API_BASE_URL}/uploads/${imagePath}`;
      }
    }
  };

  const validateImageUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return url.match(/\.(jpg|jpeg|png|gif|webp)$/i) !== null;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const fetchProdukById = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Token tidak ditemukan');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/produk/produkPetani/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(`Gagal mengambil data produk: ${errorData.message}`);
          setLoading(false);
          return;
        }

        const data = await response.json();

        // Validate and format image URL
        if (data.gambar) {
          const fullImageUrl = getFullImageUrl(data.gambar);
          if (validateImageUrl(fullImageUrl)) {
            data.gambar = fullImageUrl;
          } else {
            data.gambar = null;
            console.warn('Invalid image URL format:', data.gambar);
          }
        }

        setProduk(data);
      } catch (error) {
        console.error('Error fetching produk:', error);
        toast.error('Terjadi kesalahan saat mengambil data produk');
      } finally {
        setLoading(false);
      }
    };

    fetchProdukById();
  }, [id]);

  const handleBack = () => {
    navigate('/produk');
  };

  const handleImageError = () => {
    setImageError(true);
    console.warn('Failed to load image:', produk?.gambar);
  };

  const ImagePlaceholder = () => (
    <div className="flex items-center justify-center w-full h-64 bg-gray-200 rounded-lg border border-gray-300">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-600">Gambar tidak tersedia</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 text-lg">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (!produk) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
          <p className="text-lg text-gray-600 text-center">Produk tidak ditemukan</p>
          <button
            onClick={handleBack}
            className="mt-4 flex items-center mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            <FaChevronLeft className="w-4 h-4 mr-2" />
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(produk.dibuat_pada).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = new Date(produk.dibuat_pada).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <button
                onClick={handleBack}
                className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-green-600 transition duration-200"
              >
                <FaChevronLeft className="w-4 h-4 mr-2" />
                Kembali
              </button>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">{produk.nama}</h1>
            <div className="flex items-center text-sm text-gray-500">
              <FaCalendarAlt className="w-4 h-4 mr-1 text-blue-500" />
              <span className="mr-4">
                <span className="mr-4">{formattedDate}</span>
              </span>
              <FaClock className="w-4 h-4 mr-1 text-green-500" />
              <span>{formattedTime}</span>
            </div>
          </div>

          {/* Image Section */}
          <div className="pt-6">
            {produk.gambar ? (
              <div className="mb-6 flex justify-center">

                <img
                  src={produk.gambar}
                  alt={produk.nama}
                  className="w-full max-w-xl object-cover rounded-xl shadow-lg "
                  onError={handleImageError}
                />
              </div>
            ) : (
              <ImagePlaceholder />
            )}
          </div>
          <div className="prose prose-lg max-w-none px-8 py-2 bg-gray-50 rounded-lg">
            <p className="text-2xl font-semibold text-gray-900 mb-4">
              Rp {parseInt(produk.harga).toLocaleString('id-ID')}
            </p>
            <div className="text-gray-600">
              <span className="font-medium">Stok:</span> {produk.stok} Kg
            </div>
            <div className="text-gray-600 mt-2">
              <span className="font-medium">Lokasi:</span> {produk.lokasi}
            </div>
            <div className='m-4'>
              {(produk.deskripsi || "Tidak ada konten tersedia").split('\n').map((deskripsi, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">{deskripsi}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduk;
