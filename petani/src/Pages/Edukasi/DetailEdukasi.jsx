import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendar, FaClock, FaShare, FaBookmark } from 'react-icons/fa';

function DetailEdukasi() {
  const { id } = useParams();
  const [edukasi, setEdukasi] = useState(null);
  const [otherEdukasi, setOtherEdukasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEdukasi = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/edukasi/${id}`);
        if (!response.ok) throw new Error('Edukasi tidak ditemukan');
        const data = await response.json();
        setEdukasi(data);

        const otherResponse = await fetch('http://localhost:4000/api/edukasi');
        if (!otherResponse.ok) throw new Error('Gagal mengambil data edukasi lainnya');
        const otherData = await otherResponse.json();
        setOtherEdukasi(otherData.filter((item) => item.id !== id));
      } catch (error) {
        console.error('Error fetching edukasi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEdukasi();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!edukasi) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-50 p-8">
        <h2 className="text-2xl font-bold text-gray-800">Edukasi Tidak Ditemukan</h2>
        <button
          onClick={() => navigate('/edukasi')}
          className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <FaArrowLeft className="mr-2" />
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/edukasi')}
            className="inline-flex items-center text-gray-600 hover:text-green-600"
          >
            <FaArrowLeft className="mr-2" />
            Kembali ke Daftar Edukasi
          </button>
          <div className="flex space-x-4">
            <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
              <FaShare />
            </button>
            <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
              <FaBookmark />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <article className="w-full lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <img
                src={edukasi.gambar ? `http://localhost:4000${edukasi.gambar}` : 'http://via.placeholder.com/150'}
                alt={edukasi.judul}
                className="w-full h-[400px] object-cover"
              />
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaCalendar className="mr-2 text-green-500" />
                    {new Date(edukasi.diterbitkan_pada).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-green-500" />
                    {new Date(edukasi.diterbitkan_pada).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-6">{edukasi.judul}</h1>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{edukasi.konten}</p>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-1/3">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edukasi Terkait</h2>
            <div className="space-y-6">
              {otherEdukasi.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/edukasi/${item.id}`)}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer"
                >
                  <div className="flex space-x-4">
                    <img
                      src={item.gambar ? `http://localhost:4000${item.gambar}` : 'http://via.placeholder.com/150'}
                      alt={item.judul}
                      className="w-32 h-32 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-600">{item.judul}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(item.diterbitkan_pada).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default DetailEdukasi;
