import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiSearch, FiFilter, FiBookOpen } from "react-icons/fi";

function Edukasi() {
  const [edukasiList, setEdukasiList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  // Debounce function for fetching edukasi list
  useEffect(() => {
    const debounce = setTimeout(() => {
      const fetchEdukasi = async () => {
        try {
          setIsLoading(true);
          let url = "http://localhost:4000/api/edukasi?";
          if (selectedCategory) {
            url += `kategori=${selectedCategory}&`;
          }
          if (searchTerm) {
            url += `search=${searchTerm}&`;
          }

          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Failed to fetch edukasi");
          }
          const data = await response.json();
          setEdukasiList(data);
        } catch (error) {
          console.error("Error fetching edukasi:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchEdukasi();
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchTerm, selectedCategory]);

  // Fetch categories for filtering
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsFetching(true);
        const response = await fetch("http://localhost:4000/api/kategori");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchCategories();
  }, []);

  // Set category from URL parameters on initial load
  useEffect(() => {
    const kategoriParam = searchParams.get("kategori");
    if (kategoriParam) {
      setSelectedCategory(kategoriParam);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-green-800 mb-4">Pusat Edukasi</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Temukan berbagai artikel informatif untuk menambah pengetahuan Anda
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-10 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Cari artikel..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-green-200 focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-300"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-3.5 h-5 w-5 text-green-500" />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-green-200 focus:ring-2 focus:ring-green-400 appearance-none"
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nama}
                </option>
              ))}
            </select>
            <FiFilter className="absolute left-3 top-3.5 h-5 w-5 text-green-500" />
          </div>
        </div>

        {/* Edukasi Grid */}
        {isLoading || isFetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 animate-pulse rounded-2xl h-72"
              ></div>
            ))}
          </div>
        ) : (
          <div>
            {edukasiList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {edukasiList.map((edukasi) => (
                  <div
                    key={edukasi.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 transform cursor-pointer"
                    onClick={() => navigate(`/edukasi/${edukasi.id}`)}
                  >
                    {/* Image */}
                    <div className="relative h-56 w-full">
                      <img
                        src={
                          edukasi.gambar
                            ? `http://localhost:4000${edukasi.gambar}`
                            : "https://via.placeholder.com/400x250"
                        }
                        alt={edukasi.judul}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black opacity-20 hover:opacity-10 transition-opacity"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <FiBookOpen className="h-5 w-5 mr-2 text-green-500" />
                        <span>
                          {new Date(edukasi.diterbitkan_pada).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                        {edukasi.judul}
                      </h3>
                      <p className="text-gray-600 line-clamp-3">{edukasi.konten}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Tidak ada artikel yang ditemukan
                </h3>
                <p className="text-gray-500">
                  Silakan coba kata kunci pencarian yang lain
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Edukasi;
