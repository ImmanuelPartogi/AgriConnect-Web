import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiCalendar, FiClock } from 'react-icons/fi';

function Berita() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        let url = 'http://localhost:4000/api/berita';
        if (searchTerm) {
          url += `?search=${searchTerm}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Gagal mengambil data dari server');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchEvents();
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-green-800 mb-4">Berita Terkini</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan informasi terbaru dan terpercaya seputar kegiatan dan perkembangan terkini
          </p>
        </div>

        {/* Search Section */}
        <div className="relative max-w-xl mx-auto mb-12">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400 text-xl" />
          <input
            type="text"
            placeholder="Cari berita..."
            className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition duration-200 ease-in-out shadow-sm text-gray-700 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* News Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-200 animate-pulse rounded-2xl h-72"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <article
                key={event.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/berita/${event.id}`)}
              >
                <div className="relative">
                  <img
                    src={event.gambar ? `http://localhost:4000${event.gambar}` : 'http://via.placeholder.com/150'}
                    alt={event.judul}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 className="text-xl font-bold text-white line-clamp-2">{event.judul}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2 text-green-500" />
                      {new Date(event.diterbitkan_pada).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="flex items-center">
                      <FiClock className="mr-2 text-green-500" />
                      {new Date(event.diterbitkan_pada).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  <p className="text-gray-600 line-clamp-3">
                    {event.konten}
                  </p>

                  <div className="mt-6">
                    <button className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                      Baca selengkapnya →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && events.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak ada berita ditemukan</h3>
            <p className="text-gray-500">Silakan coba kata kunci pencarian yang lain</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Berita;
