import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSpinner, FaChevronLeft, FaEdit, FaClock, FaCalendarAlt } from 'react-icons/fa';

const DetailEdukasi = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [edukasi, setEdukasi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEdukasiById = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Token tidak ditemukan');
          return;
        }

        const response = await fetch(`http://localhost:4000/api/edukasi/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(`Gagal mengambil data edukasi: ${errorData.message}`);
          return;
        }

        const data = await response.json();

        // Add a base URL if the image does not have an absolute URL
        if (data.gambar && !/^https?:\/\//.test(data.gambar)) {
          data.gambar = `http://localhost:4000${data.gambar}`;
        }

        setEdukasi(data);
      } catch (error) {
        toast.error('Terjadi kesalahan saat mengambil data edukasi');
        console.error('Error fetching edukasi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEdukasiById();
  }, [id]);

  const handleBack = () => navigate('/edukasi');
  const handleEdit = () => navigate(`/edukasi/edit/${id}`);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Memuat edukasi...</p>
        </div>
      </div>
    );
  }

  if (!edukasi) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
          <p className="text-lg text-gray-600 text-center">Edukasi tidak ditemukan</p>
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

  const formattedDate = new Date(edukasi.diterbitkan_pada).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = new Date(edukasi.diterbitkan_pada).toLocaleTimeString('id-ID', {
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
                <FaChevronLeft className="w-4 h-4 mr-1" />
                Kembali
              </button>
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                <FaEdit className="w-4 h-4 mr-2" />
                Edit Edukasi
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{edukasi.judul}</h1>
            <div className="flex items-center text-sm text-gray-500">
              <FaCalendarAlt className="w-4 h-4 mr-1 text-blue-500" />
              <span className="mr-4">{formattedDate}</span>
              <FaClock className="w-4 h-4 mr-1 text-green-500" />
              <span>{formattedTime}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {edukasi.gambar && (
              <div className="mb-6 flex justify-center">
                <img
                  src={edukasi.gambar}
                  alt={edukasi.judul}
                  className="w-full max-w-xl object-cover rounded-lg"
                />
              </div>
            )}
            <div className="prose prose-lg max-w-none">
              {edukasi.konten.split('\n').map((paragraph, index) => (
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

export default DetailEdukasi;
