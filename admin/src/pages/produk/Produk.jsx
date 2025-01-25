import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MdError,
  MdAdd,
  MdMoreVert,
  MdVisibility,
  MdEdit,
  MdDelete,
  MdSearch,
} from "react-icons/md";

const Produk = () => {
  const [produkList, setProdukList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [produkIdToDelete, setProdukIdToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchProduk = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/produk", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setProdukList(data);
      } else {
        toast.error(`Gagal memuat data produk: ${data.message}`);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memuat data produk");
    }
  };

  useEffect(() => {
    fetchProduk();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdownId &&
        !dropdownRefs.current[openDropdownId]?.contains(event.target)
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdownId]);

  const handleDetail = (id) => navigate(`/produk/detail/${id}`);
  
  const handleDeleteConfirmation = (id) => {
    setProdukIdToDelete(id);
    setIsDeleteModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token tidak ditemukan");
        return;
      }

      const response = await fetch(`http://localhost:4000/api/produk/${produkIdToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProdukList(produkList.filter((produk) => produk.id !== produkIdToDelete));
        toast.success("Produk berhasil dihapus");
      } else {
        const errorData = await response.json();
        toast.error(`Gagal menghapus produk: ${errorData.message}`);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus produk");
    }
    setIsDeleteModalOpen(false);
  };

  const handleDropdownToggle = (id) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id));
  };

  const filteredProduk = produkList.filter(
    (produk) =>
      produk.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      produk.kategori_nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProduk.length / itemsPerPage);
  const currentProduk = filteredProduk.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderMobileCard = (produk, index) => (
    <div key={produk.id} className="bg-white p-4 rounded-lg shadow mb-4 border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-gray-900">{produk.nama}</p>
          <p className="text-xs font-semibold text-green-800 bg-green-100 px-2 py-1 rounded-full inline-block">{produk.kategori_nama}</p>
        </div>
        <div className="relative" ref={(el) => (dropdownRefs.current[produk.id] = el)}>
          <button
            onClick={() => handleDropdownToggle(produk.id)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <MdMoreVert className="text-xl text-gray-500" />
          </button>
          {openDropdownId === produk.id && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1">
                <button
                  onClick={() => handleDetail(produk.id)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <MdVisibility className="mr-3 text-blue-500" />
                  Detail
                </button>
                <button
                  onClick={() => handleDeleteConfirmation(produk.id)}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                >
                  <MdDelete className="mr-3 text-red-400" />
                  Hapus
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
        <div className="flex flex-col gap-4 mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Manajemen Produk
          </h1>

          <div className="relative w-full">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {isMobile ? (
          <div className="space-y-4">
            {currentProduk.length > 0 ? (
              currentProduk.map((produk, index) => renderMobileCard(produk, index))
            ) : (
              <div className="text-center py-4 text-gray-500">
                Tidak ada data produk.
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProduk.length > 0 ? (
                  currentProduk.map((produk, index) => (
                    <tr key={produk.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{produk.nama}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {produk.kategori_nama}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative" ref={(el) => (dropdownRefs.current[produk.id] = el)}>
                          <button
                            onClick={() => handleDropdownToggle(produk.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <MdMoreVert className="text-xl" />
                          </button>
                          {openDropdownId === produk.id && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                              <div className="py-1">
                                <button
                                  onClick={() => handleDetail(produk.id)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                >
                                  <MdVisibility className="mr-3 text-blue-500" />
                                  Detail
                                </button>
                                <button
                                  onClick={() => handleDeleteConfirmation(produk.id)}
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                                >
                                  <MdDelete className="mr-3 text-red-400" />
                                  Hapus
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      Tidak ada data produk.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-sm text-gray-500">
              Halaman {currentPage} dari {totalPages}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm transform transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <MdError className="text-red-600 text-xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Konfirmasi Hapus
            </h3>
            <p className="text-gray-500 text-center mb-6">
              Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produk;