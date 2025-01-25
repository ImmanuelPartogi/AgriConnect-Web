import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSpinner, FaChevronLeft, FaEdit, FaClock, FaCalendarAlt } from 'react-icons/fa';

const DetailBerita = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Token tidak ditemukan');
          return;
        }

        const response = await fetch(`http://localhost:4000/api/berita/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.message || 'Data tidak ditemukan');
          return;
        }

        const data = await response.json();
        if (data.gambar && !data.gambar.startsWith('http')) {
          data.gambar = `http://localhost:4000${data.gambar}`;
        }

        setBerita(data);
      } catch (error) {
        toast.error('Terjadi kesalahan saat memuat berita');
        console.error('Error fetching berita:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, [id]);

  const handleBack = () => navigate('/berita');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Memuat berita...</p>
        </div>
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
          <p className="text-lg text-gray-600 text-center">Berita tidak ditemukan</p>
          <button
            onClick={handleBack}
            className="mt-4 flex items-center mx-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            <FaChevronLeft className="w-4 h-4 mr-2" />
            Kembali
          </button>
        </div>
      </div>
    );
  }

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
                <FaChevronLeft className="w-4 h-4 mr-1" />
                Kembali
              </button>
              <button
                onClick={() => navigate(`/berita/edit/${id}`)}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                <FaEdit className="w-4 h-4 mr-2" />
                Edit Berita
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{berita.judul}</h1>
            <div className="flex items-center text-sm text-gray-500">
              <FaCalendarAlt className="w-4 h-4 mr-1 text-blue-500" />
              <span className="mr-4">
                {new Date(berita.diterbitkan_pada).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <FaClock className="w-4 h-4 mr-1 text-green-500" />
              <span>{new Date(berita.diterbitkan_pada).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              })}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {berita.gambar && (
              <div className="mb-6 flex justify-center">
                <img
                  src={berita.gambar}
                  alt={berita.judul}
                  className="w-full max-w-xl object-cover rounded-lg"
                />
              </div>
            )}
            <div className="prose prose-lg max-w-none">
              {berita.konten.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBerita;
