import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaTimes, FaImage, FaSpinner } from 'react-icons/fa';

const TambahEdukasi = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        judul: '',
        konten: '',
        kategori_id: '',
        gambar: '',
    });
    const [kategoriList, setKategoriList] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchKategori = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/kategori');
                if (!response.ok) throw new Error('Failed to fetch categories');
                const data = await response.json();
                setKategoriList(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Gagal mengambil kategori');
            }
        };
        fetchKategori();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'gambar') {
            const file = files[0];
            setFormData((prev) => ({ ...prev, gambar: file }));
            if (file) {
                const reader = new FileReader();
                reader.onload = () => setPreviewImage(reader.result);
                reader.readAsDataURL(file);
            } else {
                setPreviewImage(null);
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, gambar: '' }));
        setPreviewImage(null);
        document.getElementById('gambarInput').value = null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) formDataToSend.append(key, value);
        });

        try {
            const response = await fetch('http://localhost:4000/api/edukasi', {
                method: 'POST',
                body: formDataToSend,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Edukasi berhasil ditambahkan');
                navigate('/edukasi');
            } else {
                toast.error(data.message || 'Gagal menambahkan edukasi');
            }
        } catch (error) {
            console.error('Error adding edukasi:', error);
            toast.error('Terjadi kesalahan saat menambahkan edukasi');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                    <div className="mb-8">
                        <button
                            onClick={() => navigate('/edukasi')}
                            className="mb-4 inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <FaArrowLeft className="w-4 h-4 mr-2" /> Kembali
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800">Tambah Artikel Edukasi</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                            <span className="block text-sm font-medium text-gray-600">
                                                Tambahkan gambar edukasi
                                            </span>
                                            <input
                                                id="gambarInput"
                                                name="gambar"
                                                type="file"
                                                className="hidden"
                                                onChange={handleChange}
                                                accept="image/*"
                                            />
                                            <span className="block text-sm text-gray-500">PNG, JPG, GIF hingga 10MB</span>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Judul Artikel</label>
                            <input
                                type="text"
                                name="judul"
                                value={formData.judul}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 bg-white"
                                placeholder="Masukkan judul berita yang menarik"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Konten Edukasi</label>
                            <textarea
                                name="konten"
                                value={formData.konten}
                                onChange={handleChange}
                                rows={6}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 bg-white resize-none"
                                placeholder="Tulis konten berita Anda di sini..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-700">Kategori</label>
                            <select
                                name="kategori_id"
                                value={formData.kategori_id}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
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

                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/edukasi')}
                                className="flex-1 px-6 py-3 bg-white text-black rounded-lg hover:bg-green-50 hover:text-green-600 border focus:outline-none focus:ring-2 focus:ring-green-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center"
                                >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...
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

export default TambahEdukasi;