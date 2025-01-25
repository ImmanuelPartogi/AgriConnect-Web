import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendar, FaClock, FaArrowLeft, FaShare, FaBookmark } from 'react-icons/fa';

function DetailBerita() {
  const { id } = useParams();
  const [berita, setBerita] = useState(null);
  const [otherBerita, setOtherBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/berita/${id}`);
        if (!response.ok) throw new Error('Berita tidak ditemukan');
        const data = await response.json();
        setBerita(data);

        const otherResponse = await fetch('http://localhost:4000/api/berita');
        if (!otherResponse.ok) throw new Error('Gagal mengambil data berita lainnya');
        const otherData = await otherResponse.json();
        setOtherBerita(otherData.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error fetching berita:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-50 p-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Berita Tidak Ditemukan</h2>
          <p className="text-gray-600">Maaf, berita yang Anda cari tidak tersedia.</p>
          <button
            onClick={() => navigate('/berita')}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" />
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/berita')}
            className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Kembali ke Daftar Berita
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
                src={berita.gambar ? `http://localhost:4000${berita.gambar}` : 'http://via.placeholder.com/150'}
                alt={berita.judul}
                className="w-full h-[400px] object-cover"
              />
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaCalendar className="mr-2 text-green-500" />
                    {new Date(berita.diterbitkan_pada).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-green-500" />
                    {new Date(berita.diterbitkan_pada).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-6">{berita.judul}</h1>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {berita.konten}
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-1/3">
            <div className="sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Berita Terkait</h2>
              <div className="space-y-6">
                {otherBerita.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => navigate(`/berita/${event.id}`)}
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                  >
                    <div className="flex space-x-4">
                      <img
                        src={event.gambar ? `http://localhost:4000${event.gambar}` : 'http://via.placeholder.com/150'}
                        alt={event.judul}
                        className="w-32 h-32 object-cover"
                      />
                      <div className="p-4 flex flex-col justify-between">
                        <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200 line-clamp-2">
                          {event.judul}
                        </h3>
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center">
                            <FaCalendar className="mr-2 text-green-500" />
                            {new Date(event.diterbitkan_pada).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default DetailBerita;