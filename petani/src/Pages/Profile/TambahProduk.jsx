import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTimesCircle, FaCloudUploadAlt, FaArrowLeft, FaSave } from "react-icons/fa";

const TambahProduk = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    kategori_id: "",
    harga: "",
    lokasi: "",
    stok: "",
    gambar: "",
  });
  const [kategoriList, setKategoriList] = useState([]);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchKategori = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/kategori");
      const data = await response.json();
      setKategoriList(data);
    } catch (error) {
      toast.error("Gagal mengambil kategori");
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "gambar") {
      setFormData({ ...formData, [name]: files[0] });
      handleImageChange(e);
      setIsImageSelected(true);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, gambar: "" });
    setIsImageSelected(false);
    setPreviewImage(null);
    document.getElementById("gambarInput").value = null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData({ ...formData, gambar: file });
      handleImageChange({ target: { files: [file] } });
      setIsImageSelected(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch("http://localhost:4000/api/produk", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Produk berhasil ditambahkan");
        navigate("/profil");
      } else {
        toast.error(data.message || "Gagal menambahkan produk");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menambahkan produk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/profil")}
                className="text-white hover:text-green-100 transition-colors"
              >
                <FaArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold text-white">
                Tambah Hasil Panen
              </h1>
            </div>
          </div>

          {/* Image Preview Section */}
          <div className="p-6 bg-gray-50 border-b">
            <div
              className="flex flex-col items-center justify-center gap-4"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {previewImage ? (
                <>
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-h-80 rounded-lg shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <FaTimesCircle size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <div
                  className="w-full max-w-md h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:border-green-500 transition-colors"
                  onClick={() => document.getElementById("gambarInput").click()}
                >
                  <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Klik untuk memilih atau seret gambar ke sini
                  </p>
                </div>
              )}
              <input
                type="file"
                id="gambarInput"
                name="gambar"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Masukkan nama produk"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Kategori
                  </label>
                  <select
                    name="kategori_id"
                    value={formData.kategori_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {kategoriList.map((kategori) => (
                      <option key={kategori.id} value={kategori.id}>
                        {kategori.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    name="harga"
                    value={formData.harga}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Stok
                  </label>
                  <input
                    type="number"
                    name="stok"
                    value={formData.stok}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Lokasi
                </label>
                <input
                  type="text"
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Masukkan lokasi"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Deskripsi
                </label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  rows="4"
                  placeholder="Deskripsi produk"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all"
              >
                {loading ? "Menambahkan..." : "Tambah Produk"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TambahProduk;
