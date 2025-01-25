import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTimesCircle, FaImage, FaArrowLeft, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EditEdukasi = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [edukasi, setEdukasi] = useState({ title: '', content: '', imageUrl: '', kategori_id: '' });
  const [kategoriList, setKategoriList] = useState([]);
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch data edukasi for existing details
  useEffect(() => {
    const fetchEdukasi = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/edukasi/${id}`);
        if (response.ok) {
          const data = await response.json();
          const imageUrl = data.gambar ? `http://localhost:4000${data.gambar}` : '';
          setEdukasi({
            title: data.judul,
            content: data.konten,
            imageUrl,
            kategori_id: data.kategori_id,
          });
        } else {
          toast.error('Data edukasi tidak ditemukan');
        }
      } catch (error) {
        toast.error('Terjadi kesalahan saat mengambil data edukasi');
        console.error(error);
      }
    };

    fetchEdukasi();
  }, [id]);

  // Fetch kategori list for dropdown
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/kategori');
        if (response.ok) {
          const data = await response.json();
          setKategoriList(data);
        } else {
          toast.error('Gagal mengambil kategori');
        }
      } catch (error) {
        toast.error('Terjadi kesalahan saat mengambil kategori');
        console.error(error);
      }
    };

    fetchKategori();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('judul', edukasi.title);
    formData.append('konten', edukasi.content);
    formData.append('kategori_id', edukasi.kategori_id);

    if (file) {
      formData.append('gambar', file);
    } else {
      formData.append('gambar', edukasi.imageUrl); // Keep old image if no new image selected
    }

    try {
      const response = await fetch(`http://localhost:4000/api/edukasi/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        toast.success('Edukasi berhasil diperbarui!');
        navigate('/edukasi');
      } else {
        toast.error('Gagal memperbarui edukasi');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat memperbarui edukasi');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file change (image)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelection(selectedFile);
  };

  const handleFileSelection = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      const fileURL = URL.createObjectURL(selectedFile);
      setPreviewImage(fileURL);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewImage(null);
    document.getElementById('gambar').value = null; // Reset input file
  };

  // Handle drag over event
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle drag leave event
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Handle drop event for images
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type.startsWith('image/')) {
      handleFileSelection(droppedFile);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8 border-b pb-4 border-gray-300">
              <button
                onClick={() => navigate('/edukasi')}
                className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-green-600 transition duration-200"
                aria-label="Kembali"
              >
                <FaArrowLeft className="mr-2" />
                Kembali
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Edit Edukasi</h1>
            </div>

            {/* Image Preview Section */}
            <div className="mb-10">
              {(previewImage || edukasi.imageUrl) && (
                <div className="relative group flex justify-center">
                  <img
                    src={previewImage || edukasi.imageUrl}
                    alt="Preview"
                    className="w-full max-w-md object-cover rounded-lg shadow-md"
                  />
                  {previewImage && (
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      aria-label="Hapus gambar"
                    >
                      <FaTimesCircle size={20} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Edukasi
                </label>
                <input
                  type="text"
                  id="title"
                  value={edukasi.title}
                  onChange={(e) => setEdukasi({ ...edukasi, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                  placeholder="Masukkan judul edukasi"
                  aria-label="Judul edukasi"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Konten
                </label>
                <textarea
                  id="content"
                  value={edukasi.content}
                  onChange={(e) => setEdukasi({ ...edukasi, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                  placeholder="Tulis konten edukasi di sini"
                  aria-label="Konten edukasi"
                />
              </div>

              <div>
                <label htmlFor="kategori_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Edukasi
                </label>
                <select
                  id="kategori_id"
                  value={edukasi.kategori_id}
                  onChange={(e) => setEdukasi({ ...edukasi, kategori_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                  aria-label="Kategori edukasi"
                >
                  <option value="">Pilih Kategori</option>
                  {kategoriList.map((kategori) => (
                    <option key={kategori.id} value={kategori.id}>
                      {kategori.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gambar Edukasi
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-500'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  aria-label="Seret dan lepas gambar atau pilih file"
                >
                  <input
                    type="file"
                    id="gambar"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                    aria-label="Pilih gambar"
                  />
                  <label htmlFor="gambar" className="cursor-pointer flex flex-col items-center">
                    <FaImage className="w-12 h-12 text-gray-400 mb-3" />
                    <span className="text-sm text-gray-600">
                      Drag & drop gambar di sini atau{' '}
                      <span className="text-green-600 hover:text-green-700">pilih file</span>
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF hingga 10MB
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => navigate('/edukasi')}
                  type="button"
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <FaSave />
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEdukasi;
