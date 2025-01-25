import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTimes, FaImage, FaSpinner } from 'react-icons/fa';

const TambahBerita = () => {
  const [formData, setFormData] = useState({
    judul: '',
    konten: '',
    gambar: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'gambar') {
      setFormData({ ...formData, [name]: files[0] });
      handleImageChange(e);
      setIsImageSelected(true);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('judul', formData.judul);
    formDataToSend.append('konten', formData.konten);
    formDataToSend.append('gambar', formData.gambar);

    try {
      const response = await fetch('http://localhost:4000/api/berita', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Berita berhasil ditambahkan');
        navigate('/berita');
      } else {
        toast.error(data.message || 'Gagal menambahkan berita');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menambahkan berita');
      console.error('Error adding news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/berita');
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setPreviewImage(null);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, gambar: '' });
    setIsImageSelected(false);
    setPreviewImage(null);
    document.getElementById('gambarInput').value = null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          {/* Header Section */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="mb-4 inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              Tambah Berita Baru
            </h1>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Preview Section */}
            <div className="space-y-4">
              {previewImage ? (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="gambarInput" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-600">
                        Tambahkan gambar berita
                      </span>
                      <input
                        id="gambarInput"
                        name="gambar"
                        type="file"
                        className="hidden"
                        onChange={handleChange}
                        accept="image/*"
                      />
                      <span className="mt-1 block text-sm text-gray-500">
                        PNG, JPG, GIF hingga 10MB
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Judul Berita
              </label>
              <input
                type="text"
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                placeholder="Masukkan judul berita yang menarik"
                required
              />
            </div>

            {/* Content Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Konten Berita
              </label>
              <textarea
                name="konten"
                value={formData.konten}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white resize-none"
                placeholder="Tulis konten berita Anda di sini..."
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 px-6 py-3 bg-white text-black rounded-lg hover:bg-green-50 hover:text-green-600 border focus:outline-none focus:ring-2 focus:ring-green-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TambahBerita;